// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

const PADDING = 20;

type VariantMapping = {
  layer: InstanceNode; componentSet: ComponentSetNode
}

const { selection } = figma.currentPage;
const mainComponent = selection[0];

const instances = [];

const variantChildren = mainComponent.children.filter((c) => {
  return (
    c.type === "INSTANCE" && c.mainComponent.parent.type === "COMPONENT_SET"
  );
}) as InstanceNode[];

const variantParentSets = variantChildren.map((item) => {
  return {
    layer: item,
    componentSet: item.mainComponent.parent as ComponentSetNode,
  };
}) as VariantMapping[];

// recursively generate combinations of the different variations of `variantChildren`
// so for variantChildren [x, y, z] with options [{x: [a,b]}, {y: [c, d]}, {z: e, f}]
// create variations [{x: a, y: c, z: e}, {x: a,  y : d, z: e}...] & so forth

const createCombinations1 = (instance: InstanceNode, variantMapping: VariantMapping[]) => {
  if (!variantMapping.length) return;
  const newMapping = [...variantMapping];
  const nextVariant = newMapping.pop();
  for (let variant = 0; variant < nextVariant.componentSet.children.length; variant++) {
    const newInstance = instance.clone();
    instances.push(newInstance)
    const correspondingLayer = newInstance.children.find(
      (c) => c.type === "INSTANCE" && c.id.includes(nextVariant.layer.id)
    ) as InstanceNode;
    correspondingLayer.swapComponent(nextVariant.componentSet.children[variant] as ComponentNode);
    createCombinations1(newInstance, newMapping);
  }
};

const renderCombination = (c: ComponentNode[]) => {
  const f = figma.createFrame();
  if (c.length) f.resize(c[0].width, c[0].height);
  c.map(component => {
    const instance = component.createInstance();
    f.appendChild(instance);
    instance.x = 0;
    instance.y = 0;
  })
  return f;
}

 const renderStats = async (componentSets: ComponentSetNode[]) => {
  const numAssets = componentSets.reduce((prev, current) => { return prev + current.children.length }, 0);
  const numCombos = componentSets.reduce((prev, current) => { return prev * current.children.length }, 1);
  const statistics = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  statistics.characters = `
  Stats
  ————
  ${numAssets} assets
  ${numCombos} days of Nouns builder`;
  const fills = JSON.parse(JSON.stringify(statistics.fills))
  fills[0].color.r = 1;
  fills[0].color.g = 1;
  fills[0].color.b = 1;
  statistics.fills = fills;
  statistics.fontSize = 160;
  return statistics
}

const positionCombos = (combos: ComponentNode[][]) => {
  const instances = [...combos];
  const newPage = figma.createPage();
  newPage.name = `Playground run at ${new Date().toString()}`
  const numColumns = Math.floor(Math.pow(instances.length, 0.5));
  // assume width & height of all items is same
  const colWidth = instances[0][0].width + PADDING;
  const colHeight = instances[0][0].height + PADDING;
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
}

const createCombinations = (componentSets: ComponentSetNode[]) => {
// return [[component[0][0], createCombinations(component[1...n])]
  if (!componentSets.length) return [];
  const combinations: ComponentNode[][] = [];
  const nextSets = [...componentSets];
  const currentSet = nextSets.pop();
  const nextCombos = createCombinations(nextSets);
  console.log(currentSet.children)
  currentSet.children.forEach((c: ComponentNode) => {
    if (!nextCombos.length) combinations.push([c])
    else {
      nextCombos.forEach(combo => {
        combinations.push([c].concat(combo));
      })
    }
  })
  return combinations;
}

const main = async () => {
  if (!selection.length) {
    throw Error ("Please select at least 1 component set")
  }
  selection.forEach((s) => {
    if (s.type !== "COMPONENT_SET") {
      throw Error("Please select a component set, not individual components or layers");
    }
  })
  const combos = createCombinations(selection as ComponentSetNode[])
  const page =  positionCombos(combos);
  const stats = await renderStats(selection as ComponentSetNode[]);
  page.appendChild(stats)
  stats.x = -2500;
  stats.y = 0;
}

main().then(() => {
  figma.closePlugin();
});

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
