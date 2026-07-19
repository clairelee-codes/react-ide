import { useContext, useRef, useState } from "react";
import "./editorContainer.scss";
import Editor from "@monaco-editor/react";
import { PlaygroundContext } from "../../Providers/PlaygroundProvider";
import { useFileUpload } from "../../hooks/useFileUpload";
import { downloadTextFile } from "../../utils/downloadTextFile";

const editorOptions = {
  fontSize: 16,
  wordWrap: "on",
  automaticLayout: true,
};

const fileExtensionMapping = {
  cpp: "cpp",
  javascript: "js",
  python: "py",
  java: "java",
};

export const EditorContainer = ({ folderId, fileId, runCode }) => {
  const { getFile, getDefaultCode, saveCode } = useContext(PlaygroundContext);
  const {
    title,
    code: initialCode,
    language: initialLanguage,
  } = getFile(folderId, fileId) ?? {};

  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [theme, setTheme] = useState("vs-dark");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const codeRef = useRef(code);

  const handleChangeCode = (newCode) => {
    codeRef.current = newCode;
  };

  const handleUploadCode = useFileUpload(
    (result) => {
      setCode(result);
      codeRef.current = result;
    },
    { onInvalidType: () => alert("Please Choose a program file") },
  );

  const handleExportCode = () => {
    // console.log(codeRef);
    const codeValue = codeRef.current?.trim();

    if (!codeValue) {
      alert("Please Type Some code in the editor before exporting");
      return;
    }

    downloadTextFile(codeValue, `code.${fileExtensionMapping[language]}`);
  };

  const handleChangeLanguage = (e) => {
    const defaultCode = getDefaultCode(e.target.value);
    codeRef.current = defaultCode;
    // console.log(codeRef.current);

    setCode(defaultCode);
    setLanguage(e.target.value);
  };

  const handleChangeTheme = (e) => {
    setTheme(e.target.value);
  };

  const handleSaveCode = () => {
    // console.log(codeRef.current);
    saveCode(folderId, fileId, codeRef.current, language);
    alert("Code Saved Successfully");
  };

  const handleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const handleRunCode = () => {
    runCode({
      code: codeRef.current,
      language,
    });
  };
  return (
    <div
      className="root-editor-container"
      style={isFullScreen ? styles.fullScreen : {}}
    >
      <div className="editor-header">
        <div className="editor-left-container">
          <b className="title">{title}</b>
          <span className="material-icons">edit</span>
          <button onClick={handleSaveCode}>Save code</button>
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
        <button className="btn" onClick={handleFullScreen}>
          <span className="material-icons">fullscreen</span>
          <span>{isFullScreen ? "Minimize" : "Full Screen"}</span>
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
        <button className="btn" onClick={handleRunCode}>
          <span className="material-icons">play_arrow</span>
          <span>Run Code</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
};
