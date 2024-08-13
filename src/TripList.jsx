import { Link } from "react-router-dom";
import flagsData from "./flags.json";

const TripList = (props) => {
  const { trips, title } = props;

  const getFlagFile = (country) => {
    const flags = flagsData.flags; 
    const flag = flags.find((flag) => flag.country === country);
    return flag ? flag.file : null;
  };

  return (
    <div className="trip-list">
      <h2>{title}</h2>
      {trips.map((trip) => {
        
        const flagFile = getFlagFile(trip.country);
        return (
          <div className="trip-preview" key={trip.id}>
            <Link to={`/trips/${trip.id}`}>
              <div className="trip-all-basic-info">
                <div className="basic-trip-info">
                  <h2>{trip.country}</h2>
                  <p>Date: {trip.startDate} ~ {trip.endDate}</p>
                </div>
                {flagFile && <img src={flagFile} alt={trip.country}/>}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default TripList;
