import { prisma } from "../prisma/client.js";
import { bucket } from "../firebase.js";

export async function saveSegmentRecursively(segment, userId, parentId) {
  const created = await prisma.segment.create({
    data: {
      name: segment.name,
      isDocument: segment.isDocument || false,
      documentKey: segment?.documentKey,
      userId,
      parentId,
    },
  });

  if (segment.children && segment.children.length > 0) {
    for (const child of segment.children) {
      await saveSegmentRecursively(child, userId, created.id);
    }
  }

  return created.id;
}

export function buildSegmentTree(segments, parentId = null) {
  return segments
    .filter((seg) => seg.parentId === parentId)
    .map((seg) => ({
      id: seg.id,
      name: seg.name,
      isDocument: seg.isDocument,
      documentKey: seg.documentKey,
      userId: seg.userId,
      parentId: seg.parentId,
      children: buildSegmentTree(segments, seg.id),
    }));
}

export async function getAllDescendants(segmentId) {
  const all = await prisma.segment.findMany();
  const map = {};

  all.forEach((seg) => {
    if (!map[seg.parentId]) map[seg.parentId] = [];
    map[seg.parentId].push(seg);
  });

  const result = [];

  function collect(id) {
    const children = map[id] || [];
    for (let child of children) {
      result.push(child);
      collect(child.id);
    }
  }

  collect(segmentId);
  return result;
}

export const deleteFileFromFirebase = async (filePath) => {
  try {
    const file = bucket.file(filePath);
    await file.delete();
    console.log(`Firebase deleted: ${filePath}`);
  } catch (err) {
    console.warn(`Firebase delete failed: ${filePath}`, err.message);
  }
};
