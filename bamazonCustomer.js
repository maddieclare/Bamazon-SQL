const connection = require("./connection");
const inquirer = require("inquirer");

connection.connect();

getListOfItems();

function Item(id, name, price) {
  this.id = id;
  this.name = name;
  this.price = price;

  this.printItemDetails = function() {
    console.log(`${this.id}: ${this.name} ($${this.price})`);
  };
}

function getListOfItems() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw error;
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
      let itemId = response.get_id;
      pullItemFromDatabase(itemId);
    });
}

function pullItemFromDatabase(id) {
  connection.query("SELECT * FROM products WHERE ?", { item_id: id }, function(
    err,
    results
  ) {
    if (err) throw error;
    let itemToPurchase = results[0].product_name;
    let stockQuantity = results[0].stock_quantity;
    console.log(`\nYou have selected: ${itemToPurchase}.`);
    promptForItemQuantity(itemToPurchase, stockQuantity);
  });
}

function promptForItemQuantity(item, stock) {
  inquirer
    .prompt([
      {
        name: "get_quantity",
        message: "How many of this item would you like to purchase?"
      }
    ])
    .then(function(response) {
      let purchaseQuantity = response.get_quantity;
      console.log(purchaseQuantity);
      removePurchasedItemsFromDatabase(item, stock, purchaseQuantity);
    });
}

function removePurchasedItemsFromDatabase(item, stock, quantity) {
  let newQuantity = stock - quantity;
  connection.query(
    `UPDATE products SET stock_quantity = ${newQuantity} WHERE product_name = "${item}"`,
    function() {
      connection.query(
        "SELECT * FROM products WHERE ?",
        { product_name: item },
        function(err, response) {
          if (err) throw error;
          let itemCost = response[0].price;
          let totalCost = itemCost * quantity;

          console.log(
            `Your purchase details: x${quantity} ${item} for a total of $${totalCost}.`
          );
          inquirer
          .prompt([
            {
              name: "restart_app",
              message: "Would you like to continue shopping? (y/n)"
            }
          ])
          .then(function(response) {
            if (response.restart_app === "y") {
              getListOfItems();
            } else {
              return console.log("Thank you for your purchase! Have a nice day.");
            }
          });
        }
      );
    }
  );
}
