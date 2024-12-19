import { NewEvent } from "./Create";
import { EditEvent } from "./EditTrip";

const CreateEvent = ({
  event,
  onEventChange,
}: {
  event: EditEvent | NewEvent;
  onEventChange: (updatedEvent: EditEvent | NewEvent) => void;
}) => {
  return (
    <div className="w-full">
      <input
        className="title-input"
        type="text"
        placeholder="Type your event title..."
        value={event.title}
        onChange={(e) => onEventChange({ ...event, title: e.target.value })}
        required
      />
      <textarea
        value={event.content}
        onChange={(e) => onEventChange({ ...event, content: e.target.value })}
        placeholder="Type your event content..."
        required
      />
    </div>
  );
};

export default CreateEvent;
