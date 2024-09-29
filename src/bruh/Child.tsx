import { Dispatch, HTMLAttributes, SetStateAction } from "react";

// PROPS
const Child = ({
  ...props
}: {
  setHelo: Dispatch<SetStateAction<string[]>>;
} & HTMLAttributes<HTMLButtonElement>) => {
  return <button {...props}>{props.children}</button>;
};

export default Child;

// // ONE BY ONE
// const Child = ({
//   children,
//   onClick,
//   className,
//   disabled,
// }: {
//   children: string;
//   onClick: () => void;
//   className: string;
//   disabled: boolean;
// }) => {
//   return (
//     <button onClick={onClick} className={className} disabled={disabled}>
//       {children}
//     </button>
//   );
// };

// export default Child;
