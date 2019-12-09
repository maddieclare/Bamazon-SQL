const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0923MySq$#",
  database: "bamazon"
});

connection.connect();

function Item(id, name, price) {
  this.id = id;
  this.name = name;
  this.price = price;

  this.printItemDetails = function() {
    console.log(`${this.id}: ${this.name} ($${this.price})`);
  };
}

getListOfItems();

function getListOfItems() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw error;
    // console.log(userPromptCall);

    console.log("\nCurrent items for sale:\n");
    for (let result of results) {
      let item = new Item(result.item_id, result.product_name, result.price);
      item.printItemDetails();
    }

    promptUserForId();
  });
}

function promptUserForId() {
  inquirer
    .prompt([
      {
        name: "get_id",
        message: "Please enter the ID of the item you would like to purchase:"
      }
    ])
    .then(function(response) {
      console.log(response);
    });
}
