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
      <h2 class="font-semibold text-xl">{title}</h2>
      {trips.map((trip) => {
        const flagFile = getFlagFile(trip.country);
        return (
          <div
            class="py-2.5 px-4 my-5 border-b border-grey-100 text-left hover:shadow-sm"
            key={trip.id}
          >
            <Link class="no-underline" to={`/trips/${trip.id}`}>
              <div class="flex justify-between">
                <div>
                  <h2 class="text-xl text-blue-400 font-semibold mb-[8px]">
                    {trip.country}
                  </h2>
                  <p>
                    Date: {trip.startDate} ~ {trip.endDate}
                  </p>
                </div>
                {flagFile && (
                  <img
                    class="w-[18%] h-auto ml-[20px] border border-grey-500"
                    src={flagFile}
                    alt={trip.country}
                  />
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default TripList;
