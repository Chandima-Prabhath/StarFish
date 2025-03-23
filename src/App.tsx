import { Route, Routes } from "react-router";

import "./App.css";
import BottomNavigation from "./components/core/navigation/BottomNavigation";

import ProfilePage from "./pages/profile";
import HomePage from "./pages/home";
import EventsPage from "./pages/events";
import MapPage from "./pages/map";

function App() {
  return (
    <div className="App fade-in">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
}

export default App;
