import { useParams, useNavigate } from "react-router-dom";
import useFetch from "./useFetch";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import CreateEvent from "./CreateEvent";

const EditTrip = () => {
  const { id } = useParams();
  const { data: trip, error, loading } = useFetch(`http://localhost:8000/trips/${id}`);   
  const [tempStartDate, setStartDate] = useState(null);
  const [tempEndDate, setEndDate] = useState(null);
  const [events, setEvents] = useState([])
  const [region, setRegion] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if(trip){
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setEvents(trip.events);
      setRegion(trip.region);
      setCountryOptions(regions[trip.region] || []);
      setSelectedCountry(trip.country);
    }
  }, [trip])
  
  const handleRegionChange = (event) => {
    const region = event.target.value;
    setRegion(region);
    setCountryOptions(regions[region] || []);
    setSelectedCountry('');
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleDateChange = (range) => {
    const [tempStartDate, tempEndDate] = range;
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  }

  const handleEventChange = (id, updatedEvent) => {
    const updatedEvents = events.map((event) => 
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
  };

  const addEvent = () => {
    setEvents([...events, { id: events.length + 1, title: "", content: "" }]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = `${format(tempStartDate, 'MM/dd/yyyy')}`;
    const endDate = `${format(tempEndDate, 'MM/dd/yyyy')}`;
    const trip = { region, country: selectedCountry, startDate, endDate, events };
    fetch(`http://localhost:8000/trips/${id}`, {
      method:'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip)
    }).then(() => {
      navigate('/');
    });
  };

  const regions = {
    "east-south-asia": ["Brunei", "Cambodia", "China", "Indonesia", "Japan", "South Korea", "Laos", "Malaysia", "Mongolia", "Myanmar", "Philippines", "Singapore", "Taiwan", "Thailand", "Vietnam"],
    "central-southern-asia": ["Afghanistan", "Bangladesh", "Bhutan", "India", "Kazakhstan", "Kyrgyzstan", "Maldives", "Nepal", "Pakistan", "Sri Lanka", "Tajikistan", "Turkmenistan", "Uzbekistan"],
    "europe-north-america": ["Austria", "Belgium", "Canada", "Denmark", "Finland", "France", "Germany", "Greece", "Ireland", "Italy", "Netherlands", "Norway", "Portugal", "Spain", "Sweden", "Switzerland", "United Kingdom", "United States"],
    "latin-caribbean": ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Trinidad and Tobago", "Uruguay", "Venezuela"],
    "north-africa-western-asia": ["Algeria", "Bahrain", "Egypt", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon", "Libya", "Morocco", "Oman", "Qatar", "Saudi Arabia", "Syria", "Tunisia", "Turkey", "United Arab Emirates", "Yemen"],
    "australia-new-zealand": ["Australia", "New Zealand"],
    "oceania": ["Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"],
    "sub-saharan-africa": ["Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Kenya", "Lesotho", "Liberia", "Madagascar", "Malawi", "Mali", "Mauritania", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "Sudan", "Tanzania", "Togo", "Uganda", "Zambia", "Zimbabwe"]
  };

  return ( 
    <div className="create-edit-form">
      <h2>Edit Mode</h2>
      <form onSubmit={handleSubmit}>
      <label>Trip Region:</label>
      <select value={region} onChange={handleRegionChange} required>
          <option value="">Select a region</option>
          <option value="east-south-asia">Eastern and South-Eastern Asia</option>
          <option value="central-southern-asia">Central and Southern Asia</option>
          <option value="europe-north-america">Europe and Northern America</option>
          <option value="latin-caribbean">Latin America and the Caribbean</option>
          <option value="north-africa-western-asia">Northern Africa and Western Asia</option>
          <option value="australia-new-zealand">Australia and New Zealand</option>
          <option value="oceania">Oceania</option>
          <option value="sub-saharan-africa">Sub-Saharan Africa</option>
      </select>
      <label>Country:</label>
      <select value={selectedCountry} onChange={handleCountryChange} required>
        <option value="">Select a country</option>
        {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
      </select>
      <label>Trip Date:</label>
      <DatePicker
        selected={tempStartDate}
        startDate={tempStartDate}
        endDate={tempEndDate}
        selectsRange
        onChange={handleDateChange}
        wrapperClassName="datepicker"
        placeholderText="Choose a Date"
      />
      <label>Trip Information:</label>
      <button type="button" onClick={addEvent}>Add Event</button>
      {events.map((event) => {
        <CreateEvent
          key={event.id}
          event={event}
          onEventChange={(updatedEvent) => handleEventChange(event.id, updatedEvent)}
        />
      })
      }
      {events.map((event) => {
        return(
          <div className="trip-event-edit" key={event.id}>
            <label>Event Title</label>
            <input 
              type="text" 
              value={event.title} 
              onChange={(e) => handleEventChange(event.id, { title: e.target.value })}
            />
            <label>Event Content</label>
            <textarea 
              value={event.content}
              onChange={(e) => handleEventChange(event.id, { content: e.target.value })}
            />
          </div>
        )
      })}
      <button type="submit">Finish Edit</button>
      </form>
    </div>
   );
}
 
export default EditTrip;