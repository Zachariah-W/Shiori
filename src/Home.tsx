import { useEffect, useState } from "react";
import TripList from "./TripList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { IoMdArrowDropdown } from "react-icons/io";

export type FirestoreTrip = {
  id: string;
  country: string;
  startDate: Timestamp;
  endDate: Timestamp;
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
    countryListSnap.exists() &&
      setCountryList(countryListSnap.data().countryList as string[]);
  };

  const getMainData = async () => {
    const tripsSnap = await getDocs(tripsRef);
    !tripsSnap.empty &&
      (() => {
        const tempTripsArray: FirestoreTrip[] = [];
        tripsSnap.forEach((doc) => {
          tempTripsArray.push({ ...doc.data(), id: doc.id } as FirestoreTrip);
        });
        setDataCollectionHolder(tempTripsArray);
      })();
    setLoading(false);
  };

  useEffect(() => {
    getMainData();
    getSortCountryData();
  }, [loading]);

  return (
    <div>
      <div className="flex items-center gap-4 mt-1 max-w-[600px]">
        <div className="flex items-center gap-5 text-sm text-black dark:text-white">
          <DropdownMenu
            onOpenChange={() => {
              setPrevCountryFilter(countryFilter);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button className="w-40 h-8 font-semibold text-black bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 gap-5">
                Select Country <IoMdArrowDropdown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              onInteractOutside={() => {
                countryFilter.length === 0
                  ? getMainData()
                  : JSON.stringify(prevCountryFilter.sort()) !==
                      JSON.stringify(countryFilter.sort()) && getFilteredData();
              }}
            >
              {countryList.map((country, i) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={i}
                    checked={countryFilter.includes(country)}
                    onSelect={(e) => {
                      e.preventDefault();
                      countryFilter.includes(country)
                        ? (() => {
                            setCountryFilter(
                              countryFilter.filter((c) => c !== country)
                            );
                            console.log(countryFilter);
                          })()
                        : (() => {
                            setCountryFilter([...countryFilter, country]);
                            console.log(countryFilter);
                          })();
                    }}
                  >
                    {country}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-black dark:text-white">|</p>
        <Select>
          <SelectTrigger className="w-36 h-8 text-black bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
            <SelectValue placeholder="Sort Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="pl-4">Time</SelectLabel>
              <SelectItem value="early" className="pl-6">
                Earliet Trips
              </SelectItem>
              <SelectItem value="late" className="pl-6" onClick={() => {}}>
                Latest Trips
              </SelectItem>
              <SelectItem value="future" className="pl-6" onClick={() => {}}>
                Future Trips
              </SelectItem>
              <SelectItem value="past" className="pl-6" onClick={() => {}}>
                Past Trips
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <br />
      {dataCollectionHolder.length > 0 && (
        <TripList trips={dataCollectionHolder} title="Trips" />
      )}
    </div>
  );
};

export default Home;
