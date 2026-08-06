/* Data field requirements */

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

type Fields = Record<
  string,
  {
    fieldType?: FieldType;
    fieldRules: FieldRules;
  }
>;

 export const ProfileFields:Fields = {
  username:{
    fieldType:'alphanum', 
    fieldRules:{
      characters:5,
      spaces:false
    }
  },
  password:{
    fieldType:'any', 
    fieldRules:{
      characters:10,
      spaces:false,
      capital:1,
      small:1,
      number:1,
      special:1,
      email:false,
    }
  },
  firstname:{
    fieldType:'alpha',
    fieldRules:{
      characters:1,
      spaces:true,
    }
  },
  lastname:{
    fieldType:'alpha',
    fieldRules:{
      characters:1,
      spaces:true,
    }
  }
}

