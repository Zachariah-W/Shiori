import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useFetch from './useFetch';
import flagsData from "./flags.json";

const TripDetails = () => {
  const { id } = useParams();
  const { data: trip } = useFetch('http://localhost:8000/trips/' + id);
  const [visibleEvents, setVisibleEvents] = useState({});
  const navigate = useNavigate();

  const handleDelete = () => {
    const userConfirmed = window.confirm('Are you sure you want to delete?');
    if (userConfirmed) {
      fetch('http://localhost:8000/trips/' + trip.id, {
        method: 'DELETE'
      }).then(() => {
        navigate('/');
      });
    }
  };

  const handleEdit = () => {
    navigate(`/edittrip/${id}`);
  };

  const toggleEventContent = (eventId) => {
    setVisibleEvents(prevState => ({
      ...prevState,
      [eventId]: !prevState[eventId]
    }));
  };

  const getFlagFile = (country) => {
    const flags = flagsData.flags; 
    const flag = flags.find((flag) => flag.country === country);
    return flag ? flag.file : null;
  };

  const flagFile = trip ? getFlagFile(trip.country): null;

  return (
    <div className="trip-details">
      {trip && (
        <article>
          <div className="all-basic-detail-info">
            <div className="text-detail-info">
              <h2>Location: {trip.country}</h2>
              <p><b>Region:</b> {trip.region}</p>
              <p><b>Date:</b> {trip.startDate} ~ {trip.endDate}</p>
              <p><b>Trip Information:</b></p>
            </div>
            {flagFile && <img src={flagFile} alt={trip.country}/>}
          </div>
          {trip.events.map((event) => (
            <div key={event.id} className="single-trip-event-display">
              <button onClick={() => toggleEventContent(event.id)} className="event-button">
                <b>Event:</b> {event.title}
              </button>
              {visibleEvents[event.id] && (
                <div id="event-content-display-tag">
                  {event.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="trip-detail-button">
            <button onClick={handleDelete}>Delete Trip</button>
            <button onClick={handleEdit}>Edit Trip</button>
          </div>
        </article>
      )}
    </div>
  );
};

export default TripDetails;
