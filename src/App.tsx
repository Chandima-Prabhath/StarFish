import { Route, Routes } from "react-router";

import "./App.css";
import BottomNavigation from "./components/core/navigation/BottomNavigation";

import SettingsPage from "./pages/settings";
import HomePage from "./pages/home";

function App() {
  return (
    <div className="App fade-in" data-oid="kghlz.3">
      <Routes data-oid="9dd.apl">
        <Route
          path="/"
          element={<HomePage data-oid="2nhsbym" />}
          data-oid="d16oc6p"
        />

        <Route
          path="/settings"
          element={<SettingsPage data-oid="7e.5hek" />}
          data-oid=":ix-xcj"
        />
      </Routes>
      <BottomNavigation data-oid="qmr4-1e" />
    </div>
  );
}

export default App;
