const quoteDetails = document.querySelector("form#quoteDetails");
const deleteBtn = document.querySelector("#quoteDelete");

const searchParams = (new URL(document.location)).searchParams;
const quoteID = searchParams.get("quoteID");
console.log("Enter quoteDetails.js for", quoteID);

let quote;

const quoteText = document.querySelector("#quoteText");
const quoteAuthor = document.querySelector("#quoteAuthor");
const quoteSource = document.querySelector("#quoteSource");
const quoteSrcYear = document.querySelector("#quoteSrcYear");
const quoteTags = document.querySelector("#quoteTags");

async function drawQuote(quoteID) {
  try {
    const resRaw = await fetch(`/quotes/${quoteID}`);

    const res = await resRaw.json();
    quote = res.quote;

    // quote.quoteID = quoteID;
    quoteText.innerText = quote.text;
    quoteAuthor.setAttribute("value", quote.author);
    quoteSource.setAttribute("value", quote.source);
    quoteSrcYear.setAttribute("value", quote.srcYear);
    quoteTags.setAttribute("value", quote.tags);

  } catch (e) {
    quoteText.innerHTML = e.msg;
  }
}

quoteDetails.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  console.log("quoteDetails submit");

  const quoteData = new FormData(quoteDetails);
  // const data = {};
  for (let [key, val] of quoteData.entries()){
    quote[key] = val;
  }

  // const text = quoteDetails.querySelector("#quoteText");

  const fetchRes = await fetch("/quotes/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  });
  const res = await fetchRes.json();

  console.log("Got response", res);

  if (res.status == "OK"){
    window.location.replace("../index.html");
  } else {
    // show error message
  }
});

if (quoteID != null){
  drawQuote(quoteID);
}

deleteBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  console.log("quoteDetails delete");

  // console.log(quote);

  const fetchRes = await fetch("/quotes/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  });
  const res = await fetchRes.json();

  console.log("Got response", res);

  if (res.status == "OK"){
    window.location.replace("../index.html");
  } else {
    // show error message
  }
});


