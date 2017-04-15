//dependencies
const mysql = require("mysql")
	, inquirer = require("inquirer");

//use a connection pool since multiple query's will be made inside of each other
const pool = mysql.createPool(
{
	connectionLimit: 5,
	host: "localhost",
	user: "root",
	password: "your-password",
	database: "bamazon_DB"
});


function ShowItems()
{
	//use a connection from the pool
	pool.getConnection(function(error, connection)
	{
		if (error)
		{
			throw error;
		}

		connection.query("SELECT item_id, product_name, price FROM products;", function(error, data, fields)
		{
			if (error)
			{
				throw error;
			}

			console.log("=-=-=-=-=-=-= Welcome to Bamazon! =-=-=-=-=-=-=");
			//go through each element in the array of items
			for (var i = 0; i < data.length; i++)
			{
				//display the id#, name, and price of each item in the database
				console.log("id#:" + data[i].item_id + 
				"  " + data[i].product_name +
				" $" + data[i].price);
			}
			//Get choices from user
			PickItem(data);
		});
		//put the connection back in the pool
		connection.release();
	});
}

function PickItem(items)
{
	//store ids and names of all items in an array to use in inquirer prompt
	var itemNames = [];
	for (var i = 0; i < items.length; i++)
		itemNames.push(items[i].product_name + " id#:" + items[i].item_id);

	//Get input from user
	inquirer.prompt([
	{
		type: "list",
		message: "Please choose the product you would like to purchase.",
		choices: itemNames,
		name: "itemChoice"
	},
	{
		type: "input",
		message: "Please enter how many you would like to purchase.",
		name: "quantity"
	}]).then(function(choices)
	{	
		var quantity = parseInt(choices.quantity);

		//check user input validity
		if (isNaN(quantity))
		{
			console.log("Sorry, the quantity you entered was not a number. Please try again.");
			//close the pool
			pool.end(function(error)
			{
				if (error)
				{
					throw error;
				}
			});
		}
		else if (quantity < 1)
		{
			console.log("Sorry, you can't buy 0 or a negative amount of items.");
			//close the pool
			pool.end(function(error)
			{
				if (error)
				{
					throw error;
				}
			});
		}
		else	
		{
			//process the purchase
			ProcessPurchase(choices, items);
		}
	});
}

function ProcessPurchase(userChoices, allItemInfo)
{
	//pull the id from userChoices
	var itemID = userChoices.itemChoice.split(':')[1];

	pool.getConnection(function(error, connection)
	{
		if (error)
		{
			throw error;
		}

		connection.query("SELECT * FROM products WHERE item_id = ?", [itemID], function(error, data, fields)
		{
			if (error)
			{
				throw error;
			}
			//remove decimals if there were any. 
			var quantity = parseInt(userChoices.quantity);

			//if there's enough in stock
			if (data[0].stock_quantity >= quantity)
			{
				var stockRemaining = data[0].stock_quantity - quantity;

				//update sql database to show changes
				UpdateQuantity(itemID, stockRemaining); 
				//print total
				var thisSale = data[0].price * quantity;
				console.log("Your total is: $" + thisSale);

				//allow time for transaction to complete, then close the pool.
				setTimeout(function()
				{
					pool.end(function(error)
					{
						if (error)
						{
							throw error;
						}
					});
				}, 1000);
			}
			else //not enough in stock
			{
				console.log("Out of stock.");

				//close the pool
				pool.end(function(error)
				{
					if (error)
					{
						throw error;
					}
				});
			}
		});
		connection.release();
	});
}

function UpdateQuantity(itemID, quantityRemaining)
{
	pool.getConnection(function(error, connection)
	{
		if (error)
		{
			throw error;
		}

		connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantityRemaining, itemID], function(error, data, fields)
		{
			if (error)
			{
				throw error;
			}
		});
		connection.release();
	});
}

//execute this function
ShowItems();





















