import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaygroundPage from "./pages/PlaygroundPage";
import { PlaygroundProvider } from "./Providers/PlaygroundProvider";
import { ModalProvider } from "./Providers/ModalProvider";
import Modal from "./Providers/Modals/Modal";

function App() {
  return (
    <PlaygroundProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/playground/:folderId/:fileId"
              element={<PlaygroundPage />}
            />
          </Routes>
        </BrowserRouter>
        <Modal />
      </ModalProvider>
    </PlaygroundProvider>
  );
}

export default App;
