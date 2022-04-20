const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8000;


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2":  {longURL: "http://www.lighthouselabs.ca"},
  "9sm5xK":  {longURL: "http://www.google.com"}
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/", (req,res) => {
  res.send("Hello!");
});

function generateRandomString() {
  return  Math.random().toString(36).slice(2,8);
}


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
  console.log(req.cookies, "cookie")
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  console.log(templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log(req.cookies)
  const templateVars = { username: req.cookies["username"],};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"],  username: req.cookies["username"],  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL }
  res.redirect(`/urls/${shortURL}`)    
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete",(req, res) => {
const shortURL = req.params.shortURL
// console.log(req.params.shortURL)
// console.log(urlDatabase[shortURL])
delete urlDatabase[shortURL]
res.redirect(`/urls`) 
})

app.get("/urls/:id/edit", (req,res) => {
 const shortURL = req.params.id
  res.redirect(`/urls/${shortURL}`) 
})

app.post("/urls/:id/edit", (req,res) => {
  const shortURL = req.params.id
  const longURL ={ longURL: req.body.longURL }
  urlDatabase[shortURL] = longURL
  res.redirect("/urls")
})

// app.post("/urls/login", (req,res) => {
//   const username = req.body.username
//   res.cookie("username", username)
//   res.redirect("/urls")
// })

app.post('/login', (req,res) => {
  const username = req.body.username
  // const name = req.cookies.username.trim()
  if (!username){
    // enableAlert('Login failed')
    return res.redirect('/urls')
  }
  res.cookie("username", username)
  // enableAlert('Loggin Success');
  console.log(username, "Logged in as:");
  res.redirect('/urls')
});

app.post('/logout', (req,res) => {
  res.clearCookie('username')
  // enableAlert('Logged out')
  res.redirect('/urls')
})



// function generateRandomString() {
//   return  Math.random().toString(36).slice(2,8);
// }



