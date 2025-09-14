// backend/controllers/dashboardController.js

export const getDashboardStats = async (req, res) => {
  try {
    // Total tasks
    const totalTasks = await Task.countDocuments();

    // Tasks by status (grouped)
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      dueDate: { $gte: today, $lt: tomorrow }
    });

    // Users with most assigned tasks
    const topUsers = await Task.aggregate([
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users", // collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          taskCount: "$count"
        }
      }
    ]);

    res.json({
      totalTasks,
      tasksByStatus,
      tasksDueToday,
      topUsers
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
