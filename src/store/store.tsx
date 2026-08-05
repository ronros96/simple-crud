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
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  address: string;
  terms: boolean;
};

type SignIn = Profile & {
  setProfile: (profile: Partial<Profile>) => void;
};

export const useSignIn  = create<SignIn>((set) => ({
  isSignedIn: false,
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  mobile: "",
  email: "",
  address: "",
  terms: false,

  setSignIn: (state:any) => set({isSignedIn:state}),
  setProfile: (profile) =>
    set((state) => ({
      ...state,
      ...profile,
    })),

}));