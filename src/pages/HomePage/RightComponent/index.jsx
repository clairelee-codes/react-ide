import { useContext } from "react";
import "./index.scss";
import { PlaygroundContext } from "../../../Providers/PlaygroundProvider";

const Folder = ({ folderTitle, cards }) => {
  return (
    <div className="folder-container">
      <div className="folder-header">
        <div className="folder-header-item">
          <span className="material-icons" style={{ color: "#ffca29" }}>
            folder
          </span>
          <span>{folderTitle}</span>
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
        {cards?.map((card, index) => {
          return (
            <div className="card" key={index}>
              <img src="logo.png" />
              <div className="title-container">
                <span>{card.title}</span>
                <span>Language: {card.language}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-icons">delete</span>
                <span className="material-icons">edit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RightComponent = () => {
  const { folders } = useContext(PlaygroundContext);
  // console.log(folders);
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
      {folders?.map((folder, index) => {
        return (
          <Folder
            key={index}
            folderTitle={folder?.title}
            cards={folder?.files}
          />
        );
      })}
    </div>
  );
};

export default RightComponent;
