
$(document).ready(function() {

    //Managment server integration module//

    var major = '12345';
    var minor = '67890';
    //two vars above this should come from beacon integration


    var serverDomain = 'http://argov.grn.cc/';
    var managmentServerUrl = serverDomain + 'Server/app/response.php?callback=?';
    var method = 'GET';
    var connectionFlag = '0'; //0 is income, 1 is disconnect
    var bid = major+ '.' + minor;
    window.cid = ''; //recieved by server and shouold be sent to server upon DC

    //preping global vars
    var chatAmount ='';
    var userImg = '';
    var localID = '';
    var connectionStatus = '';

    window.initiatePrimaryConnection = function(){
    var getReqDataString = 'rid=' + connectionFlag + '&bid=' + bid; //connection GET request string
    $.getJSON(managmentServerUrl,getReqDataString).done(function(res){
      console.log(res);
      connectionStatus = res.connection;
      window.cid = res.cid;
      chatAmount = res.amount;
      userImg = res.img;
      localID = res.localID; //Beacon ID @ the server
    }).fail(function(e){
      alert('Oops ! problems!, stub generated');
      console.log(e);
      connectionStatus = 0;
      window.cid = 0;
      chatAmount = 5;
      userImg = 'avatars/cyan.png';
      localID = 0;
    });

  };
    //end of server integration module//

    //global data
    var url = 'https://hackidc2015.imrapid.io/message';
    var roomID = bid + 'BeaconRoom';
    var projectName = 'hackidc2015'; //do not change ! server critical (RapidAPI)
    var chatMsg ='';


    //////////////
    // Pre Chat //
    //////////////



    console.log(window.clientName);
    console.log('got JQ on via integration');

    var userID = localID;

    //message output
    $('#sendMsg').click(function(){

      chatMsg = $('#chatMsg').val();
      $('#chatMsg').val('');
      var msg = {
        name: window.clientName,
        message : chatMsg,
        room : roomID,
        userID : userID,
        userImg : userImg,
        msgType : 'txt'
      };
      console.log('sending message object.. msg is ',msg);
      /*var outputHTMLString = generateCurrentBlob(msg);

      $('.chat_body').append(outputHTMLString);*/
      ScrollFix();
      $.post(url,msg,function(data,status){
        console.log('data: ' + data + 'status : ' + status + 'from the POST');
        if (status === "success") {
          $('.timestamp').append('V');
        }
      });
    });

    //img message output
    $('.gif_drawer img').on('click',function(){
      chatMsg = $(this).attr('src');
      $('#chatMsg').val('');

      var msg = {
        name: window.clientName,
        message : chatMsg,
        room : roomID,
        userID : userID,
        userImg : userImg,
        msgType : 'img'
      };


      console.log('sending message object.. msg is ',msg);

        //code for local double messaging
       /* var outputHTMLString = generateCurrentBlob(msg);
       $('.chat_body').append(outputHTMLString);*/
       ScrollFix();
        //end of local double messaging

        $.post(url,msg,function(data,status){
          console.log('data: ' + data + 'status : ' + status + 'from the POST');

            //mark V if recieved by server
            if (status === "success") {
              $('.timestamp').append('V');
            }
          });

      });

    $('#roomName').text(roomID);
    $('#roomTag').text('@' + roomID);
    //message feed
    var io = createIO(projectName, roomID);


    function generateCurrentBlob(data){
     var d = new Date();
     var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
     var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
     var dateString = hours + ':' + minutes;
     var _htmlTemplateString = '<div class="col-xs-12 user_msg"><div class="media message-box"><div class="media-left"><img class="media-object user-profile-in-chat" src="' + data.userImg +'" alt="general_id" style="width: 35px; height: 35px;"></div><div class="media-body"><h4 class="media-heading timestamp" id="top-aligned-media">'+ data.name+', ' + dateString+'<a class="anchorjs-link" href="#top-aligned-media"><span class="anchorjs-icon"></span></a></h4><p>'+ data.message+'</p></div></div></div>';
     return _htmlTemplateString;

   };

   function generateCurrentBlobForImage(data) {
    console.log('img blob');
    var d = new Date();
    var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var dateString = hours + ':' + minutes;
    var _htmlTemplateString = '<div class="col-xs-12 user_msg"><div class="media message-box"><div class="media-left"><img class="media-object user-profile-in-chat" src="' + data.userImg +'" alt="general_id" style="width: 35px; height: 35px;"></div><div class="media-body"><h4 class="media-heading timestamp" id="top-aligned-media">'+ data.name+', ' + dateString+'<a class="anchorjs-link" href="#top-aligned-media"><span class="anchorjs-icon"></span></a></h4><p><img src="'+ data.message+'"/></p></div></div></div>';
    return _htmlTemplateString;
  }

  function ScrollFix() {
    $(".chat_body").scrollTop($(".chat_body")[0].scrollHeight);
  }

  io.on('newMsg', function(data) {
    //console.log('data is ', JSON.stringify(data), 'data string is', data + '');
    //console.log(dataArr);
    console.log(data.msgType);
    if (data.msgType === 'txt'){
      var outputHTMLString = generateCurrentBlob(data);
    }else{
      $('#open-button').click();
      var outputHTMLString = generateCurrentBlobForImage(data);
    }
   // alert(data);

   $('.chat_body').append(outputHTMLString);
   ScrollFix();

 });
});

