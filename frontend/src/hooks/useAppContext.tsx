import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
