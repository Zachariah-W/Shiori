const CreateEvent = ({event, onEventChange}) => {
  const handleTitleChange = (e) => {
    const updatedEvent = { ...event, title: e.target.value };
    onEventChange(updatedEvent);
  };

  const handleContentChange = (e) => {
    const updatedEvent = { ...event, content: e.target.value };
    onEventChange(updatedEvent);
  };

  return ( 
    <div className="new-event">
      <label>Event:</label>
      <input 
        type="text" 
        placeholder="Type your event title..." 
        value={event.title} 
        onChange={handleTitleChange} 
      />
      <textarea 
        value={event.content} 
        onChange={handleContentChange} 
        placeholder="Type your event content..."
      />
    </div>
  );
}
 
export default CreateEvent;