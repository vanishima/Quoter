let input_username = document.getElementById("uname").value;
let input_password = document.getElementById("psw").value;
let currentUser;

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const myQuotesLink = document.getElementById("myQuotesLink");
/* Usernaconst username = document.querySelector("#username");me */
const display_username = document.getElementById("display_username");

loginBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const user = { name: input_username, password: input_password };

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

  if (response.status == "OK"){
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
  display_username.href = "../user.html?user=temp";
  myQuotesLink.href = "../user.html?user=temp";
  
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
} else {
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}







