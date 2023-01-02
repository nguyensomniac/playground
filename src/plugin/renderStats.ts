/**
 * TODO: Deprecate this function and move stats to the UI
 * @param attributes A list of component sets representing each attribute. Each child
 * is a single variant of that attribute.
 * @returns the text layer w/ statistics
 */

export const renderStats = async (attributes: ComponentSetNode[]) => {
  const numAssets = attributes.reduce((prev, current) => {
    return prev + current.children.length;
  }, 0);
  const numCombos = attributes.reduce((prev, current) => {
    return prev * current.children.length;
  }, 1);
  const statistics = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  statistics.characters = `
  Stats
  ————
  ${numAssets} assets
  ${numCombos} days of Nouns builder`;
  const fills = JSON.parse(JSON.stringify(statistics.fills));
  fills[0].color.r = 1;
  fills[0].color.g = 1;
  fills[0].color.b = 1;
  statistics.fills = fills;
  statistics.fontSize = 160;
  return statistics;
};