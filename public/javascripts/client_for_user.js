/* Quotes */
const quotesDiv = document.querySelector("#quotes");

/* Search bar */
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

/* Most Recent Button */
const recentBtn = document.getElementById("mostRecentBtn");
recentBtn.addEventListener("click", () => {
  sort();
});

// searchButton.addEventListener("click", () => {
//   const filter = searchInput.value;
//   console.log("searching for " + filter);
//   reloadQuotes(filter);
// });

/* Create Quote */

function createHTMLElement(type, classes, theInnerText) {
  const ele = document.createElement(type);
  if (classes.length > 0) {
    ele.className = classes;
  }
  if (theInnerText.length > 0) {
    ele.innerText = theInnerText;
  }
  return ele;
}

// TODO: MODULARIZE HTML ELEMENT CREATION

function createComment(comments) {}

async function redrawQuotes(q) {
  // create a quote card
  const divQ = createHTMLElement("div", "card mb-3", "");
  quotesDiv.appendChild(divQ);

  const cardBody = createHTMLElement("div", "card-body row", "");
  divQ.appendChild(cardBody);

  /* Quote Details: blockQuote, quoteFooter*/
  const quoteDetails = createHTMLElement("div", "quoteDetails col-11", "");
  const blockQuote = createHTMLElement("blockquote", "blockquoter", "");
  const quoteFooter = createHTMLElement("div", "quoteFooter", "");

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
    "greyText smallText left tags",
    ""
  );
  footerTags.innerHTML = q.tags; // q.tags.join(", ");
  quoteFooter.appendChild(footerTags);

  const footerRight = createHTMLElement("div", "right row", "");
  const footerLikes = createHTMLElement(
    "p",
    "likes smallText col-auto",
    `${q.likes} Likes`
  );
  // const footerEditLink =createHTMLElement("a", "editLink", "");
  const footerEdit = createHTMLElement("a", "editLink smallText col-auto bold greenText", "Edit");
  footerEdit.href = "quotes/edit";
  const footerDelete = createHTMLElement("a", "editLink smallText col-auto bold greenText", "Delete");
  footerDelete.href = "#";
  quoteFooter.appendChild(footerRight);
  footerRight.appendChild(footerLikes);
  footerRight.appendChild(footerEdit);
  footerRight.appendChild(footerDelete);

  /* DivAction */
  const actionDiv = createHTMLElement(
    "div",
    "action col-1 quote-action-bar",
    ""
  );
  const btnFav = createHTMLElement("a", "quote-action-button", "");
  btnFav.href = "#";
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

async function reloadQuotes(filter) {
  console.log("reloading quotes");

  // clean up
  quotesDiv.innerHTML = "";

  // fetch quotes from /quotes
  try {
    // get list of quotes with filter
    let resRaw;
    if (filter.length > 0) {
      resRaw = await fetch("/quotes/search/" + filter);
    } else {
      resRaw = await fetch("/quotes");
      console.log("Got raw");
    }

    // get the actual quotes
    const res = await resRaw.json();
    const quotes = res.quotes;
    console.log("Got data", quotes);

    quotes.forEach(redrawQuotes);
  } catch (e) {
    quotesDiv.innerHTML = e.msg;
  }
}

async function sort() {
  console.log("sorting quotes");

  // clean up
  quotesDiv.innerHTML = "";

  // fetch quotes from /quotes
  let quotes;
  try {
    // get list of quotes with filter
    const res = await fetch("/quotes/most-recent");

    if (!res.ok) {
      throw new Error("Failed to fetch quotes " + res.status);
    }

    // get the actual quotes
    quotes = await res.json();
  } catch (e) {
    quotesDiv.innerHTML = e.msg;
  }

  // redraw quotes
  redrawQuotes(quotes);
}

reloadQuotes("");