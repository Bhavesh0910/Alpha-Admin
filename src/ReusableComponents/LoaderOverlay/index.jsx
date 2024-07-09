import "./index.scss";
// import { infinity } from "ldrs";

// infinity.register();
import { helix } from "ldrs";
helix.register();
function LoaderOverlay({ desc }) {
  return (
    <>
      <div className="loader_overlay"></div>
      <div className="container">
        {/* <l-infinity
          size="55"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3"
          color="white"
        ></l-infinity> */}

        <l-helix size="55" speed="2.5" color="white"></l-helix>
        {<h1>{desc} </h1> ? <h1>Loading...</h1> : ""}
      </div>
    </>
  );
}

export default LoaderOverlay;
