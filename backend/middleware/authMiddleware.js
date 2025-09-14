import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js"; 
import Task from "../models/taskModel.js"; 

// Protect routes - require valid JWT
const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    }

    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role '${req.user.role}' not authorized` });
    }
    next();
  };
};

// Ownership / Assignee check
const isOwnerOrAssigned = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignee =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isCreator && !isAssignee) {
      return res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
    }

    req.task = task; // Attach for downstream use
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { protect, authorizeRoles, isOwnerOrAssigned };
