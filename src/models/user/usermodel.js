'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
    }

    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    toJSON() {
      const values = super.toJSON();
      delete values.password;
      return values;
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'username_unique', // Named unique constraint
      validate: {
        len: [3, 50],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'email_unique', // Named unique constraint
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        notEmpty: true,
        isStrongPassword(value) {
          if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(value)) {
            throw new Error('Password must contain at least 8 characters including uppercase, lowercase and numbers');
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'employee', 'viewer'),
      defaultValue: 'viewer',
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      // Explicitly define only the indexes we need
      {
        name: 'username_unique',
        unique: true,
        fields: ['username']
      },
      {
        name: 'email_unique',
        unique: true,
        fields: ['email']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });

  return User;
};