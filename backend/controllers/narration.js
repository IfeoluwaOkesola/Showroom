const { deposit } = require("../models/savings")
const { withdrawal } = require("../models/withdrawal")




const withdrawNarrate = async (req,res) => {
    const result = await withdrawal.findOne({
        where: {
            cusid: req.decoded.cusid
        }
    })

    

    
}