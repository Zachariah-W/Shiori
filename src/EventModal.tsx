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
      <Dialog.Overlay className="fixed inset-0 bg-gray-200 opacity-70 dark:bg-gray-900" />
      <Dialog.Content className="fixed inset-0 m-auto h-1/2 w-7/12 overflow-y-auto rounded-lg bg-gray-300 bg-graph-bg p-6 shadow-lg dark:bg-gray-800">
        <Dialog.Title className="text-xl font-bold">
          {eventContent.title}
        </Dialog.Title>
        <Dialog.Description className="mt-2">
          {eventContent.content}
        </Dialog.Description>
        <Dialog.Close className="duration-180 absolute right-2 top-2 mr-2 mt-2 rounded-full hover:bg-red-600">
          <button>
            <IoClose />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default EventDialog;
