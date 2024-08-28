import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CreateEvent from "./CreateEvent";

const Create = () => {
  const [events, setEvents] = useState([]);
  const [tempStartDate, setStartDate] = useState(null);
  const [tempEndDate, setEndDate] = useState(null);
  const [region, setRegion] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

  const handleDateChange = (range) => {
    const [tempStartDate, tempEndDate] = range;
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
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

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setRegion(region);
    setCountryOptions(regions[region] || []);
    setSelectedCountry("");
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const addEvent = () => {
    setEvents([...events, { id: events.length + 1, title: "", content: "" }]);
  };

  const handleEventChange = (id, updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Events:", events);
    const startDate = `${format(tempStartDate, "MM/dd/yyyy")}`;
    const endDate = ` ${format(tempEndDate, "MM/dd/yyyy")}`;
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
  };

  const allLabels = "text-left block";

  const allSelect =
    "w-[100%] py-[6px] px-[10px] my-[10px] mx-0 border border-solid border-grey-500 box-border block";

  return (
    <div class="max-w-[400px] mx-auto my-0 text-center">
      <h2 class="text-[20px] text-blue-500  mb-[30px]">Add a New Trip</h2>
      <form onSubmit={handleSubmit}>
        <label class={allLabels}>Trip Region:</label>
        <select class={allSelect} onChange={handleRegionChange} required>
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
        <label class={allLabels}>Trip Content:</label>
        <button
          type="button"
          onClick={addEvent}
          class="bg-blue-500 text-white border-none px-[8px] py-[5px] rounded-[8px] cursor-pointer"
        >
          Add Event
        </button>
        {events.map((event) => (
          <CreateEvent
            key={event.id}
            event={event}
            onEventChange={(updatedEvent) =>
              handleEventChange(event.id, updatedEvent)
            }
          />
        ))}
        <hr class="h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent ml-[5%] mr-[5%] mb-[20px] mt-[20px] border-none" />
        <button
          type="submit"
          class="bg-blue-500 text-white border-none py-[5px] px-[8px] rounded-[8px] cursor-pointer"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default Create;
