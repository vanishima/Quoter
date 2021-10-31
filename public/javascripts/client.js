/* Search bar */
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
searchButton.addEventListener("click", () => {
  const filter = searchInput.value;
  console.log("searching for " + filter);
  reloadQuotes(filter);
});

/* Create Quote */

/* Quotes */
const quotesDiv = document.querySelector("#quotes");

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

function createComment(comments){

}

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
  const footer = createHTMLElement(
    "footer",
    "blockquote-footer",
    q.author
  );
  blockQuote.appendChild(pText);


  if (q.source.length > 0){
    const cite = createHTMLElement("cite", "", ", " + q.source);
    cite.title = "Source Title";
    footer.appendChild(cite);
  }
  blockQuote.appendChild(footer);

  /* Quote Footer */
  const footerTags = createHTMLElement("div", "greyText smallText left tags", "");
  footerTags.innerHTML =  q.tags; // q.tags.join(", ");
  quoteFooter.appendChild(footerTags);

  const footerRight = createHTMLElement("div", "right", "");
  const footerLikes = createHTMLElement("p", "likes smallText", `${q.likes} Likes`);
  quoteFooter.appendChild(footerRight);
  footerRight.appendChild(footerLikes);

  /* DivAction */
  const actionDiv = createHTMLElement("div", "action col-1 quote-action-bar", "");
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
  let quotes;
  try {
    // get list of quotes with filter
    let res;
    if (filter.length > 0){
      res = await fetch("/quotes/search/" + filter);
    } else {
      res = await(fetch("/quotes"));
    }

    console.log(res);
    // console.log("quotes:", res.quotes);
  
    if (!res.ok) {
      throw new Error("Failed to fetch quotes " + res.status);
    }

    // get the actual quotes
    quotes = await res.json();
    console.log("Got data", quotes);

    quotes.forEach(redrawQuotes);

  } catch (e) {
    quotesDiv.innerHTML = e.msg;
  }

  // redraw quotes
  // redrawQuotes(quotes);

  // const resRaw = await fetch("/getFiles");
  // const res = await resRaw.json();
}


reloadQuotes("");
