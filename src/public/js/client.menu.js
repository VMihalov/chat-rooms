const socket = io('localhost:3001/menu', {
  withCredentials: false,
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer ' + token,
      },
    },
  },
});

socket.on('connect', () => {
  socket.emit('getAll');
});

socket.on('getRooms', (rooms) => {
  $('#roomsContainer').empty();
  rooms.forEach((element) => {
    $('#roomsContainer').append(`
    <div class="card border-dark">
        <div class="card-body text-center">
            <a class="card-link text-dark" href="/rooms/${element._id}">${element.title}</a>
        </div>
    </div><br>
    `);
  });
});

socket.on('insertRoom', (data) => {
  $('#roomsContainer').append(`
    <div class="card border-dark">
    <div class="card-body text-center">
        <a class="card-link text-dark" href="/rooms/${data.id}">${data.title}</a>
    </div>
  </div><br>
  `);
});

$('#addRoom').on('click', () => {
  const title = $('#roomsText').val();
  $('#roomsText').val('');
  socket.emit('createRoom', title);
});

$('#search').on('input', () => {
  const text = $('#search').val();
  socket.emit('searchReq', text);
})