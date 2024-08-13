import { useState } from "react";
import SearchBar from "./SearchBar";
import TripList from "./TripList";
import useFetch from "./useFetch";

const Home = () => {
  const { data: trips } = useFetch("http://localhost:8000/trips");
  const [filteredTrips, setFilteredTrips] = useState([]);

  const handleSearch = (searchTerm) => {
    if (trips) {
      const filtered = trips.filter(trip =>
        trip.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTrips(filtered);
    }
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
      <SearchBar onSearch={handleSearch} /><br />
      {filteredTrips.length > 0 && <TripList trips={filteredTrips} title="Search Results" />}
      <hr />
      {trips && <TripList trips={trips} title="All Trips" />}
      <hr />
      {trips && Object.keys(regions).map(region => {
        const regionTrips = trips.filter(trip => trip.region === region);
        return regionTrips.length > 0 && (
          <TripList key={region} trips={regionTrips} title={regions[region]} />
        );
      })}
    </div>
  );
};

export default Home;