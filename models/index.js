"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env]; // Adjust path to your config
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import User model
const UserModel = require('../src/models/user/usermodel');
if (UserModel) {
  const User = UserModel(sequelize, Sequelize.DataTypes);
  db[User.name] = User;
}

// Import other models
const modelPaths = [
  path.join(__dirname, "../src/models/Client/Model/clientmodel.js"),
  path.join(__dirname, "../src/models/ClientTransaction/Model/clienttransactionmodel.js"),
  path.join(__dirname, "../src/models/ResourceType/Model/resourcetypemodel.js"),
  path.join(__dirname, "../src/models/Resource/Model/resourcemodel.js"),
  path.join(__dirname, "../src/models/BrickType/Model/brickTypes.js"),
  path.join(__dirname, "../src/models/BrickProduction/Model/brickProductions.js"),
  path.join(__dirname, "../src/models/BrickTransaction/Model/bricktransactionmodel.js"),
  path.join(__dirname, "../src/models/EmployeeSalary/Model/employeesalarymodel.js"),
  path.join(__dirname, "../src/models/Outgoing/Model/outgoingmodel.js"),
];

// Load each model if the file exists
modelPaths.forEach((modelPath) => {
  try {
    if (fs.existsSync(modelPath)) {
      const model = require(modelPath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      console.warn(`Model file not found: ${modelPath}`);
    }
  } catch (error) {
    console.error(`Error loading model from ${modelPath}:`, error.message);
  }
});

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;