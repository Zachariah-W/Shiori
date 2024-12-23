import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FirestoreTrip } from "./Home";
import ReactCountryFlag from "react-country-flag";
import lookup from "country-code-lookup";
import DateDisplay from "./DateDisplay";

const TripList = ({ trips }: { trips: FirestoreTrip[] }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {trips.map((trip, i) => (
        <motion.div
          className="relative h-48"
          key={i}
          initial={{ y: 100, opacity: 0, rotateZ: 8 }}
          animate={{ y: 0, opacity: 1, rotateZ: 0 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          whileTap={{ scale: 0.95, transition: { duration: 0.05 } }}
        >
          {trip.image !== undefined ? (
            <img
              src={trip.image.urls.regular}
              className="absolute left-0 top-0 h-48 w-full rounded-xl border border-b-2 border-neutral-300 bg-neutral-100 bg-cover bg-center text-left shadow-md transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800"
            />
          ) : (
            <div className="absolute left-0 top-0 h-48 w-full rounded-xl border border-b-2 border-neutral-300 bg-neutral-100 bg-dotted bg-center text-left shadow-md transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800" />
          )}

          <Link
            className="absolute left-0 top-0 flex h-48 w-full items-end overflow-hidden rounded-b-xl bg-gradient-to-t from-neutral-500 via-transparent to-transparent p-6 no-underline dark:from-neutral-800"
            to={`/trip/${trip.id}`}
          >
            <div className="h-fit w-fit">
              <div>
                <p className="absolute -right-11 top-7 w-44 rotate-45 transform bg-orange-500 bg-dotted py-1 pl-2 text-center text-sm font-bold text-neutral-200 shadow-lg">
                  {trip.country}
                </p>
                <p className="flex w-80 items-center gap-2 truncate text-lg font-semibold text-white">
                  {trip.title}
                  {lookup.byCountry(trip.country)?.internet != undefined && (
                    <ReactCountryFlag
                      countryCode={`${
                        lookup.byCountry(trip.country)?.internet
                      }`}
                      style={{
                        fontSize: "1.3em",
                        paddingTop: "2px",
                      }}
                      aria-label={trip.country}
                    />
                  )}
                </p>
                <DateDisplay
                  className={`text-white`}
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default TripList;
