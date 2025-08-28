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
      status: "pending", // default
    });

    const populatedTask = await task.populate("assignedTo", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get all tasks with filters, search, pagination  GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, dueDate, search, page = 1, limit = 10 } = req.query;

    let query = {};

    // Filter by status
    if (status) query.status = status;

    // Filter by dueDate (exact match for now)
    if (dueDate) query.dueDate = new Date(dueDate);

    // Search by title (case-insensitive)
    if (search) query.title = { $regex: search, $options: "i" };

    // Pagination logic
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

export { createTask, getTasks };
