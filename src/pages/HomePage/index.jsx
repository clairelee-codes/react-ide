import { useContext } from "react";
import "./index.scss";
import RightComponent from "./RightComponent";
import { modalConstants, ModalContext } from "../../Providers/ModalProvider";

const HomePage = () => {
  const modalFeatures = useContext(ModalContext);

  const handleOpenCreatePlaygroundModal = () => {
    modalFeatures.openModal(modalConstants.CREATE_PLAYGROUND);
  };

  return (
    <div className="home-container">
      <div className="left-container">
        <div className="items-container">
          <img src="logo.png" />
          <h1>PIO IDE</h1>
          <h2>Code.Compile.Debug</h2>
          <button onClick={handleOpenCreatePlaygroundModal}>
            <span className="material-icons">add</span>
            <span>Create Playground</span>
          </button>
        </div>
      </div>
      <RightComponent />
    </div>
  );
};

export default HomePage;
