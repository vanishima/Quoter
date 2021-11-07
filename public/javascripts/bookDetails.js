const bookTitle = document.querySelector("#bookTitle");
const bookAuthor = document.querySelector("#bookAuthor");
const bookKeywords = document.querySelector("#bookKeywords");
const bookYear = document.querySelector("#bookYear");

const params = new URL(document.location).searchParams;
const bookID = params.get("book");

async function reloadBookDetail() {
  console.log("reloading book detail");

  try {
    // get list of quotes with filter
    let bookRaw = await fetch("/books/" + bookID);
    console.log("Got raw");

    // get the actual authors
    const res = await bookRaw.json();
    const book = await res.book;
    const author = await res.author;

    await redrawBookDetail(book, author);

  } catch (e) {
    bookTitle.innerHTML = e.msg;
  }
}

async function redrawBookDetail(book, author) {
  console.log("Got author", author);
  console.log("Got book", book);

  bookTitle.innerHTML = book.title;
  bookKeywords.innerHTML = book.keywords != null ? book.keywords : "";
  bookYear.innerHTML = book.year != null ? book.year : "";

  bookAuthor.innerHTML = author.name;
  bookAuthor.href = "/pages_details/authorDetails.html?author=" + author._id;
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

reloadBookDetail();