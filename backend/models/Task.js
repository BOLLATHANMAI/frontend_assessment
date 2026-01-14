const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Task title is required' },
            len: { args: [1, 100], msg: 'Title cannot exceed 100 characters' }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        validate: {
            len: { args: [0, 500], msg: 'Description cannot exceed 500 characters' }
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: {
                args: [['pending', 'completed']],
                msg: 'Status must be pending or completed'
            }
        }
    }
});

// Define Relationships
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
