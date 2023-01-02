/**
 *
 * @param attributes A list of component sets representing each attribute. Each child
 * is a single variant of that attribute.
 * @returns all the unique combinations of individual components within the attribute list. ie for
 * [{hat: [a, b]}, {face: [c, d]}] return
 * [[a, c], [a, d], [b, c], [b, d]].
 */

 export const createCombinations = (attributes: ComponentSetNode[]) => {
  if (!attributes.length) return [];
  const combinations: ComponentNode[][] = [];
  const restAttributes = [...attributes];
  const currentAttribute = restAttributes.pop();
  const nextCombinations = createCombinations(restAttributes);
  currentAttribute.children.forEach((c: ComponentNode) => {
    if (!nextCombinations.length) combinations.push([c]);
    else {
      nextCombinations.forEach((combo) => {
        combinations.push([c].concat(combo));
      });
    }
  });
  return combinations;
};