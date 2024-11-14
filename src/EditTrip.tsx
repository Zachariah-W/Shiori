import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CreateEvent from "./CreateEvent";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { FirestoreTrip } from "./Home";
import { onAuthStateChanged } from "firebase/auth";

export type EditEvent = {
  id: string;
  update: boolean;
  title: string;
  content: string;
  new: boolean;
};

const EditTrip = () => {
  const { id } = useParams();
  const [tempStartDate, setStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setEndDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<EditEvent[]>([]);
  const [trip, setTrip] = useState<FirestoreTrip>();
  const navigate = useNavigate();

  const getInfo = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tripRef = doc(db, `users`, `${user.uid}`, `trips`, `${id}`);
        const tripSnap = await getDoc(tripRef);
        if (tripSnap.exists()) {
          setTrip({ ...tripSnap.data(), id: tripSnap.id } as FirestoreTrip);
          const formattedTripStartDate = tripSnap.data().startDate.toDate();
          const formattedTripEndDate = tripSnap.data().endDate.toDate();
          setStartDate(formattedTripStartDate);
          setEndDate(formattedTripEndDate);
        }
        const eventsRef = collection(
          db,
          `users`,
          `${user.uid}`,
          `trips`,
          `${id}`,
          `events`
        );
        const eventsSnap = await getDocs(eventsRef);
        const tempEventsHolder: EditEvent[] = [];
        eventsSnap.forEach((doc) => {
          tempEventsHolder.push({
            ...doc.data(),
            id: doc.id,
            update: false,
            new: false,
          } as EditEvent);
        });
        setEvents(tempEventsHolder);
      }
    });
  };

  useEffect(() => {
    if (id === undefined) navigate("/Home");
    getInfo();
  }, []);

  const allLabels = "text-left block dark:text-white font-semibold";

  if (!trip) return <div></div>;

  return (
    <div className="max-w-[400px] mx-auto my-0 text-center">
      <pre>{JSON.stringify(events)}</pre>
      <h2 className="text-[20px] font-bold text-black dark:text-white  mb-[30px]">
        Edit Mode
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const currentUser = auth.currentUser;
          if (!currentUser?.uid) {
            alert("You must be logged in to add a trip.");
            return;
          }
          const batch = writeBatch(db);
          const tripDocRef = doc(
            db,
            `users`,
            `${currentUser.uid}`,
            `trips`,
            `${id}`
          );
          batch.update(tripDocRef, {
            country: trip.country,
            startDate: tempStartDate,
            endDate: tempEndDate,
          });
          events.forEach((newDoc) => {
            if (newDoc.new == true) {
              const newEventRef = doc(
                collection(
                  db,
                  `users`,
                  `${currentUser.uid}`,
                  `trips`,
                  `${id}`,
                  `events`
                )
              );
              batch.set(newEventRef, {
                title: newDoc.title,
                content: newDoc.content,
              });
            } else if (newDoc.update == true) {
              const updateEventRef = doc(
                db,
                `users`,
                `${currentUser.uid}`,
                `trips`,
                `${id}`,
                `events`,
                `${newDoc.id}`
              );
              batch.update(updateEventRef, {
                title: newDoc.title,
                content: newDoc.content,
              });
            }
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
          value={trip.country}
          required
        />
        <label className={allLabels}>Trip Date:</label>
        <DatePicker
          selected={tempStartDate}
          startDate={tempStartDate}
          endDate={tempEndDate}
          selectsRange
          onChange={(range: [Date | null, Date | null]) => {
            const [start, end] = range;
            setStartDate(start || undefined);
            setEndDate(end || undefined);
          }}
          placeholderText="Choose a Date"
          wrapperClassName="w-full my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent"
          className="w-full py-1.5 px-2.5 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent outline-none font-semibold leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800"
        />
        <label className={allLabels}>Trip Information:</label>
        <button
          type="button"
          onClick={() =>
            setEvents([
              ...events,
              {
                id: `${events.length + 1}`,
                title: "",
                content: "",
                update: false,
                new: true,
              },
            ])
          }
          className="text-white border-none p-[8px] rounded-[8px] cursor-pointer bg-black dark:bg-white dark:text-black"
        >
          Add Event
        </button>
        {events.length > 0 &&
          events.map((event, i) => (
            <CreateEvent
              key={i}
              event={event}
              onEventChange={(updatedEvent) => {
                const updatedEvents = events.map((e) =>
                  e.id === event.id
                    ? { ...e, ...updatedEvent, update: true }
                    : e
                );
                setEvents(updatedEvents);
              }}
            />
          ))}

        <br />
        <br />
        <button
          type="submit"
          className="text-white border-none p-[8px] rounded-[8px] cursor-pointer bg-black dark:bg-white dark:text-black"
        >
          Finish Edit
        </button>
      </form>
    </div>
  );
};

export default EditTrip;
