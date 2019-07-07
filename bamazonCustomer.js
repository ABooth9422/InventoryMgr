var mysql=require('mysql')
var inquirer=require('inquirer')

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Wow0148407!",
    database: "bamazon"
  });

  connection.connect(function(err){
      if (err) throw err
      
      afterConnection();
  })

  function afterConnection(){
      var query='SELECT id,product_name,price,stock_quantity FROM products'
      connection.query(query,function(err,resp){
          if (err) throw err
          
          var choiceArray=[]
          var resultArray=[]
          var priceArray=[]
         
          for (let i = 0; i < resp.length; i++) {
              choiceArray.push(`ID: ${resp[i].id} || Product Name: ${resp[i].product_name} || Price: ${resp[i].price} || Quantity on Hand: ${resp[i].stock_quantity}`)
              resultArray.push(resp[i].product_name)
              priceArray.push(resp[i].price)
          }
          console.log('Here is the following items:')
          console.log('\n**************************')
          console.log(choiceArray)
          console.log('\n**************************')
        inquirer
        .prompt([
           
            {
                name:'choices',
                message:'What would you like to buy? Input ID # of the item.',
                
                
            },
            {
                name:'itemqty',
                message:'How many would you like to buy?'
            }
        ]).then(function(resp,err){
            if (err) throw err
            if(resp.choices>10){
                console.log(`Sorry there is no item that exists for ID ${resp.choices}`)
                afterConnection();
            }else
            console.log(resp.choices)
            var stock=`stock_quantity=stock_quantity-`+resp.itemqty
            var total=priceArray[resp.choices-1]*resp.itemqty
            connection.query(
                `UPDATE products SET ${stock} WHERE ?`,
                [
                    {
                        id:resp.choices
                    }
                ],function(err,resp){
                    if(err) throw err;
                 
                }

                )
                console.log(`Congratulations you have purchased ${resp.itemqty} of ${resultArray[resp.choices -1]}`) 
                console.log(`Your total for this order is ${total}`)
                console.log('\n')
                inquirer
                .prompt(
                    [
                        {
                            name:'again',
                            message:'Would you like to make another purchase?',
                            type:'confirm'
                        }
                    ]
                ).then(function(resp,err){
                    if (err) throw err
                    if(resp.again){
                        afterConnection();
                    }else
                    connection.end();
                })
        })
      })
  }