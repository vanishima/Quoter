console.log("inside login.js");

let currentUser;

const logoutOptionBtn = document.getElementById("logoutOptionBtn");
const loginSignUpBtn = document.getElementById("loginSignUpBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutConfirmBtn");
const myQuotesLink = document.getElementById("myQuotesLink");
const display_username = document.getElementById("display_username");

const inputUserID = document.getElementById("inputUserID");

logoutBtn.addEventListener("click", async(evt) => {
  evt.preventDefault();
  sessionStorage.clear();
  window.location.reload();
  alert("You have successfully logged out!");
});

loginBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let input_username = document.getElementById("uname").value;
  let input_password = document.getElementById("psw").value;

  let user = { name: input_username, password: input_password };

  // attemp to log in
  const response = await fetch("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(user),
  });
  console.log("login response: ", response);
  const res = await response.json();

  if (response.status == 200){
    user = res.user;
    currentUser = user;
    sessionStorage.setItem("username", input_username);
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    console.log("logged in sessionStorage", JSON.parse(sessionStorage.getItem("currentUser")).name);
    window.location.reload();
  } else {
    alert("incorrect username or password");
  }
});

if (sessionStorage.getItem("currentUser") != null){
  currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  console.log("user logged in", currentUser);

  display_username.innerHTML = currentUser.name;
  // display_username.href = "../user.html?user=" + user._id;
  display_username.href = "../user.html?user=" + currentUser._id;
  myQuotesLink.href = "../user.html?user=" + currentUser._id;

  if (inputUserID != null){
    inputUserID.value = currentUser._id;
  }
  
  loginSignUpBtn.style.display = "none";
  logoutOptionBtn.style.display = "block";
} else {
  loginSignUpBtn.style.display = "block";
  logoutOptionBtn.style.display = "none";
}







