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
            let conditionAct = response.current_condition.condition
            HTMLMainInfo(response,conditionAct)
            HTMLTitle()
            setBackground(conditionAct)
            setHourByHour(response)
            nextDays(response)
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

function HTMLMainInfo (response, conditionAct) {
    document.querySelector(".tempAct").innerHTML = `${response.current_condition.tmp}°C`;
    document.querySelector(".logoTemp").innerHTML = `<img src=${response.current_condition.icon_big}>`;
    document.querySelector(".condition").innerHTML = conditionAct;
}

function HTMLTitle() {
    let cityFav = compareCityToFavoris()
    HTMLBtnFav(cityFav)
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

function capitalize(string) {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function setBackground(conditionAct) {
    let skyTint = conditionAct.substr(0, 4)
    if (skyTint == "Nuit") {
        $body.classList.add("nuit");

    } else {
        $body.classList.add("day")
    }
}

function setHourByHour(response) {
    let hourAct = response.current_condition.hour
    let i = searchActHour(hourAct)
    resetHTML(".hourByHour")
    getWeatherHours(i,response)
}

function nextDays(response) {
    resetHTML(".nextDays")
    for (let i = 0; i < 5; i++) {
        let futurDay = "fcst_day_" + i;
        
        HTMLForNextDays(response, futurDay, i);
    }
}

function HTMLForNextDays(response, futurDay, i) {
    let day = knowIfItsToday(response, futurDay, i)
    const div = document.createElement('div');
    div.className = "weather-next-days";
    div.innerHTML = `<p>${day}</p> <p>${response[futurDay].tmin}/${response[futurDay].tmax}°C</p> <img src="${response[futurDay].icon}">`;
    document.querySelector(".nextDays").appendChild(div);
}

function knowIfItsToday (response, futurDay, i) {
    if (i == 0) {
        return "Auj.";
    }
    return response[futurDay].day_short;
}

function HTMLinfoSup(response) {
    document.querySelector(".humidity").innerHTML = "Le taux d'humidité est de : " + response.current_condition.humidity + "%";
    document.querySelector(".windSpeed").innerHTML = "La vitesse du vent est de " + response.current_condition.wnd_spd + "km/h";
    document.querySelector(".sunRise").innerHTML = "Le soleil se lévera à " + response.city_info.sunrise;
    document.querySelector(".sunSet").innerHTML = "et se couchera à " + response.city_info.sunset;
}

function  hideInfo() {
    $infoSup.classList.remove("active")
    $infoSup.classList.add("sup-info_disable");
    const $lineInfo = document.querySelectorAll(".lineInfo");
    for (div of $lineInfo) {
        div.classList.add("displayNone")
    }
}

function addFunctionToNewFav() {
    const $dropddownFav = document.querySelectorAll(".dropdown-item")
    for (item of $dropddownFav) {
        item.addEventListener("click", newPage)
    }

}

function displayFav() {
    document.querySelector("#navbarDropdownMenuLink").classList.add("displayNone")
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

function searchActHour(hourAct) {
    let i = 0;
    let iHour = "";                        // variable qui va prendre les différentes heures nous permettant de comparer à l'heure actuelle
    while (iHour != hourAct) {
        if (i < 10) {
            iHour = "0" + i + ":00";
        } else if (i >= 10) {
            iHour = i + ":00";
        }
        i += 1;
    }
    return i
}

function getWeatherHours(i, response) {
    
    let DayForTheHours = "fcst_day_0";
    for (let j = 0; j < 24; i++, j++) {
        if (i == 24) {
            i = 0;
            DayForTheHours = "fcst_day_1";
        }
        const pathHour = i + "H00"
        const hourIcon = response[DayForTheHours].hourly_data[pathHour].ICON;
        const hourTemp = response[DayForTheHours].hourly_data[pathHour].TMP2m;
        HTMLForEachHour(pathHour, hourIcon, hourTemp)
    }
}

function HTMLForEachHour(pathHour, hourIcon, hourTemp) {
    const div = document.createElement('div');
    div.className = "weather-by-hour";
    div.innerHTML = `<p>` + pathHour + `</p> <img src="` + hourIcon + `"><p>` + hourTemp + ` °C</p>`;
    document.querySelector(".hourByHour").appendChild(div);
}

function newPage() {
    userInfo.city = event.target.textContent;
    creationPage()
}

function showInfo() {
    $infoSup.classList.remove("sup-info_disable");
    const $lineInfo = document.querySelectorAll(".lineInfo");
    for (div of $lineInfo) {
        div.classList.remove("displayNone")
        div.classList.add("active")
    }
}

function resetHTML(place) {
    document.querySelector(place).innerHTML = ""
}
function setFavToStorage(){
    localStorage.setItem('datFav', favoris)
}
document.querySelector('.sup-info').addEventListener('click', showInfo)
$cityChoose.addEventListener('change', creationPage);
creationPage()
addFav()

