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
import ImageSearch, { UnsplashImage } from "./ImageSearch";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export type NewEvent = {
  title: string;
  content: string;
};

const Create = () => {
  const [events, setEvents] = useState<Map<string, NewEvent>>();
  const [trip, setTrip] = useState<{
    title: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    country: string;
    image: UnsplashImage | undefined;
  }>({
    title: "",
    startDate: undefined,
    endDate: undefined,
    country: "",
    image: undefined,
  });
  const navigate = useNavigate();

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
    <div className="w-layout text-center text-black dark:text-white">
      <h2 className="mb-[30px] text-[20px] font-bold">Add a New Trip</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const currentUser = auth.currentUser;
          if (currentUser === null) {
            return;
          }
          const batch = writeBatch(db);
          const createTripRef = doc(
            collection(db, "users", currentUser.uid, "trips"),
          );

          const fieldSubmit: {
            title: string;
            country: string;
            startDate: Date | undefined;
            endDate: Date | undefined;
            image?: UnsplashImage;
          } = {
            title: trip.title,
            country: trip.country,
            startDate: trip.startDate,
            endDate: trip.endDate,
          };

          if (trip.image !== undefined) {
            fieldSubmit.image = trip.image;
            const downloadUrl = trip.image.links.download_location;
            (async () => {
              try {
                const response = await fetch(downloadUrl, {
                  method: "POST",
                  headers: {
                    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
                  },
                });
                if (!response.ok) {
                  throw new Error(`${response.status}`);
                }
              } catch (error: unknown) {
                console.error(error);
              }
            })();
          }

          batch.set(createTripRef, fieldSubmit);

          if (events !== undefined) {
            Array.from(events.values()).forEach((event) => {
              const createEventsRef = doc(
                collection(
                  db,
                  "users",
                  currentUser.uid,
                  "trips",
                  createTripRef.id,
                  "events",
                ),
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
        <label className={allLabels}> Trip Title:</label>
        <input
          type="text"
          placeholder="Please type in the trip title ..."
          onChange={(e) => {
            setTrip({
              ...trip,
              title: e.target.value,
            });
          }}
        />
        <label className={allLabels}>Country:</label>
        <input
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
          placeholderText="Choose a Date (If it is a one day trip , choose the exact same date)"
          wrapperClassName="w-full"
          className="title-input"
        />
        <label className={allLabels}>Search Image:</label>
        <ImageSearch
          unsplashPhoto={trip.image}
          onPhotoChange={(e) => {
            setTrip({ ...trip, image: e });
          }}
        />
        <div className="mt-1 flex flex-row items-center justify-between">
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
            className="cursor-pointer rounded-full border border-gray-600 p-1.5 font-bold duration-200 hover:rotate-180 dark:border-neutral-300"
          >
            <FiPlus className="dark:text-white" />
          </button>
        </div>
        {events &&
          Array.from(events.entries()).map(([key, event]) => (
            <div
              className="flex flex-row items-center justify-between gap-1.5"
              key={key}
            >
              <CreateEvent
                event={event}
                onEventChange={(newEvent) => handleEventChange(key, newEvent)}
              />
              <button
                type="button"
                className="cursor-pointer items-center rounded-full border border-red-600 p-1.5 text-red-600 transition-all duration-500 ease-in-out hover:bg-red-600 hover:text-white dark:border-red-800 dark:text-red-800 dark:hover:bg-red-800 dark:hover:text-neutral-300"
                onClick={() => {
                  const userConfirmed = window.confirm(
                    "Your data will not be actually deleted until you click on finish editing",
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
                <FiTrash2 />
              </button>
            </div>
          ))}
        <button
          type="submit"
          className="my-4 transform cursor-pointer rounded-lg bg-gradient-to-r from-neutral-400 to-neutral-500 p-2 text-lg font-semibold text-neutral-50 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-100 dark:bg-gradient-to-r dark:from-neutral-700 dark:to-neutral-800 dark:text-white dark:hover:scale-105 dark:hover:shadow-lg dark:focus:ring-2 dark:focus:ring-neutral-400"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default Create;
