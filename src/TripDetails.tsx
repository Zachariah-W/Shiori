import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import flagsData from "./flags.json";
import individualFetch from "./individaulFetch";

const TripDetails = () => {
  const { id } = useParams();
  const { data: trip, error, loading } = individualFetch(id || "");
  const [visibleEvents, setVisibleEvents] = useState<Record<number, boolean>>(
    {}
  );
  const navigate = useNavigate();

  const getFlagFile = (country: string) => {
    const flags = flagsData.flags;
    const flag = flags.find((flag) => flag.country === country);
    return flag ? flag.file : null;
  };

  const flagFile = trip ? getFlagFile(trip.country) : null;

  const deleteEditButton =
    "bg-blue-500 border-0 text-white px-[8px] py-[4px] rounded-md cursor-pointer";

  return (
    <div>
      {trip && (
        <article className="leading-loose text-left">
          <div className="flex justify-between items-center">
            <div className="m-[20px]">
              <h2 className="text-lg text-blue-500 mb-2.5 font-semibold">
                Location: {trip.country}
              </h2>
              <p>
                <b>Region:</b> {trip.region}
              </p>
              <p>
                <b>Date:</b> {trip.startDate} ~ {trip.endDate}
              </p>
              <p>
                <b>Trip Information:</b>
              </p>
            </div>
            {flagFile && (
              <img
                className="w-[30%] h-auto ml-[20px] border border-black border-opacity-50"
                src={flagFile}
                alt={trip.country}
              />
            )}
          </div>
          {trip.events.map((event) => (
            <div
              key={event.id}
              className="border-b border-b-gray-200 p-0 rounded-md m-[20px]"
            >
              <button
                onClick={() => {
                  setVisibleEvents((prevState) => ({
                    ...prevState,
                    [event.id]: !prevState[event.id],
                  }));
                }}
                className="w-full p-[8px] text-left border-0 bg-transparent cursor-pointer text-base outline-none rounded-md transition-all duration-500 hover:cursor-pointer hover:bg-gray-400 hover:text-white"
              >
                <b>Event:</b> {event.title}
              </button>
              {visibleEvents[event.id] && (
                <div className="pl-[2%] m-[20px]">
                  {event.content.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </div>
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
              Delete Trip
            </button>
            <button
              className={deleteEditButton}
              onClick={() => navigate(`/edittrip/${id}`)}
            >
              Edit Trip
            </button>
          </div>
        </article>
      )}
    </div>
  );
};

export default TripDetails;
