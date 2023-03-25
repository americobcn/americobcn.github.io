const cider_date = new Date("2023-04-02T14:00");
let interval_id;
let re = new RegExp(/^-?\d+(?:\d{0,0})?/);

function time_diff() {
    const now = Date.now();
    if (now > cider_date) {
        clearInterval(interval_id);
        console.log("Stoped called")
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


document.addEventListener('DOMContentLoaded', () => {
    if (cider_date > Date.now()) {
        start_interval(interval_id);
        console.log("Start called");
    } else {
        update();
    }
});


function update() {
    let couter_element = document.getElementById('counter');
    console.log('Start removing childs ..');
    while (couter_element.firstChild) {
        console.log('Removing childs ..');
        couter_element.removeChild(couter_element.firstChild);
    }

    couter_element.classList.add('txotx');
    couter_element.classList.add('flip-scale-up-hor');
    const txotx = document.createElement('div');
    const text_node = document.createTextNode('Txotx!');
    txotx.appendChild(text_node);
    couter_element.appendChild(txotx);
}