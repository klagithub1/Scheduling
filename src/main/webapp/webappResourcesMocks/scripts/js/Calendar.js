/// <reference path="/Scripts/jquery.js" />
/// <reference path="/Scripts/base.js" />
/// <reference path="/Scripts/js.js" />

var day = null;
var calendarItems = [];
var specificDay = false;
var startIndex = 0;
var endIndex = 48;



var isExistingEvent = false;
var existingEvent = null;
var isevalevent;

var selectedEOMExaminerID;

var tzoffset = 240;

var isinside = false;

var currenthref = window.location.href;

$.urlParam = function (name) {
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    if (results == null) {
        return 0;
    }
    else {
        return results[1] || 0;
    }
}

$(document).ready(function () {

    var popup = $.urlParam('popup');

    var bookEOMExamPopup = $.urlParam('bookEOMExam');

    if (_user.Role == 1 || _user.Role == 3) {
        $("#notice24hours").show();
    }
    else {
        $("#notice24hours").hide();
    }

    $("#examReady").click(function () {

        $("#examReadyButtonClicked").val("True");

        $.LoadingOverlay("show");
        $('body .body-overlay').show();
        $.ajax({
            url: $("#baseURL").val() + "/SetExamReady/" + $("#studentID").val(),
            type: "POST",
            data: null,
            success: function (t) {
                $.LoadingOverlay("hide");
                alert("The learner is now ready for the exam / L'apprenant est maintenant prêt pour l'examen.");
                //$("#examReady").attr('disabled', 'disabled');
                //$("#examReady").remove();
                location.reload();
                $('body .body-overlay').hide();
                $("#submit").click();
                $.LoadingOverlay("show");
            },
            error: function (t) {
                $.LoadingOverlay("hide");
                alert("Error setting the learner as EOM exam ready.");
            }
        });
    })


    $('.all-checks').change(function () {
        var checked = $(this).is(':checked');
        $(this).parents('table').find('td input[type=checkbox]:visible').each(function (index, el) { el.checked = checked })
    });

    $("#from-time").change(function () {
        var selected = $("#from-time").val();
        var hour = parseInt(selected.substr(0, 2));

        index = hour * 2;

        startIndex = index;

        var selector = $(".timetrs");

        var showSel = $();
        var hideSel = $();

        for (var j = startIndex; j < endIndex; j++) {
            var tds = $(selector[j]).find("td");
            for (var i = 0; i < tds.length; i++) {
                showSel.push(tds[i]);
            }
        }

        for (var j = 0; j < startIndex; j++) {
            var tds = $(selector[j]).find("td");

            for (var i = 0; i < tds.length; i++) {
                hideSel.push(tds[i]);
            }
        }

        showSel.show();
        hideSel.hide();

    });


    $("#to-time").change(function () {

        var selected = $("#to-time").val();
        var hour = parseInt(selected.substr(0, 2));

        index = hour * 2;

        endIndex = index;

        var selector = $(".timetrs");

        var showSel = $();
        var hideSel = $();

        for (var j = startIndex; j < endIndex; j++) {
            var tds = $(selector[j]).find("td")
            for (var i = 0; i < tds.length; i++) {
                showSel.push(tds[i]);
            }
        }

        for (var j = endIndex; j < 48; j++) {
            var tds = $(selector[j]).find("td")
            for (var i = 0; i < tds.length; i++) {
                hideSel.push(tds[i]);
            }
        }

        showSel.show();
        hideSel.hide();

    });

    $(".classroomlearnershover").each(function (e) {
        // check if list is already loaded
        if ($(this).find(".learner").length == 0)

            var selector = $(this).find(".container");

        // if not, then call the ajax method
        GetClassroomLearnersPresence($(this).attr("data-appointmentID"), function (list) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.m_Item2 == true) {
                    selector.append("<span class='learner'> - " + item.m_Item1.Name + "</span><br />");
                }
                else {
                    selector.append("<span class='learner cancelled-classroom'> - " + item.m_Item1.Name + "</span><br />")
                }
            }

            selector.hide();
            selector.show();
        });
    }
    );

    $("#category").change(function () {
        var selectedcategory = $(".popup-event").find("#category option:selected").val();

        var category = FirstOrDefault(calendar.Categories, function (c) { return (c.ID == selectedcategory) });

        if (category.Type == 2) {
            //appointment    
            if (pageUser.Role != 1) {
                $("#learner-formitem").show();
                $("#lessonDurationDiv").show();
            }
            $("#classroom-formitem").hide();

            $("#learner").change();
            isClassroom = false;
        }
        else if (category.Type == 3) {
            //classroom
            $("#learner-formitem").hide();
            $("#classroom-formitem").show();

            $("#lessonDurationDiv").hide();

            $("#classroom").change()
           

            isClassroom = true;

            setTimeout(function () {
                var name = $("#classroom").find("option:selected").html();
                $("#event-name").val(name);
            }, 300);
        }
    });

    // --- Left Buttons
    $('#add-availability').click(function () {
        isevalevent = false;
        OpenAvailability(this);
        return false;
    });


    $('#book-lesson').click(function () {
        showOverlay();
        $(".cancelappointment-button").removeAttr("data-appid");
        $("#appointmentError").hide();
        isevalevent = false;
        iseomexam = false;
        FillNewLessonCalendarItemData();
        $("#popup-event-title").text($(this).val());
        $("#category").change();
        $('.popup-event').show();

        if ($("#category").find('option').length <= 1) {
            $("#category-section").hide();
        }

        return false;
    });


    $('#book-evaluation').click(function () {
        showOverlay();
        $(".cancelappointment-button").removeAttr("data-appid");
        $("#appointmentError").hide();
        isevalevent = true;
        iseomexam = false;
        FillNewLessonCalendarItemData();
        $("#popup-event-title").text($(this).val());
        $("#category").change();
        $('.popup-event').show();

        if ($("#category").find('option').length <= 1) {
            $("#category-section").hide();
        }

        return false;
    });

    $('#book-eom-exam').click(function () {
        showOverlay();
        $(".cancelappointment-button").removeAttr("data-appid");
        $("#appointmentError").hide();
        isevalevent = true;
        iseomexam = true;
        FillBookEOMExamPopupData();
        $("#popup-event-title").text($(this).val());
        $("#category").change();
        $('.popup-event').show();

        if ($("#category").find('option').length <= 1) {
            $("#category-section").hide();
        }

        return false;
    });

    $('#add-other').click(function () {
        //showOverlay();
        //FillNewOtherCalendarItemData();

        //$('.popup-other').show();
        return false;
    });
    // --- END Left Buttons

    $(".calendar").on("click", ".event", function () {
        var json = $(this).attr("data-item");
        var item = JSON.parse(json);
        existingEvent = item;
        var category = FirstOrDefault(calendar.Categories, function (t) { return t.ID == item.Category });

        if (!category) {
            // open custom window, or not.
        }
        else if (category.Type == 1) {
            OpenAvailability(this);
        }
        else {
            // open calendaritem
            showOverlay();
            $("#appointmentError").hide();
            FillCalendarItemData(item, json);
            $("#category").change();
            $('.popup-event').show();
        }
        return false;
    });


    $(".num").on("click", function () {
        var stringDate = $(this).attr("data-date");
        window.location.href = window.location.protocol + "//" + window.location.host + baseURL + "/calendar/week/" + pageUser.ID + "?start=" + stringDate;

    });

    $(".calendar").on("click", ".tutor, .learner", function () {
        if (_user.Role != 3) {
            OpenAvailability(this);
        }
        return false;
    });

    $("#learner").change(function () {
        var userID = $("#learner").find("option:selected").val();
        var name = $("#learner").find("option:selected").html();

        var selectedcategory = $(".popup-event").find("#category option:selected").val();

        var category = FirstOrDefault(calendar.Categories, function (c) { return (c.ID == selectedcategory) });

        if (category.Type == 2) {
            $("#event-name")[0].value = name;
            UpdateActiveLessons(userID);
        }
    });

    $(".head a.startdate").click(function (e) {
        var href = $(this).attr("href");
        var gethref = currenthref;
        var queryvalue = href.substr(href.indexOf("?"));
        var gizmoutte = (currenthref.indexOf("?") > 0) ? "&" : "?";

        var startindex = gethref.indexOf("start");

        if (startindex > 0) {
            var endindex = gethref.indexOf("&", startindex);

            var base = gethref.substr(0, startindex);
            var suffix = (endindex < 0) ? "" : gethref.substr(endindex);

            gethref = base + suffix;
        }

        gethref = gethref.concat(gizmoutte, queryvalue);

        gethref = gethref.replace("&e&", "&");

        gethref = gethref.replace("&&", "&");
        gethref = gethref.replace("&&", "&");
        gethref = gethref.replace("?&", "?");
        gethref = gethref.replace("?&", "?");
        gethref = gethref.replace("&?", "&");
        gethref = gethref.replace("??", "?");
        window.location.href = gethref;

        e.preventDefault();
        return false;
    });

    $("#classroom").change(function () {
        var classID = $("#classroom").find("option:selected").val();

        if (!classID && existingEvent != null) {
            classID = existingEvent.Appointment;

            $("#classroom").find("option").remove().end().append($("option").val(existingEvent.ID).text(existingEvent.Name));
        }
        else {
            UpdateActiveLessons(classID, true);
        }
        var name = $("#classroom").find("option:selected").html();
        $("#event-name")[0].value = name;
    });

    $("#tutor").change(function () {
        var userID = $("#tutor").find("option:selected").val();
        var name = $("#tutor").find("option:selected").html();

        $("#event-name")[0].value = name;
    });

    $(".cancelappointment-button").on("click", function (e) {
        TryCancelAppointment(e.target);
    });

    $("#bookLessonOK").click(function () {

        if (!isExistingEvent) { OK_Click(); }
    });

    $("#availabilityOK").click(function (e) { CreateAvailability(); });

    $("#radToday, #radWeek, #radMonth").on("change", function (t) {
        //console.log ( $('#input[name=apply-period]:checked').val() );
        SetAvailabilityDates();
        if ($('#radWeek').is(':checked') || $('#radMonth').is(':checked'))
            $('#week-period-tab').show();
        else
            $('#week-period-tab').hide();
    });


    $(".popup-event").on("change", "select, #event-start-date", function (t) {
        var handler;
        if ((!isExistingEvent) && (pageUser.Role == 1)) {
            if (true) {
                // First get the selected lesson.
                var session;
                var opt = $(".popup-event").find("#Lesson option:selected");
                if (opt.length > 0) {
                    var sess = $(".popup-event").find("#Lesson option:selected").prop("data-session");
                    if (sess) {
                        session = JSON.parse(sess);
                    }
                    else { return; }
                }

                if ((session) && (session.ProductType == 4)) {
                    if ($(this).attr("id") == "event-start-time") {
                        // For evaluations, the tutors are refreshed based on the selected time.
                        if (iseomexam) {
                            handler = GetAvailableEOMExaminers;
                        }else{
                            handler = GetAvailableTutors;
                        }
                    } else if ($(this).attr("id") != "tutor") {
                        // Otherwise its the time that is filtered based on the selections.
                        if (iseomexam) {
                            handler = GetAvailableHoursOfEOMExaminers;
                        } else {
                            handler = GetAvailableHours;
                        }
                        
                    }
                } else if ($(this).attr("id") == "Lesson") {
                    // Lesson changed: update the available tutors.
                    GetAvailableTutors();
                    handler = GetAvailableHours;
                }
                else if ($(this).attr("id") == "tutor") {
                    // Otherwise its the time that is filtered based on the selections.
                    if (iseomexam) {
                        handler = GetAvailableHoursOfEOMExaminers;
                    } else {
                        handler = GetAvailableHours;
                    }
                    
                }
                else if ($(this).attr("id") != "event-start-time") {
                    // Otherwise its the time that is filtered based on the selections.
                    if (iseomexam) {
                        handler = GetAvailableHoursOfEOMExaminers;
                    } else {
                        handler = GetAvailableHours;
                    }
                    
                }
            }
        } else if ($(this).attr("id") != "tutor") {
            handler = GetAvailableTutors;
        }

        if (isMSIE()) {
            setTimeout(function () {
                if (handler) {
                    handler();
                }
                Validate();
            }, 0);
        }
        else {
            if (handler) {
                handler();
            }
            Validate();
        }
    });

    ManageCheckboxes();




    $("input[name=reason]").change(function (e) { validateCancellationForms(e) });
    $("input[name=accept]").change(function (e) { if ($("input[name=accept][value=Y]:checked").length > 0) { $("#normaldiv").show(); } else { $("#normaldiv").hide(); } });

    $("#details").keyup(function (e) { validateCancellationForms(e) });
    $("#details").change(function (e) { validateCancellationForms(e) });


    if (window.location.href.indexOf("showLessonPopup=true") > 0) {
        // trigger the action
        $('#book-lesson').click();
    }

    if (window.location.href.indexOf("showEvalPopup=true") > 0) {
        // trigger the action
        $('#book-evaluation').click();
    }

    if (popup == "true") {
        $('#book-lesson').click();
    }

    if (bookEOMExamPopup == "true") {
        $('#book-eom-exam').click();
    }

});

