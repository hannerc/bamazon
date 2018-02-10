const inquirer = require("inquirer");

var mysql = require('mysql');

var menu = `

	Order Form: 

	1 	iPhone
	2 	clock
	3 	wrench
	4 	light bulb
	5 	belt
	6 	hand grenade
	7 	flame thrower
	8 	Seven of Nine
	9 	Kermit the Frog
	10 	Nickleback CD 
	11 	Television
			`

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bamazon"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
  customer();

  });

function customer(){

	console.log(menu);

	inquirer.prompt([
		{
			message: "what product ID would you like to buy?",
			name: "product"
		},{
			message: "how many?",
			name: "number"
		
		}]).then(function(inquirerResponse){

		//console.log(inquirerResponse.product)

		con.query("SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?", [inquirerResponse.product],function(err, result) {
	  	if (err) throw err;
	  	
	  	console.log(result);

	  	console.log("Product name: " + result[0].product_name);
	  	console.log("Price: $" + result[0].price.toFixed(2));
	  	console.log("Number in stock: " +result[0].stock_quantity);

	  	var new_qty = result[0].stock_quantity - inquirerResponse.number;

	  	if (new_qty >= 0){

	  	var totalCost = result[0].price.toFixed(2) * inquirerResponse.number;

	  	console.log("You purchased " +inquirerResponse.number);
	  	console.log("Total cost: $"+totalCost.toFixed(2));
	  	
	  	con.query("UPDATE products SET stock_quantity = (stock_quantity - ?) WHERE item_id = ?", [inquirerResponse.number, inquirerResponse.product],function(err, res) {
	  	if (err) throw err;
	  	//console.log(res)
	  	console.log("Remaining in stock: " +new_qty);

	  	});

	  	setTimeout(customer, 3000);

	  }else{
	  	console.log("We're sorry but there aren't enough " + result[0].product_name.toString()+"'s to fulfill this order!")
	  	setTimeout(customer, 3000);
	  }
	  });
	});
	
};
 


