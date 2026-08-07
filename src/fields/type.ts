/*  
  Data fields types:

  @param {string} value     =>  field value
  
  @param {string} fieldType =>  'any' (accepts any kind of characters)
                                'alphanum' (accepts alpha-numberic only) 
                                'alpha' (accepts letters only)
                                'num' (accepts numbers only)
                                'bool' (accepts binary | binary[])  - for tick boxes like checkbox / radio
                                                                    - if required single entity: it only accepts 'true' value
                                                                    - if required multiple entity: at least one entity must be 'true'
                                'date' (accepts date['yyyy-mm-dd'] only)
                                'datetime' (accepts datetime['yyyy-mm-dd hh:mm:ss'] only)
                                ** spaces will be determined if 'spaces' in the fieldRules is set on false
  
  @param {string[]} owner   =>  determines which role who can administer this kind of field (default: ['admin','guest'])
                                ________________________________________________
                                Legend:   0-deny 1-full, 2-self, 
                                ------------------------------------------------
                                Roles:    Create  Read  Update  Delete  Transact
                                admin     1       1     1       1       0
                                librarian 0       1     0       0       1
                                patron    0       2     2       0       2
                                guest     2       0     0       0       0
                                ------------------------------------------------
  
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
export type owner = string[]

export type FieldType = "any" | "alphanum" | "alpha" | "num" | "bool" | "date" | "datetime";

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
    owner?:owner;
    fieldType?: FieldType;
    fieldRules: FieldRules;
  }
>;