function ReloadPage() {
    var pos = window.location.href.indexOf("showLessonPopup=true");
    var pos1 = window.location.href.indexOf("showEvalPopup=true");

    if (pos > 0) {
        // Remove the auto-popup, otherwise it will stay open after the reload.
        window.location.href = window.location.href.substring(0, pos);
    }
    else if (pos1 > 0) {
        //ShowEvaluationConfirmation(function () {

        // Remove the auto-popup, otherwise it will stay open after the reload.
        window.location.href = window.location.href.substring(0, pos1);
        //});
    }
    else {
        // Simply reload the page.
        window.location.reload();
    }
}

function querystring(key) {
    var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
    var r = [], m;
    while ((m = re.exec(document.location.search)) != null) r.push(m[1]);
    return r;
}


function ShowEvaluationConfirmation(fnct) {
    showOverlay();
    $("#evalConfirm").show();

    $("#evalConfirm .ok").click(fnct);
}

var popupChargeable;
var popupChargeStep;
function showCancellationWindow(callback) {
    $("#cancelAppointmentOK")[0].disabled = true;
    $("#cancelAppointmentOK").click(function () { callback(); });

    $("#chargeYes").click(function () {
        popupChargeable = true;
        popupChargeStep = 1;
        $("#askcharge").hide();
        $("#chargeablediv").show();
        $("#normaldiv").hide();
        $("#charged").show();
        $("#uncharged").hide();
        $("#askbuttons").hide();
        $("#normalbuttons").show();
    });
    $("#chargeNo").click(function () {
        popupChargeable = false;
        popupChargeStep = 1;
        $("#askcharge").hide();
        $("#chargeablediv").hide();
        $("#normaldiv").show();
        $("#charged").hide();
        $("#uncharged").show();
        $("#askbuttons").hide();
        $("#normalbuttons").show();
    });

    popupChargeStep = 1;

    if (popupChargeable) {
        if (currentRole > 1) {
            popupChargeStep = 2;
            $("#askcharge").show();
            $("#chargeablediv").hide();
            $("#normaldiv").hide();
            $("#charged").hide();
            $("#uncharged").hide();
            $("#askbuttons").show();
            $("#normalbuttons").hide();
        } else {
            $("#askcharge").hide();
            $("#chargeablediv").show();
            $("#normaldiv").hide();
            $("#charged").show();
            $("#uncharged").hide();
            $("#askbuttons").hide();
            $("#normalbuttons").show();
        }
    } else {
        $("#askcharge").hide();
        $("#chargeablediv").hide();
        $("#normaldiv").show();
        $("#charged").hide();
        $("#uncharged").show();
        $("#askbuttons").hide();
        $("#normalbuttons").show();
    }

    showOverlay();
    $("#confirmCancelWindow").css("z-index", 100);
    $("#confirmCancelWindow").show();
}

function TryCancelAppointment(node, calendarItem) {
    $("input[name=accept]").prop('checked', false);
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }
    var item;
    if (calendarItem) {
        item = calendarItem;
    }
    else {
        item = JSON.parse($(node).attr("data-item"));
    }


    popupChargeable = false;
    var now = new Date();

    // get timezone offset from the current user. 
    //var offset = new Date().getTimezoneOffset() - tzoffset;

    //offset = offset * 60 * 1000;

    var offset = 0;

    if ((Date.fromISONoTZ(item.StartDate || item.Date || item.Name) - now < (86400000 + offset)) &&
        !(item.ModuleName && item.ModuleName.toLowerCase().indexOf("eval") >= 0)) {
        popupChargeable = true;
    }

    if (pageUser.Role == 1) {
        $('.popup-event').hide();
        showCancellationWindow(function () { CancelAppointment(item.Appointment || item.ID, popupChargeable, $("input[name=reason]:checked").val(), $("#details").val(), function () { ReloadPage(); }); });
    }
        //else if (isClassroom && isClassroom === true) {
        //    $('.popup-event').hide();
        //    CancelClassroomAppointment(item.Appointment || item.ID, function () { ReloadPage(); });
        //}
    else {

        $('.popup-event').hide();
        showCancellationWindow(function () {
            var test = null;


            try {
                test = FirstOrDefault(calendar.Categories, function (c) { return c.ID == item.Category; });
            }
            catch (e) {
                // skip;
            }

            if (test == null) {
                if (window.location.href.toLowerCase().indexOf("grouplesson") > 0) {
                    test = {};
                    test.Type = 3; // classroom ?
                }
                else {
                    test = {};
                    test.Type = 2; // lesson ?
                }
            }

            if (item.ModuleName && item.ModuleName.toLowerCase().indexOf("eval") >= 0) {
                popupChargeable = false;  // override: evaluations are never chargeable!
            }

            var reason = $("input[name=reason]:checked").val();
            var reasonText = $("#details").val();
            if (test.Type == 2) {
                CancelAppointment(item.Appointment || item.ID, popupChargeable, reason, reasonText, function () { ReloadPage(); });
            }
            else {
                CancelClassroomAppointment(item.Appointment || item.ID, popupChargeable, reason, reasonText, function () { ReloadPage(); });
            }

        });

    }

}



function OpenAvailability(node) {

    var winHeight = document.getElementsByTagName('html')[0].clientHeight;
    $('.popup-avalability .scroll-container').css('height', winHeight - 180);
    showOverlay();
    $('.popup-avalability').css('margin-top', -winHeight / 2 + 20).show();

    $("#from-time").find("option").get(7).selected = true;
    $("#to-time").find("option").get(23).selected = true;

    $("#from-time").change();
    $("#to-time").change();

    if (node) {

        var strDate = $(node).attr("data-date");
        day = StringToDate(strDate);

        var json = $(node).attr("data-calendaritems");
        if (json) calendarItems = JSON.parse(json);

        FillAvailibilityData(calendarItems);

        specificDay = (json ? true : false);
        SetAvailabilityDates();
    } else {
        specificDay = false;
    }

    $("#radToday").click();
}

