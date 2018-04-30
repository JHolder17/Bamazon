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
        connection.query("SELECT * FROM products", function (err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + " | " + "Item: " + res[i].product_name + " | " + "Price: $" + res[i].price + ".00");
            }
            console.log("-----------------------------------");
        });
    }
    setTimeout(function () { bamazon(); }, 1000);
});

function bamazon() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var questions = [
            {
                name: "id",
                type: "input",
                message: "Please enter the ID of the item you would like to purchase.",
            },
            {
                name: "units",
                type: "input",
                message: "How many units would you like to buy?"
            }
        ];
        inquirer.prompt(questions)
            .then(function (answers) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id == answers.id) {
                        chosenItem = results[i];
                    }
                }
                if (chosenItem.stock_quantity > parseInt(answers.units)) {
                    var newQuantity = chosenItem.stock_quantity - parseInt(answers.units);
                    var cost = chosenItem.price * parseInt(answers.units);
                    console.log(cost);
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
                            console.log("Order placed!");
                            console.log("Total: $" + cost + ".00");
                        }
                    );
                }
                else {
                    console.log("Insufficient quantity!");
                }
            });
    });
}