import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CreateEvent from "./CreateEvent";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  QuerySnapshot,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { FirestoreTrip } from "./Home";
import { onAuthStateChanged } from "firebase/auth";
import { FiPlus } from "react-icons/fi";
import ImageSearch, { UnsplashImage } from "./ImageSearch";
import { FiTrash2 } from "react-icons/fi";

type EventDetails = {
  title: string;
  content: string;
};

export type EditEvent = EventDetails & {
  status: "new" | "deleted" | "updated" | "unchanged";
};

const EditTrip = () => {
  const { id } = useParams();
  const [tempStartDate, setStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setEndDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<Map<string, EditEvent>>();
  const [trip, setTrip] = useState<FirestoreTrip>();
  const [ogData, setOgData] = useState<string[]>();
  const [ogCountry, setOgCountry] = useState<string>();
  const navigate = useNavigate();
  const [unsplashPhoto, setUnsplashPhoto] = useState<UnsplashImage | undefined>(
    undefined,
  );

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
          setOgData([
            `${tripSnap.data().title}`,
            `${tripSnap.data().country}`,
            `${formattedTripStartDate}`,
            `${formattedTripEndDate}`,
            `${tripSnap.data().image}`,
          ]);
          setOgCountry(`${tripSnap.data().country}`);
        }
        const eventsRef = collection(
          db,
          `users`,
          `${user.uid}`,
          `trips`,
          `${id}`,
          `events`,
        );
        const eventsSnap = (await getDocs(
          eventsRef,
        )) as QuerySnapshot<EventDetails>;
        const tempEvents = new Map<string, EditEvent>();
        eventsSnap.forEach((doc) => {
          tempEvents.set(doc.id, {
            ...doc.data(),
            status: "unchanged",
          });
        });
        setEvents(tempEvents);
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
    <div className="w-layout text-center text-black dark:text-white">
      <h2 className="mb-[30px] text-[20px] font-bold">Edit Mode</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const currentUser = auth.currentUser;
          if (!currentUser) return;
          const batch = writeBatch(db);
          const currentData = [
            `${trip.title}`,
            `${trip?.country}`,
            `${tempStartDate}`,
            `${tempEndDate}`,
          ];
          if (
            JSON.stringify(ogData) !== JSON.stringify(currentData) ||
            unsplashPhoto !== undefined
          ) {
            console.log("Bruh");
            const tripDocRef = doc(
              db,
              `users`,
              `${currentUser.uid}`,
              `trips`,
              `${id}`,
            );
            const updateData: {
              title: string;
              country: string;
              startDate: Date | undefined;
              endDate: Date | undefined;
              image?: UnsplashImage;
            } = {
              title: trip.title,
              country: trip.country,
              startDate: tempStartDate,
              endDate: tempEndDate,
            };

            if (unsplashPhoto !== undefined) {
              updateData.image = unsplashPhoto;
            }

            batch.update(tripDocRef, updateData);

            const existingCountries = collection(
              db,
              `users`,
              `${auth.currentUser?.uid}`,
              `trips`,
            );
            const existingCountriesSnap = await getDocs(existingCountries);
            const tempArray: string[] = [];
            existingCountriesSnap.forEach((doc) => {
              tempArray.push(doc.data().country);
            });
            const countryListRef = doc(db, "users", currentUser.uid);
            const countryNum = tempArray.filter(
              (country) => country === ogCountry,
            ).length;
            if (countryNum == 1) {
              batch.update(countryListRef, {
                countryList: arrayRemove(`${ogCountry}`),
              });
            }
            if (!tempArray.includes(trip.country)) {
              batch.update(countryListRef, {
                countryList: arrayUnion(trip.country),
              });
            }
          }
          if (events) {
            Array.from(events.entries()).forEach(([key, event]) => {
              if (event.status == "new") {
                const newEventRef = doc(
                  collection(
                    db,
                    `users`,
                    `${currentUser.uid}`,
                    `trips`,
                    `${id}`,
                    `events`,
                  ),
                );
                batch.set(newEventRef, event);
              } else if (event.status == "updated") {
                const updateEventRef = doc(
                  db,
                  `users`,
                  `${currentUser.uid}`,
                  `trips`,
                  `${id}`,
                  `events`,
                  `${key}`,
                );
                batch.update(updateEventRef, event);
              } else if (event.status == "deleted") {
                const deletEventRef = doc(
                  db,
                  `users`,
                  `${auth.currentUser?.uid}`,
                  `trips`,
                  `${id}`,
                  `events`,
                  `${key}`,
                );
                batch.delete(deletEventRef);
              }
            });
          }
          await batch.commit();
          navigate("/Home");
        }}
      >
        <label className={allLabels}>Trip Title:</label>
        <input
          type="text"
          placeholder="Please type in the trip title ..."
          onChange={(e) => {
            setTrip({
              ...trip,
              title: e.target.value,
            });
          }}
          value={trip.title}
          required
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
          placeholderText="Choose a Date (If it is a one day trip , choose the exact same date)"
          wrapperClassName="w-full"
        />
        <label className={allLabels}>Search New Image:</label>
        <ImageSearch
          unsplashPhoto={unsplashPhoto}
          onPhotoChange={(e) => {
            setUnsplashPhoto(e);
          }}
        />
        <div className="mt-1 flex flex-row items-center justify-between">
          <label className={allLabels}>Trip Information:</label>
          <button
            type="button"
            onClick={() =>
              setEvents((prevEvents) => {
                if (!prevEvents) return undefined;
                const newEvent = new Map(prevEvents);
                const newId = `new${newEvent.size + 1}`;
                newEvent.set(newId, {
                  title: "",
                  content: "",
                  status: "new",
                });
                return newEvent;
              })
            }
            className="cursor-pointer rounded-full border border-gray-600 p-1.5 font-bold text-gray-700 duration-200 hover:rotate-180 dark:border-white"
          >
            <FiPlus className="dark:text-white" />
          </button>
        </div>
        {events &&
          Array.from(events.entries()).map(([key, event]) => {
            if (event.status === "deleted") return null;
            return (
              <div
                className="flex flex-row items-center justify-between gap-1.5"
                key={key}
              >
                <CreateEvent
                  event={event}
                  onEventChange={(updatedEvent) => {
                    setEvents((prevEvents) => {
                      if (!prevEvents) return undefined;
                      const updatedEvents = new Map(prevEvents);
                      const existingEvent = updatedEvents.get(key);
                      if (existingEvent && existingEvent.status === "new") {
                        updatedEvents.set(key, {
                          ...existingEvent,
                          ...updatedEvent,
                          status: "new",
                        });
                      } else {
                        updatedEvents.set(key, {
                          ...existingEvent,
                          ...updatedEvent,
                          status: "updated",
                        });
                      }
                      return updatedEvents;
                    });
                  }}
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
                      const targetEvent = events.get(key);
                      if (!targetEvent) return updatedEvents;
                      if (targetEvent.status === "new") {
                        updatedEvents.delete(key);
                      } else {
                        updatedEvents.set(key, {
                          ...targetEvent,
                          status: "deleted",
                        });
                      }
                      return updatedEvents;
                    });
                  }}
                >
                  <FiTrash2 />
                </button>
              </div>
            );
          })}
        <button
          type="submit"
          className="my-4 transform cursor-pointer rounded-lg bg-gradient-to-r from-neutral-400 to-neutral-500 p-2 text-lg font-semibold text-neutral-50 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-100 dark:bg-gradient-to-r dark:from-neutral-700 dark:to-neutral-800 dark:text-white dark:hover:scale-105 dark:hover:shadow-lg dark:focus:ring-2 dark:focus:ring-neutral-400"
        >
          Finish Edit
        </button>
      </form>
    </div>
  );
};

export default EditTrip;