function ManageCheckboxes() {

    var handler = function (e) {
        var showLessons = ($('#lessons-checkbox').length == 0) || $('#lessons-checkbox').is(":checked");
        var showGroups = ($('#Group-checkbox').length == 0) || $('#Group-checkbox').is(":checked");
        var showOtherAvail = ($('#tutors-checkbox').length == 0) || $('#tutors-checkbox').is(":checked");
        var showMyAvail = ($('#availability-checkbox').length == 0) || $('#availability-checkbox').is(":checked");
        var showmisc = ($('#misscelanious-checkbox').length == 0) || $('#misscelanious-checkbox').is(":checked");

        if (showLessons) {
            $(".lessons-event").show();
        }
        else {
            $(".lessons-event").hide();
        }

        if (showGroups) {
            $(".Group-event").show();
        }
        else {
            $(".Group-event").hide();
        }

        if (showOtherAvail) {
            //  $(".otheravailability-event").show();
            $(".tutor-avalability-select").show();
            $("a.tutor").show();
            var selector = $("#tutor-avalability-filter option:selected");

            // special case for tutors;
            if (e && selector.length > 0) {
                if (selector.val() != "00000000-0000-0000-0000-000000000000") {
                    // filter by tutor.
                    $(".otheravailability-event").hide()

                    $("[data-id=" + selector.val() + "]").show()

                    if (window.location.href.indexOf("month") > 0) {

                        if (window.location.href.indexOf("?") > 0) {
                            var filterIndex = currenthref.indexOf("filter=");
                            if (filterIndex > 0) {
                                var temp = currenthref.substr(0, filterIndex);
                                temp = temp + "filter=" + selector.val();
                                window.location.href = temp;
                            }
                            else {
                                window.location.href = window.location.href + "&filter=" + selector.val();
                            }
                        }
                        else {
                            window.location.href = window.location.href + "?filter=" + selector.val();
                        }
                    }

                }
                else {
                    $(".otheravailability-event").show()
                    if (window.location.href.indexOf("month") > 0) {
                        if (window.location.href.indexOf("filter") > 0) {
                            var index = window.location.href.indexOf("filter=");

                            if (index > 0) {
                                var temp = currenthref.substring(0, index);
                                window.location.href = (temp.replace(/&q/g, "") + "q");
                            }
                        }
                    }
                }
            }

        }
        else {
            $(".otheravailability-event").hide();
            $(".tutor-avalability-select").hide();
            $("a.tutor").hide();
        }

        if (showMyAvail) {
            $(".availability-event").show();
            $("a.learner").show();
        }
        else {
            $(".availability-event").hide();
            $("a.learner").hide();
        }

        if (showmisc) {
            $(".miscelanious-event").show();
        }
        else {
            $(".miscelanious-event").hide();
        }


        var queryparam = $(this).attr("data-queryparam");

        if (queryparam && queryparam.length > 0) {
            var gethref = currenthref;

            var startindex = gethref.indexOf(queryparam);

            if (startindex > 0) {
                var endindex = gethref.indexOf("&", startindex);

                var base = gethref.substr(0, startindex);
                var suffix = (endindex < 0) ? "" : gethref.substr(endindex);

                gethref = base + suffix;
            }


            var gizmoutte = (gethref.indexOf("?") > 0) ? "&" : "?";

            gethref = gethref.concat(gizmoutte, queryparam, "=", $(this).is(":checked"));

            gethref = gethref.replace("&e&", "&");

            gethref = gethref.replace("&&", "&");
            gethref = gethref.replace("&&", "&");
            gethref = gethref.replace("?&", "?");
            gethref = gethref.replace("?&", "?");
            gethref = gethref.replace("&?", "&");
            gethref = gethref.replace("??", "?");
            //window.location.href = gethref;

            $.get(gethref, function (www) { console.log(www) });

            currenthref = gethref;

        }
    };

    $("#tutor-avalability-filter").change(handler);

    $("#lessons-checkbox").change(handler);
    $("#Group-checkbox").change(handler);
    $("#misscelanious-checkbox").change(handler);
    $("#tutors-checkbox").change(handler);
    $("#availability-checkbox").change(handler);


    $("#lessons-checkbox").prop("checked", querystring("lcu") != "false");
    $("#Group-checkbox").prop("checked", querystring("gcu") != "false");
    $("#misscelanious-checkbox").prop("checked", querystring("mcu") != "false");
    $("#tutors-checkbox").prop("checked", querystring("tcu") != "false");
    $("#availability-checkbox").prop("checked", querystring("acu") != "false");


    handler();

}

function GetRecurrencyInfo() {
    var result = 0;

    var radToday = $("#radToday");

    if (radToday.is(":checked")) {
        // do nothing, return none. 
    }
    else {
        // Get list of check boxes
        var recurrentDays = $("#week-period-tab").find("input");

        // Loop through the recurrent days check boxes to compute the result.
        for (var i = 0; i < recurrentDays.length; i++) {
            // direct cast since condition was already checked in the WHERE call up here 
            var chk = $(recurrentDays[i]);

            if (chk.is(":checked")) {
                // determine which checkbox it is. 
                switch (chk.attr("name")) {
                    case "sun":
                        result |= 1;
                        break;
                    case "mon":
                        result |= 2;
                        break;
                    case "tue":
                        result |= 4;
                        break;
                    case "wed":
                        result |= 8;
                        break;
                    case "thu":
                        result |= 16;
                        break;
                    case "fri":
                        result |= 32;
                        break;
                    case "sat":
                        result |= 64;
                        break;
                    default:
                        // do nothing, succesfully. 
                        break;
                }
            }
        }

    }

    return result;
}

function GetTimeBoxesIntervals() {
    var result = [];

    var interval = new DateInterval();
    result.push(interval);

    var timeBoxes = $(".timeboxes");

    for (var i = 0; i < timeBoxes.length; i++) {
        var tb = $(timeBoxes[i]);
        if (tb.is(":visible") && tb.is(":checked")) {

            if (interval.StartDate == null) {
                // only the time is needed
                interval.StartDate = new Date(1970, 1, 1, i >> 1, i % 2 > 0 ? 30 : 0, 0)

                // default duration : 30 minutes
                interval.EndDate = new Date(1970, 1, 1, i >> 1, i % 2 > 0 ? 30 : 0, 0);
                interval.EndDate.setMinutes(interval.EndDate.getMinutes() + 30);
            }
            else {
                var k = i + 1;   // duration counter
                //if (k >= 48) { k = 47; }
                // only the time is needed
                interval.EndDate = new Date(1970, 1, 1, k >> 1, i % 2 == 0 ? 30 : 0, 0);
            }
        }
        else if (tb.is(":visible") && !tb.is(":checked")) {
            if (interval.StartDate != null) {
                interval = new DateInterval();
                result.push(interval);
            }
        }
    }

    if (result.Count > 0 && result.Last().StartDate == DateTime.MinValue) {
        result.splice(result.length - 1, 1);
    }

    for (var i = 0; i < result.length; i++) {
        var int = result[i];

        if (int.StartDate && int.EndDate) {
            int.StartDate = stringifyDate(int.StartDate);
            int.EndDate = stringifyDate(int.EndDate);
        }
    }

    return result;
}

function ClearAvailabilityWindow() {
    var trs = $(".tab-availability").find("tr");

    var tds = $(".tab-availability").find("td");

    trs.removeAttr("style");
    tds.find("p").remove();
    tds.find("a").remove();
    tds.find("br").remove();
    var checkboxes = tds.find("input[type=checkbox]");

    for (var k = 0; k < checkboxes.length; k++) {
        checkboxes[k].checked = false;
    }

}

/// <summary>
/// Defines an interval with a Start Date and an End Date
/// </summary>
function DateInterval() {
    this.StartDate = null;
    this.EndDate = null;
}

function CreateAvailability() {
    // create availability with recurrency, if applicable
    var recurrency = GetRecurrencyInfo();

    if (day == null) { day = new Date(); }

    //start = day;
    //end = GetEndDate();
    var dateString = $("#from-date").val();
    start = StringToDate(dateString);

    if ($("#radToday").is(":checked")) {
        end = new Date(start);
    } else {
        dateString = $("#to-date").val();
        end = StringToDate(dateString);
    }
    end.setDate(end.getDate() + 1);
    end.setHours(0, -1, 0, 0);

    var timeIntervals = GetTimeBoxesIntervals();

    var availability = new AvailabilityContainer();
    availability.Start = stringifyDate(start);   // already offset.
    availability.End = stringifyDate(end);
    availability.TimeIntervals = timeIntervals;
    availability.Recurrency = recurrency;
    availability.Category = FirstOrDefault(calendar.Categories, function (c) { return c.Type == 1; }).ID;

    SaveAvailability(availability);

}

function StringToDate(str) {
    // fix for IE7
    var strday = str.substring(0, str.indexOf("."));
    if (strday.charAt(0) == "0") {
        strday = strday.substring(1);
    }
    var dDay = parseInt(strday);



    var strMonth = str.substring(str.indexOf(".") + 1, str.lastIndexOf("."));
    if (strMonth.charAt(0) == "0") {
        strMonth = strMonth.substring(1);
    }


    var dMonth = parseInt(strMonth) - 1;
    var dYear = parseInt(str.substring(str.lastIndexOf(".") + 1));
    return new Date(dYear, dMonth, dDay);
}

