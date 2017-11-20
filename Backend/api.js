/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var crypto	=	require('crypto');
function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}
function	base64(str)	 {
    return	new	Buffer(str).toString('base64');
}
var LIQPAY_PUBLIC_KEY = "i1965565064";
var LIQPAY_PRIVATE_KEY = "efq38PjFy3bEIThRxLxwj4PhQwa3lKouc5VQI0CA";
exports.getPizzaList = function (req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function (req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.total,
        currency: "UAH",
    description: order_info.name + " Замовлення:" + JSON.stringify(order_info.order)+ "\n Адреса доставки:" + order_info.address + "\n Телефон: " +
        order_info.phone + " До сплати: " + order_info.total + " грн",
        order_id: Math.random(),
//!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

    res.send({
        success: true,
        pizza: order_info.order.length,
        name: order_info.name,
        phone: order_info.phone,
        address: order_info.address,
        data: data,
        signature: signature
    });
};