import { Playground } from "./createCombinations";
import { renderCombinationsToPage } from "./renderCombinationsToPage";
import { renderStats } from './renderStats';

/**
 *
 * Creates a Playground page containing all the unique combinations of
 * the given layer set.
 *
 * @param layerSet A list of component sets representing each attribute. Each child
 * is a single variant of that attribute.
 *
 */


export const createPlayground = async (layerSet: SceneNode[]) => {
  if (!layerSet.length) {
    throw Error("Please select at least 1 component set");
  }
  layerSet.forEach((s) => {
    if (s.type !== "COMPONENT_SET") {
      throw Error(
        "Please select a component set, not individual components or layers"
      );
    }
  });
  const attributes = layerSet as ComponentSetNode[];
  const playground = new Playground();
  const combinations = playground.createCombinations(attributes);
  const stats = await renderStats(attributes);
  const page = renderCombinationsToPage(combinations);
  page.appendChild(stats);
  stats.x = -2500;
  stats.y = 0;
};