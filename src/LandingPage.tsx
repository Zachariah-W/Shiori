import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Timestamp } from "firebase/firestore";
import GoogleSvg from "./GoogleSvg";
import Logo from "./Logo";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <section className="flex items-center gap-2.5">
        <div className="w-fit h-fit p-2.5 rounded-full text-orange-600 text-6xl">
          <Logo/>
        </div>
        <div className="grid gap-1.5 text-left">
          <h1 className="text-2xl font-bold">Shiori</h1>
          <p className="text-neutral-500">Travel Tales Simplified</p>
        </div>
      </section>
      <button
        className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 font-semibold text-neutral-800 shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        onClick={handleSignIn}
      >
        <GoogleSvg />
        Sign in with Google
      </button>
    </div>
  );
};

export default LandingPage;
