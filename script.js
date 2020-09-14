const $cityName = document.querySelector(".bold");
const $cityChoose = document.querySelector(".cityChoose");
const $body = document.querySelector("body");
const $infoSup = document.querySelector(".sup-info");
let favoris = [];
const userInfo = {
    city: "Paris",
}

function creationPage() {
    userInfo.city = getCity()
    let dataMeteo = "https://www.prevision-meteo.ch/services/json/" + userInfo.city;
    fetch(dataMeteo)
        .then(response => response.json())
        .then(function (response) {  
            let currentCondition = response.current_condition.condition
            HTMLMainInfo(response,currentCondition)
            HTMLTitle()
            setBackground(currentCondition)
            setHourByHour(response)
            setNextDays(response)
            HTMLinfoSup(response)
            addFunctionToNewFav()
            hideInfo()
            $cityChoose.value = "";
        })
        .catch(function () {
            alert("Erreur")
        })
}

function getCity() {
    if ($cityChoose.value != "") {
        return $cityChoose.value;
    }else {
        return  userInfo.city
    }
}

function HTMLMainInfo (dataWeather, currentCondition) {
    document.querySelector(".tempAct").innerHTML = `${dataWeather.current_condition.tmp}°C`;
    document.querySelector(".logoTemp").innerHTML = `<img src=${dataWeather.current_condition.icon_big}>`;
    document.querySelector(".condition").innerHTML = currentCondition;
}

function HTMLTitle() {
    let cityFav = compareCityToFavoris()
    HTMLBtnFav(cityFav)
}

function setBackground(currentCondition) {
    let skyTint = currentCondition.substr(0, 4)
    if (skyTint == "Nuit") {
        $body.classList.add("nuit");

    } else {
        $body.classList.add("day")
    }
}

function setHourByHour(dataWeather) {
    let currentHour = dataWeather.current_condition.hour
    let hourKey = getHour(currentHour)
    resetHTML(".hourByHour")
    getWeatherHours(hourKey,dataWeather)
}

function setNextDays(dataWeather) {
    resetHTML(".nextDays")
    for (let i = 0; i < 5; i++) {
        let futurDay = "fcst_day_" + i;
        let dayWeather = dataWeather[futurDay];
        HTMLForNextDays(dayWeather, i);
    }
}

function HTMLinfoSup(dataWeather) {
    document.querySelector(".humidity").innerHTML = "Le taux d'humidité est de : " + dataWeather.current_condition.humidity + "%";
    document.querySelector(".windSpeed").innerHTML = "La vitesse du vent est de " + dataWeather.current_condition.wnd_spd + "km/h";
    document.querySelector(".sunRise").innerHTML = "Le soleil se lévera à " + dataWeather.city_info.sunrise;
    document.querySelector(".sunSet").innerHTML = "et se couchera à " + dataWeather.city_info.sunset;
}

function addFunctionToNewFav() {
    const $dropddownFav = document.querySelectorAll(".dropdown-item")
    for (item of $dropddownFav) {
        item.addEventListener("click", newPage)
    }
}

function  hideInfo() {
    $infoSup.classList.remove("active")
    $infoSup.classList.add("sup-info_disable");
    const $lineInfo = document.querySelectorAll(".lineInfo");
    for (div of $lineInfo) {
        div.classList.add("displayNone")
    }
}

function compareCityToFavoris () {
    let cityCompare = userInfo.city.toLowerCase()
    for (favori of favoris) {
        favori = favori.toLowerCase()
        if (cityCompare == favori) {
            return  "true";
        }
    }
    return "false"
}

function HTMLBtnFav (cityFav) {
    userInfo.city = capitalize(userInfo.city)
    if (cityFav == "true") {
        $cityName.innerHTML = `<span>${userInfo.city}</span> <img  class="fav btn-fav" onclick="removeFav()" title="Retirer des favoris" src="assets/img/delete.svg">`
        document.querySelector(".btnNavFav").innerHTML = `<button class="btn my-2 my-lg-0 btn-addFav btn-fav" onclick="removeFav()">Retirer des favoris</button>`
    } else {
        $cityName.innerHTML = `<span>${userInfo.city}</span><img  class="fav btn-fav" onclick="addFav()" title="Ajouter aux favoris" src="assets/img/addFav.svg">`
        document.querySelector(".btnNavFav").innerHTML = `<button class="btn my-2 my-lg-0 btn-addFav btn-fav" onclick="addFav()">Ajouter aux favoris</button>`
    }
}

