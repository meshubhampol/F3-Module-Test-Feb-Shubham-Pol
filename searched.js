let index = JSON.parse(localStorage.getItem('index'));

let url = 'https://www.googleapis.com/books/v1/volumes?q=';

let historyData = JSON.parse(localStorage.getItem('history'));
let query = historyData[index].query;
query = query.split(" ").join('+');
url = url + query;
let container = document.getElementById('result-table');

let sr = 1;
let result;

let data = [];
fetch(url).then((response) => response.json()).then(
    (result) => {
        data = result.items;
        console.log('data', data);
    }
).then(() => {
    historyData.map((item) => {
        let row = document.createElement('div');
        row.classList.add('item-row');
        row.innerHTML = `
            <div>${sr++}. ${item.query}</div>
            <div>Searcheed On: ${item.date} at ${item.time}</div>`
        container.appendChild(row);

        if (sr - 2 === index) {
            row.scrollIntoView();
            result = document.createElement('div');
            result.id = 'result-container';
            mapData();
        }
        let rows = document.getElementsByClassName('item-row');
        console.log(rows[0]);
        for (let i = 0; i < rows.length; i++) {
            rows[i].addEventListener('click', () => {
                console.log(i);
                localStorage.setItem('index', JSON.stringify(i));
                window.location.reload();
            })
        };
    });
});

function mapData() {
    data.map(showBooks);
    container.appendChild(result);
}

// displaying the found book results
function showBooks(book) {
    let title = book.volumeInfo.title;
    let author = "";
    if (book.volumeInfo.authors) {
        author = book.volumeInfo.authors[0];
    }

    let bookItem = document.createElement('div');
    bookItem.classList.add('book');
    let thumbnail = book.volumeInfo.imageLinks.thumbnail;
    let page = book.volumeInfo.pageCount;
    let publisher = book.volumeInfo.publisher;
    bookItem.innerHTML = `
            <img src=${thumbnail}
                alt="book">
            <div class="text-section">
                <div class="title">Title: ${title}</div>
                <div class="author">Author: ${author}</div>
                <div>Page count: ${page}</div>
                <div>Publisher: ${publisher}</div>
            <div>
                <button class="buy-now">Buy Now</button>
            </div>`

    result.appendChild(bookItem);
}

