import { Link } from "react-router-dom";
import flagsData from "./flags.json";
import { motion } from "framer-motion";
import { Trips } from "./Home";

const TripList = ({ trips, title }: { trips: Trips; title: string }) => {
  const getFlagFile = (country: string) => {
    const flags = flagsData.flags;
    const flag = flags.find((flag) => flag.country === country);
    return flag ? flag.file : null;
  };

  return (
    <div className="trip-list">
      <h1 className="font-semibold text-xl text-black dark:text-white">
        {title}
      </h1>
      {trips.map((trip, i) => {
        const flagFile = getFlagFile(trip.country);
        return (
          <motion.div
            key={i}
            initial={{ y: "50vh" }}
            animate={{ y: 0 }}
            transition={{
              delay: i * 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <div
              className="py-2.5 px-4 my-5 border border-gray-300 text-left dark:bg-gray-800 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 bg-dotted-bg"
              key={trip.id}
            >
              <Link className="no-underline" to={`/trips/${trip.id}`}>
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl text-black dark:text-white font-semibold mb-[8px]">
                      {trip.country}
                    </h2>
                    <p className="text-black dark:text-white">
                      Date: {trip.startDate} ~ {trip.endDate}
                    </p>
                  </div>
                  {flagFile && (
                    <img
                      className="w-[18%] h-auto brightness-100 dark:brightness-90 rounded-lg"
                      src={flagFile}
                      alt={trip.country}
                    />
                  )}
                </div>
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TripList;
