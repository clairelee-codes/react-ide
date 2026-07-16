import { createContext, useEffect, useState } from "react";
import { v4 } from "uuid";

const defaultCodes = {
  cpp: `#include <iostream>
  using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  javascript: `console.log("hello world");`,
  python: `print("hello python)`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
};

const initialData = [
  {
    id: v4(),
    title: "Spring Boot",
    files: [
      {
        id: v4(),
        title: "index",
        code: defaultCodes.cpp,
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
        code: defaultCodes.cpp,
        language: "cpp",
      },
    ],
  },
];

export const PlaygroundContext = createContext();

export const PlaygroundProvider = ({ children }) => {
  const [folders, setFolders] = useState(() => {
    const localData = localStorage.getItem("data");
    if (localData) {
      return JSON.parse(localData);
    }
    return initialData;
  });

  const createNewPlayground = (newPlayground) => {
    // console.log({ newPlayground }, "inside the playground provider");
    const { fileName, folderName, language } = newPlayground;

    setFolders((folders) => {
      const updatedFolders = [...folders];
      updatedFolders.push({
        id: v4(),
        title: folderName,
        files: [
          {
            id: v4(),
            title: fileName,
            code: defaultCodes[language],
            language: language,
          },
        ],
      });
      return updatedFolders;
    });
  };

  const createNewFolder = (folderName) => {
    const newFolder = {
      id: v4(),
      title: folderName,
      files: [],
    };
    setFolders((folders) => [...folders, newFolder]);
  };

  const deleteFolder = (id) => {
    setFolders((folders) => {
      return folders.filter((folder) => folder.id !== id);
    });
  };

  const editFolderTitle = (newFolderName, id) => {
    setFolders((folders) =>
      folders.map((folder) =>
        folder.id !== id ? folder : { ...folder, title: newFolderName },
      ),
    );
  };

  const editFileTitle = (newFileName, folderId, fileId) => {
    setFolders((folders) =>
      folders.map((folder) =>
        folder.id !== folderId
          ? folder
          : {
              ...folder,
              files: folder.files.map((file) =>
                file.id !== fileId ? file : { ...file, title: newFileName },
              ),
            },
      ),
    );
  };

  const deleteFile = (folderId, fileId) => {
    setFolders((folders) =>
      folders.map((folder) =>
        folder.id !== folderId
          ? folder
          : {
              ...folder,
              files: folder.files.filter((file) => file.id !== fileId),
            },
      ),
    );
  };

  const createFile = (folderId, fileName, language) => {
    const file = {
      id: v4(),
      title: fileName,
      code: defaultCodes[language],
      language: language,
    };

    setFolders((folders) =>
      folders.map((folder) =>
        folder.id !== folderId
          ? folder
          : { ...folder, files: [...folder.files, file] },
      ),
    );
  };

  const resetLanguageAndCode = (folderId, fileId, language) => {
    setFolders((folders) =>
      folders.map((folder) =>
        folder.id !== folderId
          ? folder
          : {
              ...folder,
              files: folder.files.map((file) =>
                file.id !== fileId
                  ? file
                  : {
                      ...file,
                      code: defaultCodes[language],
                      language: language,
                    },
              ),
            },
      ),
    );
  };

  const getCode = (folderId, fileId) => {
    const folder = folders.find((folder) => folder.id === folderId);
    // console.log(folder);
    const file = folder?.files.find((file) => file.id === fileId);
    return file?.code;
  };

  const getLanguage = (folderId, fileId) => {
    const folder = folders.find((folder) => folder.id === folderId);
    // console.log(folder);
    const file = folder?.files.find((file) => file.id === fileId);
    return file?.language;
  };

  const getDefaultCode = (language) => {
    return defaultCodes[language];
  };

  useEffect(() => {
    // if (!localStorage.getItem("data")) {
    //   localStorage.setItem("data", JSON.stringify(folders));
    // }

    localStorage.setItem("data", JSON.stringify(folders));
  }, [folders]);

  const playgroundFeatures = {
    folders,
    createNewPlayground,
    createNewFolder,
    deleteFolder,
    editFolderTitle,
    editFileTitle,
    deleteFile,
    createFile,
    resetLanguageAndCode,
    getCode,
    getLanguage,
    getDefaultCode,
  };

  return (
    <PlaygroundContext value={playgroundFeatures}>{children}</PlaygroundContext>
  );
  // React 18
  // <PlaygroundContext.Provider value={obj}></PlaygroundContext.Provider>
};
