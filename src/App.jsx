import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaygroundPage from "./pages/PlaygroundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/playground" element={<PlaygroundPage />} />
    </Routes>
  );
}

export default App;
