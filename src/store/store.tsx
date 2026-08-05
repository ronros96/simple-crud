import { create } from "zustand";

// LOG IN
export const useLogin = create((set) => ({
  isLogged: false,
  username: '',
  password: '',
  setLogin: (state:any) => set({isLogged:state}),
  setUsername: (state:any) => set({username:state}),
  setPassword: (state:any) => set({password:state}),
}));

// SIGN IN
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