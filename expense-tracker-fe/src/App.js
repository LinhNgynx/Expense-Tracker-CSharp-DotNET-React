import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Income from "./component/Income/Income";
import Expense from "./component/Expense/Expense";
import NavBar from "./component/NavBar/NavBar";
import Home from "./component/Home/Home";
function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/income" element={<Income />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
