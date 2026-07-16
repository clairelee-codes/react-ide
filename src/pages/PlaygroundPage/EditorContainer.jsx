import { useContext, useRef, useState } from "react";
import "./editorContainer.scss";
import Editor from "@monaco-editor/react";
import { PlaygroundContext } from "../../Providers/PlaygroundProvider";

const editorOptions = {
  fontSize: 16,
  wordWrap: "on",
};

const fileExtensionMapping = {
  cpp: "cpp",
  javascript: "js",
  python: "py",
  java: "java",
};

export const EditorContainer = ({ folderId, fileId }) => {
  const { getCode, getLanguage, resetLanguageAndCode, getDefaultCode } =
    useContext(PlaygroundContext);
  const [code, setCode] = useState(() => {
    return getCode(folderId, fileId);
  });
  const [language, setLanguage] = useState(() => {
    return getLanguage(folderId, fileId);
  });
  const [theme, setTheme] = useState("vs-dark");
  const codeRef = useRef(code);

  const handleChangeCode = (newCode) => {
    codeRef.current = newCode;
    console.log(newCode);
  };

  const handleUploadCode = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.includes("text");
    console.log(file);

    if (fileType) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (e) {
        // console.log(e.target.result);
        const importedCode = e.target.result;
        setCode(importedCode);
        codeRef.current = importedCode;
      };
    } else {
      alert("Please Choose a program file");
    }
  };

  const handleExportCode = () => {
    // console.log(codeRef);
    const codeValue = codeRef.current?.trim();

    if (!codeValue) {
      alert("Please Type Some code in the editor before exporting");
    }

    const codeBlob = new Blob([codeValue], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(codeBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `code.${fileExtensionMapping[language]}`;
    link.click();
  };

  const handleChangeLanguage = (e) => {
    resetLanguageAndCode(folderId, fileId, e.target.value);
    setCode(getCode(folderId, fileId));
    // setCode(getDefaultCode(e.target.value));
    setLanguage(e.target.value);
  };

  const handleChangeTheme = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="root-editor-container">
      <div className="editor-header">
        <div className="editor-left-container">
          <b className="title">{"title of the card"}</b>
          <span className="material-icons">edit</span>
          <button>Save code</button>
        </div>
        <div className="editor-right-container">
          <select value={language} onChange={handleChangeLanguage}>
            <option value="cpp">cpp</option>
            <option value="javascript">javascript</option>
            <option value="java">java</option>
            <option value="python">python</option>
          </select>
          <select value={theme} onChange={handleChangeTheme}>
            <option value="vs-dark">vs-dark</option>
            <option value="vs-light">vs-light</option>
          </select>
        </div>
      </div>
      <div className="editor-body">
        <Editor
          height={"100%"}
          language={language}
          options={editorOptions}
          theme={theme}
          onChange={handleChangeCode}
          value={code}
        />
      </div>
      <div className="editor-footer">
        <button className="btn">
          <span className="material-icons">fullscreen</span>
          <span>Full Screen</span>
        </button>
        <label htmlFor="import-code" className="btn">
          <span className="material-icons">cloud_download</span>
          <span>Import Code</span>
        </label>
        <input
          type="file"
          id="import-code"
          style={{ display: "none" }}
          onChange={handleUploadCode}
        />
        <button className="btn" onClick={handleExportCode}>
          <span className="material-icons">cloud_upload</span>
          <span>Export Code</span>
        </button>
        <button className="btn">
          <span className="material-icons">play_arrow</span>
          <span>Run Code</span>
        </button>
      </div>
    </div>
  );
};
