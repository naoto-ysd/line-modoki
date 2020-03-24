$(function(){ 
  function buildHTML(message){
   htmljs = 
     `<div class="main__messages__CurrentUser">
          <div class="upper-message">
            <div class="upper-message__user-name">
              ${message.user_name}
            </div>
            <div class="upper-message__date">
              ${message.created_at}
            </div>
          </div>
        <div class="lower-message">
          <p class="lower-message__content">
          ${message.content}
          </p>`
   if ( message.image ) {
     var html = htmljs + 
      `<div class="lower-message__image">
        <img src=${message.image} >
       </div>
     </div>`
     
     return html;

   } else {
     return htmljs + `</div>`;
    };
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
     .done(function(data){
       var html = buildHTML(data);
       $('.main__messages').append(html);
       $('.main__messages').animate({ scrollTop: $('.main__messages')[0].scrollHeight});
       $('form')[0].reset();
       $('.form__submit').prop('disabled', false);
     })
     .fail(function() {
      alert("メッセージ送信に失敗しました");
  });
  })
});

//   $('#new_message').on('submit', function(e){
//   e.preventDefault();
//   var formData = new FormData(this);
//   var url = $(this).attr('action')
//   $.ajax({
//     url: url,
//     type: "POST",
//     data: formData,
//     dataType: 'json',
//     processData: false,
//     contentType: false
//   })
//     .done(function(data){
//       var html = buildHTML(data);
//       $('.main__messages').append(html);
//       $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
//       $('form')[0].reset();
//     })
//   })
// });