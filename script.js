const $cityName = document.querySelector(".cityName");
const $logoTemp = document.querySelector(".logoTemp");
const $tempAct = document.querySelector(".tempAct");
const $cityChoose = document.querySelector(".cityChoose");
const $condition = document.querySelector(".condition");
const $body = document.querySelector("body");
let city = "toulon"
let conditionAct;
let hourAct;
let hourIcon;
let pathHour ="";
let hourTemp;

const divHour = function () {
    const div = document.createElement('div');
    div.className = "weather-by-hour";
    div.innerHTML = `<p>` + pathHour + `</p> <img src="`+ hourIcon + `"><p>` + hourTemp + ` °C</p>`;
    document.querySelector(".hourByHour").appendChild(div);
}
const background = function () {
    if ( conditionAct == "Ensoleillé") {
        $body.style.backgroundImage = `url(./assets/img/blueSky.jpg)`
    }if( conditionAct == "Développement nuageux") {
        $body.style.backgroundImage = `url(./assets/img/petitNuage.png)`
    }
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

function main () {
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
            $condition.innerHTML = conditionAct
            $cityChoose.value = "";
            background()
            nextHours(response)
            
        })
        .catch(function () {
            alert("Erreur")
        })
}

$cityChoose.addEventListener('change', main);



main()


