const Sequelize = require("sequelize");
const sequelize = require("../config/connections");

const Transaction = sequelize.define("transaction", {
  transactionid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  cusid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    references: {
      model: "customers",
      key: "cusid",
    },
  },

  totalWithdrawal: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  totalDeposit: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  totalBalance: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },


});

module.exports = Transaction;
