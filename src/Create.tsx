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
import EditTrip, { EditEvent } from "./EditTrip";
import { IoAdd } from "react-icons/io5";

const Create = () => {
  const [events, setEvents] = useState<Map<string, NewEvent>>();
  const [trip, setTrip] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
    country: string;
  }>({
    startDate: undefined,
    endDate: undefined,
    country: "",
  });
  const navigate = useNavigate();

  const handleEventChange = (id: string, updatedEvent: EditEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
  };

  const allLabels = "text-left block font-semibold";

  return (
    <div className="my-0 text-black dark:text-white">
      <h2 className="text-lg font-medium">Add a New Trip</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const currentUser = auth.currentUser;
          if (!currentUser?.uid) {
            alert("You must be logged in to add a trip.");
            return;
          }

          const batch = writeBatch(db);

          const createTripRef = doc(
            collection(db, "users", currentUser.uid, "trips")
          );

          batch.set(createTripRef, {
            country: filter.country,
            startDate: filter.startDate,
            endDate: filter.endDate,
          });

          if (events.length > 0) {
            events.forEach(async (event) => {
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
              batch.set(createEventsRef, {
                title: event.title,
                content: event.content,
              });
            });
          }

          const countryListRef = doc(db, "users", currentUser.uid);
          const countryListSnap = await getDoc(countryListRef);

          if (countryListSnap.exists()) {
            batch.update(countryListRef, {
              countryList: arrayUnion(filter.country),
            });
          }

            await batch.commit();
            navigate("/home");
          }
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

        {events.length > 0 &&
          events.map((event, i) => (
            <CreateEvent
              key={i}
              event={event}
              onEventChange={(updatedEvent) =>
                handleEventChange(event.id, updatedEvent)
              }
            />
          ))}
        <hr className="h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent ml-[5%] mr-[5%] mb-[20px] mt-[20px] border-none" />
        <Button type="submit">Add Trip</Button>
      </form>
    </div>
  );
};

export default Create;
