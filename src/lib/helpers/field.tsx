import type { ReactNode } from "react";
import type {Fields ,FieldType, FieldRules, Owner} from "@src/fields/type";
import { useRole, useProfile } from "@src/store/store";

type Field = {
  value: any;
  owner?: Owner;
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
  Validate per field
  @param field  {Field}   => see fields/fields.ts 
  @param init   {boolean} => if validation is just initial (for onchange func) or final (for submit func) (defualt:false)
  
*/    
const validateField = (
  field: Field,
  init: boolean,
): ValidationResult => {
  const value = field.value ?? "";
  const rules = field.fieldRules;

  // default values
  const required = rules.required ?? false;
  const unique = rules.unique ?? false;
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
    if(typeof value === "boolean" && !value){
      errors.push("agree");
    }
    //multiple booleans
    else{
      
    }
  }

  //unique
  const allUsers = useProfile.getState().Users;
  if(unique && Object.keys(allUsers).length > 0){
    const match = Object(allUsers).find(
      (u:any) => u.username === value.trim()
    );
    if(match){
      errors.push("unique");
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

    case "mobile":
      if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)) {
        errors.push("numberOnly");
      }
      break;

    case "alphanum":
      if (!/^[A-Za-z0-9._]+$/.test(value)) {
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
  OnChange validation
  if displayInitialIy is true it will show which requirements are valid/not.
  else is show certain requirements once it triggered false like: email input, etc.

  @param field            {record}           => FieldConfig (see fields.ts)
  @param value            {string}           => field value
  @params settings        {partial records} 
  {
    displayInitialIy      {boolean}          => if requirement/s should be shown or not, if 'false' once error takes place the requirement will show up (default: false).  
    insert                {string[]}         => insert message at the bottom of the list.
    title                 {string}           => this will be used for certain message/s instead of field's name.
    unique                {string}           => (required if field detected is unique) message needed 
  }


  */
type FieldConfig = Omit<Field, "value">;

const validateOnChange = (
  field: FieldConfig,
  value: string | boolean
) => {
  return validateField({
    ...field,
    value,
  },true);
};

export const showRequirements = (
  field: FieldConfig,
  value: string,
  settings?:{
    displayInit?: boolean,
    insert?: string[],
    title?: string,
    unique?: boolean | string,
  },

): ReactNode => {
  const fieldType = field.fieldType;
  const rules = field.fieldRules;
  const requirementItems = [];
  const display = settings?.displayInit ?? false;
  const insert = settings?.insert ?? false;
  const title = settings?.title ?? "";
  const isUnique = settings?.unique ?? false;
  rules.unique && isUnique === null && console.error('Field type is unique, insert handler function that will determine wheter the field is available or not')

  const result =  validateOnChange(field,value);
  const getClass = (name: string) => {
    if (result === "empty") return "";
    if (result === "good") return "good";
    console.log(result.errors.includes(name),name)
    return result.errors.includes(name) ? "err" : value.length > 0 ? "good" : "";
  };
  //for required tickers (checkbox / radio)
  if(fieldType === 'bool' && rules.required){
    requirementItems.push(
      <li
        key="agree"
        className={getClass("agree")}
      >
        You must agree to the {title} before proceeding.
      </li>
    );
  }

  //min of characters
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

  if (rules.unique) {
    let uniqueMsg:string = "";
    switch(isUnique){
      case 'profile':
        uniqueMsg = "Username already exist"
      break;
    }
    requirementItems.push(
      <li
        key="unique"
        className={getClass("unique")}
      >
        {uniqueMsg !== "" && getClass("unique") === "err" ? uniqueMsg : "Must be unique"}
      </li>
    );
  }

  const subRequirements = [];

  //min of capital
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

  //min of small
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

  //min of number
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

  //min of special char
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

  //show sub-requirements
  if (subRequirements.length) {
    requirementItems.push(
      <li key="title">There should be at least:</li>,
      <ul key="sub">{subRequirements}</ul>
    );
  }

  //no spaces
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

  //email input required
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

  //rendering all requirements
  insert && insert?.map((text,i)=>{
    requirementItems.push(
      <li key={`insert-${i}`}>
        {text}
      </li>
    )
  })

  return display ? 
    <ul className='rules'>{requirementItems}</ul> : 
    typeof result === "object" && <ul className='rules'>{requirementItems}</ul>
};

/* 
  Submit Error Handler:
  Check for last pass if all fields are valid.
  
  @param  error {obj}  => error state
  @param  target {any} => target field
  @return {boolean}    => true = there's an error.    
*/
export const fieldError = (
  error: Record<string, any>[],
  target: any
) => {
  return error[target]?.errors ? true : false;
};

/* Checking multiple fields for Submit */
const validateFields = (
  fields: Fields) => {
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
  fields: Fields,
): Object => {
  const result = validateFields(fields);

  return Object.values(result).every(
    (validation) => validation === "good"
  ) ? true : result;
};

/* 
Role orginazer:
Check if certain field needs to be shown base on current owner.

@param  fields {Fields} => list of Fields
@param  target {string} => target field
@return {string}        => 'view' | 'full' | false'
*/

type FieldOrginizerReturn = string | boolean;

export const FieldOrginizer = (
  fields:Fields,
  target:string
):FieldOrginizerReturn =>{
  const currentOwner = useRole.getState().roleLogged;

  if(fields[target].owner){
    return fields[target].owner?.[currentOwner] ? fields[target].owner?.[currentOwner] : false
  }else{
    return true;
  }
}