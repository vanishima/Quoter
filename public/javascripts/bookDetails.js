// import {redrawQuotes, likeQuotes} from "./client.js";

const bookTitle = document.querySelector("#bookTitle");
const bookAuthor = document.querySelector("#bookAuthor");
const bookKeywords = document.querySelector("#bookKeywords");
const bookYear = document.querySelector("#bookYear");

const quotesDiv = document.querySelector("#bookQuotes");

const newQuoteBookID = document.querySelector("#newQuoteBookID");
const newQuoteAuthorID = document.querySelector("#newQuoteAuthorID");
const newQuoteAuthorName = document.querySelector("#newQuoteAuthorName");
const newQuoteBookTitle = document.querySelector("#newQuoteBookTitle");
const newQuotePostDate = document.querySelector("#newQuotePostDate");

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
    const currTime = await res.currTime;
    const quotes = await res.quotes;

    await quotes.forEach(redrawQuotes);

    await redrawBookDetail(book, author, currTime);

  } catch (e) {
    bookTitle.innerHTML = e.msg;
  }
}

async function redrawBookDetail(book, author, currTime) {
  console.log("Got author", author);
  console.log("Got book", book);

  bookTitle.innerHTML = book.title;
  newQuoteBookTitle.innerHTML = book.title;
  bookKeywords.innerHTML = book.keywords != null ? book.keywords : "";
  bookYear.innerHTML = book.year != null ? book.year : "";

  bookAuthor.innerHTML = author.name;
  newQuoteAuthorName.innerHTML = author.name;
  bookAuthor.href = "/pages_details/authorDetails.html?author=" + author._id;

  newQuotePostDate.value = currTime;
  newQuoteBookID.value = book._id;
  newQuoteAuthorID.value = author._id;
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

// =================

async function redrawQuotes(q) {
  console.log("redrawQuotes with quote", q._id);
  // create a quote card
  const divQ = createHTMLElement("div", "card mb-3", "");
  quotesDiv.appendChild(divQ);

  const cardBody = createHTMLElement("div", "card-body row", "");
  divQ.appendChild(cardBody);

  /* Quote Details: blockQuote, quoteFooter */
  const quoteDetails = createHTMLElement("div", "quoteDetails col-11", "");
  const blockQuote = createHTMLElement("blockquote", "blockquoter", "");
  const quoteFooter = createHTMLElement("div", "quoteFooter row", "");

  quoteDetails.appendChild(blockQuote);
  quoteDetails.appendChild(quoteFooter);

  /* Block Quote*/
  const pText = createHTMLElement("p", "blockquote-text", q.text);
  const footer = createHTMLElement("footer", "blockquote-footer", q.author);
  blockQuote.appendChild(pText);

  if (q.source.length > 0) {
    const cite = createHTMLElement("cite", "", ", " + q.source);
    cite.title = "Source Title";
    footer.appendChild(cite);
  }
  blockQuote.appendChild(footer);

  /* Quote Footer */
  const footerTags = createHTMLElement(
    "div",
    "greyText smallText left tags col-4",
    ""
  );
  footerTags.innerHTML = q.tags; // q.tags.join(", ");

  quoteFooter.appendChild(footerTags);

  // const footerRight = createHTMLElement("div", "right", "");
  const footerLikes = createHTMLElement(
    "p",
    "likes smallText col-2",
    `${q.likes} Likes`
  );

  const editBtn = createHTMLElement(
    "a",
    "btn btn-outline-primary col-auto me-2",
    "Edit"
  );
  // const deleteBtn = createHTMLElement("a", "btn btn-outline-danger col-auto", "Delete");

  // editBtn.setAttribute("href", `/quotes/${q._id}/edit`);
  editBtn.setAttribute(
    "href",
    `./pages_details/quoteDetails.html?quoteID=${q._id}`
  );
  // editBtn.href = "quoteDetails.html";

  quoteFooter.appendChild(footerLikes);
  // footerRight.appendChild(footerLikes);
  quoteFooter.appendChild(editBtn);
  // quoteFooter.appendChild(deleteBtn);

  /* DivAction */
  const actionDiv = createHTMLElement(
    "div",
    "action col-1 quote-action-bar",
    ""
  );
  const btnFav = createHTMLElement("a", "btn quote-action-button", "");
  btnFav.addEventListener("click", async () => {
    likeQuote(q._id);
  });

  // const imgFav = createHTMLElement("i", "bi bi-heart", "");
  const imgFav = createHTMLElement("img", "quote-action-icon", "");
  // {/*<i class="bi bi-star"></i>*/}
  imgFav.src = "../images/icon/iconmonstr-heart-thin-240.png";
  imgFav.alt = "like-button";
  btnFav.appendChild(imgFav);

  actionDiv.appendChild(btnFav);

  if (q.srcYear) {
    footer.innerHTML += " (" + q.srcYear + ")";
  }

  cardBody.appendChild(quoteDetails);
  cardBody.appendChild(actionDiv);
}

async function likeQuote(quoteID) {
  const response = await fetch(`/quotes/like/${quoteID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(),
  });
  console.log("like response: ", response);
  window.location.reload();
}