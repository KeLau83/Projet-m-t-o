const $cityName = document.querySelector(".bold");
const $logoTemp = document.querySelector(".logoTemp");
const $tempAct = document.querySelector(".tempAct");
const $cityChoose = document.querySelector(".cityChoose");
const $condition = document.querySelector(".condition");
const $body = document.querySelector("body");
const $divHourByHour = document.querySelector(".hourByHour");
const $divnextDays = document.querySelector(".nextDays");
const $infoSup = document.querySelector(".sup-info");
const $favoris = document.querySelector(".favoris");
const $btnFav = document.querySelectorAll(".btn-fav");
let city = "Paris"
let favoris = [];

const capitalize = (string) => {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const writeTitle = function () {
    let cityFav = "false";
    let cityCompare = city.toLowerCase()
    for (favori of favoris) {
        favori = favori.toLowerCase()
        if (cityCompare == favori) {
            cityFav = "true";
            break
        }
    }
    city = capitalize(city)
    if (cityFav == "true") {
        $cityName.innerHTML = `<span>${city}</span> <img  class="fav btn-fav" onclick="removeFav()" title="Retirer des favoris" src="assets/img/delete.svg">`
        document.querySelector(".btnNavFav").innerHTML= `<button class="btn my-2 my-lg-0 btn-addFav btn-fav" onclick="removeFav()">Retirer des favoris</button>`
    } else {
        $cityName.innerHTML = `<span>${city}</span><img  class="fav btn-fav" onclick="addFav()" title="Ajouter aux favoris" src="assets/img/addFav.svg">`
        document.querySelector(".btnNavFav").innerHTML= `<button class="btn my-2 my-lg-0 btn-addFav btn-fav" onclick="addFav()">Ajouter aux favoris</button>`
    }
}

const displayFav = function () {
    document.querySelector("#navbarDropdownMenuLink").classList.add("displayNone")
}

const writeFav = function () {
    document.querySelector(".dropdown-menu").innerHTML = "";
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


const addFav = function () {
    let cityAdd = $cityName.textContent;
    if (localStorage.length != 0) {
        let datFav = localStorage.getItem('datFav');
        if (datFav == "") {
            favoris = []
        } else {
            favoris = datFav.split(',');
        }

    }

    const bAlreadyFavorite = favoris.indexOf(cityAdd) > -1;

    if (!bAlreadyFavorite && cityAdd != "") {
        favoris.push(cityAdd);
    }
    localStorage.setItem('datFav', favoris)
    document.querySelector(".dropdown-menu").innerHTML = "";
    writeTitle()
    writeFav()
    addFunctionNewFav()
}

const removeFav = function () {
    let cityCompare = city.toLowerCase()
    for (favori of favoris) {
        let favoriCompare = favori.toLowerCase()
        if (cityCompare == favoriCompare) {
            favoris.splice(favoris.indexOf(favori),1)
        }
    }
    localStorage.setItem('datFav', favoris)
    writeTitle()
    writeFav()
    addFunctionNewFav()
}


const background = function (skyTint) {
    if (skyTint == "Nuit") {
        $body.style.backgroundImage = `url(./assets/img/blackSky.jpg)`

    } else {
        $body.style.backgroundImage = `url(./assets/img/1.jpg)`
    }
}

const infoSup = function (response) {   
    document.querySelector(".humidity").innerHTML = "Le taux d'humidité est de : " + response.current_condition.humidity + "%";
    document.querySelector(".windSpeed").innerHTML = "La vitesse du vent est de " + response.current_condition.wnd_spd + "km/h";
    document.querySelector(".sunRise").innerHTML = "Le soleil se lévera à " + response.city_info.sunrise;
    document.querySelector(".sunSet").innerHTML = "et se couchera à " + response.city_info.sunset;
}

const divHour = function (pathHour, hourIcon, hourTemp) {
    const div = document.createElement('div');
    div.className = "weather-by-hour";
    div.innerHTML = `<p>` + pathHour + `</p> <img src="` + hourIcon + `"><p>` + hourTemp + ` °C</p>`;
    document.querySelector(".hourByHour").appendChild(div);
}

const nextHours = function (response ,hourAct ) {
    let i = 0;
    let iHour = "";

    while (iHour != hourAct) {
        if (i < 10) {
            iHour = "0" + i + ":00";
        } else if (i >= 10) {
            iHour = i + ":00";
        }
        i += 1;
    }

    $divHourByHour.innerHTML = "";
    let DayForTheHours = "fcst_day_0" ;
    for (let  j = 0; j < 24;i++,j++) {
        if (i == 24) {
            i = 0;
            DayForTheHours = "fcst_day_1"; 
        }
        const pathHour = i + "H00"
        const hourIcon = response[DayForTheHours].hourly_data[pathHour].ICON;
        const hourTemp = response[DayForTheHours].hourly_data[pathHour].TMP2m;
        divHour(pathHour, hourIcon, hourTemp)
    }
}

const nextDays = function (response) {
    $divnextDays.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        let futurDay = "fcst_day_" + i;
        let day = response[futurDay].day_short;
        if (i == 0) {
            day = "Auj."
        }
        let tmin = response[futurDay].tmin;
        let tmax = response[futurDay].tmax;
        let litleIcon = response[futurDay].icon;
        const div = document.createElement('div');
        div.className = "weather-next-days";
        div.innerHTML = `<p>` + day + `</p> <p>` + tmin + ` / ` + tmax + `°C</p> <img src="` + litleIcon + `">`;
        document.querySelector(".nextDays").appendChild(div);
    }
}

const newPage = function () {
    city = event.target.textContent;
    main()
}

const addFunctionNewFav = function () {
    const $dropddownFav = document.querySelectorAll(".dropdown-item")
    for (item of $dropddownFav) {
        item.addEventListener("click", newPage)
    }

}

const showInfo = function () {
    $infoSup.classList.remove("sup-info_disable");
    const $lineInfo = document.querySelectorAll(".lineInfo");
    for (div of $lineInfo) {
        div.classList.remove("displayNone")
        div.classList.add("active")
    }
}

const hideInfo = function () {
    $infoSup.classList.add("sup-info_disable");
    const $lineInfo = document.querySelectorAll(".lineInfo");
    for (div of $lineInfo) {
        div.classList.add("displayNone")
    }
}

function main() {
    if ($cityChoose.value != "") {
        city = $cityChoose.value;
    }
    let dataMeteo = "https://www.prevision-meteo.ch/services/json/" + city;
    fetch(dataMeteo)
        .then(response => response.json())
        .then(function (response) {
            $infoSup.classList.remove("active")
            hourAct = response.current_condition.hour
            $tempAct.innerHTML = `${response.current_condition.tmp}°C`
            $logoTemp.innerHTML = `<img src=` + response.current_condition.icon_big + `>`
            let conditionAct = response.current_condition.condition
            let skyTint = conditionAct.substr(0, 4)
            $condition.innerHTML = conditionAct
            $cityChoose.value = "";
            writeTitle()
            background(skyTint)
            nextHours(response,hourAct)
            nextDays(response)
            infoSup(response) 
            addFunctionNewFav()
            hideInfo()
        })
        .catch(function () {
            alert("Erreur")
        })
}

$cityChoose.addEventListener('change', main);

main()
addFav()

