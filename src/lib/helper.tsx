import type { ReactNode } from "react";
import type {Fields ,FieldType, FieldRules, owner} from "@src/fields/type";

/*

  Error Handler Helper
  see fields/fields.ts for params

*/

type Field = {
  value: any;
  owner?: owner;
  fieldType?: FieldType;
  fieldRules: FieldRules;
}

type ValidationResult =
  | "empty"
  | "good"
  | {
      errors: string[];
    };

/* 
  Error handler 
  @param Field
  @param init => if validation is just initial (for onchange func) or final (for submit func) (defualt:false)
*/    
const validateField = (
  field: Field,
  init: boolean,
): ValidationResult => {
  const value = field.value ?? "";
  const owner = field.owner ?? ['admin,1,1,1,1,0','guest,2,0,0,0,0'];
  const rules = field.fieldRules;

  // default values
  const required = rules.required ?? false;
  const minChars = rules.characters ?? 0;
  const allowSpaces = rules.spaces ?? true;
  const minCapital = rules.capital ?? 0;
  const minSmall = rules.small ?? 0;
  const minNumber = rules.number ?? 0;
  const minSpecial = rules.special ?? 0;
  const email = rules.email ?? false;
  const type = field.fieldType ?? "any";

  // Empty value
  if (typeof value === "string" && value.trim() === "" && init) {
    return "empty";
  }
  const errors: string[] = [];

  //required
  if(required && !init){
    //string
    if (typeof value === "string" && value.trim() === "") {
      errors.push("required");
    }
    //single boolean
    else if(!value){
      errors.push("required");
    }
    //multiple booleans
    else{
      
    }
  }

  // Character length
  if (value.length < minChars) {
    errors.push("characters");
  }

  // Spaces
  if (!allowSpaces && /\s/.test(value)) {
    errors.push("spaces");
  }

  // Email
  if (
    email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
  ) {
    errors.push("email");
  }

  // Count required characters
  if(typeof value === "string"){
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

    case "bool":
      if (parseInt(value) <= 0 && required) {
        errors.push("bool");
      }
      break;

    case "date":
      if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) {
        errors.push("date");
      }
      break;
      
    case "datetime":
      if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value)) {
        errors.push("datetime");
      }
      break;
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
  },true);
};

export const showRequirements = (
  field: FieldConfig,
  value: string,
  displayInitialIy?: boolean,
  insert?: string[],
): ReactNode => {
  const rules = field.fieldRules;
  const requirementItems = [];
  const result = validateOnChange(field,value);
  const display = displayInitialIy ?? false;
  const getClass = (name: string) => {
    if (result === "empty") return "";
    if (result === "good") return "good";
    return result.errors.includes(name) ? "err" : value.length > 0 ? "good" : "";
  };

  if ((rules.characters ?? 0) > 0) {
    requirementItems.push(
      <li
        key="characters"
        className={getClass("characters")}
      >
        Must be more than {rules.characters} characters.
      </li>
    );
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

  insert && insert?.map((text,i)=>{
    requirementItems.push(
      <li key={`insert-${i}`}>
        {text}
      </li>
    )
  })

  return display ? 
    <ul className='rules'>{requirementItems}</ul> : 
    typeof value === "object" && <ul className='rules'>{requirementItems}</ul>;
};

/* Checking multiple fields for Submit */
const validateFields = (fields: Fields) => {
  const result: Record<string, ValidationResult> = {};

  Object.entries(fields).forEach(([name, field]) => {
    result[name] = validateField({
      value: field.value,
      owner: field.owner,
      fieldType: field.fieldType,
      fieldRules: field.fieldRules,
    },false);
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