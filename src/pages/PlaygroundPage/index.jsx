import { useParams } from "react-router-dom";
import "./index.scss";
import { EditorContainer } from "./EditorContainer";
import { useState } from "react";
const PlaygroundPage = () => {
  const params = useParams();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { fileId, folderId } = params;

  const handleImportInput = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.includes("text");

    if (fileType) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (e) => {
        // console.log(e.target.result);
        setInput(e.target.result);
      };
    }
  };

  const handleExportOutput = () => {
    const outputValue = output.reim();
    if (!outputValue) {
      alert("Output is Empty");
      return;
    }

    const blob = new Blob([outputValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.text";
    link.click();
  };

  return (
    <div className="playground-container">
      <div className="header-container">
        <img className="logo" src="/logo.png" />
      </div>
      <div className="content-container">
        <div className="editor-container">
          <EditorContainer folderId={folderId} fileId={fileId} />
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
              setInput(e.taget.value);
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
              setOutput(e.taget.value);
            }}
          ></textarea>
        </div>
        {/* <EditorContainer></EditorContainer> */}
      </div>
    </div>
  );
};

export default PlaygroundPage;
