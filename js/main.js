/* Global variables */ 
let interval_id;
let re = new RegExp(/^-?\d+(?:\d{0,0})?/);
const event_date = new Date("2023-04-23T00:00");


/* Elements  */
const daysDiv = document.querySelector('#days');
const hoursDiv = document.querySelector('#hours');
const minutesDiv = document.querySelector('#minutes');
const secondsDiv = document.querySelector('#seconds');


/* Start process */
document.addEventListener('DOMContentLoaded', () => {
    if (event_date > Date.now()) {
        start_interval(interval_id);        
    } else {
        update();
    }
    get_data();
});


/* Start the interval and regier it */
function start_interval(interval) {
    interval_id = setInterval(time_diff, 1000);
}


function time_diff() {
    const now = Date.now();
    if (now > event_date) {
        clearInterval(interval_id);
        update();
        return;
    }

    diff = event_date - now;
    days = diff/1000/3600/24;
    hours = (diff/1000/3600)%24;
    minutes = (diff/1000/60)%60;
    seconds = (diff/1000)%60;
    
    daysDiv.innerHTML = days.toString().match(re)[0];
    hoursDiv.innerHTML = hours.toString().match(re)[0];
    minutesDiv.innerHTML = minutes.toString().match(re)[0];
    secondsDiv.innerHTML = seconds.toString().match(re)[0];
}


/** Count down ended */
function update() {
    let couter_element = document.getElementById('counter');
    while (couter_element.firstChild) {        
        couter_element.removeChild(couter_element.firstChild);
    }

    couter_element.classList.add('txotx');
    couter_element.classList.add('flip-scale-up-hor');
    const txotx = document.createElement('div');
    const text_node = document.createTextNode('Txotx!');
    txotx.appendChild(text_node);
    couter_element.appendChild(txotx);
}


/* Clima Information */
const url = 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/08019/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWVyaWNvLmNvdEBnbWFpbC5jb20iLCJqdGkiOiJmOWEwMGY3MC0yZTQ5LTQwNmYtYjViOC00MDkzNTY1NzdjNzQiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTY3OTg1ODMyOCwidXNlcklkIjoiZjlhMDBmNzAtMmU0OS00MDZmLWI1YjgtNDA5MzU2NTc3Yzc0Iiwicm9sZSI6IiJ9.4it22Cc2Iu-yBCKp8rjIeVhGZ6Kmr1NZW4W3Y_adoFs';

async function get_data() {
    const info = await fetch(url).then(response => response.json());
    const resp = await fetch(info.datos).then(response => response.json());
    const predictions = resp[0].prediccion.dia;
    const data = resp[0];

    const body = document.getElementById('name');
    body.innerHTML = `<h1>${data.nombre}</h1>`

    let dates = []
    for (let i = 0; i < 3; i++) {
        dates.push(new Date(predictions[i].fecha));
        console.log(dates[i]);
    }
    
    const name = document.getElementById('name');
    name.innerHTML = `<h1>El temps a ${data.nombre}</h1>`

    let dias = document.getElementsByClassName('col-4 text-center');

    for (let i = 0; i < 3; i++) {
        console.log(predictions[i]);
        dias[i].innerHTML = `<h5>${dates[i].toLocaleString('default', {day:'numeric', month:'short'})}</h5>
                                <div>Min:   ${predictions[i].temperatura.minima} &#8451</div>
                                <div>Max:   ${predictions[i].temperatura.maxima} &#8451</div><br>
                                <div>00 a 12hs  ${predictions[i].probPrecipitacion[1].value} %</div>
                                <div>12 a 24hs  ${predictions[i].probPrecipitacion[2].value} %</div><br>
                                <div> ${predictions[i].estadoCielo[0].descripcion}</div>`;

    }
}
