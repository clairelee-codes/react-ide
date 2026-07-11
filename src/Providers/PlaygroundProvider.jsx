import { createContext, useContext, useEffect, useState } from "react";
import { v4 } from "uuid";

const intialData = [
  {
    id: v4(),
    title: "Spring Boot",
    files: [
      {
        id: v4(),
        title: "index",
        code: `cout<<"Hello world";`,
        language: "cpp",
      },
    ],
  },
  {
    id: v4(),
    title: "Frontend",
    files: [
      {
        id: v4(),
        title: "test",
        code: `cout<<"Hello world";`,
        language: "cpp",
      },
    ],
  },
];

export const PlaygroundContext = createContext();

export const PlaygroundProvider = ({ children }) => {
  const [folders, setFolders] = useState(intialData);

  const createNewPlayground = (newPlayground) => {
    console.log({ newPlayground }, "inside the playground provider");
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(folders));
  }, []);

  const playgroundFeatures = {
    folders,
    createNewPlayground,
  };

  return (
    <PlaygroundContext value={playgroundFeatures}>{children}</PlaygroundContext>
  );
  // React 18
  // <PlaygroundContext.Provider value={obj}></PlaygroundContext.Provider>
};
