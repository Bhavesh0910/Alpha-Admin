import React from "react";
import { ring2 } from "ldrs";

ring2.register();

// Default values shown
const Spinner = ({ size = 40 }) => {
  return (
    <div>
      <l-ring-2
        size={size}
        stroke="5"
        stroke-length="0.25"
        bg-opacity="0.1"
        speed="0.8"
        color="white"
      ></l-ring-2>
    </div>
  );
};

export default Spinner;
