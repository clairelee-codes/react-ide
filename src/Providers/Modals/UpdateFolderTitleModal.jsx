import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProvider";
import { useContext } from "react";
import { createFolderStyles } from "./CreateFolderModal";

export const UpdateFolderTitleModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext);
  const { editFolderTitle } = useContext(PlaygroundContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const folderName = e.target.folderName.value;
    editFolderTitle(folderName, modalPayload);
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={handleSubmit}>
        <span className="material-icons close" onClick={closeModal}>
          close
        </span>
        <h1>Update Folder Title</h1>
        <div style={createFolderStyles.inputContainer}>
          <input
            style={createFolderStyles.input}
            name="folderName"
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
