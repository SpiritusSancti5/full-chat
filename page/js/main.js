$(function () {
  var socket = io(),
      msgBox = $('#msgBox'),
      msgField = msgBox.find('#m'),
      msgList = $('#messages');
      // generally prefer selectors over variables so i can keep track easier

  $('#msgBox').submit(function(){
    $('#messages').append('<li>'+$('#m').val()+'</li>');
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('user connect', function(msg){
    $('#messages').append($('<li class="userStatus">').text(msg));
  });

  socket.on('chat history', function(data){
    // $('#messages').find('li').remove(); // clear chat before adding chat history
    $.each(data, function(){
      $('#messages').append("<li>"+this.text+"</li>");
    });
  });
});
