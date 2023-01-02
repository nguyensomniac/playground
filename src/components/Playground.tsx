import React from "react";
import { Reorder, AnimatePresence } from "framer-motion";
import { LayerDraggable } from "./LayerDraggable";

const ITEM_HEIGHT = 40;

export const Playground = ({ initialState }) => {
  const [items, setItems] = React.useState(initialState);
  React.useEffect(() => {
    setItems(initialState);
  }, [initialState]);
  const runCombinations = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "RUN_COMBINATIONS",
          selection: items
        },
      },
      "https://www.figma.com"
    );
  };
  return (
    <div>
      <Reorder.Group
        as="ul"
        axis="y"
        onReorder={setItems}
        className="tabs"
        values={items}
      >
        <AnimatePresence initial={false}>
          {items.map((item) => {
            return (
              <Reorder.Item key={item.name} id={item.name} value={item}>
                <LayerDraggable name={item.name} height={ITEM_HEIGHT} />
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>
      <button onClick={runCombinations}>Run combinations</button>
    </div>
  );
};
