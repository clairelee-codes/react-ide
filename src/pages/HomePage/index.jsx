import "./index.scss";
import logo from "../../assets/react.svg";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="left-container">
        <div className="items-container">
          <img src={logo} />
          <h1> IDE</h1>
          <h2>Code.Compile.Debug</h2>
          <button>
            <span className="material-icons">add</span>
            <span>Create Playground</span>
          </button>
        </div>
      </div>
      <div className="right-container">
        <h2>Right</h2>
      </div>
    </div>
  );
};

export default HomePage;
