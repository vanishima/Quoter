/* ===================== Shushu Chen =================== */

const authorName = document.querySelector("#authorName");
const authorOrigin = document.querySelector("#authorOrigin");
const authorKeywords = document.querySelector("#authorKeywords");
const booksDiv = document.querySelector("#booksByAuthor");

const params = new URL(document.location).searchParams;
const authorID = params.get("author");
// document.querySelector("#authorOrigin").innerHTML = params.get("author");

async function reloadAuthorDetail() {
  console.log("reloading author detail");

  try {
    // get list of quotes with filter
    let resRaw = await fetch("/authors/" + authorID);
    console.log("Got raw");

    // get the actual authors
    const res = await resRaw.json();
    const author = res.author;
    const books = res.books;

    console.log("Got author", author);
    console.log("Got books", books);

    redrawAuthorDetail(author);
    books.forEach(redrawBooks);
  } catch (e) {
    authorName.innerHTML = e.msg;
  }
}

async function redrawAuthorDetail(author) {
  authorName.innerHTML = author.name;
  authorOrigin.innerHTML = author.origin != null ? author.origin : "";
  authorKeywords.innerHTML = author.keywords != null ? author.keywords : "";
}

function redrawBooks(book) {
  const bookDiv = createHTMLElement(
    "a",
    "author btn btn-info me-3 mb-3",
    book.title
  );
  bookDiv.setAttribute(
    "href",
    "../pages_details/bookDetails.html?book=" + book._id
  );

  booksDiv.appendChild(bookDiv);
}

function createHTMLElement(type, classes = "", theInnerText = "") {
  const ele = document.createElement(type);
  if (classes.length > 0) {
    ele.className = classes;
  }
  if (theInnerText.length > 0) {
    ele.innerText = theInnerText;
  }
  return ele;
}

reloadAuthorDetail();
