const sequelize = require("./config/connections");
const Transaction = require("./models/transactions");
 const { Customer } = require("./models/customer");
const { deposit } = require("./models/savings");
const { withdrawal } = require("./models/withdrawal");

sequelize.sync({force:true}).then(rs=>{
    console.log(rs)
}).catch(err=>{
    console.log(err)
})