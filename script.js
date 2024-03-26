document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();

    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });
});

function fetchBooks() {
    fetch('http://127.0.0.1:8000/books')
        .then(response => response.json())
        .then(data => displayBooks(data))
        .catch(error => console.error('Error:', error));
}

function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';
    Object.values(books).forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('bookItem');
        bookItem.innerHTML = `<strong>${book.title}</strong> (ID: ${book.id})<br>저자: ${book.author || '알 수 없음'}<br>출판년도: ${book.published_year || '알 수 없음'}<br>설명: ${book.description || '없음'}`;
        booksList.appendChild(bookItem);
    });
}

function addBook() {
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    const publishedYear = document.getElementById('publishedYear').value;

    const bookData = { id: parseInt(id), title, author, description, published_year: parseInt(publishedYear) };

    fetch('http://127.0.0.1:8000/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something went wrong');
    })
    .then(data => {
        console.log('Success:', data);
        fetchBooks(); // 목록 새로고침
    })
    .catch(error => console.error('Error:', error));
}
