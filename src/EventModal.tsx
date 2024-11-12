import * as Dialog from "@radix-ui/react-dialog";
import { Event } from "./Home";
import { IoClose } from "react-icons/io5";

const EventDialog = ({
  open,
  eventContent,
  onOpenChange,
}: {
  open: boolean;
  eventContent: Event;
  onOpenChange: () => void;
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-gray-200 dark:bg-gray-900 opacity-70" />
      <Dialog.Content className="fixed inset-0 m-auto bg-gray-300 dark:bg-gray-800 bg-graph-bg p-6 rounded-lg shadow-lg w-7/12 h-1/2  overflow-y-auto">
        <Dialog.Title className="text-xl font-bold">
          {eventContent.title}
        </Dialog.Title>
        <Dialog.Description className="mt-2">
          {eventContent.content}
        </Dialog.Description>
        <Dialog.Close className="absolute top-2 right-2 mt-2 mr-2 hover:bg-red-600 duration-180 rounded-full">
          <button>
            <IoClose />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default EventDialog;
