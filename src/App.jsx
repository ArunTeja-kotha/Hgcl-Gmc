import { Routes, Route } from "react-router-dom";

import Layout from "./layouts/layout/layout";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
