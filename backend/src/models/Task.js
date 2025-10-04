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
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Task;
};