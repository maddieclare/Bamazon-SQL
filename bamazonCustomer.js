const connection = require("./connection");
const inquirer = require("inquirer");

connection.connect();

getListOfItems();

function Item(id, name, price, stock) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.stock = stock;

  this.printItemDetails = function() {
    console.log(`${this.id}: ${this.name} ($${this.price}) (${stock} in stock)`);
  };
}

function getListOfItems() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw error;
    console.log("\nCurrent items for sale:\n");
    for (let result of results) {
      let item = new Item(result.item_id, result.product_name, result.price, result.stock_quantity);
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

  if (newQuantity < 0) {
    console.log(
      `\nError: We do not have enough of this item in stock to complete your request (current stock is ${stock}). Please try again.`
    );
    console.log("\nReloading stock list...");
    setTimeout(function() {
      getListOfItems();
    }, 2000);
  } else {
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
              `\nYour purchase details: x${quantity} ${item} for a total of $${totalCost}.`
            );
            console.log("\nReloading stock list...");
            setTimeout(function() {
              getListOfItems();
            }, 2000);
          }
        );
      }
    );
  }
}
