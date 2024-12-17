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
import { IoAdd } from "react-icons/io5";
import ImageSearch, { UnsplashImage } from "./ImageSearch";

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
          placeholderText="Choose a Date"
          wrapperClassName="w-full"
        />
        <label className={allLabels}>Search New Image:</label>
        <ImageSearch
          unsplashPhoto={unsplashPhoto}
          onPhotoChange={(e) => {
            setUnsplashPhoto(e);
          }}
        />
        <div className="flex items-center justify-between">
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
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-600 py-1.5 text-gray-700 duration-150 hover:rotate-180 hover:scale-105 dark:border-white"
          >
            <IoAdd className="h-4 w-4 dark:text-white" />
          </button>
        </div>
        {events &&
          Array.from(events.entries()).map(([key, event]) => {
            if (event.status === "deleted") return null;
            return (
              <div className="pb-3" key={key}>
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
                  className="h-6 w-32 cursor-pointer rounded-sm border border-red-800 text-red-800 hover:bg-red-800 hover:text-white"
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
                  Delete Event
                </button>
              </div>
            );
          })}
        <br />
        <br />
        <button
          type="submit"
          className="cursor-pointer rounded-[8px] border-none bg-black p-[8px] text-white dark:bg-white dark:text-black"
        >
          Finish Edit
        </button>
      </form>
    </div>
  );
};

export default EditTrip;
