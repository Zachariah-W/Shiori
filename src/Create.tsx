import { useState } from "react";
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
import { EditEvent } from "./EditTrip";
import { IoAdd } from "react-icons/io5";

const Create = () => {
  const [events, setEvents] = useState<EditEvent[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const handleEventChange = (id: string, updatedEvent: EditEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
  };

  const allLabels = "text-left block font-semibold";

  return (
    <div className="max-w-[400px] mx-auto my-0 text-center text-black dark:text-white">
      <h2 className="text-[20px] mb-[30px] font-bold">Add a New Trip</h2>
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
            country: country,
            startDate: startDate,
            endDate: endDate,
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

          countryListSnap.exists() &&
            batch.update(countryListRef, {
              countryList: arrayUnion(country),
            });
          await batch.commit();
          navigate("/Home");
        }}
      >
        <label className={allLabels}>Country:</label>
        <input
          className="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none leading-6 transition-all duration-200 cursor-pointer font-semibold hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-none"
          type="text"
          placeholder="Type your event title..."
          onChange={(e) => {
            setCountry(e.target.value);
          }}
        />
        <label className={allLabels}>Trip Date:</label>
        <DatePicker
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          onChange={(range: [Date | null, Date | null]) => {
            const [start, end] = range;
            setStartDate(start || undefined);
            setEndDate(end || undefined);
          }}
          placeholderText="Choose a Date"
          wrapperClassName="w-full my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent"
          className="w-full py-1.5 px-2.5 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent font-semibold outline-none leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800"
        />
        <div className="flex items-center justify-between">
          <label className={allLabels}>Trip Description:</label>
          <button
            type="button"
            onClick={() =>
              setEvents([
                ...events,
                {
                  id: `${events.length + 1}`,
                  title: "",
                  content: "",
                  new: true,
                  update: false,
                },
              ])
            }
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
