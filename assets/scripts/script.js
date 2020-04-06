//Declare global variables
var mostRecCity; //most recent city searched for
var days = []; //the array that holds the day object for the 5-day forecast
for (let i = 1; i <= 5; i++) { //create an object for each day in the forecast
    days[i] = {
        date: "",
        temperature,
        humidity,
        time: "06:00:00",
        dtTxt: "",
        icon: "02d"
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////functions///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateDay(offset) { //update today's date and the dates for the 5 day forecast, will be called when a new city is selected as well.
    if (cities[0]) { //if there is at least one element in cities
        var today = moment().utc().utcOffset(offset).format("dddd, MMMM Do YYYY"); //use the offset value supplied to Update day to determine the time in that timezone
        var thisHour = moment().utc().utcOffset(offset).hour();
        if (thisHour < 5 || thisHour >= 21) { //if it is before 5 am or after 9pm use the night stylings
            $("#cityCard").attr("class", "card p-4 night"); //make the background night
            $(".bg-img").attr("id", "nightBg");
        }
        else if (thisHour > 6 && thisHour < 17) { //if it is after 6am AND before 5pm use the day stylings
            $("#cityCard").attr("class", "card p-4");
            $(".bg-img").attr("id", "dayBg");
        }
        else { //otherwise, use the evening/early morning stylings
            $("#cityCard").attr("class", "card p-4 evening");
            $(".bg-img").attr("id", "evenBg");
        }
        $("#date").text(today); //set the date at the top of the screen to today's date
        for (let i = 1; i <= 5; i++) { //set each day in the forecast to a day later than today
            var id = "#d" + i + "date"; //creates an id based on i to assign the date's text to
            var id2 = "#d" + i; //creates an id based on i to set the value of the select box
            days[i].date = moment().utc().utcOffset(offset).add(i, 'days').format('ddd MMMM Do');
            $(id).text(days[i].date);
            days[i].time = "06:00:00";
            days[i].dtTxt = moment().utc().utcOffset(offset).add(i, 'days').format("YYYY-MM-DD");
            $(id2).val("6:00AM");
            $(id2).parent().attr("class", "card m-2 p-2 text-white evening");
        }
    }
    else { //if there is not at least one element in cities, do the same things but don't use the utc offset
        var today = moment().format("dddd, MMMM Do YYYY");
        var thisHour = moment().hour();
        if (thisHour < 5 || thisHour >= 21) {
            $("#cityCard").attr("class", "card p-4 night"); //make the background night
        }
        else if (thisHour > 6 && thisHour < 17) {
            $("#cityCard").attr("class", "card p-4");
        }
        else {
            $("#cityCard").attr("class", "card p-4 evening");
        }
        $("#date").text(today);
        for (let i = 1; i <= 5; i++) {
            var id = "#d" + i + "date";
            var id2 = "#d" + i;
            days[i].date = moment().add(i, 'days').format('ddd MMMM Do');
            $(id).text(days[i].date);
            days[i].time = "06:00:00";
            days[i].dtTxt = moment().add(i, 'days').format("YYYY-MM-DD");
            $(id2).val("6:00AM");
            $(id2).parent().attr("class", "card m-2 p-2 text-white evening");
        }
    }
}
function searchCity(city) { //search for a city
    //construct a url using the supplied city
    var myCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=4e1d66a53d3f4005204fa8c8a3971736";
    $.ajax({ //make an ajax call to get that cities info including latitute and longitude to use in the next ajax call
        url: myCityUrl,
        method: "GET"
    }).then(function (response) {
        $("#currentCity").text(city)
        var icon = response.weather[0].icon;
        var temperature = response.main.temp;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var offset = response.timezone / 60;
        var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=4e1d66a53d3f4005204fa8c8a3971736&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (response) {
            var uv = response.value;
            $("#icon0").attr("src", "https://openweathermap.org/img/wn/" + icon + ".png");
            $("#temperature").text("Temperature: " + temperature + "F");
            $("#humidity").text("Humidity: " + humidity + "%");
            $("#wind-speed").text("Wind-speed: " + windSpeed + " MPH");
            $("#uv").text("UV Index: " + uv);
            updateDay(offset);
        })
    })
}

