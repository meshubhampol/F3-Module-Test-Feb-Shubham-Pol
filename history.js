let container = document.getElementById('result-table');

let historyData = JSON.parse(localStorage.getItem('history'));

let sr=1;
historyData.map((item) => {
    let row = document.createElement('div');
    row.classList.add('item-row');
    row.innerHTML = `
        <div>${sr++}. ${item.query}</div>
        <div>Searcheed On: ${item.date} at ${item.time}</div>`
    container.appendChild(row);
});

let clear = document.getElementById('clear');
clear.addEventListener('click',
    (event) => {
        event.preventDefault();
        // removing local storage history
        container.innerHTML='';
        localStorage.removeItem('history');
        alert('History Cleared!');
        window.location.replace('./index.html');
    })


// showing book results for selected row item
let rows=document.getElementsByClassName('item-row');


for(let i=0;i<rows.length;i++) {
    rows[i].addEventListener('click',() => {
        localStorage.setItem('index',JSON.stringify(i));
        window.location.assign('./searched.html');
    })
}
