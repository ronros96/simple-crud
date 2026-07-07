import { create } from "zustand";

export const usePopUp = create((set) => ({
  isHover: false,
  setPopHover: (state:any) => set({isHover:state}),
}));