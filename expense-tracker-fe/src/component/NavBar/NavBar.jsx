import { Link } from "react-router-dom";
import "../css/NavBar.css"; 

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/expense">Expense</Link></li>
        <li><Link to="/income">Income</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
