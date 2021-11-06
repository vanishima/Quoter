console.log("inside authors.js");

/* Username */
const username = document.querySelector("#username");

const authorsDiv = document.querySelector("#authors");

async function reloadAuthors() {
  console.log("reloading authors");

  authorsDiv.innerHTML = "";

  try {
    // get list of quotes with filter
    let resRaw = await fetch("/authors");
    console.log("Got raw");

    // get the actual authors
    const res = await resRaw.json();
    const authors = res.authors;
    
    console.log("Got data", authors);
    authors.forEach(redrawAuthors);

  } catch (e) {
    authorsDiv.innerHTML = e.msg;
  }
}

async function redrawAuthors(author){
  const authorDiv = createAuthorElement(author);
  authorsDiv.appendChild(authorDiv);
}

function createAuthorElement(author){
  const authorDiv = createHTMLElement("a", "author btn btn-info me-3 mb-3", author.name);
  authorDiv.setAttribute("href", "/pages_details/authorDetails.html?author=" + author._id);

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

reloadAuthors();