function GetEndDate() {
    var result = null;

    var radMonth = $("#radMonth");
    var radWeek = $("#radWeek");

    if (radMonth.is(":checked")) {
        // next month (or almost)
        result = new Date(day);
        result.setMonth(result.getMonth() + 1, 1);
        result.setHours(0, -1, 0, 0);
    }
    else if (radWeek.is(":checked")) {
        // until the end of the week
        result = new Date(day);
        while (result.getDay() != 0) {
            result.setDate(result.getDate() + 1);

        }
        result.setHours(0, -1, 0, 0);
    }
    else {
        // today  (today at 23:59)
        result = new Date(day);
        result.setDate(day.getDate() + 1);
        result.setHours(0, -1, 0, 0);
    }

    return result;
}

function SetAvailabilityDates() {

    var showEnd = true;
    var startDay, endDay;

    if (specificDay || (day.getMonth() != (new Date()).getMonth())) {
        startDay = new Date(day);
    } else {
        startDay = new Date();
    }

    if ($("#radMonth").is(":checked")) {
        startDay = new Date(startDay.getFullYear(), startDay.getMonth(), 1);
        endDay = new Date(startDay.getFullYear(), startDay.getMonth() + 1, 0);
    }
    else if ($("#radWeek").is(":checked")) {
        startDay.setDate(startDay.getDate() - startDay.getDay());
        endDay = new Date(startDay);
        endDay.setDate(endDay.getDate() + 6);
    }
    else {
        showEnd = false;
    }

    $("#from-date").val(startDay.getDate() + "." + (startDay.getMonth() + 1) + "." + startDay.getFullYear());
    if (showEnd) {
        $("#to-date").val(endDay.getDate() + "." + (endDay.getMonth() + 1) + "." + endDay.getFullYear()).show();
        $("#to-date-label").show();
    } else {
        $("#to-date").hide();
        $("#to-date-label").hide();
    }
}


function validateCancellationForms() {

    $("#cancelAppointmentOK")[0].disabled = ($("input[name=reason]:checked").length == 0) || ($("input[value=4]:checked").length == 1 && ($("#details").val().length == 0));

}

function AvailabilityContainer() {
    var TimeIntervals = []

    var Start = null;
    var End = null;
    var Category = "";
    var Recurrency = 0;
}

function UpdateActiveLessons(id, isClassroom) {
    $("#Lesson").find('option').remove().end();

    // event handler
    var handler = function (Lessons) {

        if (Lessons.length == 0) {
            $("#Lesson").append($("<option>").val(Guid.Empty).html("Please contact your Account Manager to get more Lessons"));
        }
        else {
        }
        // differientiate between different durations
        var uniqueModule = Distinct(Lessons, function (s) { return s.Module ? (s.Module.Name) + s.Duration : s.ID.toString(); });



        for (var i = 0; i < uniqueModule.length; i++) {
            var s = uniqueModule[i];

            if (isevalevent) {
                if (s.ProductType == 4) {
                    $("#Lesson").append($("<option>").val(s.ID).html(s.Module ? s.Module.Name + " " + s.Duration + " minutes" : $("#classroom").text() + " " + s.Duration + " minutes").prop("data-session", JSON.stringify(s)));

                }
                else if  (iseomexam && s.ProductType == 1)
                {
                    $("#Lesson").append($("<option>").val(s.ID).html(s.Module ? s.Module.Name + " " + s.Duration + " minutes" : $("#classroom").text() + " " + s.Duration + " minutes").prop("data-session", JSON.stringify(s)));

                }
        }
            else {
                if (s.ProductType != 4) {
                    //$("#Lesson").append($("<option>").val(s.ID).html(s.Module ? s.Module.Name + " " + s.Duration + " minutes" : $("#classroom").text() + " " + s.Duration + " minutes").prop("data-session", JSON.stringify(s)));
                    $("#Lesson").append($("<option>").val(s.ID).html(s.Module ? s.Module.Name : $("#classroom").text() + " " + s.Duration + " minutes").prop("data-session", JSON.stringify(s)));


                }
            }

        }

        if (!isClassroom) {
            var name = $("#learner").find("option:selected").html();
            $("#event-name")[0].value = name;
        }

        if (iseomexam) {
            GetAvailableHoursOfEOMExaminers();
        } else {
            GetAvailableHours();
        }
        
    };

    if (isClassroom) {
        GetClassroomSessions(id, handler);
    }
    else {
        GetAvailableSessions(id, handler);
    }
}


function OK_Click() {
    $("#phoneNumber").css("border", "");
    var appointment = new Appointment();
    appointment.ID = Guid.Empty;
    //appointment.Date =GetSelectedDate();
    appointment.Session = new Session();
    appointment.Session.ID = $(".popup-event").find("#Lesson option:selected").val();
    //this.Item.EndDate = this.Item.StartDate.AddMinutes(appointment.Lesson.Duration);
    appointment.Tutor = new Identification($(".popup-event").find("#tutor option:selected").val());
    appointment.Student = new Identification($(".popup-event").find("#learner option:selected").val());
    appointment.Notes = $("#event-notes").val();
    appointment.LessonDuration = $(".popup-event").find("#LessonDuration option:selected").val();
    appointment.Phone = $("#phoneNumber").val();

    var selectedcategory = $(".popup-event").find("#category option:selected").val();

    var category = FirstOrDefault(calendar.Categories, function (c) { return (c.ID == selectedcategory) });

    if (category.Type == 2) {
        //if (this.mode == AddAppointmentMode.Tutor) {
        //    appointment.Student = $(".popup-event").find("#student").filter(":selected").val();
        //}

        // Create the appointment at the server. This will also create the calendar items for both the student and the tutor.

        var phoneEntered = $("#phoneNumber").val();

        var phone = "";

        for (var i = 0; i < phoneEntered.length; i++) {
            if (isDigit(phoneEntered[i])) {
                phone = phone + phoneEntered[i];
            }
        }

        var isPhoneValid = (phone.length == 10) || (phone.length == 0);

        if (isPhoneValid)
            CreateAppointment(appointment, phone, iseomexam, (typeof appointment.LessonDuration == "undefined" ? null : appointment.LessonDuration), $("#phoneExtension").val(), function (t) { if (t == "success") { ReloadPage(); } else { DisplayError("Error creating appointment"); } });
        else {
            $("#phoneNumber").css("border", "3px solid red");
        }

    }
    else if (category.Type == 3) {
        // Create the appointments at the server. This will also create the calendar items for the tutor and all the Group students.
        CreateGroupAppointment(appointment, function (t) { if (t == "success") { ReloadPage(); } else { DisplayError("Error creating appointment"); } });
    }
}

