// src/controllers/taskController.js
import { models } from "../models/index.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    // Added dueDate to destructuring
    const { title, description, status, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await models.Task.create({
      title,
      description,
      status: status || "To Do",
      dueDate, // NEW: Include dueDate in creation
      // Changed ownerId to userId to match the database schema
      UserId: req.user.id,
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      // Admin sees all tasks and who owns them
      // Corrected 'User' to 'models.User'
      tasks = await models.Task.findAll({
        include: [{ model: models.User, attributes: ["name", "email"] }],
      });
    } else {
      // Normal user sees only their own tasks
      // Changed ownerId to userId
      tasks = await models.Task.findAll({ where: { UserId: req.user.id } });
    }

    return res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await models.Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only owner or admin can view
    // Changed ownerId to userId
    if (req.user.role !== "admin" && task.UserId !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    return res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only owner or admin can update
    // Changed ownerId to userId
    if (req.user.role !== "admin" && task.UserId !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    // Added dueDate to destructuring
    const { title, description, status, dueDate } = req.body;
    
    // Update all provided fields
    await task.update({ title, description, status, dueDate }); // NEW: Include dueDate in update
    
    return res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await models.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only owner or admin can delete
    // Changed ownerId to userId
    if (req.user.role !== "admin" && task.UserId !== req.user.id) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    await task.destroy();
    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// // // src/controllers/taskController.js
// // src/controllers/taskController.js
// import { models } from "../models/index.js";

// // Create a new task
// export const createTask = async (req, res) => {
//   try {
//     const { title, description, status } = req.body;
//     if (!title) return res.status(400).json({ message: "Title is required" });

//     const task = await models.Task.create({
//       title,
//       description,
//       status: status || "To Do",
//       // Changed ownerId to userId to match the database schema
//       UserId: req.user.id,
//     });

//     return res.status(201).json(task);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all tasks
// export const getTasks = async (req, res) => {
//   try {
//     let tasks;
//     if (req.user.role === "admin") {
//       // Admin sees all tasks and who owns them
//       // Corrected 'User' to 'models.User'
//       tasks = await models.Task.findAll({
//         include: [{ model: models.User, attributes: ["name", "email"] }],
//       });
//     } else {
//       // Normal user sees only their own tasks
//       // Changed ownerId to userId
//       tasks = await models.Task.findAll({ where: { UserId: req.user.id } });
//     }

//     return res.json(tasks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get a single task by ID
// export const getTaskById = async (req, res) => {
//   try {
//     const task = await models.Task.findByPk(req.params.id);

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Only owner or admin can view
//     // Changed ownerId to userId
//     if (req.user.role !== "admin" && task.UserId !== req.user.id) {
//       return res.status(403).json({ message: "Access forbidden" });
//     }

//     return res.json(task);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Update a task
// export const updateTask = async (req, res) => {
//   try {
//     const task = await models.Task.findByPk(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Only owner or admin can update
//     // Changed ownerId to userId
//     if (req.user.role !== "admin" && task.UserId !== req.user.id) {
//       return res.status(403).json({ message: "Access forbidden" });
//     }

//     const { title, description, status } = req.body;
//     // You can update properties directly on the found task instance
//     await task.update({ title, description, status });
    
//     return res.json(task);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete a task
// export const deleteTask = async (req, res) => {
//   try {
//     const task = await models.Task.findByPk(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Only owner or admin can delete
//     // Changed ownerId to userId
//     if (req.user.role !== "admin" && task.UserId !== req.user.id) {
//       return res.status(403).json({ message: "Access forbidden" });
//     }

//     await task.destroy();
//     return res.json({ message: "Task deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

