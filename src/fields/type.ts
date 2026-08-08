/*  
  Data fields types:

  @param {string} value     =>  field value
  
  @param {string} fieldType =>  'any' (accepts any kind of characters)
                                'alphanum' (accepts alpha-numberic only) 
                                'alpha' (accepts letters only)
                                'num' (accepts numbers only)
                                'mobile' (accepts 10+ digits mobile number)
                                'bool' (accepts binary | binary[])  - for tick boxes like checkbox / radio
                                                                    - if required single entity: it only accepts 'true' value
                                                                    - if required multiple entity: at least one entity must be 'true'
                                'date' (accepts date['yyyy-mm-dd'] only)
                                'datetime' (accepts datetime['yyyy-mm-dd hh:mm:ss'] only)
                                ** spaces will be determined if 'spaces' in the fieldRules is set on false
  
  @param {string[]} owner   =>  determines which role who can administer this kind of field (default: ['admin','guest'])
  
  @param {record} fieldRules:{
                    required    {boolean} => if field is required (default: false)
                    characters  {number}  => minimum characters - 0 means accepts null or empty (default: 0)
                    spaces      {boolean} => defualt true, false means no spaces
                    capital     {number}  => minimum capital letters needed, (default: 0)
                    small       {number}  => minimum small letters needed, (default: 0)
                    number      {number}  => minimum numbers needed, (default: 0)
                    special     {number}  => minimum special characters needed, (default: 0)
                    email       {boolean} => default false, true means field is a email
                  }
  
  @returns  =>  'empty' = means field is still empty/null
                'good' = all fieldRule/s are fullfilled, 
                errors[] = indicate what fieldRule/s have an error.
                
                example error return: 
                password: {
                  errors: ["capital", "special"]
                }
*/
export type Owner = Record<string,string>

export type FieldType = "any" | "alphanum" | "alpha" | "num" | "mobile" | "bool" | "date" | "datetime";

export type FieldRules = {
  required?: boolean;
  characters?: number;
  spaces?: boolean;
  capital?: number;
  small?: number;
  number?: number;
  special?: number;
  email?: boolean;
};

export type Fields = Record<
  string,
  {
    value: any;
    owner?:Owner;
    fieldType?: FieldType;
    fieldRules: FieldRules;
  }
>;

export type RolesMap = {
  admin: number[];
  librarian: number[];
  patron: number[];
  guest: number[];
};;