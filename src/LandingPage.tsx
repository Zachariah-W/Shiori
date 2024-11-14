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
      }

      navigate("/Home");
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-3xl font-bold mb-8">
        {auth.currentUser?.displayName
          ? `Welcome, ${auth.currentUser.displayName}!`
          : "Welcome to Shiori"}
      </div>
      <button
        className="px-5 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 flex items-center justify-center gap-1 rounded-full border border-gray-200 dark:border-gray-700"
        onClick={handleSignIn}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ display: "block" }}
          className={`mr-1 size-4`}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        {auth.currentUser ? "Continue" : "Sign in with Google"}
      </button>
    </div>
  );
};

export default LandingPage;
