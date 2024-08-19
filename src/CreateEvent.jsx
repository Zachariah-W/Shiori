const CreateEvent = ({ event, onEventChange }) => {
  const handleTitleChange = (e) => {
    const updatedEvent = { ...event, title: e.target.value };
    onEventChange(updatedEvent);
  };

  const handleContentChange = (e) => {
    const updatedEvent = { ...event, content: e.target.value };
    onEventChange(updatedEvent);
  };

  return (
    <div class="border-b border-solid border-gray-200">
      <label class="text-left block">Event:</label>
      <input
        class="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none font-medium leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-none"
        type="text"
        placeholder="Type your event title..."
        value={event.title}
        onChange={handleTitleChange}
      />
      <textarea
        class="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none font-medium leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-y overflow-y-auto"
        value={event.content}
        onChange={handleContentChange}
        placeholder="Type your event content..."
      />
    </div>
  );
};

export default CreateEvent;
