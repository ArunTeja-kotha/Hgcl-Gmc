import { Routes, Route } from "react-router-dom";

import Register from "./pages/register/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
    </Routes>
  );
}

export default App;