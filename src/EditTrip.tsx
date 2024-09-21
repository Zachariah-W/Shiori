import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import CreateEvent from "./CreateEvent";
import { Region, Trip } from "./Home";
import individualFetch from "./individaulFetch";

export type Event = {
  id: number;
  title: string;
  content: string;
};

const EditTrip = () => {
  const { id } = useParams();
  const { data: trip } = individualFetch(id || "");
  const [tempStartDate, setStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setEndDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>([]);
  const [region, setRegion] = useState<Region>();
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

  const stringToFateConvert = (dateString: string) =>
    parse(dateString, "MM/dd/yyyy", new Date());

  useEffect(() => {
    if (trip) {
      setStartDate(stringToFateConvert(trip.startDate));
      setEndDate(stringToFateConvert(trip.endDate));
      setEvents(trip.events);
      setRegion(trip.region);
      setCountryOptions(regions[trip.region] || []);
      setSelectedCountry(trip.country);
    }
  }, [trip]);

  const regions = {
    "east-south-asia": [
      "China",
      "Japan",
      "South Korea",
      "Thailand",
      "Indonesia",
      "Malaysia",
      "Singapore",
      "Philippines",
      "Vietnam",
      "Cambodia",
      "Taiwan",
    ],
    "central-southern-asia": [
      "India",
      "Bangladesh",
      "Sri Lanka",
      "Nepal",
      "Pakistan",
      "Kazakhstan",
      "Uzbekistan",
      "Kyrgyzstan",
      "Maldives",
      "Tajikistan",
    ],
    "europe-north-america": [
      "France",
      "Italy",
      "Spain",
      "Germany",
      "United Kingdom",
      "United States",
      "Canada",
      "Netherlands",
      "Switzerland",
      "Austria",
    ],
    "latin-caribbean": [
      "Mexico",
      "Brazil",
      "Argentina",
      "Colombia",
      "Chile",
      "Costa Rica",
      "Cuba",
      "Peru",
    ],
    "north-africa-western-asia": [
      "Turkey",
      "United Arab Emirates",
      "Egypt",
      "Saudi Arabia",
      "Jordan",
      "Israel",
      "Morocco",
    ],
    "australia-new-zealand": ["Australia", "New Zealand"],
    "sub-saharan-africa": [
      "South Africa",
      "Kenya",
      "Nigeria",
      "Ghana",
      "Ethiopia",
    ],
  };

  const allLabels = "text-left block dark:text-white font-semibold";

  const allSelect =
    "w-[100%] py-[6px] px-[10px] my-[10px] mx-0 border border-solid border-black box-border block font-semibold";

  return (
    <div className="max-w-[400px] mx-auto my-0 text-center">
      <h2 className="text-[20px] font-bold text-black dark:text-white  mb-[30px]">
        Edit Mode
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const startDate = `${format(tempStartDate as Date, "MM/dd/yyyy")}`;
          const endDate = `${format(tempEndDate as Date, "MM/dd/yyyy")}`;
          const trip = {
            region,
            country: selectedCountry,
            startDate,
            endDate,
            events,
          };
          fetch(`http://localhost:8000/trips/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip),
          }).then(() => {
            navigate("/");
          });
        }}
      >
        <label className={allLabels}>Trip Region:</label>
        <select
          className={allSelect}
          value={region}
          onChange={(e) => {
            const region = e.target.value as Region;
            setRegion(region);
            setCountryOptions(regions[region] || []);
            setSelectedCountry("");
          }}
          required
        >
          <option value="">Select a region</option>
          <option value="east-south-asia">
            Eastern and South-Eastern Asia
          </option>
          <option value="central-southern-asia">
            Central and Southern Asia
          </option>
          <option value="europe-north-america">
            Europe and Northern America
          </option>
          <option value="latin-caribbean">
            Latin America and the Caribbean
          </option>
          <option value="north-africa-western-asia">
            Northern Africa and Western Asia
          </option>
          <option value="australia-new-zealand">
            Australia and New Zealand
          </option>
          <option value="sub-saharan-africa">Sub-Saharan Africa</option>
        </select>
        <label className={allLabels}>Country:</label>
        <select
          className={allSelect}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          required
        >
          <option value="">Select a country</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
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
              { id: events.length + 1, title: "", content: "" },
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
                const updatedEvents = events.map((ev) =>
                  ev.id === event.id ? { ...ev, ...updatedEvent } : ev
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
