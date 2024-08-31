import { useState } from "react";
import SearchBar from "./SearchBar";
import TripList from "./TripList";
import useFetch from "./useFetch";
import { SwitchButton, MaterialUISwitch } from "./SwitchButton";
import { Event } from "./EditTrip";
export type Region =
  | "east-south-asia"
  | "central-southern-asia"
  | "europe-north-america"
  | "latin-caribbean"
  | "north-africa-western-asia"
  | "australia-new-zealand"
  | "sub-saharan-africa";
export type Trip = {
  id: string;
  region: Region;
  country: string;
  startDate: string;
  endDate: string;
  events: Event[];
};
export type Trips = Trip[];

const Home = () => {
  const { data: trips } = useFetch("http://localhost:8000/trips");
  const [filteredTrips, setFilteredTrips] = useState<Trips>([]);
  const [regionFilterActive, setRegionFilterActive] = useState(false);

  const handleRegionsFilter = () => {
    setRegionFilterActive(!regionFilterActive);
  };

  const regions = {
    "east-south-asia": "Eastern and South-Eastern Asia",
    "central-southern-asia": "Central and Southern Asia",
    "europe-north-america": "Europe and Northern America",
    "latin-caribbean": "Latin America and the Caribbean",
    "north-africa-western-asia": "Northern Africa and Western Asia",
    "australia-new-zealand": "Australia and New Zealand",
    "sub-saharan-africa": "Sub-Saharan Africa",
  };

  const regionModeFilters = "flex items-center gap-[10px] text-sm";

  return (
    <div>
      <div className="flex items-center gap-[20px] mt-[-40px] max-w-[600px]">
        <SearchBar
          onSearch={(searchTerm) => {
            if (searchTerm.trim() === "") {
              setFilteredTrips([]);
            } else if (trips) {
              const filtered = trips.filter((trip) =>
                trip.country.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setFilteredTrips(filtered);
            }
          }}
        />
        <p>|</p>
        <div className={regionModeFilters}>
          <SwitchButton onClick={handleRegionsFilter} />
          <p>Regions Filter</p>
        </div>
        <p>|</p>
        <div className={regionModeFilters}>
          <MaterialUISwitch />
          <p>Mode</p>
        </div>
      </div>
      <br />
      <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-[8%] mb-2.5" />
      {filteredTrips.length > 0 && (
        <TripList trips={filteredTrips} title="Search Results" />
      )}
      {filteredTrips.length === 0 && !regionFilterActive && trips && (
        <TripList trips={trips} title="All Trips" />
      )}
      {filteredTrips.length === 0 &&
        regionFilterActive &&
        trips &&
        (Object.keys(regions) as Region[]).map((region) => {
          const regionTrips = trips.filter((trip) => trip.region === region);
          return (
            regionTrips.length > 0 && (
              <TripList
                key={region}
                trips={regionTrips}
                title={regions[region]}
              />
            )
          );
        })}
    </div>
  );
};

export default Home;
