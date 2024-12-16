import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FirestoreTrip } from "./Home";
import { format } from "date-fns";
import ReactCountryFlag from "react-country-flag";
import lookup from "country-code-lookup";

const TripList = ({ trips }: { trips: FirestoreTrip[] }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {trips.map((trip, i) => (
        <motion.div
         className="relative"
          key={i}
          initial={{ y: 100, opacity: 0, rotateZ: 8 }}
          animate={{ y: 0, opacity: 1, rotateZ: 0 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <img
            src={trip.image.urls.regular}
            className="absolute rounded-xl bg-cover bg-center h-48 border border-b-2 border-neutral-200 p-1 text-left transition-all duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 top-0 left-0 w-full"
            // className="rounded-xl border border-b-2 border-neutral-200 px-6 py-4 text-left transition-all duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          />
          <Link className="absolute no-underline bg-gradient-to-tr from-neutral-800 via-transparent to-transparent h-48 w-full top-0 left-0 rounded-b-xl flex items-end p-6" to={`/trip/${trip.id}`}>
            <div className="w-fit h-fit">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-black dark:text-white">
                    {trip.title}
                    <p>|</p>
                  {trip.country}
                  {lookup.byCountry(trip.country)?.internet !=
                    undefined && (
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
                </h2>

                <p className="text-black dark:text-white">
                  Date:{" "}
                  {trip.startDate &&
                    format(
                      trip.startDate instanceof Date
                        ? trip.startDate
                        : trip.startDate.toDate(),
                      "MM/dd/yyyy",
                    )}{" "}
                  ~{" "}
                  {trip.endDate &&
                    format(
                      trip.endDate instanceof Date
                        ? trip.endDate
                        : trip.endDate.toDate(),
                      "MM/dd/yyyy",
                    )}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default TripList;