/// Fills the EditCalendarItem Window with the Appointment's data
function FillCalendarItemData(item, json) {
    // $(".popup-event").find("#event-start-time").val(item.StartDate);
    // $(".popup-event").find("#event-end-time").val(item.StartDate);

    var cat = FirstOrDefault(calendar.Categories, function (t) { return t.ID == item.Category; });


    if (cat.Type == 0) {
        isevalevent = false;
        FillNewLessonCalendarItemData();

        var date = Date.fromISONoTZ(item.StartDate);
        $("#event-start-date").datepicker("setDate", date);

        var hours = date.getHours();
        var mins = date.getMinutes();
        if (mins == 0) {
            mins = "00";
        }
        $("#event-start-time option").remove();
        $('<option value="t' + hours + '_' + mins + '">' + hours + ':' + mins + '</option>').appendTo("#event-start-time");

        $("#event-start-date").change();

        if (pageUser.Role == 1) {
            $('#tutor').find("option[value='" + item.ID + "']").attr('selected', 'selected');

        }
        else {
            $('#learner').find("option[value='" + item.ID + "']").attr('selected', 'selected');

        }



        //GetAvailableHours();


        return;
    }

    isExistingEvent = true;
    isevalevent = item.ModuleName && (item.ModuleName.toLowerCase().indexOf("evaluation") >= 0); // we should do like item.type == [enumvalue]

    if (isevalevent) {
        $(".popup-event").find("#event-name").closest(".form-item").hide();
        $(".popup-event").find("#category").closest(".form-item").hide();
        $(".popup-event").find("#Lesson").closest(".form-item").hide();
        $(".popup-event").find("#evalnotice").show();
        $(".popup-event").find("#evalnotice2").show();
        $(".popup-event").find("#lessonnotice").hide();
        $(".popup-event").find("#lessonnotice2").hide();

        $(".popup-event").find("#evaldatetext").show();
        $(".popup-event").find("#lessondatetext").hide();
        $("#popup-event-title").text($('#book-evaluation-text').val());
    } else if (item.IsEOMExam) {
        $(".popup-event").find("#event-name").closest(".form-item").hide();
        $(".popup-event").find("#category").closest(".form-item").hide();
        $(".popup-event").find("#Lesson").closest(".form-item").hide();
        $(".popup-event").find("#evalnotice").show();
        $(".popup-event").find("#evalnotice2").show();
        $(".popup-event").find("#lessonnotice").hide();
        $(".popup-event").find("#lessonnotice2").hide();

        $(".popup-event").find("#evaldatetext").show();
        $(".popup-event").find("#lessondatetext").hide();
        $("#popup-event-title").text($('#book-eomexam-text').val());
    }
    else {
        $(".popup-event").find("#event-name").closest(".form-item").show();
        $(".popup-event").find("#category").closest(".form-item").show();
        $(".popup-event").find("#Lesson").closest(".form-item").show();
        $(".popup-event").find("#evalnotice").hide();
        $(".popup-event").find("#evalnotice2").hide();
        $(".popup-event").find("#lessonnotice").show();
        $(".popup-event").find("#lessonnotice2").show();
        $(".popup-event").find("#evaldatetext").hide();
        $(".popup-event").find("#lessondatetext").show();
        $("#popup-event-title").text($('#book-lesson-text').val());
    }

    $(".popup-event").find("#category").find('option')
    .remove()
    .end()
    .append($("<option>")
            .val(item.Category)
            .html(cat.Name));

    $(".popup-event").find("#event-name").val(item.Name);
    $(".popup-event").find("#event-notes").val(item.Notes);

    $(".popup-event").find("#LessonDuration").val(item.LessonDuration);

    // Set ID to cancel Later
    var date = Date.fromISONoTZ(item.StartDate);
    $("#event-start-date").datepicker("setDate", date);
    $("#event-start-date").change();

    $("#event-notes").val(item.Notes || "");

    var hours = date.getHours();
    var mins = date.getMinutes();
    if (mins == 0) {
        mins = "00";
    }
    $("#event-start-time option").remove();
    $('<option value="t' + hours + '_' + mins + '">' + hours + ':' + mins + '</option>').appendTo("#event-start-time");


    if (isevalevent) {
        if (_user.Role == 2 || _user.Role >= 4) {
            $(".cancelappointment-button").show();
        }
        else {
            $(".cancelappointment-button").hide();
        }
    }
    else if (cat.Type == 3) {
        //if (pageUser.Role == 2) {
        //    $(".cancelappointment-button").show();
        //}
        //else {
        //    $(".cancelappointment-button").hide();
        //}
        if (item.Appointment.SessionReport == null) {
            $(".cancelappointment-button").show();
        }
        else {
            $(".cancelappointment-button").hide();
        }
        //$("#classroom").find("option").remove();
        //$("#classroom").append($("<option></option>").val(item.ClassroomID))
    }
    else {
        $(".cancelappointment-button").show();
    }
    // clear boxes
    $(".popup-event").find("#Lesson").find('option').remove().end();
    $(".popup-event").find("#tutor").find('option').remove().end();

    $(".cancelappointment-button").attr("data-item", json);


    if (item.Appointment) {
        GetAppointment(item.Appointment, item.Appointment, function (appointment) {

            $(".popup-event").find("#Lesson").find('option').remove().end().append($("<option>")
                                                                                    .val(appointment.Session.ID)
                                                                                    .html(appointment.Session.Module.Name));

            if (pageUser.Role == 1) {
                var tutor = $(".popup-event").find("#tutor");

                if (tutor.find("option[value=" + appointment.Tutor.ID + "]").length < 1) {
                    tutor.append($("<option>").val(appointment.Tutor.ID).html(appointment.Tutor.Name));

                }

                tutor.find("option[value=" + appointment.Tutor.ID + "]")[0].selected = 'selected'
            }
            else {
                $(".popup-event").find("#tutor").append($("<option>")
                .val(appointment.Tutor.ID)
                .html(appointment.Tutor.Name));
            }

            //Hide Cancel Lesson button if there is a session report associated with it
            //or the user is a tutor or tutor managerand the appointment is an oral evaluation
            //or if the user is a tutor or tutor manager in which the appointment is not related to that person
            if (item.SessionReport || ((_user.Role == 2 || _user.Role == 6) && appointment.Session.ProductType == 4) || ((_user.Role == 2 || _user.Role == 6) && appointment.Tutor.ID != _user.ID)) {
                $(".cancelappointment-button").hide();
            }

            if (cat.Type == 2) {
                // select the student : with failsafe for Oral Eval students
                var learner = $(".popup-event").find("#learner");

                if (learner.find("option[value=" + item.Student + "]").length < 1) {
                    learner.append($("<option>").val(item.Student).html(item.Name));

                }

                learner.find("option[value=" + item.Student + "]")[0].selected = 'selected';
            }

            //if (pageUser.Role == 1) {
            //    $("#tutor").change();
            //}
            $(".cancelappointment-button").attr("data-appid", appointment.ID);


            $(".popup-event").change();

        });
    }
    else {
        // ?
    }

    $("#phoneNumber").val(item.Phone);
    $("#phoneExtension").val(item.Extension);

}

function FillBookEOMExamPopupData() {
    var now = new Date();

    isExistingEvent = false;

    $(".popup-event").find("option[value='t" + (now.getHours() + 1) + "_00']").attr('selected', 'selected');

    if (_user.Role < 4) {
        now.setDate(now.getDate() + 1);
    }

    $(".popup-event").find("#event-start-date").datepicker("setDate", now);

    var lesson = FirstOrDefault(calendar.Categories, function (t) { return (t.Type == 2) });


    var Group = null;

    if (pageUser.Role > 1) {
        Group = FirstOrDefault(calendar.Categories, function (t) { return (t.Type == 3) });
    }

    var category = $(".popup-event").find("#category").find('option')
    .remove()
    .end();

    if (lesson) {
        category.append($("<option>")
                .val(lesson.ID)
                .html($("#lessonCategoryName").val()))
    }

    if (Group) {
        category.append($("<option>")
                .val(Group.ID)
                .html($("#groupCategoryName").val()));
    }

    if (isevalevent) {
        $(".popup-event").find("#event-name").closest(".form-item").hide();
        $(".popup-event").find("#category").closest(".form-item").hide();
        $(".popup-event").find("#Lesson").closest(".form-item").hide();

        $(".popup-event").find("#evalnotice").show();
        $(".popup-event").find("#evalnotice2").show();
        $(".popup-event").find("#lessonnotice").hide();
        $(".popup-event").find("#lessonnotice2").hide();

        $(".popup-event").find("#evaldatetext").show();
        $(".popup-event").find("#lessondatetext").hide();

        if (iseomexam) {
            $("#popup-event-title").text($('#book-eomexam-text').val());
        } else {
            $("#popup-event-title").text($('#book-evaluation-text').val());
        }
        

    }
    else {
        $(".popup-event").find("#event-name").closest(".form-item").show();
        $(".popup-event").find("#category").closest(".form-item").show();
        $(".popup-event").find("#Lesson").closest(".form-item").show();

        $(".popup-event").find("#evalnotice").hide();
        $(".popup-event").find("#evalnotice2").hide();
        $(".popup-event").find("#lessonnotice").show();
        $(".popup-event").find("#lessonnotice2").show();

        $(".popup-event").find("#evaldatetext").hide();
        $(".popup-event").find("#lessondatetext").show();

        $("#popup-event-title").text($('#book-lesson-text').val());

    }

    // $(".popup-event").find("#event-name").val(item.Name);
    // $(".popup-event").find("#event-notes").val(item.Notes);

    // Set ID to cancel Later

    $(".cancelappointment-button").hide();
    // clear boxes
    var Lesson = $(".popup-event").find("#Lesson").find('option').remove().end();
    var tutors = $(".popup-event").find("#tutor").find('option').remove().end();

    if (pageUser.Role == 1) {
        $("#learner-formitem").hide();
        $("#tutor-formitem").show();
        //$("#learner").change();
        $("#tutor").change();
    }
    else if (pageUser.Role == 2 || pageUser.Role == 6) {
        $("#learner-formitem").show();
        $("#tutor-formitem").hide();
        $("#tutor").append($("<option>")
            .val(pageUser.ID)
            .html(pageUser.FirstName + " " + pageUser.LastName));
        //$("#learner").change();

    }
    else {
        $("#learner-formitem").show();
        $("#tutor-formitem").show();
        //$("#learner").change();
    }


    //for (var i = 0; i < calendar.Students.length;i++)
    //{
    //    var learner = calendar.Students[i];
    //    $("#learner").append("<option>").val(learner.ID).html(learner.Name);
    //}
    if ((!isExistingEvent) && (pageUser.Role == 1)) {
        GetAvailableEOMExaminers(true);
    } else {
        GetAvailableEOMExaminers(false);
    }
    GetAvailableHoursOfEOMExaminers();

    setTimeout(function () { Validate(); }, 750);
}

