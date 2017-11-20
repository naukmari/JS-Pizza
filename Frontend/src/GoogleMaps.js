// Created by Mariia Zavertailo

var pizzacart = require('./pizza/PizzaCart');
var $inputAddress = $("#inputAdress");
function geocodeLatLng(latlng, callback) {
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            callback(null, adress);
        } else {
            callback(new Error("Can't	find	address"));
        }
    });
}

exports.geocodeLatLng = geocodeLatLng;

function calculateRoute(A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];
            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Can't	find direction"));
        }
    });
}


function displayRoute(A_latlng, B_latlng, directionsDisplay) {
    var directionService =	new	google.maps.DirectionsService();
    var start = A_latlng;
    var end = B_latlng;
    directionService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            // window.alert('Directions request failed due to ' + status);
        }
    });
}

function	geocodeAddress(address,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK && results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new	Error("Can	not	find	the	adress"));
        }
    });
}

function initialize() {
//Тут починаємо працювати з картою
    var MainOffice = new google.maps.LatLng(50.464379, 30.519131);
    var mapProp = {
        center: MainOffice,
        zoom: 16
    };
    var html_element = document.getElementById("googleMaps");
    var map = new google.maps.Map(html_element, mapProp);
    var MainOffice_marker = new google.maps.Marker({
        position: MainOffice,
        map: map,
        icon: "assets/images/map-icon.png"
    });
    var marker = null;
    var directions = new google.maps.DirectionsRenderer;
    directions.setMap(map);
    directions.setOptions( { suppressMarkers: true } );

    google.maps.event.addListener(map, 'click', function (me) {
            var coordinates = me.latLng;
//coordinates	- такий самий об’єкт як створений new google.maps.LatLng(...)
            if (marker) {
                marker.setMap(null);
                marker = null;
            }
            marker = new google.maps.Marker({
                position: coordinates,
//map	- це змінна карти створена за допомогою new google.maps.Map(...)
                map: map,
                icon: "assets/images/home-icon.png"
            });

            geocodeLatLng(coordinates, function (err, address) {
                if (err) {
                    $("#GoogleAdr").text("невідома")
                    window.validAddress = false;
                    $("#inputAdress").val(address);

                } else {
                    window.validAddress = true;

                    $("#inputAdress").val(address);
                    $(".address-help-block").prop('style', 'display:none');

                    $inputAddress.parent().removeClass('has-error');
                    $inputAddress.parent().addClass('has-success');
                    $("#GoogleAdr").text(address);
                    calculateRoute(MainOffice, coordinates, function (err, data) {
                        if (!err) {
                            $("#GoogleTime").text(data.duration.text);
                            window.validAddress = true;

                        } else {
                            $("#GoogleAdr").text("невідома")
                            window.validAddress = false;
                            $("#GoogleTime").text("невідомий");



                        }
                    });
                }
            })
        displayRoute(MainOffice,coordinates, directions);

    });
    $("#inputAdress").on("input", function(){
        var new_addr = $("#inputAdress").val();
        $("#GoogleAdr").text(new_addr);
        geocodeAddress(String(new_addr), function (err, coordinates) {
            if(!err) {
                if (marker) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });

                calculateRoute(MainOffice, coordinates, function (err, time) {
                    if (!err) {
                            $("#GoogleTime").text(time.duration.text);
                        window.validAddress = true;
                        $(".address-help-block").prop('style', 'display:none');
                        $inputAddress.parent().removeClass('has-error');
                        $inputAddress.parent().addClass('has-success');


                    } else {
                        $("#GoogleTime").text("невідомий");
                        $("#GoogleAdr").text("невідома")

                        console.log("Немає адреси")
                        window.validAddress = false;
                        $(".address-help-block").prop('style', '');
                        $inputAddress.parent().removeClass('has-success');
                        $inputAddress.parent().addClass('has-error');

                    }
                });

                displayRoute(MainOffice, coordinates, directions);
            } else {
                $("#GoogleTime").text("невідомий");
                $("#GoogleAdr").text("невідома")

                window.validAddress = false;
                $(".address-help-block").prop('style', '');
                $inputAddress.parent().removeClass('has-success');
                $inputAddress.parent().addClass('has-error');
            }
        });
    });
//Карта створена і показана
}


//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);
