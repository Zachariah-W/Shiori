import Navbar from "./Navbar";
import Home from "./Home";
import Create from "./Create";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripDetails from "./TripDetails";
import EditTrip from "./EditTrip";
import { ThemeProvider } from "./ThemeContext";
import LandingPage from "./LandingPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="bg-white min-h-screen p-0  m-0 dark:bg-gray-900 bg-test-bg duration-300">
          <Navbar />
          <div className="max-w-[600px] mx-auto mt-1  p-5">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/edittrip/:id" element={<EditTrip />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
