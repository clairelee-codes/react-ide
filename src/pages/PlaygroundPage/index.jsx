import { useParams } from "react-router-dom";
import "./index.scss";
import { EditorContainer } from "./EditorContainer";
import { useState } from "react";
import { makeSubmission } from "./service";
import { useFileUpload } from "../../hooks/useFileUpload";
import { downloadTextFile } from "../../utils/downloadTextFile";

const PlaygroundPage = () => {
  const params = useParams();
  const { fileId, folderId } = params;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isShowLoader, setIsShowLoader] = useState(false);

  const handleImportInput = useFileUpload(setInput);

  const handleExportOutput = () => {
    const outputValue = output.trim();
    if (!outputValue) {
      alert("Output is Empty");
      return;
    }

    downloadTextFile(outputValue, "output.text");
  };

  const callback = ({ apiStatus, data, message }) => {
    if (apiStatus === "loading") {
      setIsShowLoader(true);
    } else if (apiStatus === "error") {
      setIsShowLoader(false);
      setOutput("Something went wrong");
      console.log("message:", message);
    } else {
      setIsShowLoader(false);
      if (data.status.id === 3) {
        setOutput(atob(data.stdout));
      } else {
        setOutput(atob(data.stderr));
      }
    }
  };

  // useCallback제거 (컴파일러 자동)
  const runCode = ({ code, language }) => {
    makeSubmission({ code, language, stdin: input, callback });
  };

  return (
    <div className="playground-container">
      <div className="header-container">
        <img className="logo" src="/logo.png" />
      </div>
      <div className="content-container">
        <div className="editor-container">
          <EditorContainer
            folderId={folderId}
            fileId={fileId}
            runCode={runCode}
          />
        </div>
        <div className="input-output-container">
          <div className="input-header">
            <b>Input:</b>
            <label htmlFor="input" className="icon-container">
              <span className="material-icons">cloud_download</span>
              <b className="">Import Input</b>
            </label>
            <input
              type="file"
              id="input"
              style={{ display: "none" }}
              onChange={handleImportInput}
            />
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="input-output-container">
          <div className="output-header">
            <b>Output</b>
            <button className="icon-container" onClick={handleExportOutput}>
              <span className="material-icons">cloud_upload</span>
              <b>Export Output</b>
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            onChange={(e) => {
              setOutput(e.target.value);
            }}
          ></textarea>
        </div>
        {/* <EditorContainer></EditorContainer> */}
      </div>
      {isShowLoader && (
        <div className="fullpage-loader">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundPage;
