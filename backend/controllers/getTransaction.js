const { deposit } = require("../models/savings.js");
const Transaction = require("../models/transactions.js");
const { withdrawal } = require("../models/withdrawal.js");



const getTransactions = async (cusid) => {

  let tWithdrawal = 0
  let tDeposit = 0
  let tBalance = 0
  
  Transaction.create({
    cusid: cusid,
    totalWithdrawal: tWithdrawal,
    totalDeposit: tDeposit,
    totalBalance: tBalance

  })
  .then(res=>{
console.log(`this is your response: ${res}`)
  })
  .catch(err=>{
    console.log(err)
  })

};

module.exports = getTransactions;
