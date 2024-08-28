import { useParams, useNavigate } from "react-router-dom";
import useFetch from "./useFetch";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CreateEvent from "./CreateEvent";

const EditTrip = () => {
  const { id } = useParams();
  const {
    data: trip,
    error,
    loading,
  } = useFetch(`http://localhost:8000/trips/${id}`);
  const [tempStartDate, setStartDate] = useState(null);
  const [tempEndDate, setEndDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [region, setRegion] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (trip) {
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setEvents(trip.events);
      setRegion(trip.region);
      setCountryOptions(regions[trip.region] || []);
      setSelectedCountry(trip.country);
    }
  }, [trip]);

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setRegion(region);
    setCountryOptions(regions[region] || []);
    setSelectedCountry("");
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleDateChange = (range) => {
    const [tempStartDate, tempEndDate] = range;
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const handleEventChange = (id, updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
  };

  const addEvent = () => {
    setEvents([...events, { id: events.length + 1, title: "", content: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = `${format(tempStartDate, "MM/dd/yyyy")}`;
    const endDate = `${format(tempEndDate, "MM/dd/yyyy")}`;
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
  };

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

  const allLabels = "text-left block";

  const allSelect =
    "w-[100%] py-[6px] px-[10px] my-[10px] mx-0 border border-solid border-black box-border block";

  return (
    <div class="max-w-[400px] mx-auto my-0 text-center">
      <h2 class="text-[20px] text-blue-500  mb-[30px]">Edit Mode</h2>
      <form onSubmit={handleSubmit}>
        <label class={allLabels}>Trip Region:</label>
        <select
          class={allSelect}
          value={region}
          onChange={handleRegionChange}
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
        <label class={allLabels}>Country:</label>
        <select
          class={allSelect}
          value={selectedCountry}
          onChange={handleCountryChange}
          required
        >
          <option value="">Select a country</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <label class={allLabels}>Trip Date:</label>
        <DatePicker
          selected={tempStartDate}
          startDate={tempStartDate}
          endDate={tempEndDate}
          selectsRange
          onChange={handleDateChange}
          placeholderText="Choose a Date"
          wrapperClassName="w-full my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent"
          className="w-full py-1.5 px-2.5 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent outline-none font-medium leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800"
        />
        <label class={allLabels}>Trip Information:</label>
        <button
          type="button"
          onClick={addEvent}
          class="bg-blue-500 text-white border-none p-[8px] rounded-[8px] cursor-pointer"
        >
          Add Event
        </button>
        {events.map((event) => {
          <CreateEvent
            key={event.id}
            event={event}
            onEventChange={(updatedEvent) =>
              handleEventChange(event.id, updatedEvent)
            }
          />;
        })}
        {events.map((event) => {
          return (
            <div key={event.id}>
              <label class={allLabels}>Event Title</label>
              <input
                type="text"
                class="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none font-medium leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-none"
                value={event.title}
                onChange={(e) =>
                  handleEventChange(event.id, { title: e.target.value })
                }
              />
              <label class={allLabels}>Event Content</label>
              <textarea
                class="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none font-medium leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-y overflow-y-auto"
                value={event.content}
                onChange={(e) =>
                  handleEventChange(event.id, { content: e.target.value })
                }
              />
            </div>
          );
        })}
        <button
          type="submit"
          class="bg-blue-500 text-white border-none p-[8px] rounded-[8px] cursor-pointer"
        >
          Finish Edit
        </button>
      </form>
    </div>
  );
};

export default EditTrip;
