const quotesDiv = document.querySelector("#quotes");

async function redrawQuotes(quotes){
  for (let q of quotes){
    // create a quote div
    const divQ = document.createElement("div");
    divQ.className = "col-4 quote";

    const divText = document.createElement("div");
    divText.className = "quote-text";
    divText.innerText = q.text;

    const divAuthor = document.createElement("div");
    divAuthor.className = "quote-author";
    divAuthor.innerText = q.author;

    const divAction = document.createElement("div");
    divAction.className = "quote-action row";
    const btnFav = document.createElement("button");
    btnFav.className = "btn btn-primary";
    btnFav.innerText = "fav";

    divAction.appendChild(btnFav);

    divQ.appendChild(divText);
    divQ.appendChild(divAuthor);
    divQ.appendChild(divAction);

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