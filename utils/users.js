const users = [];
const key = "id";
module.exports = {
  // Join user to chat
  userJoin: (id, fullName, room) => {
    const user = {
      id, fullName, room, isRead: true,
      isLoad: false, number: 0,
      count: 1,
    };
    users.push(user);
    return user;
  },

  getCount: (id) => {
    let u = users.find(user => user[key] === id);
    return u.count;
  },

  increaseCount: (id) => {
    let u = users.find(user => user[key] === id);
    u.count++;
    return u;
  },

  decreaseCount: (id) => {
    let u = users.find(user => user[key] === id);
    if (!u) {
      return false;
    }
    u.count--;
    return u.count ? true : false;
  },
  // Get current user
  getCurrentUserFullName: (fullName) => {
    return users.find(user => user[key] === fullName);
  },
  // Get current user
  getCurrentUser: (id) => {
    return users.find(user => user[key] === id);
  },

  checkUserFollowFullName: (fullName) => {
    return users.find(user => user.fullName === fullName);
  },
  // User leaves chat
  userLeave: (id) => {
    const index = users.findIndex(user => user[key] === id);
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  },
  userLeaveFullName: (fullName) => {
    const index = users.findIndex(user => user.fullName === fullName);

    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  },
  // Get room users
  getRoomUsers: (room) => {
    return users.filter(user => user.room === room);
  },

  getArrUsers: () => {
    return users;
  },

  updateId: (fullName, id) => {
    let u = users.find(user => user.fullName === fullName);
    if (!u) {
      return false;
    }
    u.id = id;
    return u;
  },

  updateRead: (id) => {
    let u = users.find(user => user[key] === id);
    if (u) {
      u.number++;
      u.isRead = false;
      return u;
    } else {
      return false;
    }
  },

  updateSeen: (id) => {
    let u = users.find(user => user[key] === id);
    if (u) {
      u.number = 0;
      u.isRead = true;
      return u;
    }
  }
}