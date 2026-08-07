import { create } from "zustand";

// LOG IN
type Login = {
  isLogged: boolean;
  username: string;
  password: string;

}

type LoginStore = Login & {
  setLogin: (Login: Required<Login>) => void;
  setUsername: (Login: Required<Login>) => void;
  setPassword: (Login: Required<Login>) => void;
};

export const useLogin = create<LoginStore>((set) => ({
  isLogged: false,
  username: '',
  password: '',
  setLogin: (state:any) => set({isLogged:state}),
  setUsername: (state:any) => set({username:state}),
  setPassword: (state:any) => set({password:state}),
}));

// ROLES
/*
  Static role settings:
  ___________________________________________________
  Legend:     0-deny 1-full, 2-partial, 
  ---------------------------------------------------
  Roles:      Create  Read  Update  Delete  Transact
  admin       1       1     1       1       0
  librarian   0       2     0       0       1
  patron      0       2     2       0       2
  guest       2       0     0       0       0
  ---------------------------------------------------
*/

type RolesMap = {
  admin: number[];
  librarian: number[];
  patron: number[];
  guest: number[];
};

type RoleStore = {
  roles: RolesMap;
  roleLogged: number[];
  setRole: (role: keyof RolesMap) => void;
};

const roles:RolesMap = {
  admin: [1, 1, 1, 1, 0],
  librarian: [0, 2, 0, 0, 1],
  patron: [0, 2, 2, 0, 2],
  guest: [2, 0, 0, 0, 0],
}

export const useRole = create<RoleStore>((set) => ({
  roles:roles,
  roleLogged: roles.admin, // guest
  setRole: (role) =>
    set((state) => ({
      roleLogged: state.roles[role],
    })),
}));

// PROFILE
type Profile = {
  isSignedIn: boolean;
  isUpdate: boolean;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  address: string; // for patrons only
  terms: boolean;
  booklimit:number; // 0-standard(5), 1-scholar(8), 2-loyalty(10) 
  role:number; // 0-patron, 1-librarian, 2-admin
  active: boolean;
  created: null;

};

type ProfileStore = Profile & {
  setProfile: (profile: Partial<Profile>) => void;
};

export const useProfile  = create<ProfileStore>((set) => ({
  isSignedIn: false,
  isUpdate: false,
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  mobile: "",
  email: "",
  address: "",
  terms: false,
  booklimit:0,
  role:0,
  active: false,
  created: null,

  setSignIn: (state:any) => set({isSignedIn:state}),
  setUpdate: (state:any) => set({isSignedIn:state}),
  setProfile: (profile) =>
    set((state) => ({
      ...state,
      ...profile,
    })),
}));

// ERRORS
type Errors = {
  errors: string[];
}

type ErrorStore = Errors & {
  setErrors: (error: Partial<Errors>) => void;
};

export const useErrors = create<ErrorStore>((set) => ({
  errors:[],
  setErrors: (state:any) => set({errors:state})
}));
