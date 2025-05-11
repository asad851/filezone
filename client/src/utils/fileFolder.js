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

export const findFolderById = (id, nodes) => {
  for (let node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findFolderById(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

// Checks if targetId is in the subtree of sourceItem
export function isDescendant(sourceItem, targetId) {
  if (!sourceItem || !sourceItem.children) return false;
  for (const child of sourceItem.children) {
    if (child.id === targetId) return true;
    if (!child.isDocument && isDescendant(child, targetId)) return true;
  }
  return false;
}

// Recursively finds and removes an item by id
export function removeItemById(tree, itemId) {
  return tree
    .map((item) => {
      if (item.id === itemId) return null;
      if (!item.isDocument && item.children) {
        return {
          ...item,
          children: removeItemById(item.children, itemId),
        };
      }
      return item;
    })
    .filter(Boolean);
}



// Inserts an item into target folder's children
export function insertItem(tree, targetFolderId, itemToInsert) {
  return tree.map((item) => {
    if (item.id === targetFolderId && !item.isDocument) {
      return {
        ...item,
        children: [...(item.children || []), itemToInsert],
      };
    }
    if (!item.isDocument && item.children) {
      return {
        ...item,
        children: insertItem(item.children, targetFolderId, itemToInsert),
      };
    }
    return item;
  });
}
