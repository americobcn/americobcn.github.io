const cider_date = new Date(2023,3,2,14);

function time_diff() {
    const now = Date.now();
    diff = cider_date - now;
    days = diff/1000/3600/24;
    hours = (diff/1000/3600)%24;
    minutes = (diff/1000/60)%60;
    seconds = (diff/1000)%60;
    
    // console.log(hours,minutes,seconds);
    
    document.querySelector('#days').innerHTML = days.toString().match(/^-?\d+(?:\d{0,0})?/)[0];
    document.querySelector('#hours').innerHTML = hours.toString().match(/^-?\d+(?:\d{0,0})?/)[0];
    document.querySelector('#minutes').innerHTML = minutes.toString().match(/^-?\d+(?:\d{0,0})?/)[0];
    document.querySelector('#seconds').innerHTML = seconds.toString().match(/^-?\d+(?:\d{0,0})?/)[0];

}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(time_diff, 1000);
});