function FillNewLessonCalendarItemData() {

    var now = new Date();

    isExistingEvent = false;

    $(".popup-event").find("option[value='t" + (now.getHours() + 1) + "_00']").attr('selected', 'selected');

    if (_user.Role < 4) {
        now.setDate(now.getDate() + 1);
    }

    $(".popup-event").find("#event-start-date").datepicker("setDate", now);

    var lesson = FirstOrDefault(calendar.Categories, function (t) { return (t.Type == 2) });


    var Group = null;

    if (pageUser.Role > 1) {
        Group = FirstOrDefault(calendar.Categories, function (t) { return (t.Type == 3) });
    }

    var category = $(".popup-event").find("#category").find('option')
    .remove()
    .end();

    if (lesson) {
        category.append($("<option>")
                .val(lesson.ID)
                .html($("#lessonCategoryName").val()))
    }

    if (Group) {
        category.append($("<option>")
                .val(Group.ID)
                .html($("#groupCategoryName").val()));
    }

    if (isevalevent) {
        $(".popup-event").find("#event-name").closest(".form-item").hide();
        $(".popup-event").find("#category").closest(".form-item").hide();
        $(".popup-event").find("#Lesson").closest(".form-item").hide();

        $(".popup-event").find("#evalnotice").show();
        $(".popup-event").find("#evalnotice2").show();
        $(".popup-event").find("#lessonnotice").hide();
        $(".popup-event").find("#lessonnotice2").hide();

        $(".popup-event").find("#evaldatetext").show();
        $(".popup-event").find("#lessondatetext").hide();

        $("#popup-event-title").text($('#book-evaluation-text').val());

    }
    else {
        $(".popup-event").find("#event-name").closest(".form-item").show();
        $(".popup-event").find("#category").closest(".form-item").show();
        $(".popup-event").find("#Lesson").closest(".form-item").show();

        $(".popup-event").find("#evalnotice").hide();
        $(".popup-event").find("#evalnotice2").hide();
        $(".popup-event").find("#lessonnotice").show();
        $(".popup-event").find("#lessonnotice2").show();

        $(".popup-event").find("#evaldatetext").hide();
        $(".popup-event").find("#lessondatetext").show();

        $("#popup-event-title").text($('#book-lesson-text').val());

    }

    // $(".popup-event").find("#event-name").val(item.Name);
    // $(".popup-event").find("#event-notes").val(item.Notes);

    // Set ID to cancel Later

    $(".cancelappointment-button").hide();
    // clear boxes
    var Lesson = $(".popup-event").find("#Lesson").find('option').remove().end();
    var tutors = $(".popup-event").find("#tutor").find('option').remove().end();

    if (pageUser.Role == 1) {
        $("#learner-formitem").hide();
        $("#tutor-formitem").show();
        //$("#learner").change();
        $("#tutor").change();
    }
    else if (pageUser.Role == 2 || pageUser.Role == 6) {
        $("#learner-formitem").show();
        $("#tutor-formitem").hide();
        $("#tutor").append($("<option>")
            .val(pageUser.ID)
            .html(pageUser.FirstName + " " + pageUser.LastName));
        //$("#learner").change();

    }
    else {
        $("#learner-formitem").show();
        $("#tutor-formitem").show();
        //$("#learner").change();
    }


    //for (var i = 0; i < calendar.Students.length;i++)
    //{
    //    var learner = calendar.Students[i];
    //    $("#learner").append("<option>").val(learner.ID).html(learner.Name);
    //}
    if ((!isExistingEvent) && (pageUser.Role == 1)) {
        GetAvailableTutors(true);
    } else {
        GetAvailableTutors(false);
    }
    GetAvailableHours();

    setTimeout(function () { Validate(); }, 750);
}


function GetSelectedDate() {
    var start = $("#event-start-date").datepicker("getDate");


    var time = $("#event-start-time").find("option:selected:not(#notime)").val();
    if (time && time.length > 4) {
        var hours = parseInt(time.substr(1, 2).replace("_", ""));
        var minutes = parseInt(time.substr(time.indexOf("_") + 1, 2));
        start.setHours(hours, minutes, 0, 0);
    }

    return start;
}

