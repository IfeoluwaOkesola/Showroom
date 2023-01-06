const sequelize = require("../config/connections.js");
const { Customer } = require("../models/customer.js");
const bcrypt = require("bcryptjs");
const saltRounds = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { deposit } = require("../models/savings.js");
const { withdrawal } = require("../models/withdrawal.js");
const { verifyAuth } = require("../middleware/auth.js");
const Transaction = require("../models/transactions.js");
const getTransactions = require("./getTransaction.js");

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

const Withdraw = async (req, res) => {
  const customerID = req.decoded.cusid;
  const withdrawalValue = req.body.amount;
  const pasword = req.body.password;
  let totalwith = 0;
  let total = 0;
  let totalbal = 0;

  const resu = await Customer.findOne({
    where: {
      cusid: customerID,
    },
  });

  if (resu) {
    const validate = bcrypt.compareSync(pasword, resu.dataValues.password);

    if (validate == true) {
      const result = await Transaction.findOne({
        where: {
          cusid: customerID,
        },
      });

      if (result) {
        total = result.totalDeposit;
        totalwith = result.totalWithdrawal;
        totalbal = result.totalBalance;

        if (totalbal >= withdrawalValue) {
          const details = {
            cusid: customerID,
            Amountwithdraw: withdrawalValue,
            Narration: `${withdrawalValue} withdrawn from your account`,
          };
          const result = await withdrawal.create(details);

          if (result) {
            Transaction.update(
              {
                totalWithdrawal:
                  parseInt(totalwith) + parseInt(withdrawalValue),
                totalBalance: parseInt(totalbal) - parseInt(withdrawalValue),
                totalDeposit: parseInt(total) - parseInt(withdrawalValue),
              },

              {
                where: {
                  cusid: customerID,
                },
              }
            )
              .then((result) => {
                if (result !== null) {
                  res.status(200).json([{ message: "Withdrawal successful" }]);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log("not created");
          }
        } else {
          res.status(200).json([{ message: "insufficient balance" }]);
        }
      } else {
        console.log("not found");
      }
    } else {
      res.status(200).json([{ message: "incorrect password" }]);
    }
  } else {
    console.log("it does not exist");
  }
};

const transfer = async (req, res) => {
  const customerID = req.decoded.cusid;
  const customerUsername = req.decoded.cusName;
  const transferValue = req.body.amountTransfer;
  const transferAccount = req.body.username;
  const passwor = req.body.pin;
  let totalwith = 0;
  let total = 0;
  let totalbal = 0;

  const results = await Customer.findOne({
    where: {
      cusid: customerID,
    },
  });

  if (results) {
    const transferValidity = bcrypt.compareSync(
      passwor,
      results.dataValues.password
    );
    if (transferValidity == true) {
      const result = await Customer.findOne({
        where: {
          username: transferAccount,
        },
      });

      if (result) {
        const receiverid = result.cusid;
        const receiverName = result.username;

        const rs = await Transaction.findOne({
          where: {
            cusid: customerID,
          },
        });
        if (rs) {
          total = rs.totalDeposit;
          totalwith = rs.totalWithdrawal;
          totalbal = rs.totalBalance;

          if (totalbal >= transferValue) {
            const report = await withdrawal.create({
              cusid: customerID,
              Amountwithdraw: transferValue,
              Narration: `${transferValue} transfered to ${receiverName}`,
            });

            if (report) {
              const result = await Transaction.update(
                {
                  totalWithdrawal:
                    parseInt(totalwith) + parseInt(transferValue),
                  totalBalance: parseInt(totalbal) - parseInt(transferValue),
                  totalDeposit: parseInt(total) - parseInt(transferValue),
                },

                {
                  where: {
                    cusid: customerID,
                  },
                }
              );

              if (result) {
                const rs = await deposit.create({
                  cusid: receiverid,
                  Amountdep: transferValue,
                  Narration: `${transferValue} deposit from ${customerUsername}`,
                });
                if (rs) {
                  let totalW = 0;
                  let tot = 0;
                  let totalB = 0;

                  const rse = await Transaction.findOne({
                    where: {
                      cusid: receiverid,
                    },
                  });
                  if (rse) {
                    totalW = rse.totalWithdrawal;
                    tot = rse.totalDeposit;
                    totalB = rse.totalBalance;

                    Transaction.update(
                      {
                        totalDeposit: parseInt(tot) + parseInt(transferValue),
                        totalBalance:
                          parseInt(totalB) + parseInt(transferValue),
                      },
                      {
                        where: {
                          cusid: receiverid,
                        },
                      }
                    )
                      .then((rs) => {
                        res
                          .status(200)
                          .json([{ message: "transfer successful" }]);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                } else {
                  console.log("receiver not deposited");
                }
              } else {
                console.log("transaction not updated");
              }
            }
          } else {
            console.log("insufficient balance")
            res.status(200).json([{ message: "insufficient balance" }]);
          }
        } 
      //} else {
        //res.status(200).json([{ message: "Account do not exist" }]);
      } else{
        console.log("account does not exist");
          res.status(200).json([{ message: "Account do not exist" }]);
      }
    } else {
      console.log("password is incorrect")
      res.status(200).json([{ message: "incorrect password" }]);
    }
  }
};

module.exports = { register, login, dashboard, Withdraw, transfer };