function getHour(currentHour) {
    let hourKey = 0;
    let hourFormat = "";                        // variable qui va prendre les différentes heures nous permettant de comparer à l'heure actuelle
    while (hourFormat != currentHour) {
        if (hourKey < 10) {
            hourFormat = "0" + hourKey + ":00";
        } else if (hourKey >= 10) {
            hourFormat = hourKey + ":00";
        }
        hourKey += 1;
    }
    return hourKey
}

function getWeatherHours(i, dataWeather) {
    let DayForTheHours = "fcst_day_0";
    for (let j = 0; j < 24; i++, j++) {
        if (i == 24) {
            i = 0;
            DayForTheHours = "fcst_day_1";
        }
        let [pathHour, hourIcon, hourTemp] = getConstWeatherHour (DayForTheHours , i, dataWeather )
        HTMLForEachHour(pathHour, hourIcon, hourTemp)
    }
}

function getConstWeatherHour (DayForTheHours , i, dataWeather) {
    const pathHour = i + "H00"
    const hourIcon = dataWeather[DayForTheHours].hourly_data[pathHour].ICON;
    const hourTemp = dataWeather[DayForTheHours].hourly_data[pathHour].TMP2m;
    return [pathHour, hourIcon, hourTemp]
}

function HTMLForNextDays(dayWeather, i) {
    let day = knowIfItsToday(dayWeather, i)
    const div = document.createElement('div');
    div.className = "weather-next-days";
    div.innerHTML = `<p>${day}</p> <p>${dayWeather.tmin}/${dayWeather.tmax}°C</p> <img src="${dayWeather.icon}">`;
    document.querySelector(".nextDays").appendChild(div);
}

function HTMLForEachHour(pathHour, hourIcon, hourTemp) {
    const div = document.createElement('div');
    div.className = "weather-by-hour";
    div.innerHTML = `<p>` + pathHour + `</p> <img src="` + hourIcon + `"><p>` + hourTemp + ` °C</p>`;
    document.querySelector(".hourByHour").appendChild(div);
}

function knowIfItsToday (dayWeather, i) {
    if (i == 0) {
        return "Auj.";
    }
    return dayWeather.day_short;
}
 
function addFav() {
    let cityAdd = getCityToAdd()
    getStorage()
    setCityToStorage(cityAdd)
    HTMLTitle()
    HTMLFav()
    addFunctionToNewFav()
}

function getCityToAdd() {
    return $cityName.textContent;
}

function getStorage() {
    if (localStorage.length != 0) {
        let datFav = localStorage.getItem('datFav');
        if (datFav == "") {
            favoris = []
        } else {
            favoris = datFav.split(',');
        }
    }
}

function setCityToStorage(cityAdd) {
    const bAlreadyFavorite = favoris.indexOf(cityAdd) > -1;
    if (!bAlreadyFavorite && cityAdd != "") {
        favoris.push(cityAdd);
    }
    setFavToStorage()
    resetHTML(".dropdown-menu")
}

function HTMLFav() {
    resetHTML(".dropdown-menu");
    let datFav = localStorage.getItem('datFav');
    if (datFav == "") {
        favoris = []
    } else {
        favoris = datFav.split(',');
    }
    for (favori of favoris) {
        if (favori != "") {
            const a = document.createElement('a');
            a.className = "dropdown-item";
            a.href = "#";
            a.innerHTML = favori;
            document.querySelector(".dropdown-menu").appendChild(a);
        }
    }
}

function setFavToStorage(){
    localStorage.setItem('datFav', favoris)
}

function  removeFav() {
    let cityCompare = userInfo.city.toLowerCase()
    for (favori of favoris) {
        let favoriCompare = favori.toLowerCase()
        if (cityCompare == favoriCompare) {
            favoris.splice(favoris.indexOf(favori), 1)
            setFavToStorage()
        }
    }
    HTMLTitle()
    HTMLFav()
    addFunctionToNewFav()
}

function showInfo() {
    $infoSup.classList.remove("sup-info_disable");
    const $lineInfo = document.querySelectorAll(".lineInfo");
    for (div of $lineInfo) {
        div.classList.remove("displayNone")
        div.classList.add("active")
    }
}

function capitalize(string) {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function resetHTML(place) {
    document.querySelector(place).innerHTML = ""
}

function displayFav() {
    document.querySelector("#navbarDropdownMenuLink").classList.add("displayNone")
}

function newPage() {
    userInfo.city = event.target.textContent;
    creationPage()
}

document.querySelector('.sup-info').addEventListener('click', showInfo)
$cityChoose.addEventListener('change', creationPage);
creationPage()
addFav()

