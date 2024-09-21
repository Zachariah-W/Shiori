export type Event = {
  id: number;
  title: string;
  content: string;
};

const CreateEvent = ({
  event,
  onEventChange,
}: {
  event: Event;
  onEventChange: (updatedEvent: Event) => void;
}) => {
  return (
    <div className="border-b border-solid border-gray-200">
      <label className="text-left text-black dark:text-white block font-semibold">
        Event:
      </label>
      <input
        className="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none leading-6 transition-all duration-200 cursor-pointer font-semibold hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-none"
        type="text"
        placeholder="Type your event title..."
        value={event.title}
        onChange={(e) => onEventChange({ ...event, title: e.target.value })}
      />
      <textarea
        className="w-full py-1.5 px-2.5 my-2.5 mx-0 border border-gray-300 box-border block rounded-lg bg-gray-200 text-gray-600 border-transparent p-4 outline-none font-semibold leading-6 transition-all duration-200 cursor-pointer hover:bg-gray-100 focus:bg-white focus:text-gray-800 focus:border-gray-800 resize-y overflow-y-auto"
        value={event.content}
        onChange={(e) => onEventChange({ ...event, content: e.target.value })}
        placeholder="Type your event content..."
      />
    </div>
  );
};

export default CreateEvent;
