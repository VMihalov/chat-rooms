const socket = io('localhost:3001');

socket.on('connect', () => {
  console.log('connected');


});


