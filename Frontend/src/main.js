/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');
    var $inputPhone = $("#inputPhone");
    var $inputName = $("#inputName");
    var $inputAddress = $("#inputAdress");
    var validPhone = false;
    var validName = false;
    var validAddress = false;
    $inputPhone.on("input", function () {
        var phoneStr = $inputPhone.val();
        if(phoneStr.match(/^0\d{9}$/) || phoneStr.match(/^\+380\d{9}$/)) {
            $(".phone-help-block").prop('style', 'display:none');
            $inputPhone.parent().removeClass('has-error');
            $inputPhone.parent().addClass('has-success');
            validPhone = true;
        } else {
            $(".phone-help-block").prop('style', '')
            $inputPhone.parent().removeClass('has-success');
            $inputPhone.parent().addClass('has-error');
        }
    });
    $inputName.on("input", function () {
        if(($inputName.val().match(/^[A-ZА-ЯЄІЇ][a-zа-яєїі']* [A-ZА-ЯЄІЇ][a-zа-яєїі']*$/u))) {
            $(".name-help-block").prop('style', 'display:none');
            $inputName.parent().removeClass('has-error');
            $inputName.parent().addClass('has-success');
            validName = true;
        } else {
            $(".name-help-block").prop('style', '')
            $inputName.parent().removeClass('has-success');
            $inputName.parent().addClass('has-error');
        }
    });
    $inputAddress.on("input", function () {
        if($inputAddress.val().trim() != "") {
            $(".address-help-block").prop('style', 'display:none');
            $inputAddress.parent().removeClass('has-error');
            $inputAddress.parent().addClass('has-success');
            validAddress = true;
        } else {
            $(".address-help-block").prop('style', '');
            $inputAddress.parent().removeClass('has-success');
            $inputAddress.parent().addClass('has-error');
        }
    });

    $(".next-btn").click(function () {
        if (validName && validPhone && validAddress) {
            PizzaCart.createOrder(function (err, data) {
                if (err) {
                    alert("Can't create order");
                } else {
                    alert("You ordered " + data.pizza + "pizzas successfully");
                }
            });
        } else {
            alert("Can't create order, input valid information");
        }
    });
    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();


});