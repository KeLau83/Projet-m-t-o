const $cityName = document.querySelector(".cityName");
const $logoTemp = document.querySelector(".logoTemp");
const $tempAct = document.querySelector(".tempAct");
const $hourAct = document.querySelector(".hourAct");
const $cityChoose = document.querySelector(".cityChoose");
const $condition = document.querySelector(".condition");
const $body = document.querySelector("body");
let city = "toulon"
let conditionAct;

const background = function () {
    if ( conditionAct == "Ensoleillé"){
        $body.style.backgroundImage = `url(./assets/img/blueSky.jpg)`
    }if( conditionAct == "Développement nuageux"){
        $body.style.backgroundImage = `url(./assets/img/petitNuage.png)`
    }
}

function main (){
     if ($cityChoose.value != ""){
        city = $cityChoose.value;
    }
    let dataMeteo = "https://www.prevision-meteo.ch/services/json/" + city;
    fetch(dataMeteo)
        .then(response => response.json())
        .then(function (response) {
            console.log(response)
            $cityName.innerHTML = response.city_info.name;
            $tempAct.innerHTML = response.current_condition.tmp + "°C"
            $logoTemp.innerHTML = `<img src=` + response.current_condition.icon_big + `>`
            conditionAct =  response.current_condition.condition
            $condition.innerHTML = conditionAct
            $cityChoose.value = "";
            background()
        })
        .catch(function () {
            alert("Erreur")
        })
}

$cityChoose.addEventListener('change', main);

main()


