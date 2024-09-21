import { useParams, useNavigate } from "react-router-dom";
import flagsData from "./flags.json";
import individualFetch from "./individaulFetch";
import { IoTrash } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { motion } from "framer-motion";

const TripDetails = () => {
  const { id } = useParams();
  const { data: trip } = individualFetch(id || "");
  const navigate = useNavigate();

  const getFlagFile = (country: string) => {
    const flags = flagsData.flags;
    const flag = flags.find((flag) => flag.country === country);
    return flag ? flag.file : null;
  };

  const flagFile = trip ? getFlagFile(trip.country) : null;

  const deleteEditButton =
    "bg-transparent border border-gray-500 rounded-full p-2 cursor-pointer hover:scale-125 transition duration-300";

  return (
    <div>
      <h2 className="font-bold text-xl text-black dark:text-white text-center">
        Trip Details
      </h2>
      {trip && (
        <article className="leading-loose text-left text-black dark:text-white">
          <div className="flex justify-between items-center">
            <div className="m-[20px]">
              <h2 className="text-lg mb-2.5 font-semibold">
                Location: {trip.country}
              </h2>
              <p>Region: {trip.region}</p>
              <p>
                Date: {trip.startDate} ~ {trip.endDate}
              </p>
            </div>
            {flagFile && (
              <img
                className="w-[30%] h-auto border border-gray-500 border-opacity-50 brightness-100 dark:brightness-90 dark:border-none rounded-md"
                src={flagFile}
                alt={trip.country}
              />
            )}
          </div>
          <p className="ml-5 font-bold text-lg text-black dark:text-white">
            Trip Information:
          </p>
          {trip.events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ y: "50vh" }}
              animate={{ y: 0 }}
              transition={{
                delay: i * 0.2,
                type: "spring",
                stiffness: 180,
                damping: 22,
              }}
            >
              <div
                key={event.id}
                className="ml-6 mt-2 rounded-sm text-black dark:text-white"
              >
                <div className="w-full p-2 text-left rounded-md dark:bg-gray-800 bg-gray-100 bg-dotted-bg border border-gray-200 dark:border-gray-700">
                  <p className="text-black dark:text-white">
                    Event: {event.title}
                  </p>
                  <p className="font-normal ml-1">{event.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="flex items-center justify-center gap-[20px] m-[15px]">
            <button
              className={deleteEditButton}
              onClick={() => {
                const userConfirmed = window.confirm(
                  "Are you sure you want to delete?"
                );
                if (userConfirmed) {
                  fetch("http://localhost:8000/trips/" + trip.id, {
                    method: "DELETE",
                  }).then(() => {
                    navigate("/");
                  });
                }
              }}
            >
              <IoTrash />
            </button>
            <button
              className={deleteEditButton}
              onClick={() => navigate(`/edittrip/${id}`)}
            >
              <MdModeEdit />
            </button>
          </div>
        </article>
      )}
    </div>
  );
};

export default TripDetails;
