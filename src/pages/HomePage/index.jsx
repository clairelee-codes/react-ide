import "./index.scss";
import RightComponent from "./RightComponent";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="left-container">
        <div className="items-container">
          <img src="logo.png" />
          <h1>PIO IDE</h1>
          <h2>Code.Compile.Debug</h2>
          <button>
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
