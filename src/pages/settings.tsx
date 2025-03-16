import { useState } from "react";

function SettingsPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="settings-page fade-in" data-oid="jf7dpc8">
      <h1 data-oid="5vt:yxf">Settings</h1>
      <div className="card" data-oid="-6brsii">
        <button
          onClick={() => setCount((count) => count + 1)}
          data-oid="5:00epf"
        >
          count is {count}
        </button>
        <p data-oid="9ehpu9h">
          Edit <code data-oid="wtz8-r3">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs" data-oid="6iqnt__">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default SettingsPage;
