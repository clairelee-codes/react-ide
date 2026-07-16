import { useContext } from "react";
import "./createPlaygroundModal.scss";
import { ModalContext } from "../ModalProvider";
import { PlaygroundContext } from "../PlaygroundProvider";

export const CreateCardModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext);
  const { createFile } = useContext(PlaygroundContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileName = e.target.fileName.value;
    const language = e.target.language.value;

    createFile(modalPayload, fileName, language);
    closeModal();
  };

  return (
    <div className="modal-container">
      <form className="modal-body" onSubmit={handleSubmit}>
        <span className="material-icons close" onClick={closeModal}>
          close
        </span>
        <h1>Create New Playground</h1>
        <div className="item">
          <input name="fileName" placeholder="Enter card title" required />
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
