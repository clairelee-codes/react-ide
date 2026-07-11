import React, { useContext } from "react";
import "./createPlaygroundModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProvider";

export const CreatePlaygroundModal = () => {
  const modalFeatrues = useContext(ModalContext);
  const playgroundFeatures = useContext(PlaygroundContext);

  const closeModal = () => {
    modalFeatrues.closeModal();
  };

  const onSubmitModal = (e) => {
    e.preventDefault();
    // console.log(e.target?.folderName?.value);
    const folderName = e.target.folderName.value;
    const fileName = e.target.fileName.value;
    const language = e.target.language.value;
    playgroundFeatures.createNewPlayground({
      folderName,
      fileName,
      language,
    });
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={onSubmitModal}>
        <span className="material-icons close" onClick={closeModal}>
          close
        </span>
        <h1>Create New Playground</h1>
        <div className="item">
          <p>Enter folder Name</p>
          <input name="folderName" />
        </div>
        <div className="item">
          <p>Enter card Name</p>
          <input name="fileName" />
        </div>
        <div className="item">
          <select name="language">
            <option value="cpp">CPP</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <button type="submit">Create Playground</button>
        </div>
      </form>
    </div>
  );
};
