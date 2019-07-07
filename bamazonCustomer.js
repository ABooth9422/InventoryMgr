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
         
          for (let i = 0; i < resp.length; i++) {
              choiceArray.push(`ID: ${resp[i].id} Product Name: ${resp[i].product_name} Price: ${resp[i].price}`)
            
          }
          console.log(choiceArray)
        inquirer
        .prompt([
           
            {
                name:'choices',
                message:'What would you like to buy?!',
                type:'list',
                choices:choiceArray
            }
        ])
      })
  }