function renderCities(array) { //add buttons for each city
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

function searchForecast(city) {
    var myForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=4e1d66a53d3f4005204fa8c8a3971736";
    $.ajax({
        url: myForecastUrl,
        method: "GET"
    }).then(function (response) {
        var forecastList = response.list;
        for (let i = 1; i <= 5; i++) {
            for (let j = 0; j < forecastList.length; j++) {
                if (days[i].dtTxt + " " + days[i].time === forecastList[j].dt_txt) {
                    days[i].temperature = (forecastList[j].main.temp);
                    days[i].humidity = (forecastList[j].main.humidity);
                    days[i].icon = (forecastList[j].weather[0].icon).slice(0, 2);
                    if (days[i].time === "21:00:00") {
                        $("#icon" + i).attr("src", "https://openweathermap.org/img/wn/" + days[i].icon + "n.png");
                    }
                    else {
                        $("#icon" + i).attr("src", "https://openweathermap.org/img/wn/" + days[i].icon + "d.png");
                    }
                    $("#d" + i + "temp").text(days[i].temperature + "F");
                    $("#d" + i + "hum").text(days[i].humidity + "%");
                }
            }
        }
    })
}

///////////////////////////////////////////////////////////////Initialize the page///////////////////////////////////////////////////////////////

// update today's date and the dates for the forecast when the page loads
var cities = JSON.parse(localStorage.getItem("cities"));
if (cities) {
    if (cities[0]) {
        mostRecCity = cities[cities.length - 1];
        searchCity(mostRecCity);
        searchForecast(mostRecCity);
        $("select").prop("disabled", false);
    }
    else {
        updateDay();
    }
}
else {
    cities = [];
    updateDay();
}

renderCities(cities);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~On-click Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$("#submitBtn").on("click", function (event) {
    event.preventDefault();
    var myCity = $("#cityInput").val();
    if (myCity) {
        for (let i = 0; i < cities.length; i++) { //checks if the city already exists in the array. if it does, it deletes the previous entry.
            if (cities[i] === myCity) {
                cities.splice(i, 1);
            }
        }
        cities.push(myCity); //adds the searched city to the end of the array.
        searchCity(myCity);
        searchForecast(myCity);

        localStorage.setItem("cities", JSON.stringify(cities));
        renderCities(cities);
        mostRecCity = myCity;
        $("select").prop("disabled", false);
    }
})


for (let i = 1; i <= 5; i++) {
    const id = "#d" + i;
    $(id).on("change", function (event) {
        event.preventDefault();
        var time = $(this).val();
        if (time === "9:00PM") {
            $(this).parent().attr("class", "card m-2 p-2 text-white night");
            days[i].time = "21:00:00";
        }
        else if (time === "6:00PM") {
            $(this).parent().attr("class", "card m-2 p-2 text-white evening");
            days[i].time = "18:00:00";
        }
        else if (time === "3:00PM") {
            $(this).parent().attr("class", "card m-2 p-2 text-white bg-primary");
            days[i].time = "15:00:00";
        }
        else if (time === "12:00PM") {
            $(this).parent().attr("class", "card m-2 p-2 text-white bg-primary");
            days[i].time = "12:00:00";
        }
        else if (time === "9:00AM") {
            $(this).parent().attr("class", "card m-2 p-2 text-white bg-primary");
            days[i].time = "09:00:00";
        }
        else if (time === "6:00AM") {
            $(this).parent().attr("class", "card m-2 p-2 text-white evening");
            days[i].time = "06:00:00";
        }
        searchForecast(mostRecCity);
    })
}

$("#citiesSection").on("click", function (event) {
    event.preventDefault();
    var btn = event.target;
    var myCity = $(btn).text();
    for (let i = 0; i < cities.length; i++) { //checks if the city already exists in the array. if it does, it deletes the previous entry.
        if (cities[i] === myCity) {
            cities.splice(i, 1);
        }
    }
    cities.push(myCity); //adds the searched city to the end of the array.
    searchCity(myCity);
    searchForecast(myCity);

    localStorage.setItem("cities", JSON.stringify(cities));
    renderCities(cities);
    mostRecCity = myCity;
    $("select").prop("disabled", false);
})

$("#clearBtn").on("click", function (event) {
    event.preventDefault();
    cities = [];
    localStorage.setItem("cities", JSON.stringify(cities));
    renderCities(cities);
    mostRecCity = "";
    $("#currentCity").text("←←←Find Your City")
    $("#temperature").text("Temperature: ");
    $("#humidity").text("Humidity: ");
    $("#wind-speed").text("Wind-speed: ");
    $("#uv").text("UV Index: ");
    for (let i = 1; i <= 5; i++) {
        $("#d" + i + "temp").text("Temperature");
        $("#d" + i + "hum").text("Humidity");
    }
    updateDay();
    $("select").attr("disabled", true);
})