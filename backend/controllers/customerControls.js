const sequelize = require("../config/connections.js");
const { Customer } = require("../models/customer.js");
const bcrypt = require("bcryptjs");
const saltRounds = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { deposit } = require("../models/savings.js");
const { withdrawal } = require("../models/withdrawal.js");
const { verifyAuth } = require("../middleware/auth.js");
const Transaction = require("../models/transactions.js");


const secret = "secret";

const register = async (req, res) => {
  const cus = {
    cusName: req.body.CustomerName,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };

  Customer.findAll({
    where: {
      username: req.body.username,
    },
  })
    .then((rs) => {
      if (rs.length >= 1) {
        res.status(200).json([{ message: "username taken" }]);
      } else {
        Customer.create(cus)
          .then((rs) => {
            console.log(rs);
            res.status(200).json([{ message: "data created" }]);
          })
          .catch((err) => {
            console.log(err);
            res.status(403).json([{ message: "err" }]);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // res.status(200).json([{message:password}])
  Customer.findOne({
    where: {
      username: username,
    },
  })
    .then((rs) => {
      if (rs) {
        const validity = bcrypt.compareSync(password, rs.dataValues.password);
        if (validity == true) {
          const token = jwt.sign(rs.dataValues, secret);
          res.status(200).json([{ message: token }]);
        } else {
          res.status(200).json([{ message: "invalid password" }]);
        }
      } else {
        res.status(200).json([{ message: "invalid username" }]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const dashboard = async (req, res) => {
  let total = 0;
  let totalwith = 0;
  const customerID = req.decoded.cusid;
  const customerName = req.decoded.cusName;
  console.log(customerID);
  console.log("this is " + customerName);
  const narrations = [];

  const wresult = await withdrawal.findAll({
    where: {
      cusid: customerID,
    },
    order: [["createdAt", "DESC"]],
  });
  if (wresult) {
    wresult.map((element) => {
      const withdrawalNarration = {
        Narrations: element.Narration,
        Time: element.createdAt,
      };

      narrations.push(withdrawalNarration);
    });
  }

  const dresult = await deposit.findAll({
    where: {
      cusid: customerID,
    },
    order: [["createdAt", "DESC"]],
  });
  if (dresult) {
    dresult.map((element) => {
      const depositNarration = {
        Narrations: element.Narration,
        Time: element.createdAt,
      };

      narrations.push(depositNarration);
    });
  }

  const result = await Transaction.findOne({
    where: {
      cusid: customerID,
    },
  });
  if (result) {
    total = result.totalBalance;
    totalwith = result.totalWithdrawal;
    saving = result.totalDeposit;
    res.status(200).json({
      customer: customerID,
      fullname: customerName,
      savings: saving,
      withdraw: totalwith,
      balance: total,
      narration: narrations,
    });
  } else {
    let totalW = 0;
    let tota = 0;
    let totalB = 0;

    const rep = await Transaction.create({
      cusid: customerID,
      totalWithdrawal: totalW,
      totalDeposit: tota,
      totalBalance: totalB,
    });
    if (rep) {
      total = rep.totalBalance;
      totalwith = rep.totalWithdrawal;
      saving = rep.totalDeposit;
      res.status(200).json({
        customer: customerID,
        fullname: customerName,
        savings: saving,
        withdraw: totalwith,
        balance: total,
      });
    } else {
      console.log(error);
    }
  }
};

module.exports = { register, login, dashboard };
