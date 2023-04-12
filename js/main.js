const cider_date = new Date("2023-04-02T14:00");
let interval_id;
let re = new RegExp(/^-?\d+(?:\d{0,0})?/);

function time_diff() {
    const now = Date.now();
    if (now > cider_date) {
        clearInterval(interval_id);
        update();
        return;
    }

    diff = cider_date - now;
    days = diff/1000/3600/24;
    hours = (diff/1000/3600)%24;
    minutes = (diff/1000/60)%60;
    seconds = (diff/1000)%60;
    
    document.querySelector('#days').innerHTML = days.toString().match(re)[0];
    document.querySelector('#hours').innerHTML = hours.toString().match(re)[0];
    document.querySelector('#minutes').innerHTML = minutes.toString().match(re)[0];
    document.querySelector('#seconds').innerHTML = seconds.toString().match(re)[0];
}

function start_interval(interval) {
    interval_id = setInterval(time_diff, 1000);
}

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
const url = 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/20001/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWVyaWNvLmNvdEBnbWFpbC5jb20iLCJqdGkiOiJmOWEwMGY3MC0yZTQ5LTQwNmYtYjViOC00MDkzNTY1NzdjNzQiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTY3OTg1ODMyOCwidXNlcklkIjoiZjlhMDBmNzAtMmU0OS00MDZmLWI1YjgtNDA5MzU2NTc3Yzc0Iiwicm9sZSI6IiJ9.4it22Cc2Iu-yBCKp8rjIeVhGZ6Kmr1NZW4W3Y_adoFs';

async function get_data() {
    const info = await fetch(url).then(response => response.json());
    console.log(info);
    const data = await fetch(info.datos).then(response => response.json());
    console.log(data[0]);

    let dias = data[0].prediccion.dia;
    dias.forEach(e => {
        console.log(`${e.fecha} max: ${e.temperatura.maxima}   min: ${e.temperatura.minima}`);
    });

    const dia_0 = new Date(data[0].prediccion.dia[0].fecha).toDateString().split(' ');
    const dia_1 = new Date(data[0].prediccion.dia[1].fecha).toDateString().split(' ');
    const dia_2 = new Date(data[0].prediccion.dia[2].fecha).toDateString().split(' ');

    const name = document.getElementById('name');
    const dia0 = document.getElementById('dia_0');
    const dia1 = document.getElementById('dia_1');
    const dia2 = document.getElementById('dia_2');

    name.innerHTML = `<h1>El temps a ${data[0].nombre}</h1>`
    dia0.innerHTML = `<h5>${dia_0[2]} de ${dia_0[1]}</h5>
                    <div>min: ${data[0].prediccion.dia[0].temperatura.minima} &#8451</div>
                    <div>max: ${data[0].prediccion.dia[0].temperatura.maxima} &#8451</div><br>
                    Pluja
                    <div>06 a 12hs ${data[0].prediccion.dia[0].probPrecipitacion[4].value} %</div>
                    <div>12 a 18hs ${data[0].prediccion.dia[0].probPrecipitacion[5].value} %</div>
                    <div>18 a 24hs ${data[0].prediccion.dia[0].probPrecipitacion[6].value} %</div>
                    <div>${data[0].prediccion.dia[0].estadoCielo[0].descripcion}</div><br>`;
                    
    dia1.innerHTML = `<h5>${dia_1[2]} de ${dia_1[1]}</h5>
                    <div>min: ${data[0].prediccion.dia[1].temperatura.minima} &#8451</div>
                    <div>max: ${data[0].prediccion.dia[1].temperatura.maxima} &#8451</div><br>                    
                    Pluja
                    <div>06 a 12hs ${data[0].prediccion.dia[1].probPrecipitacion[4].value} %</div>
                    <div>12 a 18hs ${data[0].prediccion.dia[1].probPrecipitacion[5].value} %</div>
                    <div>18 a 24hs ${data[0].prediccion.dia[1].probPrecipitacion[6].value} %</div>
                    <div>${data[0].prediccion.dia[1].estadoCielo[0].descripcion}</div><br>`;

    dia2.innerHTML = `<h5>${dia_2[2]} de ${dia_2[1]}</h5>                                        
                    <div>min: ${data[0].prediccion.dia[2].temperatura.minima} &#8451</div>
                    <div>max: ${data[0].prediccion.dia[2].temperatura.maxima} &#8451</div><br>
                    Pluja
                    <div>00 a 24hs ${data[0].prediccion.dia[2].probPrecipitacion[0].value} %</div>
                    <div>00 a 12hs ${data[0].prediccion.dia[2].probPrecipitacion[1].value} %</div>
                    <div>12 a 24hs ${data[0].prediccion.dia[2].probPrecipitacion[2].value} %</div>
                    <div>${data[0].prediccion.dia[2].estadoCielo[0].descripcion}</div>`;
}


document.addEventListener('DOMContentLoaded', () => {
    if (cider_date > Date.now()) {
        start_interval(interval_id);        
    } else {
        update();
    }

    get_data();

});