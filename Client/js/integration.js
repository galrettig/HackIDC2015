$(document).ready(function() {


    //global data
    var url = 'https://hackidc2015.imrapid.io/message';
    var roomID = 'david';
    var projectName = 'hackidc2015';
    var chatMsg ='';


    //////////////
    // Pre Chat //
    //////////////


    console.log(window.clientName);
    console.log('got JQ on via integration');

    //message output
    $('#sendMsg').click(function(){
        chatMsg = $('#chatMsg').val();
        $('#chatMsg').val('');
        var msg = {
            name: window.clientName,
            message : chatMsg,
            room : roomID
        };
        console.log('sending message object.. msg is ',msg);
        var outputHTMLString = generateCurrentBlob(msg);

        $('.chat_body').append(outputHTMLString);
        ScrollFix();
        $.post(url,msg,function(data,status){
            console.log('data: ' + data + 'status : ' + status + 'from the POST');
            if (status === "success") {
                $('.timestamp').append('V');
            }
        });
    });


    //message feed
    var io = createIO(projectName, roomID);

    function generateCurrentBlob(data){
     var d = new Date();
     var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
     var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
     var dateString = hours + ':' + minutes;
     var _htmlTemplateString = '<div class="col-xs-12 user_msg" id=><div class="media message-box"><div class="media-left"><img class="media-object user-profile-in-chat" src="avatars/green.png" alt="general_id" style="width: 35px; height: 35px;"></div><div class="media-body"><h4 class="media-heading timestamp" id="top-aligned-media">'+ data.name+', ' + dateString+'<a class="anchorjs-link" href="#top-aligned-media"><span class="anchorjs-icon"></span></a></h4><p>'+ data.message+'</p></div></div></div>';
     return _htmlTemplateString;
 };

    function ScrollFix() {
        $(".chat_body").scrollTop($(".chat_body")[0].scrollHeight);
    }

 io.on('newMsg', function(data) {
    var outputHTMLString = generateCurrentBlob(data);
   // alert(data);
    console.log(data);//,outputHTMLString);
 $('.chat_body').append(outputHTMLString);
     ScrollFix();
});
});