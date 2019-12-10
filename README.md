# BAMAZON APP

## Overview

This app shows the user information about the connected SQL database and allows some values to be updated via the CLI.

The app currently has two levels: customer and manager.

  * Customers can view current items stocked and make purchases using the command line. The product database will automatically update stock quantities based on the amount of items purchased by the customer.

  * Managers can view full details of all stocked items including description, price per unit, ID and quantity. Managers can check for items with a stock quantity of 5 units or less, and can also add new stock via the command line.

## Link to video demo:
https://drive.google.com/open?id=1sPZV0v08S6CAJjCyUWs-F1a5wZFjAPsr

### Link to GitHub repo
https://github.com/maddieclare/bamazon

## Technologies used
  * SQL
  * Node.js, including the following packages:
    ** Inquirer (**https://www.npmjs.com/package/inquirer**)
    ** MySQL (**https://www.npmjs.com/package/mysql**)
