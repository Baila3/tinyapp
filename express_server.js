// requires
const express = require("express");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')
const helpers = require('./helpers')
const bodyParser = require("body-parser");

//app support
const app = express();
const PORT = 8000;
const salt = bcrypt.genSaltSync(10)

//app uses
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["THE KEYS"],
}))

app.use(function (req, res, next) {
  req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
  next()
})

app.set("view engine", "ejs");

// Databases
const urlDatabase = {
  "b2xVn2":  {longURL: "http://www.lighthouselabs.ca",  userID: "aJ48lW"},
  "9sm5xK":  {longURL: "http://www.google.com",  userID: "aJ48lW"}
};


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", salt)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", salt)
  }
}



// app.get("/", (req,res) => {
//   res.send("Hello!");
// });


// function urlsForUser(id) {
//  let arr = []
//  for (const url in urlDatabase )
//   if (id === urlDatabase[url]["userID"]) {
//     arr.push(url)
//   }
//   return arr
// };




function generateRandomString() {
  return  Math.random().toString(36).slice(2,8);
};

// function findUserEmail(email, database) {
//   console.log(email)
//   for (const user in database){
//     // console.log(users[user], "obj")
//     if (database[user].email === email) {
//       return database[user]
//     }
//   }
//   return false
// }

// app testing
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// URl page route
app.get("/urls", (req,res) => {
  const userId = req.session.user_id

  if (userId === null || userId === undefined) {
    return res.send("users should <a href=/login> login </a> first ")
  }

  const user = users[userId]
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id

  if (userId === null || userId === undefined) {
    return res.redirect("/login")
  }

  const user = users[userId]
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

// creation url route
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id

  if (userId === null || userId === undefined) {
    return res.send("users should <a href=/login> login </a> first ")
  }

  const user = users[userId]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: user  };
  res.render("urls_show", templateVars);
});

// Url page
app.post("/urls", (req, res) => {
  const userID = req.session.user_id
  const shortURL = generateRandomString(); 
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID }
  res.redirect(`/urls/${shortURL}`)    
});

// short url link 
app.get("/u/:shortURL", (req, res) => {
  let URL = urlDatabase[req.params.shortURL];

  if (URL === undefined) {
    return res.send("Link is invalid")
  }

  const userId = req.session.user_id

  if (userId === null || userId === undefined) {
    return res.send("users should <a href=/login> login </a> first ")
  }

  res.redirect(URL.longURL);
});

// delete url page
app.post("/urls/:shortURL/delete",(req, res) => {
  const userId = req.session.user_id
  const shortURL = req.params.shortURL
  const urlToDelete = urlDatabase[shortURL]

  if (urlToDelete["userID"]!== userId) {
    return res.send(400)
  }

  delete urlDatabase[shortURL]
  res.redirect(`/urls`) 
})

// edit url route
app.get("/urls/:id/edit", (req,res) => {
  const shortURL = req.params.id

  res.redirect(`/urls/${shortURL}`) 
})

// edit url page
app.post("/urls/:id/edit", (req,res) => {
  const userId = req.session.user_id
  const shortURL = req.params.id
  const longURL = req.body.longURL 
  const urlToDelete = urlDatabase[shortURL]

 if (urlToDelete["userID"] !== userId) {
  return res.send(400)
}

  urlDatabase[shortURL]["longURL"] = longURL
  res.redirect("/urls")
})

// login route
app.get('/login', (req,res) => {
  const userId = req.session.user_id

  if (userId) {
    return res.redirect("/urls")
  }
  
  const templateVars =  { user: null };
  res.render('urls_login', templateVars)
  })

// login page
app.post('/login', (req,res) => {
  const {email, password} = req.body
 
  const findEmail = helpers.findUserEmail (email, users) 

  if (findEmail["email"] !== email) { 
    return res.send(403)
  }

  if (!bcrypt.compareSync(password, findEmail.password)) { 
    return res.send(403)
  }

  const ID = findEmail.id
  
  
  req.session.user_id = ID
  res.redirect("/urls")
});

// logout route
app.get('/logout', (req,res) => {
   req.session.user_id = null
  return res.redirect('/register')
})

// register route
app.get('/register', (req,res) => {
const userId = req.session.user_id

if (userId) {
  return res.redirect("/urls")
}

const templateVars =  { user: null };
res.render('urls_register', templateVars)
})

// register page
app.post("/register", (req,res) => {
  const mail = req.body.email
  const pass = req.body.password

  if (!mail || !pass) {
    return res.send(400)
  }

  const userId = generateRandomString()
  const user = {id: userId, email: mail, password:  bcrypt.hashSync(pass, salt)}
  
  const findEmail = helpers.findUserEmail(mail, users) 

  if (findEmail["email"] === mail) {
    return  res.send(400)
   }
   
   users[userId] = user
  
   const ID = userId
 
  req.session.user_id = ID
  res.redirect("/urls")
  
})







