import classic from "ember-classic-decorator";
import { inject as service } from "@ember/service";
import { not, readOnly } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import { getOwner } from "@ember/application";
import { isEmpty } from "@ember/utils";
import EmberObject, { action, computed } from "@ember/object";
import { validator, buildValidations } from "ember-cp-validations";
import config from "croodle/config/environment";
import { tracked } from "@glimmer/tracking";

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
      disabled: readOnly("model.model.anonymousUser"),
      dependentKeys: ["model.intl.locale"],
    }),
    validator("unique", {
      parent: "model",
      attributeInParent: "users",
      dependentKeys: [
        "model.model.users.[]",
        "model.model.users.@each.name",
        "model.intl.locale",
      ],
      disable: readOnly("model.model.anonymousUser"),
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
        "model.model.forceAnswer",
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
      return this.model.isFreeText
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

export default class PollParticipationController extends Controller.extend(Validations) {
  @service encryption;
  @service intl;

  @controller("poll")
  pollController;

  @tracked name = "";
  @tracked savingFailed = false;

  @computed('intl.locale', 'labelTranslation', 'model')
  get possibleAnswers() {
    const { answers } = this.model;

    return answers.map((answer) => {
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

  @computed("model", "pollController.dates")
  get selections() {
    const { forceAnswer, isFindADate, isFreeText, options } = this.model;

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
        forceAnswer,
        isFreeText,
      });
    });
  }

  @action
  async submit() {
    if (!this.get("validations.isValid")) {
      return;
    }

    const { model: poll } = this;
    const { answers, isFreeText } = poll;
    let selections = this.selections.map(({ value }) => {
      if (value === null) {
        return {};
      }

      if (isFreeText) {
        return {
          label: value,
        };
      }

      // map selection to answer if it's not freetext
      let answer = answers.findBy("type", value);
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

    this.newUserRecord = user;
    await this.save(user);
  }

  @action
  async save() {
    const { newUserRecord: user } = this;

    try {
      await user.save();

      this.savingFailed = false;
    } catch (error) {
      // couldn't save user model
      this.savingFailed = true;

      return;
    }

    // reset form
    this.name = "";
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
