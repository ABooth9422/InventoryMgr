//what we are requiring from our npm dependancies

var mysql = require('mysql')
var inquirer = require('inquirer')
var chalk = require('chalk')
var tableUpdate=[]

//created some variables for chalk display

var startColor = chalk.whiteBright.bgGreen
var invColor = chalk.whiteBright.bgRed
const log = console.log


//started our connection to the mySQL database
var connection = mysql.createConnection({
    host: "localhost",


    port: 3306,


    user: "root",


    password: "Wow0148407!",
    database: "bamazon"
});
//call on our connection object and perform the connect function
connection.connect(function (err) {
    if (err) throw err
    // execute the afterConnection() function after we establish a connection
    afterConnection();
})

function afterConnection() {

    //query parameters for what we want to select from our SQL table
    var query = 'SELECT id,product_name,price,stock_quantity,department_name FROM products'
    //establishing the query
    connection.query(query, function (err, resp) {
        if (err) throw err
        //using various arrays from the initial query to use at other points in the code
        var choiceArray = []
        var resultArray = []
        var priceArray = []
        var currentStock = []
        //need a for loop to be able to go through all of the responses
        for (let i = 0; i < resp.length; i++) {
            choiceArray.push(`ID: ${resp[i].id} || Product Name: ${resp[i].product_name} || Rarity: ${resp[i].department_name} || Price: ${resp[i].price.toFixed(2)} || Quantity on Hand: ${resp[i].stock_quantity}`)
            resultArray.push(resp[i].product_name)
            priceArray.push(resp[i].price)
            currentStock.push(resp[i].stock_quantity)
        }
        // initial display when the program is executed
        console.log('\n********************************************************')
        console.log('Here is the following items that you can purchase:')
        console.log(choiceArray)
        console.log('\n********************************************************')
        //the two basic commands required in the initial program from inquirer
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
                // with the response of inquirer we execute a block of code to make a purchase
                if (err) throw err
                //we are checking to see if the user input an id that does not exist
                // if the id does not exist it returns to the top of the function
                if (resp.choices > choiceArray.length) {
                    console.log(`\n*******************************************************`)
                    log(invColor.bold(`Sorry there is no item that exists for ID ${resp.choices}`))
                    afterConnection();
                } else if (resp.choices <= choiceArray.length) {
                    //if the id that they selected is less than or equal to the length that we put into our choice array we run the code below
                    var inventory = currentStock[resp.choices - 1]
                    var amount = resp.itemqty
                    //made a conditional if the amount that the user wanted to buy is greater than what inventory we have available we block it from proceeding
                    if (amount > inventory) {
                        log(invColor.bold("Not enough inventory available to complete this order, Try Again!"))
                    } else {

                        //we have to use some trickery pre query to put into the next query where we are subtracting values from our table
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
                        //logging the results of the purchase and the amount with literals! They are a life saver for this project
                        log(startColor.bold(`Congratulations you have purchased ${resp.itemqty} of ${resultArray[resp.choices -1]}`))
                        log(startColor.bold(`The total for your order is: $ ${total}`))
                        log('\n')
                    }
                    //after the initial purchase is made we prompt for what they want to do next.
                    //if they want to make another purchase , go to a manager menu, or if they want to exit the program
                    inquirer
                        .prompt(
                            [{
                                name: 'again',
                                message: 'What would you like to do now?',
                                type: 'list',
                                choices: ['Make Another Purchase', 'Manager Functions', 'Finished']
                            }]
                        ).then(function (resp, err) {
                            if (err) throw err
                            //made a switch case to help us with the next menu and what we are trying to do.
                         
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


    function managerFunction(choiceArray) {
        //made a manager function for the second part of the challenge that prompts users into making additional querys
        
        inquirer
            .prompt([
                //put a password on there for a manager just for fun
                {
                    name: 'password',
                    type: 'password',
                    message: 'What is the Manager Password?',
                    mask: '*'
                }
            ]).then(function (resp, err) {
                var inPassword = resp.password
                if (err) throw err
                if (inPassword !== '1234') {
                    log(invColor.bold("ACCESS DENIED PLEASE TRY AGAIN"))
                    managerFunction(choiceArray);
                } else {
                    log(startColor.bold('ACCESS GRANTED'))
                    inquirer.prompt([
                        {
                            //manager menu has additional functions that were listed as part 2
                            name: 'managerMenu',
                            message: 'Manager Menu',
                            type: 'list',
                            choices: ['Item Available', 'View Low Inventory', 'Add to Inventory', 'Add a New Product', 'Main Menu', 'Exit']
                        }
                    ]).then(function (resp, err) {
                        if (err) throw err;
                        //made a switch statement to help us navigate from the choices of the manager menu and execute the proper function
                        //to that option.
                        updateArray(function(){        
                        switch (resp.managerMenu) {
                            case 'Item Available':
                                itemAvailable(tableUpdate)
                                break;
                            case 'View Low Inventory':
                                viewLowInventory(tableUpdate)
                                break;
                            case 'Add to Inventory':
                                addInventory(tableUpdate)
                                break;
                            case 'Add a New Product':
                                addProduct(tableUpdate)
                                break;
                            case 'Main Menu':
                                afterConnection();
                                break;
                            case 'Exit':
                                connection.end()
                                break;


                            default:
                                break;
                        }
                        });
                    })
                }
            })
    }




    function itemAvailable(tableUpdate) {
        //redisplaying all items available for sale
       
        console.log("****************************************")
        console.log("Current list of items available for sale")
        console.log(tableUpdate)
        console.log("****************************************")
        //executing a call back to put users back in the manager function menu upon the request being completed
        managerFunction(tableUpdate);
    }

    function viewLowInventory() {
        //wrote a block for inventory thats less than 10
        var query = `SELECT *FROM products WHERE stock_quantity<10`
        connection.query(query, function (err, resp) {
            console.log('**********************************************')
            console.log('************Inventory Less Than 10************')
            if (err) throw err;
            for (let i = 0; i < resp.length; i++) {
                //looping through the responses to log all the information for the propery quantities that were a result of the query.
                console.log(`ID: ${resp[i].id} || Product Name: ${resp[i].product_name} || Price: ${resp[i].price.toFixed(2)} || Quantity on Hand: ${resp[i].stock_quantity}`)
                console.log('\n')
            }
            //calling back the manager function menu
            managerFunction(tableUpdate);
        })

    }

    function addProduct() {

        //function added to if they wanted to add an entire product
        inquirer.
        prompt([{
                name: 'productName',
                message: 'What is the name of the product you want to add?'
            },
            {
                name: 'deptName',
                message: 'What is the rarity of the item?'
            },
            {
                name: 'price',
                message: 'How much does it cost?'
            },
            {
                name: 'quantity',
                message: 'How many are available for sale?'
            }
        ]).then(function (inqResp, err) {

            if (err) throw err;
            //object query based on response that we insert into the table
            connection.query("INSERT INTO products SET ?", {
                    product_name: inqResp.productName,
                    department_name: inqResp.deptName,
                    price: inqResp.price,
                    stock_quantity: inqResp.quantity
                },

                function (err, resp) {
                    //letting the user know the product has been added
                   log(startColor.bold("*****************Your Product Has Been Added***********************"))
                    if (err) throw err;
                    // executing the callback for the manager menu
                    managerFunction(tableUpdate);
                })

        })
    }

    function addInventory(tableUpdate) {
        //displaying the results of the choice array so that the user can see which item they want to add
        console.log('**************************************************')
        console.log(tableUpdate)
        console.log('**What item do you want to add to the inventory?**')
        console.log('************Select item by ID ********************')
        //using inquirer to get the responses of how many of the item they want to add
        inquirer.prompt([{
                name: 'selection',
                message: 'Provide The ID for the item you want to add'
            },
            {
                name: 'qtyAdd',
                message: 'How many would you like to add?'
            }
        ]).then(function (resp, err) {
            //created a variable to hold the query parameters to make it cleaner
            var stockAdd = `stock_quantity=stock_quantity+` + resp.qtyAdd
            var query = `UPDATE products SET ${stockAdd} WHERE ?`
            connection.query(query,
                [{
                    id: resp.selection
                }],
                function (err, resp) {
                    if (err) throw err;
                    console.log('*********************Product Updated************************')
                    // executing a callback from the manager function menu
                    managerFunction(tableUpdate);
                })
        })
    }

}

function updateArray(callback){
    var query = 'SELECT id,product_name,price,stock_quantity,department_name FROM products'
    connection.query(query, function (err, resp) {
        if (err) throw err
            tableUpdate=[]
        
        for (let i = 0; i < resp.length; i++) {
            tableUpdate.push(`ID: ${resp[i].id} || Product Name: ${resp[i].product_name} || Rarity: ${resp[i].department_name} || Price: ${resp[i].price.toFixed(2)} || Quantity on Hand: ${resp[i].stock_quantity}`)
           
        }
        callback();
       
})
   
}


