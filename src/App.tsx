import {
  Route,
  Routes,
} from "react-router";

import "./App.css";
import BottomNavigation from "./components/core/navigation/BottomNavigation";

import SettingsPage from "./pages/settings";
import HomePage from "./pages/home";

function App() {
  return (
    <div className="App fade-in">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
    <BottomNavigation />
  </div>
  );
}

export default App;