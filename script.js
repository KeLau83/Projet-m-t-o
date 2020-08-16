const $cityName = document.querySelector(".cityName");
const $logoTemp = document.querySelector(".logoTemp");
const $tempAct = document.querySelector(".tempAct");
const $cityChoose = document.querySelector(".cityChoose");
const $condition = document.querySelector(".condition");
const $body = document.querySelector("body");
let city = "paris"
let conditionAct;
let hourAct;
let hourIcon;
let pathHour ="";
let hourTemp;
let skyTint;
let $city;


const divHour = function () {
    const div = document.createElement('div');
    div.className = "weather-by-hour";
    div.innerHTML = `<p>` + pathHour + `</p> <img src="`+ hourIcon + `"><p>` + hourTemp + ` °C</p>`;
    document.querySelector(".hourByHour").appendChild(div);
}
const background = function () {
    if ( skyTint == "Nuit") {
        $body.style.backgroundImage = `url(./assets/img/petitNuage.png)`
        
    }else {
        $body.style.backgroundImage = `url(./assets/img/blueSky.jpg)`
    }
}

const storageCity = function (event) {
    let $cityWrite = $cityChoose.value
    localStorage.setItem($city,$cityWrite)
}

const nextHours = function (response) {
    let i = 0;
    let iHour ="";
  
    
    while ( iHour != hourAct ) {
        if (i < 10) {
            iHour = "0" + i + ":00"
        }else if (i >= 10) {
            iHour =  i + ":00"
        }
        i += 1  
    }
    
    while ( i < 24) {
        pathHour = i + "H00"
        hourIcon = response.fcst_day_0.hourly_data[pathHour].ICON;
        hourTemp = response.fcst_day_0.hourly_data[pathHour].TMP2m;
        divHour()
        i += 1
    }
}

const nextDays = function (response) {
    for (let i = 0; i < 4; i++) {
        let futurDay = "fcst_day_" + i;
        let day = response[futurDay].day_short;
        let tmin = response[futurDay].tmin;
        let tmax = response[futurDay].tmax;
        let litleIcon = response[futurDay].icon;

        const div = document.createElement('div');
        div.className = "weather-next-days";
        div.innerHTML = `<p>` + day + `</p> <p>` +tmin + `/` + tmax + `°C</p> <img src="`+ litleIcon + `">`;
        document.querySelector(".nextDays").appendChild(div);
    }
}
function main () {
    // if ( localStorage.length != 0 ) {
    //     city = localStorage.getItem($city)
    // }
     if ($cityChoose.value != "") {
        city = $cityChoose.value;
    }
    let dataMeteo = "https://www.prevision-meteo.ch/services/json/" + city;
    fetch(dataMeteo)
        .then(response => response.json())
        .then(function (response) {
            console.log(response)
            hourAct = response.current_condition.hour
            $cityName.innerHTML = response.city_info.name;
            $tempAct.innerHTML = response.current_condition.tmp + "°C"
            $logoTemp.innerHTML = `<img src=` + response.current_condition.icon_big + `>`
            conditionAct =  response.current_condition.condition
            skyTint = conditionAct.substr(0,4 )
            $condition.innerHTML = conditionAct
            $cityChoose.value = "";
            background()
            nextHours(response)
            nextDays(response)
            
            
            
        })
        .catch(function () {
            alert("Erreur")
        })
}

$cityChoose.addEventListener('change', main);
$cityChoose.addEventListener('change', storageCity);



main()


