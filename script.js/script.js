var searchHistory = [];
// loacl storage set up
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
     // Lists up to 10
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 10) {
            break;
          }
        //  Creates button out of search history https://getbootstrap.com/docs/4.0/components/list-group/
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(searchHistory[i]);
        $(".list-group").append(cityListButton);
    }
};
var city;
var mainCard = $(".card-body");
getItems();
function getData() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c26cbe6a679e58f6c5b8bce2459323e4"
    mainCard.empty();
    $("#weeklyForecast").empty();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
      //Calls date from moment api
        var date = moment().format(" dddd MMMM Do");
        // Brings in icons
        var iconCode = response.weather[0].icon;
    
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
       
        var name = $("<h3>").html(city + date);
        // Displays city name in main card
        mainCard.prepend(name);
        // Displays icon in main card
        mainCard.append($("<img>").attr("src", iconURL));
        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        mainCard.append($("<p>").html("Temperature: " + temp + " &#8457"));
        var humidity = response.main.humidity;
        mainCard.append($("<p>").html("Humidity: " + humidity));
        var windSpeed = response.wind.speed;
        mainCard.append($("<p>").html("Wind Speed: " + windSpeed));
       
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        // Calls UV index
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=c26cbe6a679e58f6c5b8bce2459323e4b&lat=" + lat + "&lon=" + lon,
            method: "GET"
        // Displays UV in main card
        }).then(function (response) {
            mainCard.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
            // 
            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c26cbe6a679e58f6c5b8bce2459323e4",
            method: "GET"
        // Displays 5 separate columns from the forecast response
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                // Creates the columns
                var newCard = $("<div>").attr("class", "col weekly bg-primary text-white rounded-lg p-2");
                $("#weeklyForecast").append(newCard);
                // Uses moment for the date
                var myDate = new Date(response.list[i * 8].dt * 1000);
                // Displays date
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));
                var iconCode = response.list[i * 8].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                // Displays the icon
                newCard.append($("<img>").attr("src", iconURL));
                var temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32);
                // Displays the temperature
                newCard.append($("<p>").html("Temp: " + temp + " &#8457"));
                var humidity = response.list[i * 8].main.humidity;
                // Displays humidity
                newCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
};
// Searches and adds to search history
$("#searchCity").click(function() {
    city = $("#city").val();
    getData();
    var checkArray = searchHistory.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(city);
        $(".list-group").append(cityListButton);
    };
});
// Creates buttons from search history
$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});