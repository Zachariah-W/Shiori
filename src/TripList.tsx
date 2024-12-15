import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FirestoreTrip } from "./Home";
import { format } from "date-fns";
import ReactCountryFlag from "react-country-flag";
import lookup from "country-code-lookup";

const TripList = ({
  trips,
  title,
}: {
  trips: FirestoreTrip[];
  title: string;
}) => {
  return (
    <div className="w-layout">
      <h1 className="text-xl font-semibold text-black dark:text-white">
        {title}
      </h1>
      {trips.map((trip, i) => {
        return (
          <motion.div
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <div className="my-2 rounded-xl border-2 border-neutral-200 bg-dotted px-4 py-2 text-left transition-all duration-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
              <Link className="no-underline" to={`/trip/${trip.id}`}>
                <div className="flex h-16 items-center justify-between">
                  <div className="ml-1">
                    <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold text-black dark:text-white">
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
                  {trip.image && (
                    <div
                      className="h-full w-1/2 rounded-md bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${trip.image.urls.regular})`,
                      }}
                    ></div>
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
