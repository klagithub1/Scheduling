$(document).ready(function () {
    // Make sure there is a connected user.
    try
    {
        if (!_user) return;
    }
    catch (error)
    {
        return; // skip
    }

    // Declare a proxy to reference the hub. 
    var chatHub = $.connection.chatHub;
    if (!chatHub) return false;

    // Prepare the hub client method handlers.
    chatHub.client.beginChat = function (receiver, senderID, senderName, senderConnection) {
        if (_user.ID == receiver) {
            var url = baseURL + "/home/chat?uid=" + senderID + "&cid=" + senderConnection;
            $("#accept-chat-popup").attr("data-url", url).show().find("#chatName").html(senderName);
            return false;
        }
    }

    // Start the hub.
    $.connection.hub.start().done(function () {
        //alert("le chat est ressucité !");
    });

    $("body").on("dblclick", ".chat-list li", function () {
        var id = $(this).find('a').attr('id');
        var url = baseURL + "/home/chat?uid=" + id;
        window.open(url, 'title', 'width=500, height=400, left=45, top=15, scrollbars=yes, menubar=no,resizable=yes,directories=no,location=no');
        
        // Simulate a click on the button to close the chat slider.
        chatWindow();
        return false;
    });

    $("#accept-chat-popup .ok-button").click(function () {
        var url = $("#accept-chat-popup").attr("data-url");
        window.open(url, 'title', 'width=500, height=400, left=45, top=15, scrollbars=yes, menubar=no,resizable=yes,directories=no,location=no');
        $("#accept-chat-popup").hide();
        return false;
    });

    //click the user list
    //$('.chat-list li a').click(function () {
    //    $('.chat-list li a.selected').removeClass('selected');
    //    $(this).addClass('selected');
    //    openNewDialog($(this).find('span').text(), $(this).attr('href'));
    //    return false;
    //});

    $("#ui-id-2").click(function () {
        GetRecentChat(_user.ID, function (list) {
            //to fill the recent chats
            var userIdTemp = "";
            var chatList = list;
            $('#tab-2 ul.chat-list').find("li").remove();
            //Here work on Today, Yesterday or others date display accordingly.
            var tempdate = "";
            for (var i in list) {
                if (i== "Any") { break;}
                var item = list[i];
                if (item.IsOnline) {
                    var onlineClass = "online";
                }
                var datenowString = (new Date()).getYear() + "-" + ((new Date()).getMonth() + 1) + "-" + (new Date()).getDate();
                var yesterdayString = (new Date()).getYear() + "-" + ((new Date()).getMonth() + 1) + "-" + ((new Date()).getDate() - 1);
                var itemDate = (item.DateCreated).substring(0, 10);
                if (itemDate == datenowString && tempdate != itemDate) {
                    $('#tab-2 ul.chat-list').append('<li class="date"><span>' + todayText + '</span></li>');
                    tempdate = itemDate;
                } else if (itemDate == yesterdayString && tempdate != itemDate) {
                    $('#tab-2 ul.chat-list').append('<li class="date"><span>' + yesterdayText + '</span></li>');
                    tempdate = itemDate; 
                }

                if ((itemDate != datenowString) && (itemDate != yesterdayString) && itemDate != tempdate) {
                    $('#tab-2 ul.chat-list').append('<li class="date"><span>'+ itemDate+'</span></li>');
                    tempdate = itemDate;
                }

                var address = baseURL + "/images/" + item.OtherUserId + ".JPG"
                $('#tab-2 ul.chat-list').append('<li id="' + item.OtherUserId + '" ><a id="' + item.OtherUserId + '"><img src="' + address + '"  onerror="this.src=baseURL + \'/img/no-photo.png\';"   width="32" height="32" alt=""><span class="' + onlineClass + '">' + item.Name + '</span></a></li>');

            }


        });
    });

    //handle with the users for chat
    $("#chat-user-type").on("change", function (t) {
        GetMessageUsersMethod($("#chat-user-type").val());
    });
});

function chatWindow() { 
    if ($('.chat-win').css('opacity') == '0') {
        $('.chat-win').css({ display: 'block', opacity: 0 });
        onResize();
        $('.chat-win').stop().animate({ marginRight: 0, opacity: 1 }, 500)
        $(".chat-button").stop().animate({ right: 290 }, 500);

        if ($("#zenbox_tab").attr('title') == "Support") {
            $("#zenbox_tab").stop().animate({ right: 274 }, 500);
        } else {
            $("#zenbox_tab").stop().animate({ right: 274 }, 500);
        }

        //if ($("#zenbox_tab").attr('title') == "Support") {
        //    $("#zenbox_tab").stop().animate({ right: 390 }, 500);
        //} else {
        //    $("#zenbox_tab").stop().animate({ right: 403 }, 500);
        //}

        // Fill in the users when changing the role.
        GetMessageUsersMethod($("#chat-user-type").val());
    }
    else {
        // Hide the chat window.
        $('.chat-win').stop().animate({ marginRight: -275, opacity: 0 }, 500);
        $(".chat-button").stop().animate({ right: 15 }, 500);

        if ($("#zenbox_tab").attr('title') == "Support") {
            $("#zenbox_tab").stop().animate({ right: 0 }, 500);
        } else {
            $("#zenbox_tab").stop().animate({ right: 0 }, 500);
        }

        //if ($("#zenbox_tab").attr('title') == "Support") {
        //    $("#zenbox_tab").stop().animate({ right: 115 }, 500);
        //} else {
        //    $("#zenbox_tab").stop().animate({ right: 128 }, 500);
        //}
    }
    return false;
}

function GetMessageUsersMethod(role) {
    GetChatMessageUsers(role, function (list) {
        //to fill the user list with users get.
        var listusers = list;
        $('#chat-list').find("li").remove();
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var imgsrc = baseURL + "/images/" + item.ID + ".jpg"

            $('<li><a id="' + item.ID + '"><img src="' + imgsrc + '" onerror="this.src=baseURL + \'/img/no-photo.png\';"  width="32" height="32" alt=""> <span class="online">' + item.FirstName + ' ' + item.LastName + '</span></a></li>').appendTo('#chat-list');
        }
    });

}

function GetRecentChat(usreIdt, callback) {
    
    var userID = "00000000-0000-0000-0000-000000000000";
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/user/GetRecentChat/?userId=" + usreIdt,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { alert("GetRecentChat Error: " + t.status + "  " + t.statusText); }
    });
}

function GetChatMessageUsers(role, callback) {

    var userID = "00000000-0000-0000-0000-000000000000";
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/user/" + userID + "/messageusers/?role=" + role,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { alert("GetChatMessageUsers Error: " + t.status + "  " + t.statusText); }
    });
}