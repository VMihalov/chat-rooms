const socket = io('localhost:3001');

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
  socket.emit('addRoom', title);
});
