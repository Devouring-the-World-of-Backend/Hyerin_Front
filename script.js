document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();

    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });

    document.getElementById('searchBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        searchBooks();
    });

    // 도서 수정 및 삭제 이벤트 리스너는 displayBooks 함수 내부에서 동적으로 추가됩니다.
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
        bookItem.innerHTML = `<strong>${book.title}</strong> (ID: ${book.id})<br>저자: ${book.author || '알 수 없음'}<br>출판년도: ${book.published_year || '알 수 없음'}<br>설명: ${book.description || '없음'}<button class="editBtn">수정</button><button class="deleteBtn">삭제</button>`;
        booksList.appendChild(bookItem);

        const editBtn = bookItem.querySelector('.editBtn');
        const deleteBtn = bookItem.querySelector('.deleteBtn');

        // 수정 버튼 이벤트 리스너
        editBtn.addEventListener('click', function() {
            editBook(book.id);
        });

        // 삭제 버튼 이벤트 리스너
        deleteBtn.addEventListener('click', function() {
            deleteBook(book.id);
        });
    });
}

// 도서 수정 함수
function editBook(id) {
    // 도서 수정 로직을 구현합니다.
    fetch(`http://127.0.0.1:8000/books/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('id').value = data.id;
            document.getElementById('title').value = data.title;
            document.getElementById('author').value = data.author;
            document.getElementById('description').value = data.description;
            document.getElementById('publishedYear').value = data.published_year;
        })
        .catch(error => console.error('Error:', error));
    alert(`ID ${id}의 도서를 수정합니다. (실제 구현 필요)`);
    // 수정 로직 구현 후 fetchBooks()를 호출하여 목록을 새로고침합니다.
    fetchBooks();
}

// 도서 삭제 함수
function deleteBook(id) {
    fetch(`http://127.0.0.1:8000/books/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            fetchBooks(); // 목록 새로고침
        } else {
            throw new Error('Something went wrong');
        }
    })
    .catch(error => console.error('Error:', error));
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

function searchBooks() {
    const query = document.getElementById('searchQuery').value;
    const type = document.getElementById('searchType').value; // 검색 유형 (title 또는 author)

    fetch(`http://127.0.0.1:8000/books/search?${type}=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => displayBooks(data))
        .catch(error => console.error('Error:', error));
}