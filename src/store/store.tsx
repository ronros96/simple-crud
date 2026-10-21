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
type Status = "idle" | "yes" | "no"

type Login = {
  isLogged: boolean;
  cookies: Status;
  id: string;
  username: string;
}

type LoginStore = Login & {
  setLogin: (Login: Required<Login>) => void;
  setCookies: (Login: Required<Login>) => void;
};

export const useLogin = create<LoginStore>((set) => ({
  isLogged: false,
  cookies: "idle",
  id: '',
  username: '',
  setLogin: (state:any) => set({isLogged:state}),
  setCookies: (state:any) => set({cookies:state}),
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
  contact: string;
  email: string;
  address: string[];
  terms: boolean;
  booklimit:number; // 0-standard(5), 1-scholar(8), 2-loyalty(10) 
  role:number; // 0-patron, 1-librarian, 2-admin
  active: boolean;
  bot:boolean;
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
  contact: "",
  email: "",
  address: [],
  terms: false,
  booklimit:0,
  role:0,
  active: false,
  bot:false,
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
  contact: "",
  email: "",
  address: [],
  terms: false,
  booklimit:0,
  role:0,
  active: false,
  created: null,
  bot: false,
  selected: [],

  setUsers: (state:any) => set({Users:state}),
  setUserPicked: (data) =>
    set((state) => ({
      UserPicked: {
        ...state.UserPicked,
        ...data,
      },
    })),
  setSelected: (selected) =>
    set((state) => ({
      selected:
        typeof selected === 'function'
          ? selected(state.selected)
          : selected,
    }))
}));

//DELETE PROFILE
type DeleteUser = {
  complete:boolean;
}

type DeleteUserStore = DeleteUser & {
  setComplete: (Login: Required<Login>) => void;
};

export const useDelete = create<DeleteUserStore>((set) => ({
  complete: false,
  setComplete: (state:any) => set({complete:state}),
}));

//CARD FILTERS
type Filters = {
  all: boolean;
  contact: boolean;
  email: boolean;
  address: boolean;
}

type FliterStore = {
  viewFilter:Partial<Filters>;
  setViewFilter: (Filters: Required<Filters>) => void;
}

export const useFilter  = create<FliterStore>((set) => ({
  viewFilter:{
    all: true,
    contact: true,
    email: true,
    address: true,
  },
  setViewFilter: (filter) =>
    set((state) => ({
      viewFilter: {
        ...state.viewFilter,
        ...filter,
      },
    })),
}));

//FOR USER ACTION NOTIFS
type ActionStatus = '' | 'update' | 'delete'
type BatchType = '' | 'multiple' | 'single'
 
type UserStatus = {
  status: ActionStatus;
  userID: string;
  firstname: string;
  lastname: string;
}

type Trigger = {
  batchType: BatchType
  isOpen:boolean
}

type UserStatusStore = {
  Trigger:Trigger;
  userAction:Partial<UserStatus>
  setTrigger: (setTrigger: Required<Trigger>) => void;
  setUserAction: (UserStatus: Required<UserStatus>) => void;
}
export const useUserAction  = create<UserStatusStore>((set) => ({
  Trigger:{
    batchType: 'single',
    isOpen: false
  },
  userAction:{
    status: '',
    userID: '',
    firstname: '',
    lastname: '',
  },
  setTrigger: (trigger:any) => 
    set((state) => ({
      Trigger: {
        ...state.Trigger,
        ...trigger,
      },
    })),
  setUserAction: (userStatus) =>
    set((state) => ({
      userAction: {
        ...state.userAction,
        ...userStatus,
      },
    })),
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
