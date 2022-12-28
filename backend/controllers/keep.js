const transfer = async (req, res) => {
    const customerID = req.decoded.cusid;
    const customerUsername = req.decoded.cusName;
    const transferValue = req.body.amountTransfer;
    const transferAccount = req.body.username
    let totalwith = 0;
    let total = 0;
    let totalbal = 0;
  
    const result = await Customer.findOne({
      where: {
        username: transferAccount
      }
    })
  
    if (result){
  
      const receiverid = result.cusid
  
      const rs = await Transaction.findOne({
        where: {
          cusid: customerID
        }
      })
      if (rs){
        total = rs.totalDeposit
      totalwith = rs.totalWithdrawal
      totalbal = rs.totalBalance
  
      if (totalbal >= transferValue){
  
        const report = await withdrawal.create({
          cusid: customerID,
          Amountwithdraw: transferValue,
          Narration:`${transferValue} transfered`
        })
  
        if (report){
  
          Transaction.update(
            {
              totalWithdrawal: parseInt(totalwith) + parseInt(transferValue),
              totalBalance: parseInt(totalbal) - parseInt(transferValue),
              totalDeposit: parseInt(total) - parseInt(transferValue),
            },
      
            {
              where: {
                cusid: customerID,
              },
            }
          )
          .then((report) => {
            if (report !== null) {
              console.log ("Transfer successful");
  
           deposit.create({
  
            cusid: receiverid,
            Amountdep: transferValue,
            Narration:`${transferValue} has being deposited into your account from ${customerUsername}`
          
  
           })
           .then((rs)=> {
            console.log ("Transfer received")
  
           })
           .catch((err)=> {
            console.log(err);
           })
  
        
            
           let totalW = 0
           let tot = 0
           let totalB = 0
  
          Transaction.findOne({
            
            where: {
              cusid: receiverid
            }
  
           })
  
           .then((rse)=>{
            if(rse){
              totalW = rse.totalWithdrawal;
              tot = rse.totalDeposit;
              totalB = rse.totalBalance
  
              Transaction.update(
                {
                  totalDeposit: parseInt(tot) + parseInt(transferValue),
                  totalBalance: parseInt(totalB) + parseInt(transferValue),
                  
                },
                {
                  where: {
                    cusid: receiverid
                  }
                }
               )
               .then((rs)=>{
                console.log("transaction recorded")
               })
      
               .catch((err)=>{
                console.log(err)
               })
            }
           })
  
           .catch((err)=>{
            console.log(err)
           })
  
          
  
            }
          })
          // .catch((err) => {
          //   console.log(err);
          // });
        }
  
      }else{
        res.status(200).json([{message: "insufficient balance"}])
      }
  
  
      }else{
        console.log("transaction not found")
      }
  
      
  
    }else{
      res.status(200).json([{message: "Account do not exist"}])
    }
  
  
  
  }