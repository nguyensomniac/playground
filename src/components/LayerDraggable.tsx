import { styled } from "@stitches/react";
import React from "react";

const Container = styled('div', {
  backgroundColor: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  padding: '8px 16px',
})

export function LayerDraggable({ height, name, ...props }) {
  return (
    <Container
      css={{
        height: height
      }}
      {...props}
    >
      {name}
    </Container>
  );
}
