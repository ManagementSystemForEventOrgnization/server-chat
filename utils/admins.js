const admins = [];

// Join admin to chat
function adminJoin(id, adminName, room, roomClient) {
  const admin = { id, adminName, room, roomClient };

  admins.push(admin);

  return admin;
}

// Get current admin
function getCurrentAdmin(id) {
  return admins.find(admin => admin.id === id);
}

//push clientRoom
async function pushClientRoom ( id, name){
  let ad = await admins.find(admin=>admin.id===id);
  ad.roomClient.push(name);
}

// Get clientRom
function getClientRoom(id){
  return admins.find(admin=>admin.id===id);
}

// admin leaves chat
function adminLeave(id) {
  const index = admins.findIndex(admin => admin.id === id);
  if (index !== -1) {
    return admins.splice(index, 1)[0];
  }
}

// Get room admins
function getRoomAdmins(room) {
  return admins.filter(admin => admin.room === room);
}

module.exports = {
  adminJoin,
  getCurrentAdmin,
  adminLeave,
  getRoomAdmins,
  getClientRoom,
  pushClientRoom
};
