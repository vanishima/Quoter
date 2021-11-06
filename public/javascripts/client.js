/* Quotes */
const quotesDiv = document.querySelector("#quotes");

/* Username */
const username = document.querySelector("#username");

/* Search bar */
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

/* Search status */
const controlPanelDiv = document.querySelector("#control-panel");
const searchDiv = document.querySelector("#searchStatus");
searchDiv.innerHTML = "";

/* Most Recent Button */
const recentBtn = document.getElementById("mostRecentBtn");
recentBtn.addEventListener("click", () => {
  sort();
});

searchButton.addEventListener("click", () => {
  const filter = searchInput.value;
  console.log("searching for " + filter);
  reloadQuotes(filter);
});

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

async function reloadQuotes(filter) {
  console.log("reloading quotes");

  // clean up
  quotesDiv.innerHTML = "";

  // fetch quotes from /quotes
  try {
    // get list of quotes with filter
    let resRaw;
    let withSearch = false;
    if (filter.length > 0) {
      resRaw = await fetch("/quotes/search/" + filter);
      withSearch = true;
    } else {
      resRaw = await fetch("/quotes");
      console.log("Got raw");
    }

    // get the actual quotes
    const res = await resRaw.json();
    const quotes = res.quotes;
    const user = res.user;
    if (user != null) {
      const username = user.username;
      console.log(username);
      username.innerHTML = username;
    }

    let searchStatus = quotes.length + " results";
    if (withSearch == true) {
      const keywordSpan = createHTMLElement("span", "bold", res.keyword);
      searchStatus += " for ";
      searchDiv.innerHTML = searchStatus;
      searchDiv.appendChild(keywordSpan);
    } else {
      searchDiv.innerHTML = searchStatus;
    }

    // controlPanelDiv.appendChild(searchDiv);

    console.log("Got data", quotes);

    quotes.forEach(redrawQuotes);
  } catch (e) {
    quotesDiv.innerHTML = e.msg;
  }
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
  quotes.forEach(redrawQuotes);
}

reloadQuotes("");
