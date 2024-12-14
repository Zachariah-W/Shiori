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
    <div className="trip-list">
      <h1 className="font-semibold text-xl text-black dark:text-white">
        {title}
      </h1>
      {trips.map((trip, i) => {
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
            <div className=" py-2 my-2 px-2 border border-gray-300 text-left dark:bg-gray-800 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 bg-dotted-bg">
              <Link className="no-underline" to={`/trip/${trip.id}`}>
                <div className="flex justify-between items-center h-16">
                  <div className="ml-1">
                    <h2 className="mt-1 text-xl text-black dark:text-white font-semibold flex items-center gap-2">
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
                          "MM/dd/yyyy"
                        )}{" "}
                      ~{" "}
                      {trip.endDate &&
                        format(
                          trip.endDate instanceof Date
                            ? trip.endDate
                            : trip.endDate.toDate(),
                          "MM/dd/yyyy"
                        )}
                    </p>
                  </div>
                  {trip.image && (
                    <div
                      className="bg-cover bg-center w-1/2 h-full rounded-md"
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
