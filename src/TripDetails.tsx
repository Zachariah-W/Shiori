import { useParams, useNavigate } from "react-router-dom";
import { IoTrash } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Event, FirestoreTrip } from "./Home";
import { auth, db } from "../firebaseConfig";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import EventDialog from "./EventModal";

const TripDetails = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const batch = writeBatch(db);
  const [trip, setTrip] = useState<FirestoreTrip>();
  const [tripEvents, setTripEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [eventExist, setEventExist] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<Event>({
    id: "",
    title: "",
    content: "",
  });

  const getTripData = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tripDocRef = doc(db, `users`, `${user.uid}`, `trips`, `${id}`);
        const tripEventsDetailRef = collection(
          db,
          `users`,
          `${user.uid}`,
          `trips`,
          `${id}`,
          `events`
        );
        const tripDocSnap = await getDoc(tripDocRef);
        setTrip({
          ...tripDocSnap.data(),
          id: tripDocSnap.id,
        } as FirestoreTrip);
        const tempArray: Event[] = [];
        const tripEventsSnap = await getDocs(tripEventsDetailRef);
        if (tripEventsSnap.size == 0) {
          console.log("no event");
          setEventExist(false);
          return;
        }
        tripEventsSnap.forEach((doc) => {
          tempArray.push({ ...doc.data() } as Event);
        });
        setTripEvents(tempArray);
        setLoading(false);
      } else {
        console.log("error");
      }
    });
  };

  useEffect(() => {
    id === undefined && navigate("/Home");
    getTripData();
  }, [loading]);

  const deleteEditButton =
    "bg-transparent border border-gray-500 rounded-full p-2 cursor-pointer hover:scale-125 transition duration-300";

  return (
    <div className="min-w-fit">
      <h2 className="font-bold text-xl text-black dark:text-white text-center">
        Trip Details
      </h2>
      {trip && (
        <article className="leading-loose text-left text-black dark:text-white">
          <div className="flex justify-between items-center">
            <div className="m-2">
              <h2 className="text-lg mb-2.5 font-semibold">
                Location: {trip.country}
              </h2>
              <p>
                Date:{" "}
                {trip.startDate &&
                  format(
                    trip.startDate instanceof Date
                      ? trip.startDate
                      : trip.startDate.toDate(),
                    "MM/dd/yyyy"
                  )}{" "}
                ~{" "}
                {trip.endDate &&
                  format(
                    trip.endDate instanceof Date
                      ? trip.endDate
                      : trip.endDate.toDate(),
                    "MM/dd/yyyy"
                  )}
              </p>
            </div>
          </div>
          {eventExist && (
            <>
              <p className="ml-2 font-bold text-lg text-black dark:text-white">
                Trip Information:
              </p>
              {tripEvents.map((event, i) => (
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
                  <button
                    className="ml-2 mt-2 rounded-sm text-black dark:text-white w-11/12"
                    onClick={() => {
                      setDialogData({
                        id: event.id,
                        title: event.title,
                        content: event.content,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <div className="w-full p-2 text-left rounded-md dark:bg-gray-800 bg-gray-100 bg-dotted-bg border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                      <p className="text-black dark:text-white">
                        Event: {event.title}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </>
          )}
          <div className="flex items-center justify-center gap-[20px] m-[15px]">
            <button
              className={deleteEditButton}
              onClick={async () => {
                const userConfirmed = window.confirm(
                  "You can't restore the data you delete, are you sure you want to delete?"
                );
                if (!userConfirmed) {
                  return;
                }
                const eventsDeletionPromises = tripEvents.map((document) => {
                  const tempEventsDocHolder = doc(
                    db,
                    `users`,
                    `${auth.currentUser?.uid}`,
                    `trips`,
                    `${id}`,
                    `events`,
                    `${document.id}`
                  );
                  batch.delete(tempEventsDocHolder);
                });
                const tempTripDocHolder = doc(
                  db,
                  `users`,
                  `${auth.currentUser?.uid}`,
                  `trips`,
                  `${id}`
                );
                batch.delete(tempTripDocHolder);
                await Promise.all(eventsDeletionPromises);
                const existingCountries = collection(
                  db,
                  `users`,
                  `${auth.currentUser?.uid}`,
                  `trips`
                );
                const existingCountriesSnap = await getDocs(existingCountries);
                const tempArray: string[] = [];
                existingCountriesSnap.forEach((doc) => {
                  tempArray.push(doc.data().country);
                });
                const countryListRef = doc(
                  db,
                  `users`,
                  `${auth.currentUser?.uid}`
                );
                const countryListSnap = await getDoc(countryListRef);
                if (
                  countryListSnap.exists() &&
                  tempArray.length > 0 &&
                  tempArray.includes(trip.country)
                ) {
                  let countryNum = 0;
                  tempArray.forEach((country) => {
                    if (trip.country == country) {
                      countryNum++;
                    }
                  });
                  if (countryNum == 1) {
                    batch.update(countryListRef, {
                      countryList: arrayRemove(`${trip.country}`),
                    });
                  }
                }
                await batch.commit();
                navigate("/Home");
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
      <EventDialog
        open={openDialog}
        eventContent={dialogData}
        onOpenChange={() => {
          setOpenDialog(!openDialog);
        }}
      />
    </div>
  );
};

export default TripDetails;
