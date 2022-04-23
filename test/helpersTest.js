const { assert } = require('chai');

const { findUserEmail } = require('../helpers.js');

const testUsers = {
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
};

describe('findUserEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user["email"], testUsers[expectedUserID]["email"])
  });
  it('should return  undefined if the email was not found', function() {
    const user = findUserEmail("new@Email", testUsers) 
    assert.isUndefined(user)
  });
});