/**
 * Created by chaika on 02.02.16.
 */
var fs = require('fs');
var ejs = require('ejs');


exports.PizzaMenu_OneItem = ejs.compile(fs.readFileSync('./Frontend/templates/PizzaMenu_OneItem.ejs', "utf8"));

exports.PizzaCart_OneItem = ejs.compile(fs.readFileSync('./Frontend/templates/PizzaCart_OneItem.ejs', "utf8"));

exports.PizzaCart_EmptyText = ejs.compile(fs.readFileSync('./Frontend/templates/PizzaCart_EmptyText.ejs', "utf8"));

exports.PizzaCart_OneItemOrder = ejs.compile(fs.readFileSync('./Frontend/templates/PizzaCart_OneItemOrder.ejs', "utf8"));