export const convertFilesToHierarchy = (files) => {
  const rootMap = new Map();
  files.forEach((file) => {
    if (file.size !== 0 && file.path) {
      const pathSegments = file?.path
        ?.split("/")
        ?.filter(Boolean)
        .filter((el) => el !== ".");
      let currentMap = rootMap;

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const isLast = i === pathSegments.length - 1;

        if (!currentMap.has(segment)) {
          currentMap.set(segment, {
            name: isLast ? segment.toLowerCase() : segment,
            isDocument: isLast,
            documentKey: isLast ? file?.url : null,
            childrenMap: new Map(),
          });
        }

        const node = currentMap.get(segment);
        currentMap = node.childrenMap;
      }
    }
  });
  const mapToArray = (map) => {
    return Array.from(map.values()).map(({ childrenMap, ...node }) => {
      return {
        ...node,
        children: mapToArray(childrenMap),
      };
    });
  };
  return mapToArray(rootMap);
};
