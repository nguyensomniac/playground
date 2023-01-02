// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

import { createPlayground } from "./plugin/createPlayground";
import { SerializableNode } from "./types/types";


const serializeLayers : (layers: SceneNode[]) => SerializableNode[] = (layers: SceneNode[]) => {
  return layers.map((l) => {
    return {
      id: l.id,
      name: l.name
  }})
}

const findLayerWithId = (layerId) => {
  // This is hacky, replace w/ better search later
  const { selection } = figma.currentPage;
  return selection.find((s) => { return s.id === layerId });
}

figma.showUI(__html__);
figma.on("run", () => {
  if (figma.currentPage.selection.length) {
    figma.ui.postMessage({
      type: "SELECTION_CHANGE",
      data: serializeLayers([...figma.currentPage.selection]),
    });
  }
});


figma.on("selectionchange", () => {
  figma.ui.postMessage({
    type: "SELECTION_CHANGE",
    data: serializeLayers([...figma.currentPage.selection]),
  });
});

figma.ui.onmessage = (message) => {
  switch (message.type) {
    case "RUN_COMBINATIONS": {
      const nodes = message.selection.map((n) => {return findLayerWithId(n.id)})
      createPlayground(nodes).then(() => {
        figma.closePlugin();
      });
    }
  }
};

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
