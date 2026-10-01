import { create } from "zustand";

// THEME
type ColorScheme = {
  currentScheme: string;
}

export const useColorScheme = create<ColorScheme>((set) => ({
  currentScheme: '',
  setCurrentScheme: (state:any) => set({currentScheme:state}),
}));


// LOG IN
type Login = {
  isLogged: boolean;
  id: string;
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
  id: '',
  username: '',
  password: '',
  setLogin: (state:any) => set({isLogged:state}),
  setUsername: (state:any) => set({id:state,username:state}),
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
  id:string;
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

type ProfileSelected = {
  id: string;
  value: boolean;
  visible: boolean;
}

type ProfileStore = Profile & {
  formType:string;
  setFormType: (profile: Profile) => void;
  setProfile: (profile: Partial<Profile>) => void;
};

type UserStore = Profile & {
  Users:Partial<Profile>;
  UserPicked:Partial<Profile>;
  selected: ProfileSelected[];
  setUsers: (profile: Profile) => void;
  setUserPicked: (profile: Profile) => void;
  setSelected: (
    selected:
      | ProfileSelected[]
      | ((prev: ProfileSelected[]) => ProfileSelected[])
  ) => void;
};

export const useProfile  = create<ProfileStore>((set) => ({
  formType: '',
  id:"",
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  mobile: "",
  email: "",
  address: [],
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
}));

export const useUser  = create<UserStore>((set) => ({
  Users:{},
  UserPicked:{},
  id:"",
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  mobile: "",
  email: "",
  address: [],
  terms: false,
  booklimit:0,
  role:0,
  active: false,
  created: null,
  selected: [],

  setUsers: (state:any) => set({Users:state}),
  setUserPicked: (state:any) => set({UserPicked:state}),
  setSelected: (selected) =>
    set((state) => ({
      selected:
        typeof selected === 'function'
          ? selected(state.selected)
          : selected,
    }))
}));

// SEARCH
type Search = {
  searchType: string;
  searchValue :string;
}

type SearchStore = Search & {
  setSearchType: (search: Partial<Search>) => void;
  setSearchValue: (search: Partial<Search>) => void;
};

export const useSearch = create<SearchStore>((set) => ({
  searchType:"name",
  searchValue:"",
  setSearchType: (state:any) => set({searchType:state}),
  setSearchValue: (state:any) => set({searchValue:state})
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
