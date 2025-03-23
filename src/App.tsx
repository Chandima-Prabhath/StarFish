import { Route, Routes } from "react-router";

import "./App.css";
import BottomNavigation from "./components/core/navigation/BottomNavigation";

import SettingsPage from "./pages/settings";
import HomePage from "./pages/home";

function App() {
  return (
    <div className="App fade-in" data-oid="hmf9ipg">
      <Routes data-oid="k53cj8x">
        <Route
          path="/"
          element={<HomePage data-oid="p7jxl4e" />}
          data-oid="_l97plp"
        />

        <Route
          path="/settings"
          element={<SettingsPage data-oid="jw6s9o9" />}
          data-oid="ex.edtm"
        />
      </Routes>
      <BottomNavigation data-oid="lgyq8wb" />
    </div>
  );
}

export default App;
