import "./index.scss";
import {bouncy} from "ldrs";
bouncy.register();
function LoaderOverlay({desc}) {
  return (
    <>
      <div className="loader_overlay"></div>
      <div className="container">
        <l-bouncy
          size="45"
          speed="1.75"
          color="#04d9ff"
        ></l-bouncy>
        {<h1>{desc} </h1> ? <h1 style={{color: "#25CCF7"}}>Loading...</h1> : ""}
      </div>
    </>
  );
}

export default LoaderOverlay;
