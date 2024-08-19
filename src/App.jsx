import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import Create from "./Create";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripDetails from "./TripDetails";
import EditTrip from "./EditTrip";

function App() {
  return (
    <Router>
      <div class="App">
        <Navbar />
        <div class="max-w-[600px] mx-auto my-10 p-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/edittrip/:id" element={<EditTrip />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
