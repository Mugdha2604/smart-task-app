// src/models/Task.js
import { DataTypes } from 'sequelize';

export const TaskFactory = (sequelize) => {
  const Task = sequelize.define('Task', {
    // Define your task attributes here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    defaultValue: 'To Do',
    allowNull: false,
},
  });

  return Task;
};