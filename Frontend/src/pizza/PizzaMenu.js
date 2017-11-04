/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $pizza_name = $("#name");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".btn-buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
            return false;
        });
        $node.find(".btn-buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
            return false;
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}


function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var c = 0;

    Pizza_List.forEach(function (pizza) {
        if (pizza.type === filter) {
            pizza_shown.push(pizza);
            c++;
        } else if (filter === "all") {
            pizza_shown.push(pizza);
            c++;
        } else if (String(filter) == pizza.content.pineapple) {
            pizza_shown.push(pizza);
            c++;
        } else if (String(filter) == pizza.content.mushroom) {
            pizza_shown.push(pizza);
            c++;
        }

        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    $(".pizza-count").text(c);


}

function allNotActive() {
    $("#filter-button-all-pizza").removeClass("active");
    $("#filter-button-meat").removeClass("active");
    $("#filter-button-pineapples").removeClass("active");
    $("#filter-button-mushrooms").removeClass("active");
    $("#filter-button-ocean").removeClass("active");
    $("#filter-button-tomato").removeClass("active");
}

$("#filter-button-all-pizza").click(function () {
    allNotActive();
    $pizza_name.text("Усі піци");
    filterPizza("all");
    $("#filter-button-all-pizza").addClass("active");
});

$("#filter-button-meat").click(function () {
    allNotActive();
    $pizza_name.text("М'ясні піци");
    filterPizza('М’ясна піца');
    $("#filter-button-meat").addClass("active");
});

$("#filter-button-pineapples").click(function () {
    allNotActive();
    $pizza_name.text("Піци з ананасами");
    filterPizza('ананаси');
    $("#filter-button-pineapples").addClass("active");
});

$("#filter-button-mushrooms").click(function () {
    allNotActive();
    $pizza_name.text("Піци з грибами");
    filterPizza('шампінйони');
    $("#filter-button-mushrooms").addClass("active");
});

$("#filter-button-ocean").click(function () {
    allNotActive();
    $pizza_name.text("Піци з морепродуктами");
    filterPizza('Морська піца');
    $("#filter-button-ocean").addClass("active");
});

$("#filter-button-tomato").click(function () {
    allNotActive();
    $pizza_name.text("Вегетаріанські піци");
    filterPizza('Вега піца');
    $("#filter-button-tomato").addClass("active");
});


function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;