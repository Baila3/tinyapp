// finding user by email function
function findUserEmail(email, database) {
  for (const user in database){
    if (database[user].email === email) {
      return database[user]
    }
  }
  return false
}
//exporting function
module.exports = {findUserEmail}