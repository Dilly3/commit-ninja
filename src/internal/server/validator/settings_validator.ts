import { body, ValidationChain } from "express-validator";
export interface validationError {
  location: string;
  msg: string;
  path: string;
  value: string;
  type: string;
}

export function getValidationError(errors: any[]): validationError[] {
  return errors.map((e: any) => {
    return {
      location: e.location,
      msg: e.msg,
      path: e.path,
      value: e.value,
      type: e.type,
    };
  });
}
export function setSettingsValidator(): ValidationChain[] {
  const validatorchain = [
    body("repo")
      .isString()
      .withMessage("repo must be a string")
      .trim()
      .custom((value) => {
        if (value.includes(" ")) {
          throw new Error("repo cannot contain spaces");
        }
        return true;
      }),
    body("start_date")
      .isString()
      .withMessage("start_date must be a string")
      .trim()
      .custom((value) => {
        if (value.includes(" ")) {
          throw new Error("start_date cannot contain spaces");
        }
        return true;
      })
      .isISO8601()
      .withMessage("start_date must be a valid date in YYYY-MM-DD format"),
  ];

  return validatorchain;
}
