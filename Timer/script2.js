// The user needs to enter their name and phone number to be captured by our app for sending to emergency services.
//--The name and phone number will be open variables to vary from user to user
// 
/* global firebase */
/* global google */
/* global position */
//Document ready function
$(function() {
    // Upon page load, We show our About modal to give the user directions and to grab their location data.
    $("#aboutWindow").modal("show");




    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBYkMTioukhTliOIKHJauTsX6WVM2aUIfg",
        authDomain: "adventurebuddy-fc144.firebaseapp.com",
        databaseURL: "https://adventurebuddy-fc144.firebaseio.com",
        projectId: "adventurebuddy-fc144",
        storageBucket: "adventurebuddy-fc144.appspot.com",
        messagingSenderId: "599196361369"
    };
    firebase.initializeApp(config);

    var database = firebase.database();


    var lat = "";
    var lng = "";
    var watchID = "";

    $("#getStarted").on("click", function() {
        function getLocation() {
            if (navigator.geolocation) {
                var optn = {
                    enableHighAccuracy: true,
                    timeout: Infinity,
                    maximumAge: 5000
                };
                watchID = navigator.geolocation.watchPosition(copyPosition);
            }
            else {
                alert("Geolocation is not supported by this browser.");
            }

        }

        getLocation();


        function copyPosition(position) {
            var gLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOtn = {
                zoom: 15,
                center: gLatLng,
                mapTypeId: google.maps.MapTypeId.ROAD
            };

            var Pmap = document.getElementById("map");

            var map = new google.maps.Map(Pmap, mapOtn);

            addMarker(map, gLatLng, "Your Location: " + gLatLng, "You Are Here!");

            lat = position.coords.latitude;
            lng = position.coords.longitude;
            
            
// each time there is a new location
            var latNew = "";
            var lngNew = "";
            
//   compare it to the last one
           function comparePosition (latNew, lngNew) {
               if (latNew == lat) {
                  //temporary timer to see if user moves
               }
               if (lngNew == lng) {
                  //temporary timer to see if user moves
               }
           }

//   if they are not equal,
//          store the new position and reset time of last movement
//   else
//          if time of last movement has been over 30 min
//              start emergency timer 

    // setTimeout(function () {
    //      $("#myModal").modal('show');
    //      },1000*5);


        function addMarker(map, gLatLng, title, content) {
            var markerOptn = {
                position: gLatLng,
                map: map,
                title: title,
            };

            var marker = new google.maps.Marker(markerOptn);

            var infoWindow = new google.maps.InfoWindow({ content: content, position: gLatLng });

            google.maps.event.addListener(marker, "click", function() {
                infoWindow.open(map);
            });
        }
        $("#loginWindow").modal("show");






    $("#formSubmit").on("click", function(event) {

        event.preventDefault();
        if ($("#fullName").val() === "" || $("#phoneNumber").val() === "") {
            alert("Please enter Name and Phone to Continue.");
            return false;
        }


        var name = $("#fullName").val().trim();
        // console.log("Name: " + name);
        var phone = $("#phoneNumber").val().trim();
        // console.log("Phone: " + phone);

        database.ref().push({
            name: name,
            phone: phone,
            lat: lat,
            lng: lng,
            timeAdded: firebase.database.ServerValue.TIMESTAMP

        });

        var form = document.getElementById("inputForm");
        form.reset();
        $("#loginWindow").modal("hide");
        return false;

    });
    var s;
    var fName;
    var fPhone;
    var fLat;
    var fLng;

    database.ref().on("child_added", function(snapshot) {
        s = snapshot.val();
        fName = s.name;
        fPhone = s.phone;
        fLat = s.lat;
        fLng = s.lng;


        console.log("Name: " + fName);
        console.log("Phone: " + fPhone);
        console.log("Latitude: " + fLat);
        console.log("Longitude: " + fLng);
    });

    var URL = "https://sandbox.sendpolice.com/v1/alerts?user_key=349dff0af7377e573e305ce9a890cb22";
    // var body = {
    //     name: fName,
    //     phone: fPhone,
    //     pin: "1234",
    //     location: {
    //         lat: fLat,
    //         lon: fLng,
    //         accuracy: 5
    //     }
    // };
    var body = {
        name: "shaun",
        phone: "555-555-5555",
        pin: "1234",
        location: {
            lat: 34.0909090,
            lon: -85.0090909,
            accuracy: 5
        }
    };
    console.log("test");
    $.ajax({
        type: "POST",
        url: URL,
        data: body,
        success: function(response) {
            console.log(response);
        },
        error: function() {
            console.log("error");
        }
    });



});   // document ready function end