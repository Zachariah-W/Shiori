import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Timestamp } from "firebase/firestore";
import GoogleSvg from "./GoogleSvg";

const LandingPage = () => {
  const navigate = useNavigate();
  if (auth.currentUser) navigate("/Home");
  const provider = new GoogleAuthProvider();
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
          `trips`,
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
            `events`,
          );
          await addDoc(eventRef, {
            title: "Event Title",
            content: "Event Content",
          });
        } else {
          console.log("No such trip found!");
        }
      }

      navigate("/Home");
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <object data="./src/images/shiori-logo.svg" className="mb-4 w-44" />
      <div className="mb-8 text-3xl font-bold">Welcome to Shiori</div>
      <button
        className="flex items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-5 py-2 font-semibold text-gray-800 shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        onClick={handleSignIn}
      >
        <GoogleSvg />
        Sign in with Google
      </button>
    </div>
  );
};

export default LandingPage;
