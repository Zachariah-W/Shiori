import { Link } from 'react-router-dom';

const Navbar = () => {
  return ( 
    <nav className="navbar">
      <h1>My Trip Recorder</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/create">New Trip</Link>
      </div>
    </nav>
   );
}
 
export default Navbar;