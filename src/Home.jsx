import { useState } from "react";
import SearchBar from "./SearchBar";
import TripList from "./TripList";
import useFetch from "./useFetch";
import SwitchButton from "./SwitchButton";

const Home = () => {
  const { data: trips } = useFetch("http://localhost:8000/trips");
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [regionFilterActive, setRegionFilterActive] = useState(false);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      setFilteredTrips([]);
    } else if (trips) {
      const filtered = trips.filter(trip =>
        trip.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTrips(filtered);
    }
  };

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
    "oceania": "Oceania",
    "sub-saharan-africa": "Sub-Saharan Africa"
  };

  return (
    <div className="home">
      <div className="home-filters-search">
        <SearchBar onSearch={handleSearch} />
        <p>|</p>
        <div className="home-region-filter">
          <SwitchButton onClick={handleRegionsFilter}/>
          <p>Regions Filter</p>
        </div>
        <p>|</p>
        <div className="home-date-filter">
          <SwitchButton />
          <p>Calendar View</p>
        </div>
      </div>
      <br /><hr />
      {filteredTrips.length > 0 && <TripList trips={filteredTrips} title="Search Results" />}
      {filteredTrips.length === 0 && !regionFilterActive && trips && <TripList trips={trips} title="All Trips" />}
      {filteredTrips.length === 0 && regionFilterActive && trips && (
        Object.keys(regions).map(region => {
          const regionTrips = trips.filter(trip => trip.region === region);
          return regionTrips.length > 0 && (
            <TripList key={region} trips={regionTrips} title={regions[region]} />
          );
        })
      )}
    </div>
  );
};

export default Home;
