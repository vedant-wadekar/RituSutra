import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a href="#home" className="logo">
          <span className="logo-icon">🌿</span>
          <span>RutuSutra</span>
        </a>

        {/* Navigation */}
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#seasons">Seasons</a>
          <a href="#diet">Diet</a>
          <a href="#lifestyle">Lifestyle</a>
          <a href="#about">About</a>
        </div>

        {/* Mobile Menu */}
        <button className="menu-btn">
          ☰
        </button>

      </div>
    </nav>
  );
}

export default Navbar;