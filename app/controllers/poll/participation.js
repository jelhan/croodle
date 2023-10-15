import classic from "ember-classic-decorator";
import { inject as service } from "@ember/service";
import { not, readOnly } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import { getOwner } from "@ember/application";
import { isEmpty } from "@ember/utils";
import EmberObject, { action, computed } from "@ember/object";
import { validator, buildValidations } from "ember-cp-validations";
import config from "croodle/config/environment";

const validCollection = function (collection) {
  // return false if any object in collection is inValid
  return !collection.any((object) => {
    return object.get("validations.isInvalid");
  });
};
const Validations = buildValidations({
  name: [
    validator("presence", {
      presence: true,
      disabled: readOnly("model.anonymousUser"),
      dependentKeys: ["model.intl.locale"],
    }),
    validator("unique", {
      parent: "poll",
      attributeInParent: "users",
      dependentKeys: [
        "model.poll.users.[]",
        "model.poll.users.@each.name",
        "model.intl.locale",
      ],
      disable: readOnly("model.anonymousUser"),
      messageKey: "errors.uniqueName",
      ignoreNewRecords: true,
    }),
  ],

  selections: [
    validator("collection", true),

    // all selection objects must be valid
    // if forceAnswer is true in poll settings
    validator(validCollection, {
      dependentKeys: [
        "model.forceAnswer",
        "model.selections.[]",
        "model.selections.@each.value",
        "model.intl.locale",
      ],
    }),
  ],
});

const SelectionValidations = buildValidations({
  value: validator("presence", {
    presence: true,
    disabled: not("model.forceAnswer"),
    messageKey: computed("model.isFreeText", function () {
      return this.get("model.isFreeText")
        ? "errors.present"
        : "errors.answerRequired";
    }),
    dependentKeys: ["model.intl.locale"],
  }),
});

@classic
class SelectionObject extends EmberObject.extend(SelectionValidations) {
  @service intl;

  value = null;

  init() {
    super.init(...arguments);

    // current locale needs to be consumed in order to be observeable
    // for localization of validation messages
    this.intl.locale;
  }
}

export default class PollParticipationController extends Controller.extend(
  Validations
) {
  @service encryption;
  @service intl;

  name = "";
  savingFailed = false;

  @readOnly("poll.anonymousUser")
  anonymousUser;

  @readOnly("intl.locale")
  currentLocale;

  @readOnly("poll.forceAnswer")
  forceAnswer;

  @readOnly("poll.isFreeText")
  isFreeText;

  @readOnly("poll.isFindADate")
  isFindADate;

  @readOnly("poll.options")
  options;

  @readOnly("model")
  poll;

  @controller("poll")
  pollController;

  @computed("labelTranslation", "poll.answers")
  get possibleAnswers() {
    return this.get("poll.answers").map((answer) => {
      const owner = getOwner(this);

      const AnswerObject = EmberObject.extend({
        icon: answer.get("icon"),
        type: answer.get("type"),
      });

      if (!isEmpty(answer.get("labelTranslation"))) {
        return AnswerObject.extend({
          intl: service(),
          label: computed("intl.locale", "labelTranslation", function () {
            return this.intl.t(this.labelTranslation);
          }),
          labelTranslation: answer.get("labelTranslation"),
        }).create(owner.ownerInjection());
      } else {
        return AnswerObject.extend({
          label: answer.get("label"),
        });
      }
    });
  }

  @computed(
    "forceAnswer",
    "isFindADate",
    "isFreeText",
    "options",
    "pollController.dates",
    "timezone"
  )
  get selections() {
    let options = this.options;
    let isFindADate = this.isFindADate;
    let lastOption;

    return options.map((option) => {
      const labelString = option.title;
      const labelValue = option.isDate ? option.jsDate : option.title;
      const showDate =
        isFindADate &&
        (!lastOption || option.get("day") !== lastOption.get("day"));
      const showTime = isFindADate && option.get("hasTime");

      lastOption = option;

      // https://github.com/offirgolan/ember-cp-validations#basic-usage---objects
      // To lookup validators, container access is required which can cause an issue with Object creation
      // if the object is statically imported. The current fix for this is as follows.
      let owner = getOwner(this);
      return SelectionObject.create(owner.ownerInjection(), {
        labelString,
        labelValue,
        showDate,
        showTime,

        // forceAnswer and isFreeText must be included in model
        // cause otherwise validations can't depend on it
        forceAnswer: this.forceAnswer,
        isFreeText: this.isFreeText,
      });
    });
  }

  @readOnly("pollController.timezone")
  timezone;

  @action
  async submit() {
    if (!this.get("validations.isValid")) {
      return;
    }

    let poll = this.poll;
    let selections = this.selections.map(({ value }) => {
      if (value === null) {
        return {};
      }

      if (this.isFreeText) {
        return {
          label: value,
        };
      }

      // map selection to answer if it's not freetext
      let answer = poll.answers.findBy("type", value);
      let { icon, label, labelTranslation, type } = answer;

      return {
        icon,
        label,
        labelTranslation,
        type,
      };
    });
    let user = this.store.createRecord("user", {
      creationDate: new Date(),
      name: this.name,
      poll,
      selections,
      version: config.APP.version,
    });

    this.set("newUserRecord", user);
    await this.actions.save.bind(this)();
  }

  @action
  async save() {
    let user = this.newUserRecord;

    try {
      await user.save();

      this.set("savingFailed", false);
    } catch (error) {
      // couldn't save user model
      this.set("savingFailed", true);

      return;
    }

    // reset form
    this.set("name", "");
    this.selections.forEach((selection) => {
      selection.set("value", null);
    });

    this.transitionToRoute("poll.evaluation", this.model, {
      queryParams: { encryptionKey: this.encryption.key },
    });
  }

  constructor() {
    super(...arguments);

    // current locale needs to be consumed in order to be observeable
    // for localization of validation messages
    this.intl.locale;
  }
}
