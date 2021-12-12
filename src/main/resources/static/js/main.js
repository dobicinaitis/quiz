// useful function
function id(elementId) {
    return document.getElementById(elementId);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isEmpty(object){
    return Object.keys(object).length === 0 && object.constructor === Object;
}

window.post = function(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject(response));
}