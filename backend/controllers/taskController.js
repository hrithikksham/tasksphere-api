import Task from "../models/TaskModel.js";

// ========== Create a Task ==========
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      createdBy: req.user._id,
      assignedTo,
      status: "pending",
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// ========== Get All Tasks (Admin only) ==========
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// ========== Get Single Task by ID ==========
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("comments.postedBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// ========== Update Task ==========
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only creator or admin can update
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// ========== Delete Task ==========
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only creator or admin can delete
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// ========== Get My Tasks ==========
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching my tasks", error: error.message });
  }
};

// ========== Upload Attachment ==========
export const uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    task.attachments.push(req.file.path);
    await task.save();

    res.json({ message: "File uploaded", attachments: task.attachments });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};

// ========== Add Comment ==========
export const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
      createdAt: new Date(),
    };

    task.comments.push(comment);
    await task.save();

    res.json(task.comments);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// ========== Delete Comment ==========
export const deleteComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = task.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner or admin can delete
    if (
      comment.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.remove();
    await task.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// ========== Mark In Progress ==========
export const markInProgress = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending tasks can be marked in progress" });
    }

    task.status = "in-progress";
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

// ========== Mark Complete ==========
export const markComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "in-progress") {
      return res
        .status(400)
        .json({ message: "Only in-progress tasks can be marked complete" });
    }

    task.status = "completed";
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
