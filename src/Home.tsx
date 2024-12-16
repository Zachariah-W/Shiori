import { useEffect, useState } from "react";
import TripList from "./TripList";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnsplashImage } from "./ImageSearch";
import { FiChevronDown } from "react-icons/fi";

export type FirestoreTrip = {
  id: string;
  country: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  image: UnsplashImage;
  events: Event[];
};

export type Event = {
  id: string;
  title: string;
  content: string;
};

const Home = () => {
  const [dataCollectionHolder, setDataCollectionHolder] = useState<
    FirestoreTrip[]
  >([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [countryList, setCountryList] = useState<string[]>([]);
  const [prevCountryFilter, setPrevCountryFilter] = useState<string[]>([]);
  const tripsRef = collection(db, `users`, `${auth.currentUser?.uid}`, `trips`);

  const getFilteredData = async () => {
    const q = query(tripsRef, where("country", "in", countryFilter));
    const querySnapShot = await getDocs(q);
    const tempArray: FirestoreTrip[] = [];
    querySnapShot.forEach((doc) => {
      tempArray.push({ ...doc.data(), id: doc.id } as FirestoreTrip);
    });
    setDataCollectionHolder(tempArray);
  };

  const [loading, setLoading] = useState(true);

  const getSortCountryData = async () => {
    const countryListRef = doc(db, `users`, `${auth.currentUser?.uid}`);
    const countryListSnap = await getDoc(countryListRef);
    if (countryListSnap.exists()) {
      setCountryList(countryListSnap.data().countryList as string[]);
    }
  };

  const getMainData = async () => {
    const tripsSnap = await getDocs(tripsRef);
    if (!tripsSnap.empty) {
      const tempTripsArray: FirestoreTrip[] = [];
      tripsSnap.forEach((doc) => {
        tempTripsArray.push({ ...doc.data(), id: doc.id } as FirestoreTrip);
      });
      setDataCollectionHolder(tempTripsArray);
    }
    setLoading(false);
  };

  useEffect(() => {
    getMainData();
    getSortCountryData();
  }, [loading]);

  return (
    <section className="w-layout">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 mt-6 text-xl font-semibold text-black dark:text-white">
          Trips
        </h1>
        <div className="flex items-center gap-2">
          <DropdownMenu
            onOpenChange={() => {
              setPrevCountryFilter(countryFilter);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant={"dropdown"} size={"sm"}>
                <span>Select Country</span>
                <FiChevronDown className="opacity-50"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              onInteractOutside={() => {
                if (countryFilter.length === 0) {
                  getMainData();
                } else if (
                  JSON.stringify(prevCountryFilter.sort()) !==
                  JSON.stringify(countryFilter.sort())
                ) {
                  getFilteredData();
                }
              }}
            >
              {countryList.map((country, i) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={i}
                    checked={countryFilter.includes(country)}
                    onSelect={(e) => {
                      e.preventDefault();
                      if (countryFilter.includes(country)) {
                        setCountryFilter(
                          countryFilter.filter((c) => c !== country),
                        );
                        console.log(countryFilter);
                      } else {
                        setCountryFilter([...countryFilter, country]);
                        console.log(countryFilter);
                      }
                    }}
                  >
                    {country}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Select
            onValueChange={(value) => {
              if (value == "earliest") {
                const sortEarliest = [...dataCollectionHolder].sort(
                  (a, b) => a.startDate.toMillis() - b.startDate.toMillis(),
                );
                setDataCollectionHolder(sortEarliest);
              } else if (value == "latest") {
                const sortLatest = [...dataCollectionHolder].sort(
                  (a, b) => b.startDate.toMillis() - a.startDate.toMillis(),
                );
                setDataCollectionHolder(sortLatest);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="earliest">Sort By Earliest</SelectItem>
                <SelectItem value="latest">Sort By Latest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {dataCollectionHolder.length > 0 ? (
        <TripList trips={dataCollectionHolder} />
      ) : (
        <div className="flex h-52 items-center justify-center rounded-xl  bg-neutral-100 p-6 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-center text-lg font-medium text-neutral-500">
            No trips found
          </h2>
        </div>
      )}
    </section>
  );
};

export default Home;
