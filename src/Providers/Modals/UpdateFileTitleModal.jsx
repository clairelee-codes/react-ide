import { useContext } from "react";
import "./createPlaygroundModal.scss";
import { PlaygroundContext } from "../PlaygroundProvider";
import { ModalContext } from "../ModalProvider";
import { createFolderStyles } from "./CreateFolderModal";

export const UpdateFileTitleModal = () => {
  const { editFileTitle } = useContext(PlaygroundContext);
  const { closeModal, modalPayload } = useContext(ModalContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileName = e.target.fileName.value;
    editFileTitle(fileName, modalPayload.folderId, modalPayload.fileId);
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={handleSubmit}>
        <span className="material-icons close" onClick={closeModal}>
          close
        </span>
        <h1>Update File Title</h1>
        <div style={createFolderStyles.inputContainer}>
          <input
            style={createFolderStyles.input}
            name="fileName"
            required
            placeholder="Enter Folder Name"
          />
          <button style={createFolderStyles.btn} type="submit">
            Update Title
          </button>
        </div>
      </form>
    </div>
  );
};
