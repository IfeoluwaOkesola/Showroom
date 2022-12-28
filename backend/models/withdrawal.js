const Sequelize = require('sequelize')
const sequelize = require('../config/connections.js')

const withdrawal = sequelize.define('withdrawal',{
    withdrawalid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    Amountwithdraw:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },

    cusid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull:false,
        references: {
            model: 'customers',
            key: 'cusid',
         }
    },

    Narration:{
        type:Sequelize.STRING,
        allowNull:false
    },
  
})

module.exports = {withdrawal}
