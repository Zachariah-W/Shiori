import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CreateEvent, { Event } from "./CreateEvent";
import { Region, Trips } from "./Home";

const Create = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tempStartDate, setStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setEndDate] = useState<Date | undefined>(undefined);
  const [region, setRegion] = useState<Region>();
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

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

  const handleEventChange = (id: number, updatedEvent: Event) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
  };

  const allLabels = "text-left block font-semibold";

  const allSelect =
    "w-[100%] py-[6px] px-[10px] my-[10px] mx-0 border border-solid border-grey-500 box-border block text-black font-semibold";

  return (
    <div className="max-w-[400px] mx-auto my-0 text-center text-black dark:text-white">
      <h2 className="text-[20px] mb-[30px] font-bold">Add a New Trip</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Events:", events);
          const startDate = `${format(tempStartDate as Date, "MM/dd/yyyy")}`;
          const endDate = `${format(tempEndDate as Date, "MM/dd/yyyy")}`;
          const trip = {
            region,
            country: selectedCountry,
            startDate,
            endDate,
            events,
          };
          fetch("http://localhost:8000/trips", {
            method: "POST",
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
          className="w-full py-1.5 px-2.5 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent font-semibold outline-none leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800"
        />
        <label className={allLabels}>Trip Content:</label>
        <button
          type="button"
          onClick={() =>
            setEvents([
              ...events,
              { id: events.length + 1, title: "", content: "" },
            ])
          }
          className="bg-black text-white border-none px-[8px] py-[5px] rounded-[8px] cursor-pointer dark:bg-white dark:text-black"
        >
          Add Event
        </button>
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
          className="bg-black text-white border-none py-[5px] px-[8px] rounded-[8px] cursor-pointer dark:bg-white dark:text-black"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default Create;
