import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 to-yellow-600 text-white rounded-xl">
      <div className="text-3xl font-bold mb-6">
        {auth.currentUser?.displayName
          ? `Welcome, ${auth.currentUser.displayName}!`
          : "Welcome to Shiori"}
      </div>
      <button
        className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
        onClick={() => {
          signInWithPopup(auth, provider)
            .then((result) => {
              console.log(result);
              navigate("/Home");
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        {auth.currentUser ? "Continue" : "Sign in with Google"}
      </button>
    </div>
  );
};

export default LandingPage;
