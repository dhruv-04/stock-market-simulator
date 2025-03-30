const { sequelize } = require('../config/mysqlConfig');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
        order_id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.ENUM('CYBR', 'EDCI', 'EDLK', 'GTI', 'MCRP', 'NOVA', 'STBC', 'VPHM'),
            allowNull: false
        },
        order_type: {
            type: DataTypes.ENUM('BUY', 'SELL'),
            allowNull: false
        },
        execution_type: {
            type: DataTypes.ENUM('LIMIT', 'MARKET'),
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'PARTIALLY_COMPLETED', 'COMPLETED', 'CANCELLED'),
            defaultValue: 'PENDING'
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tablename: 'orders'
    }
);

// sequelize.sync()
//     .then(() => {
//         console.log('Order table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating Order table:', error);
//     });

module.exports = Order;