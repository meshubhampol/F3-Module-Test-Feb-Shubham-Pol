const url = 'https://www.googleapis.com/books/v1/volumes?q=';

let historybtn = document.getElementById('history');

if(!localStorage.getItem('history')) {
    // hiding history button if no hisory is stored
    historybtn.classList.add('hidden');
}


historybtn.addEventListener('click',redirect);

function redirect(event) {
    event.preventDefault();
    window.location.assign('./history.html');
}

// Decalring a global array for storing data
let data =[];

// storing input
let find;

let search = document.getElementById('search');
search.addEventListener('click',searchResults);

// searching book
function searchResults(event) {
    event.preventDefault();
    find = document.getElementById('input').value;
    if(find.trim().length == 0) {
        alert("Empty Search!");
        return;
    }
    // clearing the previous results 
    document.getElementById('result-container').innerHTML='';
    document.getElementById('search-text').innerHTML='';

    // sepearting every word from searched text 
    let searchArr = find.split(" ");

    // fetching the  required book data if present
    let searchUrl = url + searchArr.join('+');
    console.log(searchUrl);
    fetch(searchUrl).then((response)=> response.json()).then(
        (result)=> {
            console.log(result);
            data=result.items;
            if(data) {
                // showing history button
                historybtn.classList.remove('hidden');

                // fetching current date and time
                let date= new Date();
                let hours= date.getHours()%12 < 10 ? '0'+ (date.getHours()%12) : date.getHours()%12;
                if(hours == '00') {
                    hours=12;
                }
                let min=date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
                let suff= date.getHours() > 12 ? 'PM':'AM';
                let day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
                let month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth();
                let year = date.getFullYear();
                
                // storing query in local Storage
                if(localStorage.getItem('history') ) {
                    let prevData=[];
                    prevData=JSON.parse(localStorage.getItem('history'));
                
                    prevData.push({
                        query:find,
                        date:day+'/'+month+'/'+year,
                        time:hours+':'+min+suff
                    })
                    localStorage.setItem('history',JSON.stringify(prevData));
                }
                else {
                    let obj = [];
                    obj.push({
                        query:find,
                        date:day+'/'+month+'/'+year,
                        time:hours+':'+min+suff
                    });
                    localStorage.setItem('history',JSON.stringify(obj));
                }

                console.log(localStorage.getItem('history'));
                
                mapData();
            }
            else {
                document.getElementById('search-text').innerHTML='No Result Found!';
            }
        }
    )

}

function mapData() {
    data.map(showBooks);
}

// displaying the found book results
function showBooks(book) {
    let title = book.volumeInfo.title;
    let author = "";
    if(book.volumeInfo.authors) {
        author=book.volumeInfo.authors[0];
    }

    let container = document.createElement('div');
    container.classList.add('book');
    let thumbnail="";
    if(!book.volumeInfo.imageLinks) {
        thumbnail='https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
    }
    else {
        thumbnail = book.volumeInfo.imageLinks.thumbnail;
    }
    let page = book.volumeInfo.pageCount;
    let publisher = book.volumeInfo.publisher;
    document.getElementById('search-text').innerHTML=`
    Book results for '${find}'`
    container.innerHTML=`
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
    
    document.getElementById('result-container').appendChild(container);
}     