function searchCity(city) {
    var myCityUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=4e1d66a53d3f4005204fa8c8a3971736";
    $.ajax({
        url: myCityUrl,
        method: "GET"
    }).then(function (response) {
        $("#currentCity").text(city)
        var temperature = response.main.temp;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=4e1d66a53d3f4005204fa8c8a3971736&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (response) {
            var uv = response.value;
            $("#temperature").text("Temperature: " + temperature + "F");
            $("#humidity").text("Humidity: " + humidity + "%");
            $("#wind-speed").text("Wind-speed: " + windSpeed + " MPH");
            $("#uv").text("UV Index: " + uv);
        })
    })
}

function renderCities(array) {
    $("#citiesSection").empty();
    for (let i = 0; i < array.length; i++) {
        var newRow = $("<div>");
        newRow.addClass("row");
        var newCol = $("<div>");
        newCol.addClass("col-sm");
        newRow.append(newCol);
        var newBtn = $("<button>");
        newBtn.addClass("btn btn-primary mt-2");
        newBtn.text(array[i]);
        newCol.append(newBtn);
        $("#citiesSection").prepend(newRow);
    }
}

var cities = JSON.parse(localStorage.getItem("cities"));
if (cities) {
    searchCity(cities[cities.length - 1])
}
else {
    cities = [];
}

renderCities(cities);


$("#submitBtn").on("click", function (event) {
    event.preventDefault();
    console.log("u clicked me");
    var myCity = $("#cityInput").val();
    if (myCity) {
        searchCity(myCity);
        cities.push(myCity);
        console.log(cities);
        localStorage.setItem("cities", JSON.stringify(cities));
        renderCities(cities);
    }
})
