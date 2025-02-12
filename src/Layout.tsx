import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./Home";
import Create from "./Create";
import { Route, Routes, useNavigate } from "react-router-dom";
import TripDetails from "./TripDetails";
import EditTrip from "./EditTrip";
import LandingPage from "./LandingPage";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Data from "./Data";

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
    <div className="m-0 flex min-h-screen flex-col items-center bg-white p-0 duration-300 dark:bg-neutral-900">
      <div className="min-h-screen w-full">
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {isLoggedIn && (
            <>
              <Route path="/Home" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/edittrip/:id" element={<EditTrip />} />
              <Route path="/data" element={<Data />} />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
