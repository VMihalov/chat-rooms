const socket = io('localhost:3001/rooms', {
  withCredentials: false,
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer ' + token,
      },
    },
  },
});
const roomId = window.location.pathname.substr(7);

socket.on('connect', () => {
  socket.emit('joinToRoom', roomId);
  socket.emit('getAllMessages', roomId);
});

socket.on('userJoined', (number) => {
  $('#members').empty();
  //$('#members').append(`<h1>${number}</h1>`);
  for (let i = 0; i < number; i++)
    $('#members').append(`
    <img src="/images/avatar.png" alt="Avatar" class="md-avatar">
    `);
});

socket.on('insertAll', (messages) => {
  messages.forEach((element) => {
    $('#messagesList').append(`
    <li class="out">
        <div class="chat-img">
            <img alt="Avatar" src="https://bootdey.com/img/Content/avatar/avatar6.png">
        </div>
        <div class="chat-body">
            <div class="chat-message">
                <p>${element.text}</p>
            </div>
        </div>
    </li>
    `);
  });

  $('#overflowDiv').scrollTop($('#overflowDiv')[0].scrollHeight);
});

socket.on('insertMessage', (data) => {
  $('#messagesList').append(`
  <li class="out">
      <div class="chat-img">
          <img alt="Avatar" src="/images/avatar.png">
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

socket.on('exception', (data) => {
  console.log(data);
  $('#error').append(`
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>${data.message}!</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
`);
});

$('#sendMessage').on('click', () => {
  const text = $('#message').val();
  $('#message').val('');
  socket.emit('addMessage', { roomId, text });
});
