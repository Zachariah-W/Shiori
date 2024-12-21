import { useEffect, useState } from "react";
import { FirestoreTrip } from "./Home";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Data = () => {
  const [dataCollection, setDataCollection] = useState<FirestoreTrip[]>([]);

  const getData = async () => {
    const tripsRef = collection(
      db,
      `users`,
      `${auth.currentUser?.uid}`,
      `trips`,
    );
    const tripsSnap = await getDocs(tripsRef);
    if (!tripsSnap.empty) {
      const tempTripsArray: FirestoreTrip[] = [];
      tripsSnap.forEach((doc) => {
        tempTripsArray.push({ ...doc.data(), id: doc.id } as FirestoreTrip);
      });
      setDataCollection(tempTripsArray);
    }
  };
  useEffect(() => {
    getData();
    console.log(dataCollection);
  }, []);

  return (
    <div className="w-layout flex h-52 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 p-6 dark:border-neutral-700/50 dark:bg-neutral-800/50">
      <h2 className="text-center text-lg font-medium text-neutral-500">
        No Data found
      </h2>
    </div>
  );
};

export default Data;
