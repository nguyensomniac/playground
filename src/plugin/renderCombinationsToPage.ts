import {PLAYGROUND_PADDING, MAX_ITEMS_PER_PAGE} from '../util/constants'

/**
 * Renders the given combination of attributes onto the Figma canvas as a Frame.
 * NOTE: This function makes the assumption that the dimensions
 * of each item in the array are the same. Layers are pinned to the top left.
 * @param attributes A list of components representing the combination of
 * attributes in the combination
 * @returns A frame w/ its individual attributes as children, shown as individual instances
 */
const renderCombination = (attributes: ComponentNode[]) => {
  const f = figma.createFrame();
  if (attributes.length) f.resize(attributes[0].width, attributes[0].height);
  attributes.map((attribute) => {
    const instance = attribute.createInstance();
    f.appendChild(instance);
    instance.x = 0;
    instance.y = 0;
  });
  return f;
};

/**
 *
 * @param combinations A list of all possible combinations of attributes
 * @returns the Playground page in which the combinations are shown
 */

export const renderCombinationsToPage = (combinations: ComponentNode[][]) => {
  const instances = [...combinations.slice(0, MAX_ITEMS_PER_PAGE)];
  const newPage = figma.createPage();
  newPage.name = `Playground run at ${new Date().toString()}`;
  const numColumns = Math.floor(Math.pow(instances.length, 0.5));
  // assume width & height of all items is same
  const colWidth = instances[0][0].width + PLAYGROUND_PADDING;
  const colHeight = instances[0][0].height + PLAYGROUND_PADDING;
  let count = 0;
  while (instances.length) {
    const instance = instances.pop();
    const layers = renderCombination(instance);
    newPage.appendChild(layers);
    layers.x = (count % numColumns) * colWidth;
    layers.y = Math.floor(count / numColumns) * colHeight;
    count++;
  }
  return newPage;
};