function GetAvailableHoursOfEOMExaminers() {
    // Remove all time options.
    $("#event-start-time option").remove();


    if (isExistingEvent && existingEvent != null) {
        $("#event-start-time").find("option").remove();
        var itemStart1 = Date.fromISONoTZ(existingEvent.StartDate)
        var hours = itemStart1.getHours();
        var minutes = doubleDate(itemStart1.getMinutes());
        $('<option value="t' + hours + '_' + minutes + '">' + hours + ':' + minutes + '</option>').appendTo("#event-start-time");

        return;
    }

    if (pageUser.Role != 1) {
        // Show all times.
        var start = GetSelectedDate();
        for (var i = 0; i < 48; i++) {
            start.setHours(i / 2);
            start.setMinutes((i % 2) * 30);

            var hours = start.getHours().toString();
            var mins = start.getMinutes();
            mins = (mins < 10 ? "0" : "") + mins.toString();
            $('<option value="t' + hours + '_' + mins + '">' + hours + ':' + mins + '</option>').appendTo("#event-start-time");

            if (i == 16) {
                $(this).prop("selected", "selected");
            }
        }
        return;
    }

    // Get the currently selected session.
    var session;
    var sessionDuration;

    if (iseomexam) {
        sessionDuration = 60;
    }
    else {
        var opt = $(".popup-event").find("#Lesson option:selected");
        if (opt.length > 0) {
            var sess = $(".popup-event").find("#Lesson option:selected").prop("data-session");
            if (sess) {
                session = JSON.parse(sess);
            }
            else {
                console.log("no sessions available.");
                return;
            }

        } else if (isevalevent) {
            $("#event-start-time").change();
            return;
        }
        else {
            $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
            return;
        }
    }
    // Get the currently selected tutor.
    var tuts = [];

    if (!iseomexam && session.ProductType != 4) {
        var current = $(".popup-event").find("#tutor option:selected");


        //GetAvailableTutors(false, true);


        var newsel = $(".popup-event").find("#tutor option[id=" + current.val() + "]");
        if (newsel.length > 0) {
            newsel[0].selected = true;
        }


        opt = $(".popup-event").find("#tutor option:selected");
        if (opt.length > 0) {
            tuts.push(opt.val());
        } else {


            $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
            return;


        }
    } else {
        //for (var t in calendar.EOMExaminers) {
        //    tuts.push(t);

        opt = $(".popup-event").find("#tutor option:selected");
        if (opt.length > 0) {
            tuts.push(opt.val());
        } else {


            $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
            return;


        }
   }
    
    var start = GetSelectedDate();

    // Add the appointment times depending on the tutor availability.
    for (var i = 0; i < 48; i++) {
        start.setHours(i / 2);
        start.setMinutes((i % 2) * 30);

        var end = new Date(start);
        end.setMinutes(end.getMinutes() + sessionDuration);

        for (var t = 0; t < tuts.length; t++) {
            var avail = calendar.EOMExaminers[tuts[t]];
            //if (avail !== undefined) {
            //    avail = avail.Value;
            //}
            var found = false;
            if (avail) {

                for (var j = 0; j < avail.length; j++) {
                    var item = avail[j];
                    var itemStart = Date.fromISONoTZ(item.StartDate);
                    var itemEnd = Date.fromISONoTZ(item.EndDate);
                    if ((start >= itemStart) && (end <= itemEnd)) {
                        var hours = start.getHours().toString();
                        var mins = start.getMinutes();
                        mins = (mins < 10 ? "0" : "") + mins.toString();
                        $('<option value="t' + hours + '_' + mins + '">' + hours + ':' + mins + '</option>').appendTo("#event-start-time");

                        if ($("#event-start-time").val() == null) {
                            $(this).prop("selected", "selected");
                        }

                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                break;
            }
        }


    }


    if (!iseomexam && session.ProductType == 4 && !isExistingEvent) {
        $("#event-start-time").change();
    }

    // Display a message if there is no availability.
    if ($("#event-start-time option").length == 0) {
        $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
    }
}

function GetAvailableHours() {
    // Remove all time options.
    $("#event-start-time option").remove();


    if (isExistingEvent && existingEvent != null) {
        $("#event-start-time").find("option").remove();
        var itemStart1 = Date.fromISONoTZ(existingEvent.StartDate)
        var hours = itemStart1.getHours();
        var minutes = doubleDate(itemStart1.getMinutes());
        $('<option value="t' + hours + '_' + minutes + '">' + hours + ':' + minutes + '</option>').appendTo("#event-start-time");

        return;
    }

    if (pageUser.Role != 1) {
        // Show all times.
        var start = GetSelectedDate();
        for (var i = 0; i < 48; i++) {
            start.setHours(i / 2);
            start.setMinutes((i % 2) * 30);

            var hours = start.getHours().toString();
            var mins = start.getMinutes();
            mins = (mins < 10 ? "0" : "") + mins.toString();
            $('<option value="t' + hours + '_' + mins + '">' + hours + ':' + mins + '</option>').appendTo("#event-start-time");

            if (i == 16) {
                $(this).prop("selected", "selected");
            }
        }
        return;
    }

    // Get the currently selected session.
    var session;
    var opt = $(".popup-event").find("#Lesson option:selected");
    if (opt.length > 0) {
        var sess = $(".popup-event").find("#Lesson option:selected").prop("data-session");
        if (sess) {
            session = JSON.parse(sess);
        }
        else {
            console.log("no sessions available.");
            return;
        }

    } else if (isevalevent) {
        $("#event-start-time").change();
        return;
    }
    else {
        $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
        return;
    }

    // Get the currently selected tutor.
    var tuts = [];

    if (session.ProductType != 4) {
        var current = $(".popup-event").find("#tutor option:selected");


        //GetAvailableTutors(false, true);


        var newsel = $(".popup-event").find("#tutor option[id=" + current.val() + "]");
        if (newsel.length > 0) {
            newsel[0].selected = true;
        }


        opt = $(".popup-event").find("#tutor option:selected");
        if (opt.length > 0) {
            tuts.push(opt.val());
        } else {


            $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
            return;


        }
    } else {
        for (var t in calendar.OtherUserItems) {
            tuts.push(t);
        }
    }

    var start = GetSelectedDate();

    // Add the appointment times depending on the tutor availability.
    for (var i = 0; i < 48; i++) {
        start.setHours(i / 2);
        start.setMinutes((i % 2) * 30);

        var end = new Date(start);
        end.setMinutes(end.getMinutes() + session.Duration);

        for (var t = 0; t < tuts.length; t++) {
            var avail = calendar.OtherUserItems[tuts[t]];
            var found = false;
            if (avail) {

                for (var j = 0; j < avail.length; j++) {
                    var item = avail[j];
                    var itemStart = Date.fromISONoTZ(item.StartDate);
                    var itemEnd = Date.fromISONoTZ(item.EndDate);
                    if ((start >= itemStart) && (end <= itemEnd)) {
                        var hours = start.getHours().toString();
                        var mins = start.getMinutes();
                        mins = (mins < 10 ? "0" : "") + mins.toString();
                        $('<option value="t' + hours + '_' + mins + '">' + hours + ':' + mins + '</option>').appendTo("#event-start-time");

                        if ($("#event-start-time").val() == null) {
                            $(this).prop("selected", "selected");
                        }

                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                break;
            }
        }


    }


    if (session.ProductType == 4 && !isExistingEvent) {
        $("#event-start-time").change();
    }

    // Display a message if there is no availability.
    if ($("#event-start-time option").length == 0) {
        $('<option id="notime" selected="selected">' + $("#noAvailability").val() + '</option>').appendTo("#event-start-time");
    }
}

function GetAvailableEOMExaminers(all, self) {
    if (pageUser.Role == 2) {
        var dropdownlist = $(".popup-event").find("#tutor").find('option')
        .remove()
        .end();



        dropdownlist.append($("<option>")
            .val(pageUser.ID)
            .html(pageUser.FirstName + " " + pageUser.LastName));


        $("#tutor").change();
    }
    else {
        var start = GetSelectedDate();

        var other = calendar.EOMExaminers;

        // Get the currently selected session.
        var list;
        var opt = $(".popup-event").find("#Lesson option:selected");
        if (!isevalevent) {

            list = [];
            for (var key in other) {

                if (other[key].length > 0 && pageUser.Tutors.Any(function (pt) { return key == pt.ID })) {
                    list.push(other[key][0]);
                }

            }
        }
        else if (all) {
            list = [];
            for (var i in other) {
                if (other[i].length > 0) {
                    list.push(other[i][0]);
                }
            }

        } else if ((opt.length > 0) && opt.prop("data-session")) {
            var session = JSON.parse(opt.prop("data-session"));
            list = GetAvailableTutorsCallback(session.ProductType, start, session.Duration);
        } else {
            list = [];
        }


        // Where filter.
        if (pageUser.Role == 1 && _user.Role == 2) {
            var newlist = [];

            for (var i = 0; i < list.length; i++) {
                var t = list[i];
                if (t.ID == _user.ID) {
                    newlist.push(t);
                }
            }

            list = newlist;
        }


        var dropdownlist = $(".popup-event").find("#tutor").find('option')
        .remove()
        .end();

        if (list && list.length > 0) {

            for (var i = 0; i < list.length; i++) {
                var t = list[i];
                dropdownlist.append($("<option>")
                    .val(t.ID)
                    .html(t.Name));
            }
        }
        else {
            dropdownlist.append($("<option>")
                   .val(Guid.Empty)
                   .html($("#noTutorAvailable").val()));

        }

        if (self) {

        }
        else {
            $("#tutor").change();
        }
    }
}

function GetAvailableTutors(all, self) {
    if (pageUser.Role == 2) {
        var dropdownlist = $(".popup-event").find("#tutor").find('option')
        .remove()
        .end();



        dropdownlist.append($("<option>")
            .val(pageUser.ID)
            .html(pageUser.FirstName + " " + pageUser.LastName));


        $("#tutor").change();
    }
    else {
        var start = GetSelectedDate();

        var other = calendar.OtherUserItems;

        // Get the currently selected session.
        var list;
        var opt = $(".popup-event").find("#Lesson option:selected");
        if (!isevalevent) {

            list = [];
            for (var key in other) {

                if (other[key].length > 0 && pageUser.Tutors.Any(function (pt) { return key == pt.ID })) {
                    list.push(other[key][0]);
                }

            }
        }
        else if (all) {
            list = [];
            for (var i in other) {
                if (other[i].length > 0) {
                    list.push(other[i][0]);
                }
            }

        } else if ((opt.length > 0) && opt.prop("data-session")) {
            var session = JSON.parse(opt.prop("data-session"));
            list = GetAvailableTutorsCallback(session.ProductType, start, session.Duration);
        } else {
            list = [];
        }


        // Where filter.
        if (pageUser.Role == 1 && _user.Role == 2) {
            var newlist = [];

            for (var i = 0; i < list.length; i++) {
                var t = list[i];
                if (t.ID == _user.ID) {
                    newlist.push(t);
                }
            }

            list = newlist;
        }


        var dropdownlist = $(".popup-event").find("#tutor").find('option')
        .remove()
        .end();

        if (list && list.length > 0) {

            for (var i = 0; i < list.length; i++) {
                var t = list[i];
                dropdownlist.append($("<option>")
                    .val(t.ID)
                    .html(t.Name));
            }
        }
        else {
            dropdownlist.append($("<option>")
                   .val(Guid.Empty)
                   .html($("#noTutorAvailable").val()));

        }

        if (self) {

        }
        else {
            $("#tutor").change();
        }
    }
}

function GetAvailableTutorsCallback(LessonType, date, duration) {
    var result = [];
    if (isExistingEvent && existingEvent != null) {
        return;
    }
    else if (pageUser.Role == 2 || pageUser.Role == 6) {
        result.push({ ID: pageUser.ID, Name: pageUser.FirstName });
    }
    else {
        // Get the tutors that are available for at least the specified duration.
        var endDate = new Date(date);
        endDate.setMinutes(date.getMinutes() + duration);

        var predicate = null;

        if (LessonType == 4 && pageUser.Tutors) {
            predicate = function (input) {
                //var res = !pageUser.Tutors.Any(function (t) { return t.ID == input });
                return true;
            };
        }
        else if (LessonType == 1 && pageUser.Tutors) {
            predicate = function (input) {
                var res = pageUser.Tutors.Any(function (t) { return t.ID == input });
                return res;
            };
        }

        for (var prop in calendar.OtherUserItems) {
            // important check that this is objects own property 
            // not from prototype prop inherited
            if (calendar.OtherUserItems.hasOwnProperty(prop)) {
                var list = calendar.OtherUserItems[prop];

                if (list && predicate(prop)) {

                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var start = Date.fromISONoTZ(item.StartDate);
                        var end = Date.fromISONoTZ(item.EndDate);
                        if ((date >= start) && (endDate <= end)) {
                            result.push(item);
                            break;
                        }

                    }
                }

            }

        }
    }

    return result;
}


function FillAvailibilityData(items) {
    var categories = calendar.Categories;

    ClearAvailabilityWindow();

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var test = FirstOrDefault(categories, function (c) { return c.ID == item.Category; });

        if ((item.Category && test)
            && (test.Type == 2 || test.Type == 3)) {

            AddRow(item, test);

        }
        else if (item.Category && test
           && (test.Type == 1)) {

            // set up availability check boxes
            TickAvailabilityBoxes(item);

        }
    }
}

function AddRow(item, category) {
    var start = Date.fromISONoTZ(item.StartDate);
    var end = Date.fromISONoTZ(item.EndDate);

    var index = start.getHours() * 2 + 1;
    index += (start.getMinutes() == 30) ? 1 : 0;

    var endindex = end.getHours() * 2 + 1;
    endindex += (end.getMinutes() == 30) ? 1 : 0;

    var selector = $(".tab-availability").find("tr");

    var selec = $("#hopenooneusesthisiddotcom");  // empty selector, by design

    if (item.ModuleName == null) {
        item.ModuleName = "";
    }

    for (var i = index; i < endindex; i++) {
        selec.push($(selector[i])[0]);

        var test = JSON.stringify(item);

        $(selector[i]).css("background", "");
        if (i == index) {
            var tds = $(selector[i]).find("td");
            $(tds[2]).html("<p>" + (item.Student ? "<a href=\"/lessons/" + item.Student + "\">" : "") + item.Name + (item.Student ? "</a>" : "") + "</p>");
            $(tds[3]).html("<p>" + item.ModuleName || "" + "</p>");

            var isEval = false;

            isEval = (item.ModuleName) && (item.ModuleName.toLowerCase().indexOf("evaluation") > 0);   // far fetched. 

            var isclassroom = FirstOrDefault(calendar.Categories, function (c) { return (c.ID == item.Category) }).Type == 3;

            if (!item.SessionReport) {
                var now = new Date();;
                var end = Date.fromISONoTZ(item.EndDate);

                if ((pageUser.Role == 2 || pageUser.Role == 6) && (_user.ID == pageUser.ID)) {
                    var anchorFillESR = $("<a data-item=" + test + ">Fill ESR</a>");
                    anchorFillESR.css("cursor", "pointer");
                    if (isEval) {
                        var anchorFillESR = $("<a data-item=" + test + ">Fill Eval</a>");
                        anchorFillESR.css("cursor", "pointer");
                        anchorFillESR.attr("href", baseURL + "/reports/placementtestreport/?aid=" + item.Appointment);
                    }
                    else if (isclassroom) {
                        var anchorFillESR = $("<a data-item=" + test + ">Fill ESR</a>");
                        anchorFillESR.css("cursor", "pointer");
                        anchorFillESR.attr("href", baseURL + "/reports/ClassroomESRReport?aid=" + item.Appointment);

                    }
                    else {
                        var anchorFillESR = $("<a data-item=" + test + ">Fill ESR</a>");
                        anchorFillESR.css("cursor", "pointer");
                        anchorFillESR.attr("href", baseURL + "/reports/Lesson/?aid=" + item.Appointment);
                    }
                    $(tds[5]).append(anchorFillESR);
                    $(tds[5]).append($("<br />"));
                }


                //The code here assumes that only oral evaluations appear in the calendar.
                //Tutors can not cancel a booked oral evaluation
                if (_user.Role != 2) {
                    var anchorCancel = $("<a data-item=" + test + ">Cancel</a>");
                    anchorCancel.css("cursor", "pointer");
                    var setclick = function (t) {
                        anchorCancel.click(function (e) {
                            $(this).parents('.popup-form').hide();
                            //$('body .body-overlay').hide();
                            TryCancelAppointment(e.target, t);
                        });
                    };
                    setclick(item);
                    $(tds[5]).append(anchorCancel);
                }

            }
            else {
                if (isEval) {
                    var anchorShowESR = $("<a data-item=" + test + ">View Eval</a>");
                    anchorShowESR.css("cursor", "pointer");

                    anchorShowESR.attr("href", baseURL + "/reports/placementtestreport/" + item.SessionReport);
                }
                else if (isclassroom) {
                    var anchorShowESR = $("<a data-item=" + test + ">View ESR</a>");
                    anchorShowESR.css("cursor", "pointer");
                    anchorShowESR.attr("href", baseURL + "/reports/ClassroomESRReport/" + item.SessionReport);

                }
                else {
                    var anchorShowESR = $("<a data-item=" + test + ">View ESR</a>");
                    anchorShowESR.css("cursor", "pointer");

                    anchorShowESR.attr("href", baseURL + "/reports/Lesson/" + item.SessionReport + "?sid=");
                }
                //var setclick = function (t) {
                //    anchorShowESR.click(function (e) { TryCancelAppointment(e.target, t); });
                //};
                //setclick(item);
                $(tds[5]).append(anchorShowESR);
            }
        }
        //$(tds[4]).text(item.Name);

    }

    setTimeout(function () {
        selec.css("background", "#FFAA44");
    }, 200);
}

function TickAvailabilityBoxes(item) {
    var checkboxes = $(".tab-availability").find("input[type=checkbox]");

    var start = Date.fromISONoTZ(item.StartDate);//;
    var end = Date.fromISONoTZ(item.EndDate);//;

    var index = start.getHours() * 2 + 1;
    index += (start.getMinutes() == 30) ? 1 : 0;

    var endindex = (((end.getHours() == 0) && (end.getMinutes(0) == 0)) ? 24 : end.getHours()) * 2 + 1;
    endindex += (end.getMinutes() == 30) ? 1 : 0;

    for (var k = index; k < endindex; k++) {
        checkboxes[k].checked = true;
    }
}


function Appointment() {
    this.CancelDate = null; // datetime?
    this.CancelledBy = null; // ID
    this.CancelReason = null; // enum...
    this.CancelReasonText = null; // string
    this.Date = null; // datetime
    this.ID = null; // guid
    this.IsChargeable = false; // bool
    this.Session = null; // Lesson   only ID needed ?
    this.Student = null; // identification
    this.Tutor = null; // identification
    this.LessonDuration = null;
    this.Phone = null;
}

function Session() {
    this.ID = null; // Guid
}

function Identification(id) {
    this.ID = id;
    this.Name = "";
}

/// ----  AJAX Section
/// 

function GetAvailableSessions(studentID, callback) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/Lessons/" + studentID,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { console.log("GetAvailableSessions Error: " + t.status + "  " + t.statusText); }
    });
}

