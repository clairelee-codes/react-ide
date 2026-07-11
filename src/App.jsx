import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaygroundPage from "./pages/PlaygroundPage";
import { PlaygroundProvider } from "./Providers/PlaygroundProvider";

function App() {
  return (
    <PlaygroundProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </BrowserRouter>
    </PlaygroundProvider>
  );
}

export default App;
