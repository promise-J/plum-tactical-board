import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TacticsCanvas } from "./components/canvas/TacticsCanvas";
import Home from "./pages/Home"; // your landing page

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* Main app */}
        <Route path="/app" element={<TacticsCanvas />} />
      </Routes>
    </Router>
  );
}

export default App;