function GetClassroomLearnersPresence(studentID, callback) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/GetClassroomLearnersPresence/" + studentID,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { console.log("GetClassroomLearnersPresence Error: " + t.status + "  " + t.statusText); }
    });
}


function GetClassroomSessions(classroomID, callback) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/ClassroomSessions/" + classroomID,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) {
            console.log("GetClassroomSessions Error: " + t.status + "  " + t.statusText);
            DisplayError("Error getting the Group's information");
        }
    });
}


function CancelAppointment(id, chargeable, reason, reasonText, callback) {

    if (!chargeable) {
        chargeable = false;
    }
    if (!callback) {
        callback = function () { ReloadPage(); };
    }
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }

    $(".popup-form").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/cancelappointment/" + id + "?chargeable=" + chargeable + "&reason=" + reason + "&reasonText=" + reasonText,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { $(".popup-form").LoadingOverlay("hide"); alert("Cancel Appointment Error: " + t.status + "  " + t.statusText); }
    });
}


function CancelClassroomAppointment(id, chargeable, reason, reasonText, callback) {

    var querystring = "?chargeable=" + chargeable + "&reason=" + reason + "&reasonText=" + reasonText;
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }

    $(".popup-form").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/CancelGroupAppointment/" + id + querystring,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { $(".popup-form").LoadingOverlay("hide"); alert("Cancel Group Appointment Error: " + t.status + "  " + t.statusText); }
    });
}


function CreateAppointment(appointment, phone, iseomexam, lessonDuration, extension, callback) {
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }
    var date = GetSelectedDate();

    var strDate = stringifyDate(date);

    var json = JSON.stringify(appointment);

    $(".popup-form").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/appointment/?date=" + strDate + "&phone=" + phone + "&extension=" + extension + "&iseomexam=" + iseomexam + "&lessonDuration=" + lessonDuration,
        data: json,
        dataType: "json",
        success: function (t) { console.log(t); callback(t); },
        error: function (t) {
            $(".popup-form").LoadingOverlay("hide");
            console.log("CreateAppointment Error: " + t.status + "  " + t.statusText + " " + t.responseText);

            DisplayError("Error creating appointment");
        }
    });
}



function CreateGroupAppointment(appointment, callback) {
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }
    var date = GetSelectedDate();
    var strDate = stringifyDate(date);

    var json = JSON.stringify(appointment);

    $(".popup-form").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/Group/?date=" + strDate,
        data: json,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) {
            $(".popup-form").LoadingOverlay("hide");
            console.log("CreateGroupAppointment Error: " + t.status + "  " + t.statusText + " " + t.responseText);

            DisplayError("Error creating appointment");

        }
    });
}


function DisplayError(error) {
    $("#appointmentError").text(error);
    $("#appointmentError").show();
}

function stringifyDate(date) {

    var strDate = "" + doubleDate(date.getDate()) + "." + doubleDate(date.getMonth() + 1) + "." + date.getFullYear() + " " + doubleDate(date.getHours()) + ":" + doubleDate(date.getMinutes());

    return strDate;
}

function doubleDate(part) {

    part = "" + part;

    if (part.length == 1) {
        part = "0" + part;
    }

    return part;
}


function GetAppointment(userID, appID, callback) {
    var json = null;

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/appointment/" + appID,
        data: json,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { console.log("GetAppointment Error: " + t.status + "  " + t.statusText); }
    });
}

function SaveCalendarItem(userID, calendarItem, recurrency, callback) {
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }

    var json = JSON.stringify(calendarItem);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + userID + "/calendaritem/",
        data: json,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { alert("SaveCalendarItem Error: " + t.status + "  " + t.statusText); }
    });
}

function SaveAvailability(avaialability, callback) {
    if (_user.Role == 10) {
        return; // Accountant is readonly!
    }
    if (!callback) {
        callback = function () { ReloadPage(); };
    }

    var json = JSON.stringify(avaialability);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/calendar/" + pageUser.ID + "/availability/",
        data: json,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { alert("SaveAvailability Error: " + t.status + "  " + t.statusText); }
    });

    //AjaxPost_Overlay({
    //    url: baseURL + "/api/calendar/" + pageUser.ID + "/availability/",
    //    data: json,
    //    contentType: "application/json; charset=utf-8",
    //    onsuccess: callback,
    //    onfailed: function (t) {
    //        alert("SaveAvailability Error: " + t.status + "  " + t.statusText);
    //    }
    //});
}


function Validate() {
    setTimeout(function () {
        var valid = true;

        var selectedcategory = $(".popup-event").find("#category option:selected").val();

        var category = FirstOrDefault(calendar.Categories, function (c) { return (c.ID == selectedcategory) });


        isClassroom = category.Type == 3

        var validDate = new Date();;

        if (pageUser.Role == 1) {
            validDate.setDate(validDate.getDate() + 1);
        }

        if (_user.Role == 4 || _user.Role == 7) {
            validDate.setFullYear(2005); // before the beginning of system. 
        }

        var selDate = GetSelectedDate();

        valid &= (selDate > validDate);
        valid &= ($(".popup-event").find("#event-start-time option:selected:not(#notime)").length > 0);
        valid &= ($(".cancelappointment-button[data-appid]").length == 0);
        
        valid &= ($(".popup-event").find("#Lesson option:selected").length > 0);
        
        valid &= (($(".popup-event").find("#tutor option:selected").length > 0) && ($(".popup-event").find("#tutor option:selected").val() != Guid.Empty));
        if (!isClassroom) {
            valid &= ($(".popup-event").find("#learner option:selected").length > 0);
        }
        valid &= ($(".popup-event").find("#category option:selected").length > 0);

        valid &= !isExistingEvent;

        if (valid) {
            $("#bookLessonOK").removeAttr("disabled");
        }
        else {
            $("#bookLessonOK").attr("disabled", "disabled");
        }
    }, 200);
}

function ValidatePhone(value) {
    var result = "";

    for (var i = 0; i < value.length; i++) {
        if (isDigit(value[i])) {
            result = result + value[i];
        }
    }

    var valid = (result.length == 10);

    if (valid) {
        return "true";
    }
    else {
        return "false";
    }

    return result;
}

function isDigit(char) {
    return ("1234567890".indexOf(char) >= 0);
}