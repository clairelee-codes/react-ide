import { useContext } from "react";
import "./index.scss";
import { PlaygroundContext } from "../../../Providers/PlaygroundProvider";
import { modalConstants, ModalContext } from "../../../Providers/ModalProvider";
import { useNavigate } from "react-router-dom";

const Folder = ({ folderTitle, files, folderId }) => {
  const { deleteFolder, deleteFile } = useContext(PlaygroundContext);
  const { openModal, setModalPayload } = useContext(ModalContext);
  const navigate = useNavigate();

  const handleDeleteFolder = () => {
    deleteFolder(folderId);
  };

  const handleEditFolderTitle = () => {
    setModalPayload(folderId);
    openModal(modalConstants.UPDATE_FOLDER_TITLE);
  };

  const handleOpenCreateCardModal = () => {
    setModalPayload(folderId);
    openModal(modalConstants.CREATE_CARD);
  };

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
          <span className="material-icons" onClick={handleDeleteFolder}>
            delete
          </span>
          <span className="material-icons" onClick={handleEditFolderTitle}>
            edit
          </span>
          <button onClick={handleOpenCreateCardModal}>
            <span className="material-icons">add</span>
            <span>New Playground</span>
          </button>
        </div>
      </div>
      <div className="cards-container">
        {files?.map((file, index) => {
          const handleEditFile = (e) => {
            e.stopPropagation();

            setModalPayload({ fileId: file.id, folderId: folderId });
            openModal(modalConstants.UPDATE_FILE_TITLE);
          };
          const handleDeleteFile = (e) => {
            e.stopPropagation();
            deleteFile(folderId, file.id);
          };

          const navigateToPlaygroundPage = () => {
            // console.log({ fileId: file.id }, { folderId: folderId });
            navigate(`/playground/${folderId}/${file.id}`);
          };

          return (
            <div
              className="card"
              key={index}
              onClick={navigateToPlaygroundPage}
            >
              <img src="logo.png" />
              <div className="title-container">
                <span>{file.title}</span>
                <span>Language: {file.language}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-icons" onClick={handleDeleteFile}>
                  delete
                </span>
                <span className="material-icons" onClick={handleEditFile}>
                  edit
                </span>
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
  const modalFeatures = useContext(ModalContext);
  // console.log(folders);

  const handleOpenCreateFolderModal = () => {
    modalFeatures.openModal(modalConstants.CREATE_FOLDER);
  };

  return (
    <div className="right-container">
      <div className="header">
        <h1 className="title">
          <span>My</span> Playground
        </h1>
        <button className="add-folder" onClick={handleOpenCreateFolderModal}>
          <span className="material-icons">add</span>
          <span>New Folder</span>
        </button>
      </div>
      {folders?.map((folder, index) => {
        return (
          <Folder
            key={folder.id}
            folderTitle={folder?.title}
            files={folder?.files}
            folderId={folder.id}
          />
        );
      })}
    </div>
  );
};

export default RightComponent;
