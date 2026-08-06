import type { ReactNode } from "react";

/*
  Error Handler:
  @param {string} value     =>  field value
  @param {string} fieldType =>  'any' (accepts any kind of characters)
                                  'alphanum' (accepts alpha-numberic only) 
                                  'alpha' (accepts letters only)
                                  'num' (accepts numbers only)
                                  ** spaces will be determined if 'spaces' in the fieldRules is set on false
  @param {record} fieldRules:{
                    characters  {number}  => minimum characters - defualt 0 means accepts null or empty, also > 0 means this field is required
                    spaces      {boolean} => defualt true, false means no spaces
                    capital     {number}  => minimum capital letters needed, default: 0
                    small       {number}  => minimum small letters needed, default: 0
                    number      {number}  => minimum numbers needed, default: 0
                    special     {number}  => minimum special characters needed, default: 0
                    email       {boolean} => default false, true means field is a email
                  }
  
  @returns  =>  'empty' = means field is still empty/null
                'good' = all fieldRule/s are fullfilled, 
                errors[] = indicate what fieldRule/s have an error.
                example error: 
                password: {
                  errors: ["capital", "special"]
                }
*/

type FieldType = "any" | "alphanum" | "alpha" | "num";

type FieldRules = {
  characters?: number;
  spaces?: boolean;
  capital?: number;
  small?: number;
  number?: number;
  special?: number;
  email?: boolean;
};

type Field = {
  value: any;
  fieldType?: FieldType;
  fieldRules: FieldRules;
}

type Fields = Record<
  string,
  {
    value: string;
    fieldType?: FieldType;
    fieldRules: FieldRules;
  }
>;

type ValidationResult =
  | "empty"
  | "good"
  | {
      errors: string[];
    };

/* Error handler */    
const validateField = (field: Field): ValidationResult => {
  const value = field.value ?? "";
  const rules = field.fieldRules;

  // default values
  const minChars = rules.characters ?? 0;
  const allowSpaces = rules.spaces ?? true;
  const minCapital = rules.capital ?? 0;
  const minSmall = rules.small ?? 0;
  const minNumber = rules.number ?? 0;
  const minSpecial = rules.special ?? 0;
  const email = rules.email ?? false;
  const type = field.fieldType ?? "any";

  // Empty value
  if (value.trim() === "") {
    return "empty";
  }
  const errors: string[] = [];

  // Character length
  if (value.length < minChars) {
    errors.push("characters");
  }

  // Spaces
  if (!allowSpaces && /\s/.test(value)) {
    errors.push("spaces");
  }

  // Type checking
  switch (type) {
    case "alpha":
      if (!/^[A-Za-z\s]+$/.test(value)) {
        errors.push("alpha");
      }
      break;

    case "num":
      if (!/^\d+$/.test(value)) {
        errors.push("numberOnly");
      }
      break;

    case "alphanum":
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        errors.push("alphanum");
      }
      break;
  }

  // Email
  if (
    email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
  ) {
    errors.push("email");
  }

  // Count required characters
  if ((value.match(/[A-Z]/g) ?? []).length < minCapital) {
    errors.push("capital");
  }

  if ((value.match(/[a-z]/g) ?? []).length < minSmall) {
    errors.push("small");
  }

  if ((value.match(/[0-9]/g) ?? []).length < minNumber) {
    errors.push("number");
  }

  if ((value.match(/[^A-Za-z0-9\s]/g) ?? []).length < minSpecial) {
    errors.push("special");
  }

  return errors.length ? { errors } : "good";
};

/* 
  Checking single field for Input validation 
  @param field {record} => FieldConfig (see fields.ts)
  @param value {string} => field value
  @param displayInitialIy {boolean} => if requirement/s should be shown or not, if 'false' once error takes place the requirement will show up (default: false).  
*/
type FieldConfig = Omit<Field, "value">;

const validateOnChange = (
  field: FieldConfig,
  value: string
) => {
  return validateField({
    ...field,
    value,
  });
};

export const showRequirements = (
  field: FieldConfig,
  value: string,
  displayInitialIy?: boolean,
): ReactNode => {
  const rules = field.fieldRules;
  const requirementItems = [];
  const result = validateOnChange(field,value);
  const display = displayInitialIy ?? false;
  let html:any;
  const getClass = (name: string) => {
    if (result === "empty") return "";
    if (result === "good") return "good";
    return result.errors.includes(name) ? "err" : value.length > 0 ? "good" : "";
  };

  if ((rules.characters ?? 0) > 0) {
    html = <li
        key="characters"
        className={getClass("characters")}
      >
        Must be more than {rules.characters} characters.
      </li>
    
    display && requirementItems.push(html);
  }

  const subRequirements = [];

  if ((rules.capital ?? 0) > 0) {
    subRequirements.push(
      <li
        key="capital"
        className={getClass("capital")}
      >
        {rules.capital} capital letter
      </li>
    );
  }

  if ((rules.small ?? 0) > 0) {
    subRequirements.push(
      <li
        key="small"
        className={getClass("small")}
      >
        {rules.small} small letter
      </li>
    );
  }

  if ((rules.number ?? 0) > 0) {
    subRequirements.push(
      <li
        key="number"
        className={getClass("number")}
      >
        {rules.number} number
      </li>
    );
  }

  if ((rules.special ?? 0) > 0) {
    subRequirements.push(
      <li
        key="special"
        className={getClass("special")}
      >
        {rules.special} special character
      </li>
    );
  }

  if (subRequirements.length) {
    requirementItems.push(
      <li key="title">There should be at least:</li>,
      <ul key="sub">{subRequirements}</ul>
    );
  }

  if (rules.spaces === false) {
    requirementItems.push(
      <li
        key="spaces"
        className={getClass("spaces")}
      >
        No spaces
      </li>
    );
  }

  if (rules.email) {
    requirementItems.push(
      <li
        key="email"
        className={getClass("email")}
      >
        Must be a valid email address.
      </li>
    );
  }

  return <>{requirementItems}</>;
};

/* Checking multiple fields for Submit */
const validateFields = (fields: Fields) => {
  const result: Record<string, ValidationResult> = {};

  Object.entries(fields).forEach(([name, field]) => {
    result[name] = validateField({
      value: field.value,
      fieldType: field.fieldType,
      fieldRules: field.fieldRules,
    });
  });

  return result;
};

export const checkAllFields = (
  fields: Fields
): Object => {
  const result = validateFields(fields);

  return Object.values(result).every(
    (validation) => validation === "good"
  ) ? true : result;
};