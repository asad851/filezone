import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  buildSegmentTree,
  deleteFileFromFirebase,
  getAllDescendants,
  saveSegmentRecursively,
} from "../services/segmentServices.js";
import { prisma } from "../prisma/client.js";
dotenv.config();

export const newSegmentController = async (req, res) => {
  try {
    const user = req.user;
    const { segmentTree, parentId } = req.body;
    console.log(parentId);
    if (!segmentTree || !user?.id) {
      return res.status(400).json({ errorMessage: "Invalid data" });
    }
    await saveSegmentRecursively(segmentTree, user.id, parentId || null);
    const segments = await prisma.segment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    const tree = buildSegmentTree(segments);

    return res.status(201).json({
      errorMessage: null,
      message: "Segment tree created successfully",
      response: { tree },
    });
  } catch (err) {
    console.error("[Segment Creation Error]", err.message);
    res.status(500).json({ errorMessage: "Failed to create files/folder" });
  }
};

export const getSegmentController = async (req, res) => {
  try {
    const userId = req.user.id;

    const segments = await prisma.segment.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const segmentTree = buildSegmentTree(segments);

    res.status(200).json({ errorMessage: null, tree: segmentTree });
  } catch (err) {
    console.error("[GET SEGMENTS]", err);
    res.status(500).json({ errorMessage: "Failed to fetch segments" });
  }
};

export const deleteSegment = async (req, res) => {
  try {
    const segmentId = req.params.id;
    const userId = req.user.id;

    const root = await prisma.segment.findUnique({ where: { id: segmentId } });

    if (!root || root.userId !== userId) {
      return res
        .status(404)
        .json({ errorMessage: "Segment not found or unauthorized" });
    }

    const descendants = await getAllDescendants(segmentId);
    const allToDelete = [root, ...descendants];

    // Firebase delete (documents only)
    for (let node of allToDelete) {
      if (node.isDocument && node.documentKey) {
        await deleteFileFromFirebase(node.documentKey);
      }
    }

    // Delete all from DB
    const idsToDelete = allToDelete.map((n) => n.id);
    await prisma.segment.deleteMany({ where: { id: { in: idsToDelete } } });

    return res.status(200).json({
      errorMessage: null,
      message: `Segment and ${idsToDelete.length - 1} child nodes deleted`,
    });
  } catch (err) {
    console.error("[DELETE SEGMENT]", err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
};

export const updateSegment = async (req, res) => {
  try {
    const segmentId = req.params.id;
    const userId = req.user.id;
    const { name, documentKey, parentId } = req.body;
    const segment = await prisma.segment.findUnique({
      where: { id: segmentId },
    });

    if (!segment || segment.userId !== userId) {
      return res.status(404).json({ errorMessage: "Segment not found" });
    }
    const parent = parentId === "null" ? null : parentId;
    const updated = await prisma.segment.update({
      where: { id: segmentId },
      data: {
        ...(name && { name }),
        ...(documentKey && { documentKey }),
        ...(parentId && { parentId: parent }),
      },
    });
    return res.status(200).json({
      errorMessage: null,
      message: "Segment updated successfully",
      segment: updated,
    });
  } catch (err) {
    console.error("[UPDATE SEGMENT]", err);
    res.status(500).json({ errorMessage: "Failed to update segment" });
  }
};

export const uploadChildController = async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const userId = req.user.id;
    const { name, isDocument, documentKey } = req.body;

    const parentSegment = await prisma.segment.findUnique({
      where: { id: parentId },
    });

    if (!parentSegment || parentSegment.userId !== userId) {
      return res
        .status(404)
        .json({ errorMessage: "Parent segment not found or unauthorized" });
    }

    if (isDocument && !documentKey) {
      return res
        .status(400)
        .json({ errorMessage: "Document must have a documentKey" });
    }

    const newSegment = await prisma.segment.create({
      data: {
        name,
        isDocument,
        documentKey: isDocument ? documentKey : null,
        parentId,
        userId,
      },
    });

    return res.status(201).json({
      errorMessage: null,
      segment: newSegment,
    });
  } catch (err) {
    console.error("[CREATE CHILD SEGMENT]", err);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
};
