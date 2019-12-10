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

listManagerCommands();

function listManagerCommands() {
  inquirer
    .prompt([
      {
        name: "manager_commands",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add to inventory"
        ]
      }
    ])
    .then(function(response) {
      if (response.manager_commands === "View products for sale") {
        viewProductsForSale();
      } else if (response.manager_commands === "View low inventory") {
        viewLowInventory();
      } else if (response.manager_commands === "Add to inventory") {
        addToInventory();
      }
    });
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
  connection.end();
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
      backToMainMenu();
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
  connection.end();
}

function addToInventory() {
  inquirer
    .prompt([
      {
        name: "get_id",
        message:
          "Please enter the ID of the product you would like to add stock for:"
      }
    ])
    .then(function(response) {
      let productId = response.get_id;
      connection.query(
        "SELECT * FROM products WHERE ?",
        {
          item_id: productId
        },
        function(err, results) {
          if (err) throw error;

          let productToAdd = new Product(
            results[0].item_id,
            results[0].product_name,
            results[0].price,
            results[0].stock_quantity
          );

          productToAdd.printProductDetails();

          inquirer
            .prompt([
              {
                name: "get_quantity",
                message:
                  "Please enter the quantity of stock you would like to add for this product:"
              }
            ])
            .then(function(response) {
              let additionalStock = response.get_quantity;
              let totalStock = parseFloat(additionalStock) + productToAdd.stock;

              connection.query(
                `UPDATE products SET stock_quantity = ${totalStock} WHERE product_name = "${productToAdd.name}"`,
                function() {
                  console.log(
                    `\nStock updated for: ${productToAdd.name}. New stock quantity: ${totalStock}`
                  );
                }
              );
            });
        }
      );
      connection.end();
    });
}
