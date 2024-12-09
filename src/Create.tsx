import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auth, db } from "../firebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import CreateEvent from "./CreateEvent";
import { IoAdd } from "react-icons/io5";
import ImageSearch, { UnsplashImage } from "./ImageSearch";

export type NewEvent = {
  title: string;
  content: string;
};

const Create = () => {
  const [events, setEvents] = useState<Map<string, NewEvent>>();
  const [trip, setTrip] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
    country: string;
    image: UnsplashImage | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
    country: "",
    image: undefined,
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log(events);
  });

  const handleEventChange = (id: string, updatedEvent: NewEvent) => {
    setEvents((prevEvents) => {
      if (!prevEvents) return undefined;
      const updatedEvents = new Map(prevEvents);
      const existingEvent = updatedEvents.get(id);
      updatedEvents.set(id, { ...existingEvent, ...updatedEvent });
      return updatedEvents;
    });
  };

  const allLabels = "text-left block font-semibold";

  return (
    <div className="max-w-[400px] mx-auto my-0 text-center text-black dark:text-white">
      <h2 className="text-[20px] mb-[30px] font-bold">Add a New Trip</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const currentUser = auth.currentUser;
          if (currentUser === null) {
            return;
          }
          const batch = writeBatch(db);
          const createTripRef = doc(
            collection(db, "users", currentUser.uid, "trips")
          );
          batch.set(createTripRef, {
            country: trip.country,
            startDate: trip.startDate,
            endDate: trip.endDate,
            image: trip.image,
          });

          if (events !== undefined) {
            Array.from(events.values()).forEach((event) => {
              const createEventsRef = doc(
                collection(
                  db,
                  "users",
                  currentUser.uid,
                  "trips",
                  createTripRef.id,
                  "events"
                )
              );
              batch.set(createEventsRef, event);
            });
          }

          const countryListRef = doc(db, "users", currentUser.uid);
          const countryListSnap = await getDoc(countryListRef);

          if (countryListSnap.exists()) {
            batch.update(countryListRef, {
              countryList: arrayUnion(trip.country),
            });
          }

          await batch.commit();
          navigate("/Home");
        }}
      >
        <label className={allLabels}>Country:</label>
        <input
          className="title-input"
          type="text"
          placeholder="Please type in the official country name..."
          onChange={(e) => {
            setTrip({
              ...trip,
              country: e.target.value,
            });
          }}
        />
        <label className={allLabels}>Trip Date:</label>
        <DatePicker
          selected={trip.startDate}
          startDate={trip.startDate}
          endDate={trip.endDate}
          selectsRange
          onChange={(range: [Date | null, Date | null]) => {
            const [start, end] = range;
            setTrip({
              ...trip,
              startDate: start || undefined,
              endDate: end || undefined,
            });
          }}
          placeholderText="Choose a Date"
          wrapperClassName="w-full"
          className="title-input"
        />
        <p className={allLabels}>Search Image:</p>
        <ImageSearch
          unsplashPhoto={trip.image}
          onPhotoChange={(e) => {
            setTrip({ ...trip, image: e });
          }}
        />
        <div className="flex items-center justify-between">
          <label className={allLabels}>Trip Description:</label>
          <button
            type="button"
            onClick={() => {
              setEvents((prevEvents) => {
                const newEvent = new Map(prevEvents);
                const newId = `new${newEvent.size + 1}`;
                newEvent.set(newId, {
                  title: "",
                  content: "",
                });
                return newEvent;
              });
            }}
            className="text-gray-700 border py-1.5 border-gray-600 h-5 w-5 rounded-full cursor-pointer flex items-center justify-center hover:scale-105 hover:rotate-180 duration-150 dark:border-white"
          >
            <IoAdd className="h-4 w-4 dark:text-white" />
          </button>
        </div>
        {events &&
          Array.from(events.entries()).map(([key, event]) => (
            <div className="border border-b-white pb-3" key={key}>
              <CreateEvent
                event={event}
                onEventChange={(newEvent) => handleEventChange(key, newEvent)}
              />
              <button
                type="button"
                className="border border-red-800 rounded-sm cursor-pointer w-32 h-6 text-red-800 hover:bg-red-800 hover:text-white"
                onClick={() => {
                  const userConfirmed = window.confirm(
                    "Your data will not be actually deleted until you click on finish editing"
                  );
                  if (!userConfirmed) return;
                  setEvents((prevEvents) => {
                    if (!prevEvents) return undefined;
                    const updatedEvents = new Map(prevEvents);
                    updatedEvents.delete(key);
                    return updatedEvents;
                  });
                }}
              >
                Delete Event
              </button>
            </div>
          ))}
        <hr className="h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent ml-[5%] mr-[5%] mb-[20px] mt-[20px] border-none" />
        <button
          type="submit"
          className="bg-gray-200 text-black hover:bg-gray-300 border-none py-[5px] px-[8px] rounded-[8px] cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default Create;
