// src/models/index.js
import { UserFactory } from './User.js';
import { TaskFactory } from './Task.js';

// Export an object that will be populated with our models
export const models = {};

export const initializeModels = (sequelize) => {
  const User = UserFactory(sequelize);
  const Task = TaskFactory(sequelize);

  // ==> Define associations here <==
  User.hasMany(Task);
  Task.belongsTo(User);

  // Populate the models object
  Object.assign(models, {
    User,
    Task,
  });

  // We can still return them for use in server.js
  return models;
};