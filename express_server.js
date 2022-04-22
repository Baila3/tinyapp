const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8000;


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2":  {longURL: "http://www.lighthouselabs.ca",  userID: "aJ48lW"},
  "9sm5xK":  {longURL: "http://www.google.com",  userID: "aJ48lW"}
};
console.log(urlDatabase["b2xVn2"]["userID"])
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
// const userId = generateRandomString()
//   const user = {id: userId, email: mail, password: pass}
//   users[userId] = user


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/", (req,res) => {
  res.send("Hello!");
});

function urlsForUser(id) {
 let arr = []
 for (const url in urlDatabase )
  if (id === urlDatabase[url]["userID"]) {
    arr.push(url)
  }
  return arr
};




function generateRandomString() {
  return  Math.random().toString(36).slice(2,8);
};

function findUserEmail(email) {
  console.log(email)
  for (const user in users){
    // console.log(users[user], "obj")
    if (users[user].email === email) {
      return users[user]
    }
  }
  return false
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
  const userId = req.cookies.userId
  if (userId === null || userId === undefined) {
    return res.send("users should <a href=/login> login </a> first ")
  }
  console.log(users)
  // console.log(userId)
  // console.log(users)
  // return res.send("hello")
  // let userId = users[req.cookies.userId] 
  // user = user?.email != undefined ? user : { id: null, email: null, password: null}
  const user = users[userId]
  console.log("user:", user)
  console.log(urlDatabase)
  // if (!user) {
  //   return res.render("/register")
  // }
  // console.log(userId)
  // console.log(user)
  // return res.send("hello")
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.userId
  if (userId === null || userId === undefined) {
    return res.redirect("/login")
  }
  const user = users[userId]
  // console.log(req.cookies)
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies.userId
  if (userId === null || userId === undefined) {
    return res.send("users should <a href=/login> login </a> first ")
  }
  const user = users[userId]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: user  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const userID = req.cookies.userId
  const shortURL = generateRandomString(); 
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID }
  res.redirect(`/urls/${shortURL}`)    
});

app.get("/u/:shortURL", (req, res) => {
  let URL = urlDatabase[req.params.shortURL];
  if (URL === undefined) {
    return res.send("Link is invalid")
  }
  const userId = req.cookies.userId
  if (userId === null || userId === undefined) {
    return res.send("users should <a href=/login> login </a> first ")
  }
  res.redirect(URL.longURL);
});

app.post("/urls/:shortURL/delete",(req, res) => {
const userId = req.cookies.userId
// console.log("new",userId)
urlsForUser(userId)
// console.log("boy",userId)
// const urlsID = urlsForUser(userId)
// if (!urlsID) {
//   return res.send("users should <a href=/login> login </a> first ")
// }
const shortURL = req.params.shortURL
const urlToDelete = urlDatabase[shortURL]
if (urlToDelete["userID "]!== userId) {
  return res.send(400)
}
// deleteFunc(shortURL, urlsForUser)
// console.log(req.params.shortURL)
// console.log(urlDatabase[shortURL])
delete urlDatabase[shortURL]
res.redirect(`/urls`) 
})

app.get("/urls/:id/edit", (req,res) => {
  const shortURL = req.params.id
  // const userId = req.cookies.userId
  // if (!urlsID) {
  //   return res.send("users should <a href=/login> login </a> first ")
  // }
  res.redirect(`/urls/${shortURL}`) 
})

app.post("/urls/:id/edit", (req,res) => {
  const userId = req.cookies.userId
  const shortURL = req.params.id
  const longURL = req.body.longURL 
 const urlToDelete = urlDatabase[shortURL]
 if (urlToDelete["userID"] !== userId) {
  return res.send(400)
}
  urlDatabase[shortURL]["longURL"] = longURL
  res.redirect("/urls")
})

// app.post("/urls/login", (req,res) => {
//   const username = req.body.username
//   res.cookie("username", username)
//   res.redirect("/urls")
// })

app.get('/login', (req,res) => {
  const userId = req.cookies.userId
  // console.log(userId)
  if (userId) {
    return res.redirect("/urls")
  }
  
  const templateVars =  { user: null };
  res.render('urls_login', templateVars)
  })

app.post('/login', (req,res) => {
  const {email, password} = req.body
  // console.log(email)
  // return res.send("hello")
  // if (findEmail.email !== email && findEmail.password !== password){
  //   // enableAlert('Login failed')
  //   return res.send(403)
  // }
  
 
  const findEmail = findUserEmail (email) 
  if (findEmail["email"] !== email) { 
    return res.send(403)
  }
  if (findEmail["password"] !== password) { 
    return res.send(403)
  }
  const ID = findEmail.id
  
  // const ID = findEmail.id
  // console.log(email)
  // console.log("id", ID)
  // res.cookie("userId", iD)
  res.cookie("userId", ID)
  res.redirect("/urls")

  // const name = req.cookies.username.trim()
 

  // res.cookie("user")
  // enableAlert('Loggin Success');
  // console.log(username, "Logged in as:");
  // return res.redirect('/urls')
});

app.get('/logout', (req,res) => {
  res.clearCookie('userId')
  // enableAlert('Logged out')
  return res.redirect('/register')
})

app.get('/register', (req,res) => {
const userId = req.cookies.userId
// console.log(userId)
if (userId) {
  return res.redirect("/urls")
}

const templateVars =  { user: null };
res.render('urls_register', templateVars)
})


app.post("/register", (req,res) => {
  const mail = req.body.email
  const pass = req.body.password
  if (!mail || !pass) {
    return res.send(400)
  }
  const userId = generateRandomString()
  const user = {id: userId, email: mail, password: pass}
  // console.log(users)
  const findEmail = findUserEmail(mail) 
  console.log(findEmail)
  if (findEmail["email"] === mail) {
    return  res.send(400)
   }
   users[userId] = user
  res.cookie("userId", userId)
  res.redirect("/urls")
  
})


// function generateRandomString() {
//   return  Math.random().toString(36).slice(2,8);
// }



