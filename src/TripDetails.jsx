import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import flagsData from "./flags.json";

const TripDetails = () => {
  const { id } = useParams();
  const { data: trip } = useFetch("http://localhost:8000/trips/" + id);
  const [visibleEvents, setVisibleEvents] = useState({});
  const navigate = useNavigate();

  const handleDelete = () => {
    const userConfirmed = window.confirm("Are you sure you want to delete?");
    if (userConfirmed) {
      fetch("http://localhost:8000/trips/" + trip.id, {
        method: "DELETE",
      }).then(() => {
        navigate("/");
      });
    }
  };

  const handleEdit = () => {
    navigate(`/edittrip/${id}`);
  };

  const toggleEventContent = (eventId) => {
    setVisibleEvents((prevState) => ({
      ...prevState,
      [eventId]: !prevState[eventId],
    }));
  };

  const getFlagFile = (country) => {
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
        <article class="leading-loose text-left">
          <div class="flex justify-between items-center">
            <div class="m-[20px]">
              <h2 class="text-lg text-blue-500 mb-2.5 font-semibold">
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
                class="w-[30%] h-auto ml-[20px] border border-black border-opacity-50"
                src={flagFile}
                alt={trip.country}
              />
            )}
          </div>
          {trip.events.map((event) => (
            <div
              key={event.id}
              class="border-b border-b-gray-200 p-0 rounded-md m-[20px]"
            >
              <button
                onClick={() => toggleEventContent(event.id)}
                class="w-full p-[8px] text-left border-0 bg-transparent cursor-pointer text-base outline-none rounded-md transition-all duration-500 hover:cursor-pointer hover:bg-gray-400 hover:text-white"
              >
                <b>Event:</b> {event.title}
              </button>
              {visibleEvents[event.id] && (
                <div class="pl-[2%] m-[20px]">
                  {event.content.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div class="flex items-center justify-center gap-[20px] m-[15px]">
            <button class={deleteEditButton} onClick={handleDelete}>
              Delete Trip
            </button>
            <button class={deleteEditButton} onClick={handleEdit}>
              Edit Trip
            </button>
          </div>
        </article>
      )}
    </div>
  );
};

export default TripDetails;
