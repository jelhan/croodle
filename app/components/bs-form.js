import BaseBsForm from "ember-bootstrap/components/bs-form";
import IntlMessage from "../utils/intl-message";

export default class BsForm extends BaseBsForm {
  "__ember-bootstrap_subclass" = true;

  get hasValidator() {
    return true;
  }

  async validate(model) {
    const isInvalid = Object.getOwnPropertyNames(
      Object.getPrototypeOf(model)
    ).any((potentialValidationKey) => {
      // Validation getters must be named `propertyValidation` by our convention
      if (!potentialValidationKey.endsWith('Validation')) {
        return false;
      }

      // Validation errors must be an instance of IntlMessage by convention
      return model[potentialValidationKey] instanceof IntlMessage;
    });

    if (isInvalid) {
      throw new Error();
    }
  }
}
