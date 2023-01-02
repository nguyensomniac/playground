import React from "react";

export function LayerDraggable({ height, name }) {
  return (
    <div
      style={{
        height: height,
        backgroundColor: "#F6F6F6",
        display: "flex",
        alignItems: "center",
        padding: '4px',
      }}
    >
      {name}
    </div>
  );
}
