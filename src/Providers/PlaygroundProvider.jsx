import { createContext, useContext } from "react";

export const PlaygroundContext = createContext();

export const PlaygroundProvider = ({ children }) => {
  const obj = { name: "aravind" };
  return <PlaygroundContext value={obj}>{children}</PlaygroundContext>;
  // React 18
  // <PlaygroundContext.Provider value={obj}></PlaygroundContext.Provider>
};
