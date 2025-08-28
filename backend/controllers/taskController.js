import mongoose from "mongoose";
import Task from "../models/Taskmodel.js";

// Create a new task
// POST /api/tasks

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      status: "pending",
      user : req.user._id ,
    });

    const populatedTask = await task.populate("assignedTo", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all tasks with filters, search, pagination 
// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, dueDate, search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (dueDate) query.dueDate = new Date(dueDate);
    if (search) query.title = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id).populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only creator or assigned user can view
    if (
      task.user.toString() !== req.user._id.toString() &&
      (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Allow creator OR assigned user
    const isCreator = task.user.toString() === req.user._id.toString();
    const isAssignee =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    const { title, description, dueDate, status, assignedTo } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;

    // Validate status
    const validStatuses = ["pending", "in-progress", "completed"];
    if (status && validStatuses.includes(status)) {
      task.status = status;
    }

    if (assignedTo) task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate("assignedTo", "name email");
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only creator can delete
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {createTask , getTasks, getTaskById, updateTask, deleteTask };
