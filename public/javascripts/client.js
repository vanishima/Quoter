/* Search bar */
// let searchText = document.getElementById("inputSearch");
// let searchBtn = document.getElementById("btnSearch");
// let temp = document.querySelector("#temp");
// searchBtn.addEventListener("click", () => {
//   const tagStr = searchText.textContent || searchText.innerText;
//   const filerList = new Set();
//   const tags = tagStr.split(" ");
//   for (let tag of tags){
//     filerList.add(tag);
//     console.log(tag);

//   }
//   temp.innerText = tagStr;
//   console.log(filerList);
// });


/* Quotes */
const quotesDiv = document.querySelector("#quotes");

function createHTMLElement(type, classes, theInnerText){
  const ele = document.createElement(type);
  if (classes.length > 0){
    ele.className = classes;
  }
  if (theInnerText.length > 0){
    ele.innerText = theInnerText;
  }
  return ele;
}

async function redrawQuotes(quotes){
  for (let q of quotes){
    // create a quote card
    const divQ = createHTMLElement("div", "card", "");
    const cardBody =  createHTMLElement("div", "card-body row", "");

    const blockQuote = createHTMLElement("blockquote", "blockquote col-11", "");
    const pText = createHTMLElement("p", "", q.text);
    const footer = createHTMLElement("footer", "blockquote-footer", q.author + ", ");
    const cite = createHTMLElement("cite", "", q.source);
    cite.title = "Source Title";

    const divBtn = createHTMLElement("div", "col-1 quote-action-bar", "");
    const btnFav = createHTMLElement("a", "quote-action-button", "");
    const imgFav = createHTMLElement("img", "quote-action-icon", "");
    imgFav.src = "../images/icon/iconmonstr-heart-thin-240.png";
    imgFav.alt = "like-button";
    btnFav.appendChild(imgFav);
    divBtn.appendChild(btnFav);

    footer.appendChild(cite);
    if (q.srcDate){
      footer.innerHTML += " (" + q.srcDate +")";
    }

    blockQuote.appendChild(pText);
    blockQuote.appendChild(footer);

    cardBody.appendChild(blockQuote);
    cardBody.appendChild(divBtn);
    divQ.appendChild(cardBody);
    quotesDiv.appendChild(divQ);
  }
}

async function reloadQuotes() {
  // clean up
  quotesDiv.innerHTML = "";

  // fetch quotes from /quotes
  let quotes;
  try {
    // get list of quotes
    const res = await fetch("/quotes");

    if (!res.ok){
      throw new Error("Failed to fetch quotes " + res.status);
    }

    // get the actual quotes
    quotes = await res.json();
  } catch (e){
    quotesDiv.innerHTML = e.msg;
  }

  // redraw quotes
  redrawQuotes(quotes);
}


reloadQuotes();