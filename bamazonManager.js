var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "jkl;'",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("Error connecting: " + err.stack);
        return;
    } else {
        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    name: 'options',
                    message: 'What do you want to do?',
                    choices: [
                        "View Products for Sale",
                        "View Low Inventory",
                        "Add to Inventory",
                        "Add New Product"
                    ]
                }
            ])
            .then(function (answers) {
                switch (answers.options) {
                    case "View Products for Sale":
                        connection.query("SELECT * FROM products", function (err, res) {
                            if (err) throw err;
                            for (var i = 0; i < res.length; i++) {
                                console.log("ID: " + res[i].id + " | " + "Item: " + res[i].product_name + " | " + "Price: $" + res[i].price + ".00" + " | " + "Quantity: " + res[i].stock_quantity);
                            }
                            console.log("-----------------------------------");
                        });
                        break;
                    case "View Low Inventory":
                        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
                            if (err) throw err;
                            for (var i = 0; i < res.length; i++) {
                                console.log("ID: " + res[i].id + " | " + "Item: " + res[i].product_name + " | " + "Price: $" + res[i].price + ".00" + " | " + "Quantity: " + res[i].stock_quantity);
                            }
                            console.log("-----------------------------------");
                        });
                        break;
                    case "Add to Inventory":
                        connection.query("SELECT * FROM products", function (err, res) {
                            if (err) throw err;
                            for (var i = 0; i < res.length; i++) {
                                console.log("ID: " + res[i].id + " | " + "Item: " + res[i].product_name + " | " + "Price: $" + res[i].price + ".00" + " | " + "Quantity: " + res[i].stock_quantity);
                            }
                            console.log("-----------------------------------");
                            var questions = [
                                {
                                    name: "id",
                                    type: "input",
                                    message: "Please enter the ID of the item you would like to restock.",
                                },
                                {
                                    name: "units",
                                    type: "input",
                                    message: "How many units would you like to add?"
                                }
                            ];
                            inquirer.prompt(questions)
                                .then(function (answers) {
                                    var chosenItem;
                                    for (var i = 0; i < res.length; i++) {
                                        if (res[i].id == answers.id) {
                                            chosenItem = res[i];
                                        }
                                    };
                                    var newQuantity = chosenItem.stock_quantity + parseInt(answers.units);
                                    connection.query("UPDATE products SET ? WHERE ?",
                                        [
                                            {
                                                stock_quantity: newQuantity
                                            },
                                            {
                                                id: chosenItem.id
                                            }
                                        ],
                                        function (error) {
                                            if (error) throw err;
                                            console.log("Inventory updated!");
                                            console.log("New Inventory:" + newQuantity);
                                        }
                                    );
                                });
                        });
                        break;
                    case "Add New Product":
                        var questions = [
                            {
                                type: 'input',
                                name: 'product',
                                message: "Please enter the product."
                            },
                            {
                                type: 'input',
                                name: 'department',
                                message: "Please enter the department.",
                            },
                            {
                                type: 'input',
                                name: 'price',
                                message: "Please enter the price.",
                            },
                            {
                                type: 'input',
                                name: 'quantity',
                                message: "Please enter the quantity.",
                            }
                        ];
                        inquirer.prompt(questions)
                            .then(function (answers) {
                                connection.query("INSERT INTO products SET ?",
                                    {
                                        product_name: answers.product,
                                        department_name: answers.department,
                                        price: answers.price,
                                        stock_quantity: answers.quantity
                                    },
                                    function (error, res) {
                                        if (error) throw err;
                                        console.log("Inventory updated!"); ;
                                    }
                                )
                            });
                        break;
                }
            });
    };
});