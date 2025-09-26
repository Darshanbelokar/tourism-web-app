import React from "react";
import "aframe";

// Example: 360° image VR viewer for a tourist spot
const VRViewer = ({ image, label }) => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <a-scene embedded style={{ width: "100%", height: "100%" }}>
        <a-sky src={image} rotation="0 -130 0"></a-sky>
        {label && (
          <a-text value={label} position="-2 2 -3" color="#FFF" width="6"></a-text>
        )}
      </a-scene>
    </div>
  );
};

export default VRViewer;
