import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Data = () => {
  const [countryVistNum, setCountryVistNum] = useState<Map<string, number>>(
    new Map(),
  );
  const [topVists, setTopVisits] = useState<[string, number][]>([]);

  const getData = async () => {
    const tripsRef = collection(
      db,
      `users`,
      `${auth.currentUser?.uid}`,
      `trips`,
    );
    const tripsSnap = await getDocs(tripsRef);
    const tempVistNumMap: Map<string, number> = new Map();
    if (!tripsSnap.empty) {
      tripsSnap.forEach((trip) => {
        tempVistNumMap.set(
          trip.data().country,
          (tempVistNumMap.get(trip.data().country) || 0) + 1,
        );
      });
      setCountryVistNum(tempVistNumMap);
    }
    const tempTopVistMap = Array.from(countryVistNum.entries()).sort(
      (a, b) => b[1] - a[1],
    );
    setTopVisits(tempTopVistMap);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-layout flex h-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 p-6 dark:border-neutral-700/50 dark:bg-neutral-800/50">
      {}
      <div className="w-layout flex h-80 flex-row items-center justify-between border border-red-500 px-8">
        <div className="h-72 w-72 rounded-xl border-2 border-neutral-700 p-2">
          <h2 className="pb-4 pt-3 text-center text-2xl font-bold">
            Top Countries
          </h2>
          <ol className="text-lg *:font-semibold">
            {topVists.slice(0, 3).map((data) => (
              <li>
                {data[0]}: {data[1]} times
              </li>
            ))}
          </ol>
        </div>
        <div className="h-72 w-72 rounded-xl border-2 border-neutral-700 p-2">
          <h2 className="pb-4 pt-3 text-center text-2xl font-bold">
            Advanced Stats
          </h2>
          <ul className="text-lg *:font-semibold">
            <li># of Countries Traveled: {countryVistNum.size}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Data;
