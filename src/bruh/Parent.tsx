import { useState } from "react";
import Child from "./Child";

const Parent = () => {
  const title = "hello world";
  const [helo, setHelo] = useState<string[]>([]);
  return (
    <div>
      <Child className={`bg-white`} setHelo={setHelo}>
        {title}
      </Child>
    </div>
  );
};

export default Parent;
