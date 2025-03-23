import { Route, Routes } from "react-router";

import "./App.css";
import BottomNavigation from "./components/core/navigation/BottomNavigation";

import SettingsPage from "./pages/settings";
import HomePage from "./pages/home";

function App() {
  return (
    <div className="App fade-in" data-oid="944:0qc">
      <Routes data-oid="hh_8mot">
        <Route
          path="/"
          element={<HomePage data-oid="cip2mgr" />}
          data-oid="_dgm23n"
        />

        <Route
          path="/settings"
          element={<SettingsPage data-oid="foadsu7" />}
          data-oid="dh71_qb"
        />
      </Routes>
      <BottomNavigation data-oid="04p9-m3" />
    </div>
  );
}

export default App;
