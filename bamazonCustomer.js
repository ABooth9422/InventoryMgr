var mysql = require('mysql')
var inquirer = require('inquirer')
var chalk = require('chalk')

var startColor = chalk.whiteBright.bgGreen
var invColor=chalk.black.bgRed
const log = console.log



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

connection.connect(function (err) {
    if (err) throw err

    afterConnection();
})

function afterConnection() {
    var query = 'SELECT id,product_name,price,stock_quantity FROM products'
    
    connection.query(query, function (err, resp) {
        if (err) throw err

        var choiceArray = []
        var resultArray = []
        var priceArray = []
        var currentStock=[]

        for (let i = 0; i < resp.length; i++) {
            choiceArray.push(`ID: ${resp[i].id} || Product Name: ${resp[i].product_name} || Price: ${resp[i].price} || Quantity on Hand: ${resp[i].stock_quantity}`)
            resultArray.push(resp[i].product_name)
            priceArray.push(resp[i].price)
            currentStock.push(resp[i].stock_quantity)
        }

                    console.log('\n********************************************************')
                    console.log('Here is the following items that you can purchase:')
                    console.log(choiceArray)
                    console.log('\n********************************************************')
        inquirer
            .prompt([{
                    name: 'choices',
                    message: 'What would you like to buy? Input ID # of the item.',
                },
                {
                    name: 'itemqty',
                    message: 'How many would you like to buy?'
                }
            ]).then(function (resp, err) {
                if (err) throw err
                if (resp.choices > choiceArray.length) {
                    console.log(`\n*******************************************************`)
                    log(invColor.bold(`Sorry there is no item that exists for ID ${resp.choices}`))
                    afterConnection();
                } else if (resp.choices <= 10) {
                   // inventoryAvailable(resp.choices-1,resp.itemqty)
                    var inventory= currentStock[resp.choices-1]
                    var amount= resp.itemqty
                    if(amount>inventory){
                       log(invColor.bold("Not enough inventory available to complete this order, Try Again!"))
                    }else{

                    
                    var stock = `stock_quantity=stock_quantity-` + resp.itemqty
                    var total = priceArray[resp.choices - 1] * resp.itemqty
                    connection.query(
                        `UPDATE products SET ${stock} WHERE ?`,
                        [{
                            id: resp.choices
                        }],
                        function (err, resp) {
                            if (err) throw err;

                        }

                    )
                    log(startColor.bold(`Congratulations you have purchased ${resp.itemqty} of ${resultArray[resp.choices -1]}`))
                    log(startColor.bold(`The total for your order is: $ ${total}`))
                    log('\n')
                    }
                    inquirer
                        .prompt(
                            [{
                                name: 'again',
                                message: 'What would you like to do now?',
                                type: 'list',
                                choices:['Make Another Purchase','Manager Functions','Finished']
                            }]
                        ).then(function (resp, err) {
                            if (err) throw err

                            switch (resp.again) {
                                case 'Make Another Purchase':
                                    afterConnection();
                                    break;
                                case 'Manager Functions':
                                    managerFunction(choiceArray)
                                    break;
                                case 'Finished':
                                    connection.end();
                                    break;
                                default:
                                    break;
                            }
                          

                        })
                }
            })
            
    })


    function managerFunction(choiceArray){
        inquirer
        .prompt([
            {
                name:'managerMenu',
                message:'Manager Menu',
                type:'list',
                choices:['Item Available','View Low Inventory','Add to Inventory','Add a New Product']
            }
        ]).then(function(resp,err){
            if(err) throw err;
            switch (resp.managerMenu) {
                    case 'Item Available':
                        itemAvailable(choiceArray)
                    break;
                    case 'View Low Inventory':
                        viewLowInventory()
                    break;
                    case 'Add to Inventory':
                        addInventory()
                    break;
                    case 'Add a New Product':
                        addProduct()
                    break;
            
                default:
                    break;
            }
        })
    }





    function itemAvailable(choiceArray){
        console.log("****************************************")
        console.log("Current list of items available for sale")
        console.log(choiceArray)
        console.log("****************************************")
        managerFunction(choiceArray);
    }
    function viewLowInventory(){

    }

    function addInventory(){

    }
    function addProduct(){

    }


//    function inventoryAvailable(choices,amount){
        
//         var query=`SELECT stock_quantity FROM products WHERE id=${choices}`
//         connection.query(query,function(err,response){
//             if(err) throw err;
           
//             var inventory= response[0].stock_quantity
//             if(amount>inventory){
//                  return false
                    
//             }
           
//         })
       
//     }
}



// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.