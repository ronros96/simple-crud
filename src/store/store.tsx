import { create } from "zustand";
import type {RolesMap} from "@src/fields/type";

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
  Legend:  0-deny 1-full, 2-partial, 
  ---------------------------------------------------
  Roles:  [Create  Read  Update  Delete]
  ---------------------------------------------------
*/


type Roles = 'guest' | 'admin' | 'librarian' | 'patrom';

type RoleStore = {
  roleLogged:Roles;
  setRole: (RoleStore: Roles) => void;
};

export const useRole = create<RoleStore>((set) => ({
  roleLogged: 'guest',
  setRole: (state:any) => set({roleLogged:state}),
}));

// PROFILE
type Profile = {
  formType: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  address: string[];
  terms: boolean;
  booklimit:number; // 0-standard(5), 1-scholar(8), 2-loyalty(10) 
  role:number; // 0-patron, 1-librarian, 2-admin
  active: boolean;
  created: null;
};


type ProfileStore = Profile & {
  Users:Partial<Profile>;
  setFormType: (profile: Profile) => void;
  setProfile: (profile: Partial<Profile>) => void;
  setUsers: (profile: Profile) => void;
};

export const useProfile  = create<ProfileStore>((set) => ({
  Users:{},
  formType: '',
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  mobile: "",
  email: "",
  address: [""],
  terms: false,
  booklimit:0,
  role:0,
  active: false,
  created: null,

  setFormType: (state:any) => set({formType:state}),
  setProfile: (profile) =>
    set((state) => ({
      ...state,
      ...profile,
    })),
  setUsers: (state:any) => set({Users:state}),
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
