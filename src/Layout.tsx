import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./Home";
import Create from "./Create";
import { Route, Routes, useNavigate } from "react-router-dom";
import TripDetails from "./TripDetails";
import EditTrip from "./EditTrip";
import LandingPage from "./LandingPage";
import Navbar from "./Navbar";

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        return;
      } else {
        setIsLoggedIn(false);
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="bg-test-bg m-0 min-h-screen bg-white p-0 duration-300 dark:bg-gray-900">
      {isLoggedIn && <Navbar />}
      <div className="mx-auto max-w-[600px]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {isLoggedIn && (
            <>
              <Route path="/Home" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/edittrip/:id" element={<EditTrip />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default Layout;
