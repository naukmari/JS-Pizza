/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage	= require('./Storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна, в якій зберігається перелік піц у кошику
var Cart = [];
var empty = false;

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
if (Cart.length === 0) {
    var html_code = Templates.PizzaCart_EmptyText();
    var $node = $(html_code);
    $cart.prepend($node);
}

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var was_choosen = false;
    empty = false;
    Cart.forEach(function (object) {
        if (pizza === object.pizza && size === object.size) {
            was_choosen = true;
            object.quantity += 1;
        }
    });
    if (!was_choosen) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            sum: 0,
            order: 1
        });
    }
    $("#is_order").prop("disabled", false);
    $(".sum").text("Сума замовлення");


    //Оновити вміст кошика на сторінці
    updateCart();
}


function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var ind = findIndex(cart_item.pizza, cart_item.size);
    Cart.splice(ind, 1);

    //Після видалення оновити відображення

    updateOrderCount();
    updateCart();
}

function findIndex(pizza, size){
    var i;
    for(i = 0; i < Cart.length; i++){
        if(Cart[i].pizza === pizza && Cart[i].size === size) {
            return i;
        }
    }
    return -1;
}


function initialiseCart() {

    //Фукнція віпрацьвуватиме при завантаженні сторінки
    var saved_cart = Storage.read("cart");
    if (saved_cart) {
        Cart = saved_cart;
    }
    if (Cart.length === 0) {
        updateEmpty();
    } else {
        $("#is_order").prop("disabled", false);
        $(".sum").text("Сума замовлення");
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    Storage.write("cart", Cart);
    //Очищаємо старі піци в кошику
    $cart.html("");
    addText();
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        calculatePrice(cart_item);

        $node.find(".btn-plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".btn-minus").click(function(){
            //Зменшуємо кількість замовлених піц
                cart_item.quantity -= 1;
            if (cart_item.quantity == 0) {
                removeFromCart(cart_item);
                if (Cart.length === 0) {
                    empty = true;
                    updateEmpty();
                }
                updateOrderCount();

            }

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".btn-remove").click(function(){
            removeFromCart(cart_item);
            if (Cart.length === 0) {
                $("#is_order").prop("disabled", true);
                $(".order-number").text(0);
                $(".sum-value").text("");
                $(".sum").text("");
            }

        });
        $cart.append($node);

        updateOrderCount();
    }

    Cart.forEach(showOnePizzaInCart);

}

function updatePrice(){
    var sum=0;
    Cart.forEach(function (obj) {
        sum+=obj.sum;
    });
    $(".sum-value").text(sum.toString() + " грн");
}

function updateOrderCount() {
    var order=0;
    Cart.forEach(function (obj) {
        order+=obj.order;
    });
    $(".order-number").text(order);
}
function calculatePrice(cart_item){
    cart_item.sum=cart_item.pizza[cart_item.size].price*cart_item.quantity;
    updatePrice();
}

$(".clear-order").click(function(){
    Cart = [];
    empty = true;
    updateCart();
    updateEmpty();
});

function updateEmpty() {
    if (empty) {
        $("#is_order").prop("disabled", true);
        $(".order-number").text(0);
        $(".sum-value").text("");
        $(".sum").text("");

    }
}

function addText() {
    if(Cart.length==0) {
        var html_code = Templates.PizzaCart_EmptyText();
        var $node = $(html_code);
        $cart.prepend($node);
    }
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;