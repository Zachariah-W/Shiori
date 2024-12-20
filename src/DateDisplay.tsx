import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

const DateDisplay = ({
  className,
  startDate,
  endDate,
}: {
  className: string;
  startDate: Timestamp;
  endDate: Timestamp;
}) => {
  const formatStartDate =
    startDate &&
    format(
      startDate instanceof Date ? startDate : startDate.toDate(),
      "MM/dd/yyyy",
    );
  const formatEndDate =
    endDate &&
    format(endDate instanceof Date ? endDate : endDate.toDate(), "MM/dd/yyyy");

  if (formatStartDate !== formatEndDate) {
    return (
      <p className={className}>
        Date: {formatStartDate} ~ {formatEndDate}
      </p>
    );
  } else {
    return <p className={className}>Date: {formatStartDate}</p>;
  }
};

export default DateDisplay;
