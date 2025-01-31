import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FirestoreTrip } from "./Home";
import ReactCountryFlag from "react-country-flag";
import lookup from "country-code-lookup";
import DateDisplay from "./DateDisplay";
import { cn } from "./lib/utils";

const TripList = ({ trips }: { trips: FirestoreTrip[] }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {trips.map((trip, i) => (
        <motion.div
          className="relative h-48 overflow-clip rounded-xl border border-neutral-200 dark:border-neutral-700/70"
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
              className="absolute left-0 top-0 h-48 w-full bg-neutral-100 bg-cover bg-center text-left shadow-md transition-all duration-300 dark:bg-neutral-800"
            />
          ) : (
            <div className="absolute left-0 top-0 h-48 w-full bg-neutral-50 bg-dotted bg-center text-left shadow-md transition-all duration-300 dark:bg-neutral-900" />
          )}

          <Link
            className={cn(
              "absolute left-0 top-0 flex h-48 w-full items-end overflow-hidden rounded-b-xl p-6 no-underline",
              trip.image !== undefined &&
                "bg-gradient-to-t from-neutral-700 via-transparent to-transparent dark:from-neutral-800",
            )}
            to={`/trip/${trip.id}`}
          >
            <div className="h-fit w-fit">
              <div>
                <p className="absolute -right-12 top-7 flex w-44 rotate-45 transform items-center justify-center gap-2 border bg-white py-1 pl-2 text-center text-sm font-bold text-orange-600 dark:border-neutral-700/70 dark:bg-neutral-800 dark:text-orange-500">
                  {lookup.byCountry(trip.country)?.internet != undefined && (
                    <ReactCountryFlag
                      countryCode={`${
                        lookup.byCountry(trip.country)?.internet
                      }`}
                      aria-label={trip.country}
                    />
                  )}
                  {trip.country}
                </p>
                <hgroup
                  className={cn(
                    "text-black dark:text-white",
                    trip.image && "text-white",
                  )}
                >
                  <h2 className="flex w-80 items-center gap-2 truncate text-lg font-semibold">
                    {trip.title}
                  </h2>
                  <DateDisplay
                    className={``}
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                  />
                </hgroup>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default TripList;
