$(function(){
  //カスタムデータ属性を利用し、ログインしているユーザーのIDを取得
  let current_user_ID = $('.header__name').data("current-user");
  let last_message_id = ""
  let last_message_id_current = ""
  let last_message_id_other = ""

  function last_message_setter(){
    //自動更新するときは最新のメッセージをテーブルから取得する
    //ページ上に表示されている”main__messages__CurrentUser”と
    //main__messages__OtherUserの最新メッセージを比較して大きい方をlast_message_idとしている。
    last_message_id_current = $('.main__messages__CurrentUser:last').data("message-id");
    last_message_id_other = $('.main__messages__OtherUser:last').data("message-id");
    if (last_message_id_current > last_message_id_other){
      last_message_id = last_message_id_current
    } else{
      last_message_id = last_message_id_other
    }
    //新しく作ったグループだとメッセージからlast_message_idを取得できないので0を設定しておく
    if (last_message_id == null){
      last_message_id = 0
    }      
  }

  function buildHTML(message, current_user_ID, message_user_id){
    let html_baloon = ""
    if (message_user_id == current_user_ID) {
      html_baloon = 
        `<div class="main__messages__CurrentUser" data-message-id=${message.id} >`
    } else {
      html_baloon = 
        `<div class="main__messages__OtherUser" data-message-id=${message.id} >`
    }
    html_baloon = html_baloon + 
      `<div class="upper-message">
        <div class="upper-message__user-name">
          ${message.user_name}
        </div>
        <div class="upper-message__date">
          ${message.created_at}
        </div>
      </div>
      <div class="lower-message" data-message-user=${message_user_id}>
        <p class="lower-message__content">
          ${message.content}
        </p>`
   if ( message.image ) {
     html_baloon = html_baloon + 
      `<div class="lower-message__image">
        <img src=${message.image} >
       </div>
       </div>
     </div>;`
     
     return html_baloon;

   } else {
      html_baloon = html_baloon +
        `</div> 
        </div>`

      return html_baloon
    };
  }

  $('#new_message').on('submit', function(e){
    //最新のメッセージを設定
    last_message_setter()
    e.preventDefault();
    let formData = new FormData(this);
    let url = $(this).attr('action')
    // messages#createにいく
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      //buildHTMLの第2引数と第3引数が同じ理由
      //メッセージを送った人(Submitボタンを押した人)とログイン中のユーザーは同じになるため。
      //buildHTMLメソッドでは第2引数と第3引数が同じ場合に緑色の吹き出しを生成しているので
      //そのため、メッセージの新規投稿ではbuildHTMLの引数は第2引数と第3引数に同じ値を設定している
      //なお、reloadMessages内で呼び出しているbuildHTMLについては
      //メッセージごとにメッセージに紐づくユーザーIDを取り出してbuildHTMLに渡している。
      let html = buildHTML(data, current_user_ID, current_user_ID);
        $('.main__messages').append(html);
        $('.main__messages').animate({ scrollTop: $('.main__messages')[0].scrollHeight});
        $('form')[0].reset();
        $('.form__submit').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    })
  })

  var reloadMessages = function() {
    //最新のメッセージを設定
    last_message_setter()
    //api/messages#indexにいく
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        let insertHTML = '';
        $.each(messages, function(i,message) {
          insertHTML += buildHTML(message, current_user_ID, message.user_id)
        });
        $('.main__messages').append(insertHTML);
        $('.main__messages').animate({ scrollTop: $('.main__messages')[0].scrollHeight});
      };
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});