const cacheKey = (attributes: ComponentSetNode[]) => {
  return attributes.reduce((acc, next) => {
    return `${acc},${next}`
  }, "")
}
export class Playground {
  #cache = {};
  createCombinations (attributes: ComponentSetNode[]) {
    if (!attributes.length) return [];
    if (this.#cache[cacheKey(attributes)]) return this.#cache[cacheKey(attributes)]
    const combinations: ComponentNode[][] = [];
    const restAttributes = [...attributes];
    const currentAttribute = restAttributes.pop();
    const nextCombinations = this.createCombinations(restAttributes);
    currentAttribute.children.forEach((c: ComponentNode) => {
      if (!nextCombinations.length) combinations.push([c]);
      else {
        nextCombinations.forEach((combo) => {
          combinations.push([c].concat(combo));
        });
      }
    });
    this.#cache[cacheKey(attributes)] = combinations;
    return combinations;
  };
}