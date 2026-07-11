import { useContext } from "react";
import "./index.scss";
import { PlaygroundContext } from "../../../Providers/PlaygroundProvider";

const RightComponent = () => {
  const val = useContext(PlaygroundContext);
  console.log(val);

  return (
    <div className="right-container">
      <div className="header">
        <h1 className="title">
          <span>My</span> Playground
        </h1>
        <button className="add-folder">
          <span className="material-icons">add</span>
          <span>New Folder</span>
        </button>
      </div>
      <div className="folder-container">
        <div className="folder-header">
          <div className="folder-header-item">
            <span className="material-icons" style={{ color: "#ffca29" }}>
              folder
            </span>
            <span>DSA</span>
          </div>
          <div className="folder-header-item">
            <span className="material-icons">delete</span>
            <span className="material-icons">edit</span>
            <button>
              <span className="material-icons">add</span>
              <span>New Playground</span>
            </button>
          </div>
        </div>
        <div className="cards-container">
          <div className="card">
            <img src="logo.png" />
            <div className="title-container">
              <span>{"Heap Implementation"}</span>
              <span>Language: {"java"}</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <span className="material-icons">delete</span>
              <span className="material-icons">edit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightComponent;
