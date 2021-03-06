var app = require('express')();
var express = require('express');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const adminNamespace = io.of('/admin');
const Axios = require('axios');
const api = 'https://event-orgnization.herokuapp.com/api';
const Users = require('./utils/users');
const {
  adminJoin,
  getCurrentAdmin,
  adminLeave,
  getRoomAdmin,
  getClientRoom,
  pushClientRoom
} = require('./utils/admins');

app.use(express.json())
app.set('view engine', "ejs");
app.set("views", "./views/layouts");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

server.listen(process.env.PORT || 4000, () => {
  console.log('open localhost:4000');
});

// Users.userJoin('5ec8cff211a11d17ae93aed3', 'ptmai', "");

adminNamespace.on("connect", (socket) => {

  socket.on('admin-vao', data => {

    const admin = adminJoin(socket.id, data, 'Admin', []);
    socket.Username = data;
    adminNamespace.emit("server-sent-user", Users.getArrUsers());
  })

  socket.on('getContent', data => {

    let u = Users.getCurrentUser(data.id);
    if (!u) {
      return;
    }
    Axios.get(`${api}/chat/get_list`, {
      params: {
        sender: u.id
      }
    }).then(d => {
      adminNamespace.emit('chatValue', { value: { user: u, arr: d.data.result } });
    }).catch(e => {

    });
    // let id = u._id[0];
    // io.to(id).emit('getChatBox',{data});

  })

  socket.on('admin-sent-content', data => {
    let { src, content, user } = data;
    Axios.post(`${api}/chat/save`,
      {
        sender: 'admin',
        receiver: user.id,
        content: data.content
      });

    io.to(user.id).emit('admin-reply', { src, content, user })
  })


  socket.on('SeenMessage', data => {
    let u = updateSeen(data.id);
    if (u) {
      adminNamespace.emit('updateSeenSuccess', u);
    }
  })

  socket.on('getUser', data => {
    adminNamespace.emit("server-sent-user", Users.getArrUsers());
  })

  socket.on('update-read', data=>{
    let user = data.user;
    Users.updateSeen(user.id);
  });


  socket.on("disconnect", function () {
    adminLeave(socket.id)
  });
})

// client connect to chat
io.on("connection", function (socket) {
  socket.on("client-send-Username", async function (data) {
    // let u = await Users.checkUserFollowFullName(data);
    if (!data._id) {
      io.to(socket.id).emit('login-failure');
      return;
    }
    let u1 = await Users.getCurrentUser(data._id);
    socket.join(data._id);
    let user = u1;
    if (!u1) {
      user = Users.userJoin(data._id, data.fullName, "");
      adminNamespace.emit("newUserConnect", user);
    } else {
      user = Users.increaseCount(data._id);
    }

    socket.Username = data;
    // socket.emit("server-send-dki-thanhcong", data);
    // io.sockets.emit("server-send-danhsach-Users", Users.getArrUsers());

  });

  // socket.on('chatValue', data => {
  //   adminNamespace.emit('chatValue', { value: data });
  // });

  socket.on("disconnect", function () {
    if (socket.Username) {
      let u = Users.decreaseCount(socket.Username._id);
      if (u) {
        // user nay van con.

      } else {
        const user = Users.userLeave(socket.Username._id);// Users.userLeaveFullName(socket.Username);
        if (user) {
          adminNamespace.emit("user-leave", user);
        }
      }
    }
  });

  socket.on("user-send-message", function (data) {
    if (socket.Username) {
      let u = Users.updateRead(socket.Username._id);
      Axios.post(`${api}/chat/save`,
        {
          sender: socket.Username._id,
          receiver: 'admin',
          fullName: socket.Username.fullName,
          content: data.content
        });
      adminNamespace.emit("userSentMessage", { user: u, data });
      io.to(socket.Username._id).emit("server-send-message", { un: socket.Username, nd: data });
    } else {
      io.to(socket.id).emit('login-failure');
    }
    adminNamespace.emit("server-send-message", { un: socket.Username, nd: data })
  });
});

app.post("/api/post/comment", (req, res) => {
  let { eventId, cmt } = req.body;
  io.emit(`cmt-${eventId}`, cmt);
  res.send({ 't': true });
})

app.get("/", function (req, res) {
  res.render("trangchu");
});
app.get("/1", function (req, res) {
  res.render("trangchu1");
});