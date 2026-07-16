import "./createPlaygroundModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProvider";
import { useContext } from "react";

export const CreateFolderModal = () => {
  const { closeModal } = useContext(ModalContext);
  const { createNewFolder } = useContext(PlaygroundContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const folderName = e.target.folderName.value;
    // console.log(folderName);
    createNewFolder(folderName);
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={handleSubmit}>
        <span className="material-icons close" onClick={closeModal}>
          close
        </span>
        <h1>Create New Folder</h1>
        <div style={createFolderStyles.inputContainer}>
          <input
            style={createFolderStyles.input}
            name="folderName"
            required
            placeholder="Enter Folder Name"
          />
          <button style={createFolderStyles.btn} type="submit">
            Create Folder
          </button>
        </div>
      </form>
    </div>
  );
};

export const createFolderStyles = {
  inputContainer: {
    display: "flex",
    gap: 10,
  },
  input: {
    flexGrow: 1,
    padding: 10,
  },
  btn: {
    backgroundColor: "#241f21",
    border: "none",
    borderRadius: 4,
    padding: "0px, 10px",
    color: "white",
  },
};
