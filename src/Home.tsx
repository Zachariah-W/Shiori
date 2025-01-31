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
import SearchBar from "./SearchBar";

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
  const [dataCollection, setDataCollection] = useState<FirestoreTrip[]>([]);
  const [filteredData, setFilteredData] = useState<FirestoreTrip[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [countryList, setCountryList] = useState<string[]>([]);
  const [prevCountryFilter, setPrevCountryFilter] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const tripsRef = collection(db, `users`, `${auth.currentUser?.uid}`, `trips`);

  const getFilteredData = async () => {
    const q = query(tripsRef, where("country", "in", countryFilter));
    const querySnapShot = await getDocs(q);
    const tempArray: FirestoreTrip[] = [];
    querySnapShot.forEach((doc) => {
      tempArray.push({ ...doc.data(), id: doc.id } as FirestoreTrip);
    });
    setFilteredData(tempArray);
  };

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
      setDataCollection(tempTripsArray);
      setFilteredData(tempTripsArray);
    }
    setLoading(false);
  };

  const getSearchData = async (e: string) => {
    if (e.trim() === "") {
      setFilteredData(dataCollection);
      return;
    }
    const tripSnap = await getDocs(tripsRef);
    if (tripSnap.empty) {
      return;
    }
    const tempTripsArray: FirestoreTrip[] = [];
    tripSnap.forEach((doc) => {
      if (doc.data().title.toUpperCase().includes(e.toUpperCase())) {
        tempTripsArray.push({ ...doc.data(), id: doc.id } as FirestoreTrip);
      }
    });
    setFilteredData(tempTripsArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getMainData();
      await getSortCountryData();
    };
    fetchData();
  }, [loading]);

  return (
    <section className="w-layout">
      <div className="flex items-center justify-between py-6">
        <SearchBar onSearch={(e) => getSearchData(e)} />
        <div className="flex items-center gap-0.5">
          <DropdownMenu
            onOpenChange={() => {
              setPrevCountryFilter(countryFilter);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant={"dropdown"} size={"sm"}>
                <span>Select Country</span>
                <FiChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              align="end"
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
                      } else {
                        setCountryFilter([...countryFilter, country]);
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
              const sortedData = [...filteredData];
              if (value === "earliest") {
                sortedData.sort(
                  (a, b) => a.startDate.toMillis() - b.startDate.toMillis(),
                );
              } else if (value === "latest") {
                sortedData.sort(
                  (a, b) => b.startDate.toMillis() - a.startDate.toMillis(),
                );
              }
              setFilteredData(sortedData);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort Time" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="earliest">Sort By Earliest</SelectItem>
                <SelectItem value="latest">Sort By Latest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredData.length > 0 ? (
        <TripList trips={filteredData} />
      ) : (
        <div className="flex h-52 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 p-6 dark:border-neutral-700/50 dark:bg-neutral-800/50">
          <h2 className="text-center text-lg font-medium text-neutral-500">
            No trips found
          </h2>
        </div>
      )}
    </section>
  );
};

export default Home;
