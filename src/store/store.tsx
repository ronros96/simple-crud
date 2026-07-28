import { create } from "zustand";

export const usePopUp = create((set) => ({
  isHover: false,
  setPopHover: (state:any) => set({isHover:state}),
}));

export const useLogin = create((set) => ({
  isLogged: false,
  username: '',
  password: '',
  setLogin: (state:any) => set({isLogged:state}),
  setUsername: (state:any) => set({username:state}),
  setPassword: (state:any) => set({password:state}),
}));