const users = [];


function userJoin(id, username,avatar) {
  const user = { id, username,avatar};

  users.push(user);

  return user;
}


function getCurrentUser(id) {
  
  return users.find(user => user.id === id);
}

module.exports = {
  userJoin,
  getCurrentUser
};