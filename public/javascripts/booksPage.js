/* Username */
const username = document.querySelector("#username");

const booksDiv = document.querySelector("#books");

async function reloadBooks() {
  console.log("reloading books");

  booksDiv.innerHTML = "";

  try {
    // get list of quotes with filter
    let resRaw = await fetch("/books");
    console.log("Got raw");

    // get the actual authors
    const res = await resRaw.json();
    const books = res.books;
    
    console.log("Got data", books);
    books.forEach(redrawBook);

  } catch (e) {
    booksDiv.innerHTML = e.msg;
  }
}

async function redrawBook(book){
  const bookDiv = createAuthorElement(book);
  booksDiv.appendChild(bookDiv);
}

function createAuthorElement(book){
  const authorDiv = createHTMLElement("a", "author btn btn-info me-3 mb-3", book.title);
  authorDiv.setAttribute("href", "/pages_details/bookDetails.html?book=" + book._id);

  return authorDiv;
}

function createHTMLElement(type, classes="", theInnerText="") {
  const ele = document.createElement(type);
  if (classes.length > 0) {
    ele.className = classes;
  }
  if (theInnerText.length > 0) {
    ele.innerText = theInnerText;
  }
  return ele;
}

reloadBooks();