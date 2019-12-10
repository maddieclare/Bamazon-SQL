const connection = require("./connection");
const inquirer = require("inquirer");

connection.connect();

function Product(id, name, price, stock) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.stock = stock;

  this.printProductDetails = function() {
    console.log(`\nProduct id: ${this.id}`);
    console.log(`Description: ${this.name}`);
    console.log(`Cost per unit: $${this.price}`);
    console.log(`Current stock: ${this.stock}`);
  };
}

function viewProductsForSale() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw error;
    console.log("\nViewing all items currently for sale:");
    for (let result of results) {
      let product = new Product(
        result.item_id,
        result.product_name,
        result.price,
        result.stock_quantity
      );
      product.printProductDetails();
    }
  });
}

function viewLowInventory() {
  console.log("\nViewing products with stock of 5 or lower:");
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(
    err,
    results
  ) {
    if (err) throw error;

    if (results.length === 0) {
      console.log("\nNo results found.");
    } else {
      for (let result of results) {
        let product = new Product(
          result.item_id,
          result.product_name,
          result.price,
          result.stock_quantity
        );
        product.printProductDetails();
      }
    }
  });
}
