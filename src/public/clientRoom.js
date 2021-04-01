const socket = io('localhost:3001');
const roomId = window.location.pathname.substr(7);

$('#overflowDiv').scrollTop($('#overflowDiv')[0].scrollHeight);

socket.on('connect', (user) => {
  socket.emit('joinToRoom', roomId);
});

socket.on('insertMessage', (data) => {
  $('#messagesList').append(`
  <li class="out">
      <div class="chat-img">
          <img alt="Avatar" src="https://bootdey.com/img/Content/avatar/avatar6.png">
      </div>
      <div class="chat-body">
          <div class="chat-message">
              <p>${data}</p>
          </div>
      </div>
  </li>
  `);

  $('#overflowDiv').scrollTop($('#overflowDiv')[0].scrollHeight);
});

$('#sendMessage').on('click', () => {
  const text = $('#message').val();
  $('#message').val('');
  socket.emit('addMessage', { roomId, text });
});
