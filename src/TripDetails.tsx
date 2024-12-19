import { useParams, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
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
  QuerySnapshot,
  writeBatch,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const batch = writeBatch(db);
  const [trip, setTrip] = useState<FirestoreTrip>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<Event>({
    id: "",
    title: "",
    content: "",
  });

  const getTripData = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tripDocRef = doc(db, `users`, `${user.uid}`, `trips`, `${id}`);
        const tripDocSnap = await getDoc(tripDocRef);
        setTrip({
          ...tripDocSnap.data(),
          id: tripDocSnap.id,
        } as FirestoreTrip);
        const tripEventsDetailRef = collection(
          db,
          `users`,
          `${user.uid}`,
          `trips`,
          `${id}`,
          `events`,
        );
        const tripEventsSnap = (await getDocs(
          tripEventsDetailRef,
        )) as QuerySnapshot<Event>;
        if (tripEventsSnap.empty) return;
        const tempEventArray: Event[] = [];
        tripEventsSnap.forEach((doc) => {
          tempEventArray.push({ ...doc.data() } as Event);
        });
        setEvents(tempEventArray);

        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (id === undefined) navigate("/Home");
    getTripData();
  }, [loading]);

  return (
    <div className="min-w-fit">
      {trip && (
        <article className="text-left leading-loose text-black dark:text-white">
          {trip.image ? (
            <img
              src={trip.image.urls.regular}
              alt={trip.image.alt_description}
              className="mb-2 h-48 w-full rounded-md object-cover"
            />
          ) : (
            <div className="mb-2 h-48 w-full rounded-md bg-dotted" />
          )}
          <div className="flex items-center justify-between">
            <div className="m-2">
              <h2 className="mb-2.5 text-lg font-semibold">
                Title: {trip.title}
              </h2>
              <h2 className="mb-2.5 text-lg font-semibold">
                Location: {trip.country}
              </h2>
              <p className="text-lg font-semibold">
                Date:{" "}
                {trip.startDate &&
                  format(
                    trip.startDate instanceof Date
                      ? trip.startDate
                      : trip.startDate.toDate(),
                    "MM/dd/yyyy",
                  )}{" "}
                ~{" "}
                {trip.endDate &&
                  format(
                    trip.endDate instanceof Date
                      ? trip.endDate
                      : trip.endDate.toDate(),
                    "MM/dd/yyyy",
                  )}
              </p>
            </div>
          </div>
          {events.length !== 0 && (
            <>
              <p className="ml-2 text-lg font-bold text-black dark:text-white">
                Trip Information:
              </p>
              <div className="grid h-auto w-screen grid-cols-3 gap-5 pl-2 pr-5">
                {events.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 100, opacity: 0, rotateZ: 8 }}
                    animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    whileTap={{ scale: 0.95, transition: { duration: 0.05 } }}
                  >
                    <button
                      className="ml-2 mt-2 w-full rounded-sm text-black dark:text-white"
                      onClick={() => {
                        setDialogData({
                          id: event.id,
                          title: event.title,
                          content: event.content,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <div className="bg-dotted-bg dark:border-netural-700 border-netural-200 flex h-20 w-full flex-col gap-1 rounded-md border bg-neutral-100 bg-dotted p-2 pl-3 text-left hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <p className="text-lg text-black dark:text-white">
                          {event.title}
                        </p>
                        <p className="truncate text-sm">{event.content}</p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          <div className="m-7 flex items-center justify-center gap-5">
            <button
              className="cursor-pointer items-center rounded-full border border-red-600 p-2 text-red-600 transition-all duration-500 ease-in-out hover:bg-red-600 hover:text-white dark:border-red-800 dark:text-red-800 dark:hover:bg-red-800 dark:hover:text-neutral-300"
              onClick={async () => {
                const userConfirmed = window.confirm(
                  "You can't restore the data you delete, are you sure you want to delete?",
                );
                if (!userConfirmed) {
                  return;
                }
                const eventsDeletionPromises = events.map((document) => {
                  const tempEventsDocHolder = doc(
                    db,
                    `users`,
                    `${auth.currentUser?.uid}`,
                    `trips`,
                    `${id}`,
                    `events`,
                    `${document.id}`,
                  );
                  batch.delete(tempEventsDocHolder);
                });
                const tempTripDocHolder = doc(
                  db,
                  `users`,
                  `${auth.currentUser?.uid}`,
                  `trips`,
                  `${id}`,
                );
                batch.delete(tempTripDocHolder);
                await Promise.all(eventsDeletionPromises);
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
                const countryListRef = doc(
                  db,
                  `users`,
                  `${auth.currentUser?.uid}`,
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
              <FiTrash2 />
            </button>
            <button
              className="cursor-pointer items-center rounded-full border border-black p-2 font-semibold transition-all duration-500 hover:bg-neutral-800 hover:text-neutral-200 dark:border-neutral-300 dark:hover:bg-neutral-300 dark:hover:text-black"
              onClick={() => navigate(`/edittrip/${id}`)}
            >
              <FiEdit />
            </button>
          </div>
        </article>
      )}
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogContent className="max-h-screen-md max-w-screen-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogData.title}</DialogTitle>
            <DialogDescription className="max-h-screen-md max-w-screen-md">
              <div className="max-h-96 overflow-y-auto break-words py-2 pr-8">
                {dialogData.content}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetails;
