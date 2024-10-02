import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Timestamp } from "firebase/firestore";

const LandingPage = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          countryList: ["Example Trip"],
        });
        const tripsCollectionRef = collection(
          db,
          `users`,
          `${user.uid}`,
          `trips`
        );
        const tripDocRef = await addDoc(tripsCollectionRef, {
          country: "Example Trip",
          startDate: Timestamp.fromDate(new Date("2024-09-1")),
          endDate: Timestamp.fromDate(new Date("2024-09-30")),
        });

        const tripDoc = await getDoc(tripDocRef);
        if (tripDoc.exists()) {
          const eventRef = collection(
            db,
            `users`,
            `${user.uid}`,
            `trips`,
            `${tripDoc.id}`,
            `events`
          );
          await addDoc(eventRef, {
            title: "Event Title",
            content: "Event Content",
          });
        } else {
          console.log("No such trip found!");
        }
      } else {
      }

      navigate("/Home");
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-yellow-400 text-white rounded-xl">
      <div className="text-3xl font-bold mb-6">
        {auth.currentUser?.displayName
          ? `Welcome, ${auth.currentUser.displayName}!`
          : "Welcome to Shiori"}
      </div>
      <button
        className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
        onClick={handleSignIn}
      >
        {auth.currentUser ? "Continue" : "Sign in with Google"}
      </button>
    </div>
  );
};

export default LandingPage;
