var socket = io("http://localhost:4000/");


socket.on("server-send-dki-thatbai", function () {
  alert("Sai Username (co nguoi da dang ki roi!!!)");
});

socket.on("server-send-danhsach-Users", function (data) {
  $("#boxContent").html("");
  data.forEach(function (i) {
    $("#boxContent").append("<div class='user'>" + i.fullName + "</div>");
  });
});

socket.on("server-send-dki-thanhcong", function (data) {
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});

socket.on('getChatBox',data=>{
  let arr = JSON.parse(localStorage.getItem('chatBox')) || [];
  socket.emit('chatValue',{arr, data});
})

socket.on('admin-reply',data=>{
  let {src, content, user} = data;
  let arr = JSON.parse(localStorage.getItem('chatBox')) || [];
  arr.push({ src, content});
  localStorage.setItem('chatBox', JSON.stringify(arr));

  $("#listMessages").append("<div class='ms'>" + src + ":" + content + "</div>");

})
socket.on('disconnect',d=>{
  console.log(d);
})

socket.on("server-send-message", function (data) {
  $("#listMessages").append("<div class='ms'>" + data.un + ":" + data.nd.content + "</div>");

});


$(document).ready(function () {
  (() => {
    let name = JSON.parse(localStorage.getItem('name'))
    if (name) {
      if ((+name.timeStart + 60*60 * 1000) >= +(new Date().getTime())) {

        let arr = JSON.parse(localStorage.getItem('chatBox')) || [];
        arr.forEach(element => {
          if(element.src != 'admin')
            $("#listMessages").append("<div class='ms'>" + 'me' + ":" + element.content + "</div>");
          else{
            $("#listMessages").append("<div class='ms'>" + 'admin' + ":" + element.content + "</div>");

          }
          });

        socket.emit("client-send-Username",{_id: '5ec8ebeb135f6c18bc0e5f08', fullName: 'sang' });
      }else{
        localStorage.clear();
        $("#loginForm").show();
        $("#chatForm").hide();
      }
    } else {
      $("#loginForm").show();
      $("#chatForm").hide();
    }
  }).call();
  $("#btnRegister").click(function () {
    localStorage.setItem('name', JSON.stringify({ fullName: $("#txtUsername").val(), timeStart: new Date().getTime() }));
    socket.emit("client-send-Username", {_id: '5ec8e500bc1ae931e85dfa3c', fullName: 'mtMaiMai' });
  });

  $("#btnLogout").click(function () {
    socket.emit("logout");
    $("#chatForm").hide(2000);
    $("#loginForm").show(1000);
  });

  $("#btnSendMessage").click(function () {
    let arr = JSON.parse(localStorage.getItem('chatBox')) || [];
    arr.push({ src: 'user', content: $("#txtMessage").val() });
    localStorage.setItem('chatBox', JSON.stringify(arr));
    let name = JSON.parse(localStorage.getItem('name'))

    socket.emit("user-send-message", { content: $("#txtMessage").val(), id: socket.id, fullName: name.fullName });
  
  });


});
