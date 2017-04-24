/// <reference path="/Scripts/jquery.js" />
/// <reference path="/Scripts/js.js" />

var validating = false;

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

    if ($("#passwordResetErrorMessage").val() != null && $("#passwordResetErrorMessage").val() != "") {
        if ($("#passwordResetErrorMessage").val() == "ErrorMessage1") {
            alert($("#passwordResetErrorMessage1").val());
        } else if ($("#passwordResetErrorMessage").val() == "ErrorMessage2") {
            alert($("#passwordResetErrorMessage2").val());
        }        
    }

    $("#studentstatus").on("change", function () {
        if ($("#studentstatus option:selected").val() == "Hold") {
            showOverlay();
            $("#popup-learner-status-change-reason").show();
            $("#reason-doNotLikeTheProgram").hide();
            $("#reason-lackOfMotivation").hide();
            $("#reason-completedTheModules").hide();
            $("#reason-completedSLEPrep").hide();
            $("#reason-completedMaintenance").hide();
            $("#reason-budget").show();
            $("#reason-work").show();
            $("#reason-personal").show();
            $("#reason-sickLeave").show();
            $("#reason-vacation").show();
        } else if ($("#studentstatus option:selected").val() == "Quit") {
            showOverlay();
            $("#popup-learner-status-change-reason").show();
            $("#reason-sickLeave").hide();
            $("#reason-vacation").hide();
            $("#reason-completedTheModules").hide();
            $("#reason-completedSLEPrep").hide();
            $("#reason-completedMaintenance").hide();
            $("#reason-budget").show();
            $("#reason-work").show();
            $("#reason-personal").show();
            $("#reason-doNotLikeTheProgram").show();
            $("#reason-lackOfMotivation").show();
        } else if ($("#studentstatus option:selected").val() == "Complete") {
            showOverlay();
            $("#popup-learner-status-change-reason").show();
            $("#reason-budget").hide();
            $("#reason-work").hide();
            $("#reason-personal").hide();
            $("#reason-sickLeave").hide();
            $("#reason-vacation").hide();
            $("#reason-doNotLikeTheProgram").hide();
            $("#reason-lackOfMotivation").hide();
            $("#reason-completedTheModules").show();
            $("#reason-completedSLEPrep").show();
            $("#reason-completedMaintenance").show();
        }

        if ($("input:radio[name=learner-status-change-reason]:checked").val() == "Other") {
            $("#learner-status-change-reason-details").css("border", "3px solid red");
        } else {
            $("#learner-status-change-reason-details").css("border", "1px solid black");
        }
    });

    $("input:radio[name=learner-status-change-reason]").change(function () {
        if ($("input:radio[name=learner-status-change-reason]:checked").val() == "Other") {
            $("#learner-status-change-reason-details").css("border", "3px solid red");
        } else {
            $("#learner-status-change-reason-details").css("border", "1px solid black");
        }
    });

    $('#save-learner-status-change-reason').click(function () {

        if (($("input:radio[name=learner-status-change-reason]:checked").val() == "Other") && ($("#learner-status-change-reason-details").val() == "")) {
            $("#learner-status-change-reason-details").css("border", "3px solid red");
            return false;
        }

        var that = $(this);
        var path = $("#learner-status-change-reason-path").val();
        $.ajax({
            url: baseURL + path + $("#user-id").val(),
            type: "POST",
            data: { newStatus: $("#studentstatus").val(), statusChangeReason: $("input:radio[name=learner-status-change-reason]:checked").val(), statusChangeReasonDetails: $("#learner-status-change-reason-details").val()},
            success: function (t) {
                location.reload();
                //.parents('.popup-form-special-skills').hide();
                //$('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving status change.");
            }
        });
    });

    $('#cancel-learner-status-change-reason').click(function () {
        $(this).parents('.popup-form-special-skills').hide();
        $('body .body-overlay').hide();
    });

    var showComments = $.urlParam('showComments');

    if (showComments == "true") {
        showOverlay();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-tutor-comments").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {
                $("#tutor_comments").val(t);
                //showOverlay();
                $("#popup-tutor-comments").show();
            },
            error: function (t) {
                alert("Error fetching tutor comments");
            }
        });
    }

    var unsubscribe = $.urlParam('unsubscribe');
    var language = $.urlParam('lang');

    if (unsubscribe == "true") {
        if (language == "en") {
            showOverlay();
            $("#popup-unsubscribe-en").show();
        } else if (language == "fr") {
            showOverlay();
            $("#popup-unsubscribe-fr").show();
        }
        
    }

    $('#key-notes').click(function () {

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-key-notes").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {
                $("#key_notes").val(t);
                showOverlay();
                $("#popup-key-notes").show();
            },
            error: function (t) {
                alert("Error fetching key notes");
            }
        });
  
    });

    $('#key-notes-cancel').click(function () {
        $(this).parents('.popup-form').hide();
        $('body .body-overlay').hide();
    });

    $('#key-notes-save').click(function () {
        var that = $(this);
        var key_notes = $("#key_notes").val();
        $.ajax({
            url: baseURL + $("#save-key-notes").val() + $("#user-id").val(),
            type: "POST",
            data: { keyNotes: key_notes },
            success: function (t) {
                that.parents('.popup-form').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving key notes");
            }
        });
    });

    $('#tutor-comments').click(function () {

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-tutor-comments").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {
                $("#tutor_comments").val(t);
                showOverlay();
                $("#popup-tutor-comments").show();
            },
            error: function (t) {
                alert("Error fetching tutor comments");
            }
        });

    });

    $('#tutor-comments-cancel').click(function () {
        $(this).parents('.popup-form').hide();
        $('body .body-overlay').hide();
    });

    $('#tutor-comments-save').click(function () {
        var that = $(this);
        var tutor_comments = $("#tutor_comments").val();
        $.ajax({
            url: baseURL + $("#save-tutor-comments").val() + $("#user-id").val(),
            type: "POST",
            data: { tutorComments: tutor_comments },
            success: function (t) {
                that.parents('.popup-form').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving tutor comments");
            }
        });
    });


    $('#level-achieved').click(function () {

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-level-achieved").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {
                //$("#oral option[value='" + t.level_oral + "']").attr("selected", "selected");
                //$("#listening option[value='" + t.level_listening + "']").attr("selected", "selected");
                //$("#writing option[value='" + t.level_writing + "']").attr("selected", "selected");

                $("#current-written-comprehension option[value='" + t.level_current_written_comprehension + "']").attr("selected", "selected");
                $("#current-oral-comprehension option[value='" + t.level_current_oral_comprehension + "']").attr("selected", "selected");
                $("#current-oral-interaction option[value='" + t.level_current_oral_interaction + "']").attr("selected", "selected");

                $("#targeted-written-comprehension option[value='" + t.level_targeted_written_comprehension + "']").attr("selected", "selected");
                $("#targeted-oral-comprehension option[value='" + t.level_targeted_oral_comprehension + "']").attr("selected", "selected");
                $("#targeted-oral-interaction option[value='" + t.level_targeted_oral_interaction + "']").attr("selected", "selected");

                $("#obtained-written-comprehension option[value='" + t.level_obtained_written_comprehension + "']").attr("selected", "selected");
                $("#obtained-oral-comprehension option[value='" + t.level_obtained_oral_comprehension + "']").attr("selected", "selected");
                $("#obtained-oral-interaction option[value='" + t.level_obtained_oral_interaction + "']").attr("selected", "selected");

                showOverlay();
                $("#popup-level-achieved").show();
            },
            error: function (t) {
                alert("Error fetching the levels achieved by the learner");
            }
        });

    });

    $('#level-achieved-cancel').click(function () {
        $(this).parents('.popup-form-level-achieved').hide();
        $('body .body-overlay').hide();
    });

    $('#level-achieved-save').click(function () {
        var that = $(this);
        //var level_oral = $("#oral").val();
        //var level_listening = $("#listening").val();
        //var level_writing = $("#writing").val();

        var level_current_written_comprehension = $("#current-written-comprehension").val();
        var level_current_oral_comprehension = $("#current-oral-comprehension").val();
        var level_current_oral_interaction = $("#current-oral-interaction").val();

        var level_targeted_written_comprehension = $("#targeted-written-comprehension").val();
        var level_targeted_oral_comprehension = $("#targeted-oral-comprehension").val();
        var level_targeted_oral_interaction = $("#targeted-oral-interaction").val();

        var level_obtained_written_comprehension = $("#obtained-written-comprehension").val();
        var level_obtained_oral_comprehension = $("#obtained-oral-comprehension").val();
        var level_obtained_oral_interaction = $("#obtained-oral-interaction").val();

        $.ajax({
            url: baseURL + $("#save-level-achieved").val() + $("#user-id").val(),
            type: "POST",
            data: { levelCurrentWrittenComprehension: level_current_written_comprehension, levelCurrentOralComprehension: level_current_oral_comprehension, levelCurrentOralInteraction: level_current_oral_interaction, levelTargetedWrittenComprehension: level_targeted_written_comprehension, levelTargetedOralComprehension: level_targeted_oral_comprehension, levelTargetedOralInteraction: level_targeted_oral_interaction, levelObtainedWrittenComprehension: level_obtained_written_comprehension, levelObtainedOralComprehension: level_obtained_oral_comprehension, levelObtainedOralInteraction: level_obtained_oral_interaction },
            success: function (t) {
                that.parents('.popup-form-level-achieved').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving the levels achieved by the learner");
            }
        });
    });
    
    $('#special-skills').click(function () {

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-special-skills").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {
                
                if (t.IsSLEPrep == "on") {
                    $("#slePrep").prop('checked', true);
                } else {
                    $("#slePrep").prop('checked', false);
                }

                if (t.IsSLEEval == "on") {
                    $("#sleEval").prop('checked', true);
                } else {
                    $("#sleEval").prop('checked', false);
                }

                if (t.IsSimulation == "on") {
                    $("#simulation").prop('checked', true);
                } else {
                    $("#simulation").prop('checked', false);
                }

                if (t.IsFullTime == "on") {
                    $("#fullTime").prop('checked', true);
                } else {
                    $("#fullTime").prop('checked', false);
                }

                if (t.IsGroups == "on") {
                    $("#groups").prop('checked', true);
                } else {
                    $("#groups").prop('checked', false);
                }

                if (t.IsEOMExam == "on") {
                    $("#eomExam").prop('checked', true);
                } else {
                    $("#eomExam").prop('checked', false);
                }

                //if (t.IsAuthorizedForSLE == "on") {
                //    $("#authorizedForSLE").prop('checked', true);
                //} else {
                //    $("#authorizedForSLE").prop('checked', false);
                //}

                showOverlay();
                $("#popup-special-skills").show();
            },
            error: function (t) {
                alert("Error fetching the special skills of tutor");
            }
        });

    });

    $('#special-skills-save').click(function () {
        var that = $(this);
        
        var slePrep = $("#slePrep").is(':checked');
        var sleEval = $("#sleEval").is(':checked');
        var simulation = $("#simulation").is(':checked');
        var fullTime = $("#fullTime").is(':checked');
        var groups = $("#groups").is(':checked');
        var eomExam = $("#eomExam").is(':checked');
        //var authorizedForSLE = $("#authorizedForSLE").is(':checked');

        $.ajax({
            url: baseURL + $("#save-special-skills").val() + $("#user-id").val(),
            type: "POST",
            data: { IsSLEPrep: slePrep, IsSLEEval: sleEval, IsSimulation: simulation, IsFullTime: fullTime, IsGroups: groups, IsEOMExam: eomExam},
            success: function (t) {
                that.parents('.popup-form-special-skills').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving the special skills of the tutor");
            }
        });
    });

    $('#special-skills-cancel').click(function () {
        $(this).parents('.popup-form-special-skills').hide();
        $('body .body-overlay').hide();
    });

    $('#learner-notification-settings').click(function () {

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-learner-notification-settings").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {

                if (t.registrationEmail == "on") {
                    $("#registrationEmail").prop('checked', true);
                } else {
                    $("#registrationEmail").prop('checked', false);
                }

                if (t.registrationFormSaved == "on") {
                    $("#registrationFormSaved").prop('checked', true);
                } else {
                    $("#registrationFormSaved").prop('checked', false);
                }

                if (t.onlineEvaluationCompletion == "on") {
                    $("#onlineEvaluationCompletion").prop('checked', true);
                } else {
                    $("#onlineEvaluationCompletion").prop('checked', false);
                }

                if (t.bookedOralEvaluation == "on") {
                    $("#bookedOralEvaluation").prop('checked', true);
                } else {
                    $("#bookedOralEvaluation").prop('checked', false);
                }

                if (t.cancelledOralEvaluation == "on") {
                    $("#cancelledOralEvaluation").prop('checked', true);
                } else {
                    $("#cancelledOralEvaluation").prop('checked', false);
                }

                if (t.completionOfOralEvaluation == "on") {
                    $("#completionOfOralEvaluation").prop('checked', true);
                } else {
                    $("#completionOfOralEvaluation").prop('checked', false);
                }

                if (t.tutorAssignment == "on") {
                    $("#tutorAssignment").prop('checked', true);
                } else {
                    $("#tutorAssignment").prop('checked', false);
                }

                if (t.accessToOnlineModules == "on") {
                    $("#accessToOnlineModules").prop('checked', true);
                } else {
                    $("#accessToOnlineModules").prop('checked', false);
                }

                if (t.accessCodeForDVDModules == "on") {
                    $("#accessCodeForDVDModules").prop('checked', true);
                } else {
                    $("#accessCodeForDVDModules").prop('checked', false);
                }

                if (t.softwareChangeNotification == "on") {
                    $("#softwareChangeNotification").prop('checked', true);
                } else {
                    $("#softwareChangeNotification").prop('checked', false);
                }

                if (t.bookedLesson == "on") {
                    $("#bookedLesson").prop('checked', true);
                } else {
                    $("#bookedLesson").prop('checked', false);
                }

                if (t.cancelledLesson == "on") {
                    $("#cancelledLesson").prop('checked', true);
                } else {
                    $("#cancelledLesson").prop('checked', false);
                }

                if (t.upcomingLesson == "on") {
                    $("#upcomingLesson").prop('checked', true);
                } else {
                    $("#upcomingLesson").prop('checked', false);
                }

                if (t.ESRReportSaved == "on") {
                    $("#ESRReportSaved").prop('checked', true);
                } else {
                    $("#ESRReportSaved").prop('checked', false);
                }

                if (t.chargeableCancellation == "on") {
                    $("#chargeableCancellation").prop('checked', true);
                } else {
                    $("#chargeableCancellation").prop('checked', false);
                }

                if (t.requestForAdditionalHours == "on") {
                    $("#requestForAdditionalHours").prop('checked', true);
                } else {
                    $("#requestForAdditionalHours").prop('checked', false);
                }

                if (t.requestForNextModule == "on") {
                    $("#requestForNextModule").prop('checked', true);
                } else {
                    $("#requestForNextModule").prop('checked', false);
                }

                if (t.requestForHoursApproved == "on") {
                    $("#requestForHoursApproved").prop('checked', true);
                } else {
                    $("#requestForHoursApproved").prop('checked', false);
                }

                if (t.requestForModulesApproved == "on") {
                    $("#requestForModulesApproved").prop('checked', true);
                } else {
                    $("#requestForModulesApproved").prop('checked', false);
                }

                if (t.requestDeclined == "on") {
                    $("#requestDeclined").prop('checked', true);
                } else {
                    $("#requestDeclined").prop('checked', false);
                }

                if (t.EOMSaved == "on") {
                    $("#EOMSaved").prop('checked', true);
                } else {
                    $("#EOMSaved").prop('checked', false);
                }

                if (t.studentRemovedFromTutorsList == "on") {
                    $("#studentRemovedFromTutorsList").prop('checked', true);
                } else {
                    $("#studentRemovedFromTutorsList").prop('checked', false);
                }

                if (t.tutorReassignment == "on") {
                    $("#tutorReassignment").prop('checked', true);
                } else {
                    $("#tutorReassignment").prop('checked', false);
                }

                if (t.weeklyFollowUp == "on") {
                    $("#weeklyFollowUp").prop('checked', true);
                } else {
                    $("#weeklyFollowUp").prop('checked', false);
                }

                if (t.onHoldFollowUp == "on") {
                    $("#onHoldFollowUp").prop('checked', true);
                } else {
                    $("#onHoldFollowUp").prop('checked', false);
                }

                if (t.passwordChange == "on") {
                    $("#passwordChange").prop('checked', true);
                } else {
                    $("#passwordChange").prop('checked', false);
                }

                if (t.userNameChange == "on") {
                    $("#userNameChange").prop('checked', true);
                } else {
                    $("#userNameChange").prop('checked', false);
                }

                if (t.programCompletion == "on") {
                    $("#programCompletion").prop('checked', true);
                } else {
                    $("#programCompletion").prop('checked', false);
                }

                if (t.sendingAnnouncementByEmail == "on") {
                    $("#sendingAnnouncementByEmail").prop('checked', true);
                } else {
                    $("#sendingAnnouncementByEmail").prop('checked', false);
                }

                if (t.automatedEmailToInactiveStudent == "on") {
                    $("#automatedEmailForInactiveStudents").prop('checked', true);
                } else {
                    $("#automatedEmailForInactiveStudents").prop('checked', false);
                }

                showOverlay();
                $("#popup-learner-notification-settings").show();
            },
            error: function (t) {
                alert("Error fetching the learner's notification settings");
            }
        });

    });


    $('#coordinator-notification-settings').click(function () {

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: baseURL + $("#get-coordinator-notification-settings").val() + $("#user-id").val(),
            data: null,
            dataType: "json",
            success: function (t) {

                if (t.registrationFormSaved == "on") {
                    $("#registrationFormSavedCoordinator").prop('checked', true);
                } else {
                    $("#registrationFormSavedCoordinator").prop('checked', false);
                }

                if (t.softwareChangeNotification == "on") {
                    $("#softwareChangeNotificationCoordinator").prop('checked', true);
                } else {
                    $("#softwareChangeNotificationCoordinator").prop('checked', false);
                }

                if (t.chargeableCancellation == "on") {
                    $("#chargeableCancellationCoordinator").prop('checked', true);
                } else {
                    $("#chargeableCancellationCoordinator").prop('checked', false);
                }

                if (t.requestForAdditionalHours == "on") {
                    $("#requestForAdditionalHoursCoordinator").prop('checked', true);
                } else {
                    $("#requestForAdditionalHoursCoordinator").prop('checked', false);
                }

                if (t.requestForNextModule == "on") {
                    $("#requestForNextModuleCoordinator").prop('checked', true);
                } else {
                    $("#requestForNextModuleCoordinator").prop('checked', false);
                }

                if (t.requestForHoursApproved == "on") {
                    $("#requestForHoursApprovedCoordinator").prop('checked', true);
                } else {
                    $("#requestForHoursApprovedCoordinator").prop('checked', false);
                }

                if (t.requestForModulesApproved == "on") {
                    $("#requestForModulesApprovedCoordinator").prop('checked', true);
                } else {
                    $("#requestForModulesApprovedCoordinator").prop('checked', false);
                }

                if (t.requestDeclined == "on") {
                    $("#requestDeclinedCoordinator").prop('checked', true);
                } else {
                    $("#requestDeclinedCoordinator").prop('checked', false);
                }

                if (t.passwordChange == "on") {
                    $("#passwordChangeCoordinator").prop('checked', true);
                } else {
                    $("#passwordChangeCoordinator").prop('checked', false);
                }

                if (t.userNameChange == "on") {
                    $("#userNameChangeCoordinator").prop('checked', true);
                } else {
                    $("#userNameChangeCoordinator").prop('checked', false);
                }

                if (t.feedbackSubmissionForm == "on") {
                    $("#feedbackSubmissionFormCoordinator").prop('checked', true);
                } else {
                    $("#feedbackSubmissionFormCoordinator").prop('checked', false);
                }

                if (t.sendingAnnouncementByEmail == "on") {
                    $("#sendingAnnouncementByEmailCoordinator").prop('checked', true);
                } else {
                    $("#sendingAnnouncementByEmailCoordinator").prop('checked', false);
                }

                showOverlay();
                $("#popup-coordinator-notification-settings").show();
            },
            error: function (t) {
                alert("Error fetching the coordinator's notification settings");
            }
        });

    });


    $('#unsubscribe-cancel-en').click(function () {
        $(this).parents('.popup-form').hide();
        $('body .body-overlay').hide();
    });

    $('#unsubscribe-automatedEmailForInactiveStudent-en').click(function () {
        var that = $(this);
        $.ajax({
            url: baseURL + $("#unsubscribe-email").val() + $("#user-id").val(),
            type: "POST",
            data: null,
            success: function (t) {
                that.parents('.popup-form').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error unsubscribing");
            }
        });
    });

    $('#unsubscribe-cancel-fr').click(function () {
        $(this).parents('.popup-form').hide();
        $('body .body-overlay').hide();
    });

    $('#unsubscribe-automatedEmailForInactiveStudent-fr').click(function () {
        var that = $(this);
        $.ajax({
            url: baseURL + $("#unsubscribe-email").val() + $("#user-id").val(),
            type: "POST",
            data: null,
            success: function (t) {
                that.parents('.popup-form').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error unsubscribing");
            }
        });
    });

    $('#learner-notification-settings-save').click(function () {
        var that = $(this);

        var registrationEmail = $("#registrationEmail").is(':checked');
        var registrationFormSaved = $("#registrationFormSaved").is(':checked');
        var onlineEvaluationCompletion = $("#onlineEvaluationCompletion").is(':checked');

        var bookedOralEvaluation = $("#bookedOralEvaluation").is(':checked');
        var cancelledOralEvaluation = $("#cancelledOralEvaluation").is(':checked');
        var completionOfOralEvaluation = $("#completionOfOralEvaluation").is(':checked');
        var tutorAssignment = $("#tutorAssignment").is(':checked');
        var accessToOnlineModules = $("#accessToOnlineModules").is(':checked');
        var accessCodeForDVDModules = $("#accessCodeForDVDModules").is(':checked');
        var softwareChangeNotification = $("#softwareChangeNotification").is(':checked');
        var bookedLesson = $("#bookedLesson").is(':checked');
        var cancelledLesson = $("#cancelledLesson").is(':checked');
        var upcomingLesson = $("#upcomingLesson").is(':checked');
        var ESRReportSaved = $("#ESRReportSaved").is(':checked');
        //var incompleteESR = $("#incompleteESR").is(':checked');
        var chargeableCancellation = $("#chargeableCancellation").is(':checked');
        var requestForAdditionalHours = $("#requestForAdditionalHours").is(':checked');
        var requestForNextModule = $("#requestForNextModule").is(':checked');
        var requestForHoursApproved = $("#requestForHoursApproved").is(':checked');
        var requestForModulesApproved = $("#requestForModulesApproved").is(':checked');
        var requestDeclined = $("#requestDeclined").is(':checked');
        var EOMSaved = $("#EOMSaved").is(':checked');
        var studentRemovedFromTutorsList = $("#studentRemovedFromTutorsList").is(':checked');
        var tutorReassignment = $("#tutorReassignment").is(':checked');
        var weeklyFollowUp = $("#weeklyFollowUp").is(':checked');
        var onHoldFollowUp = $("#onHoldFollowUp").is(':checked');
        var passwordChange = $("#passwordChange").is(':checked');
        var userNameChange = $("#userNameChange").is(':checked');
        //var confirmedTutorTimesheet = $("#confirmedTutorTimesheet").is(':checked');
        //var unconfirmedTutorTimesheet = $("#unconfirmedTutorTimesheet").is(':checked');
        var programCompletion = $("#programCompletion").is(':checked');
        //var feedbackSubmissionForm = $("#feedbackSubmissionForm").is(':checked');
        var sendingAnnouncementByEmail = $("#sendingAnnouncementByEmail").is(':checked');
        var automatedEmailForInactiveStudents = $("#automatedEmailForInactiveStudents").is(':checked');

        $.ajax({
            url: baseURL + $("#save-learner-notification-settings").val() + $("#user-id").val(),
            type: "POST",
            data: { registrationEmail : registrationEmail, registrationFormSaved : registrationFormSaved, onlineEvaluationCompletion : onlineEvaluationCompletion, 
                bookedOralEvaluation : bookedOralEvaluation, cancelledOralEvaluation : cancelledOralEvaluation,  completionOfOralEvaluation : completionOfOralEvaluation,
                tutorAssignment : tutorAssignment, accessToOnlineModules : accessToOnlineModules, accessCodeForDVDModules : accessCodeForDVDModules, softwareChangeNotification : softwareChangeNotification,
                bookedLesson : bookedLesson, cancelledLesson : cancelledLesson, upcomingLesson : upcomingLesson, ESRReportSaved : ESRReportSaved, chargeableCancellation: chargeableCancellation,
                requestForAdditionalHours : requestForAdditionalHours, requestForNextModule : requestForNextModule, requestForHoursApproved :requestForHoursApproved,
                requestForModulesApproved :requestForModulesApproved, requestDeclined : requestDeclined, EOMSaved : EOMSaved, studentRemovedFromTutorsList : studentRemovedFromTutorsList,
                tutorReassignment : tutorReassignment, weeklyFollowUp:weeklyFollowUp, onHoldFollowUp : onHoldFollowUp, passwordChange: passwordChange, userNameChange : userNameChange,
                programCompletion: programCompletion, sendingAnnouncementByEmail: sendingAnnouncementByEmail, automatedEmailForInactiveStudents: automatedEmailForInactiveStudents
            },
            success: function (t) {
                that.parents('.popup-form-learner-notification-settings').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving the notification settings for the learner");
            }
        });
    });

    $('#learner-notification-settings-cancel').click(function () {
        $(this).parents('.popup-form-learner-notification-settings').hide();
        $('body .body-overlay').hide();
    });


    $('#coordinator-notification-settings-save').click(function () {
        var that = $(this);

        //var registrationEmail = $("#registrationEmail").is(':checked');
        var registrationFormSaved = $("#registrationFormSavedCoordinator").is(':checked');
        //var onlineEvaluationCompletion = $("#onlineEvaluationCompletion").is(':checked');

        //var bookedOralEvaluation = $("#bookedOralEvaluation").is(':checked');
        //var cancelledOralEvaluation = $("#cancelledOralEvaluation").is(':checked');
        //var completionOfOralEvaluation = $("#completionOfOralEvaluation").is(':checked');
        //var tutorAssignment = $("#tutorAssignment").is(':checked');
        //var accessToOnlineModules = $("#accessToOnlineModules").is(':checked');
        //var accessCodeForDVDModules = $("#accessCodeForDVDModules").is(':checked');
        var softwareChangeNotification = $("#softwareChangeNotificationCoordinator").is(':checked');
        //var bookedLesson = $("#bookedLesson").is(':checked');
        //var cancelledLesson = $("#cancelledLesson").is(':checked');
        //var upcomingLesson = $("#upcomingLesson").is(':checked');
        //var ESRReportSaved = $("#ESRReportSaved").is(':checked');
        //var incompleteESR = $("#incompleteESR").is(':checked');
        var chargeableCancellation = $("#chargeableCancellationCoordinator").is(':checked');
        var requestForAdditionalHours = $("#requestForAdditionalHoursCoordinator").is(':checked');
        var requestForNextModule = $("#requestForNextModuleCoordinator").is(':checked');
        var requestForHoursApproved = $("#requestForHoursApprovedCoordinator").is(':checked');
        var requestForModulesApproved = $("#requestForModulesApprovedCoordinator").is(':checked');
        var requestDeclined = $("#requestDeclinedCoordinator").is(':checked');
        //var EOMSaved = $("#EOMSaved").is(':checked');
        //var studentRemovedFromTutorsList = $("#studentRemovedFromTutorsList").is(':checked');
        //var tutorReassignment = $("#tutorReassignment").is(':checked');
        //var weeklyFollowUp = $("#weeklyFollowUp").is(':checked');
        //var onHoldFollowUp = $("#onHoldFollowUp").is(':checked');
        var passwordChange = $("#passwordChangeCoordinator").is(':checked');
        var userNameChange = $("#userNameChangeCoordinator").is(':checked');
        //var confirmedTutorTimesheet = $("#confirmedTutorTimesheet").is(':checked');
        //var unconfirmedTutorTimesheet = $("#unconfirmedTutorTimesheet").is(':checked');
        //var programCompletion = $("#programCompletion").is(':checked');
        var feedbackSubmissionForm = $("#feedbackSubmissionFormCoordinator").is(':checked');
        var sendingAnnouncementByEmail = $("#sendingAnnouncementByEmailCoordinator").is(':checked');
        //var automatedEmailForInactiveStudents = $("#automatedEmailForInactiveStudents").is(':checked');

        $.ajax({
            url: baseURL + $("#save-coordinator-notification-settings").val() + $("#user-id").val(),
            type: "POST",
            data: {
                registrationFormSaved: registrationFormSaved, softwareChangeNotification: softwareChangeNotification,
                chargeableCancellation: chargeableCancellation,
                requestForAdditionalHours: requestForAdditionalHours, requestForNextModule: requestForNextModule, requestForHoursApproved: requestForHoursApproved,
                requestForModulesApproved: requestForModulesApproved, requestDeclined: requestDeclined, passwordChange: passwordChange, userNameChange: userNameChange,
                feedbackSubmissionForm: feedbackSubmissionForm, sendingAnnouncementByEmail: sendingAnnouncementByEmail
            },
            success: function (t) {
                that.parents('.popup-form-coordinator-notification-settings').hide();
                $('body .body-overlay').hide();
            },
            error: function (t) {
                alert("Error saving the notification settings for the coordinator");
            }
        });
    });

    $('#coordinator-notification-settings-cancel').click(function () {
        $(this).parents('.popup-form-coordinator-notification-settings').hide();
        $('body .body-overlay').hide();
    });


    //add phone number and type
    //$("#phoneTypeOriginal").on("change", function (e) {
    //    $("#contact_type_edit").val($("#phoneTypeOriginal").val());
    //});

    // ACCOUNTANT IS READONLY

    if ($("#errorMessageValidation").length > 0) {
        $("#errorMessageValidation").hide();
    }

    if (_user.Role == 10)
    {
        $("#Impersonate").attr("disabled", "disabled");
        $("#Deactivate").attr("disabled", "disabled");
        $("#Delete").attr("disabled", "disabled");
        $("#disableClient").attr("disabled", "disabled");

        $("#disableClient").attr("disabled", "disabled");
    }

    if ($("#change-password-popup .errorMessage").length > 0)
    {
        showOverlay();
        $('#change-password-popup').show();
    }

    // add handlers
    $("#checkbox").on("change", function (e) {

        if (($("#web").is(":checkd")) || ($("#web").is(":checkd"))) {

            alert("hi!");

        }

    });

    $("#phones").on("click", ".addphone", function (e) {

        format = $(".phoneTemplate");
        var template = format.html();
        var div = document.createElement("div");
        $(div).html(template);
        $(div).addClass("phoneItem");

        //---

        var parentPanel = $(div);

        // save data in the display panel
        var type = $(".add-phone-section").find(".form-select");
        var phone = $(".add-phone-section").find(".form-text");
        var extension = $(".add-phone-section").find(".form-extension");

        if ($.trim(phone.val()) == "") {
            phone.css("border-color", "#FF0000");
            phone.css("border-width", "2px");
            e.preventDefault();
            return false;
        }
        else {
            if (IsValidTelephone(phone.val())) {
                phone.css("border-color", "");
                phone.css("border-width", "");
            }
            else {
                phone.css("border-color", "#FF0000");
                phone.css("border-width", "2px");
                e.preventDefault();
                return false;
            }
        }

        if ($.trim(extension.val()) != "") {
            if (IsValidNumeric(extension.val())) {
                extension.css("border-color", "");
                extension.css("border-width", "");
            }
            else {
                extension.css("border-color", "#FF0000");
                extension.css("border-width", "2px");
                e.preventDefault();
                return false;
            }
        }

        parentPanel.find(".isnew").val(0);

        if (phone.val().substr(0, 1) != "(") {
            var area = phone.val().substr(0, 3);
            var major = phone.val().substr(3, 3);
            var minor = phone.val().substr(6);

            var formatted = "(" + area + ") " + major + "-" + minor;
        }
        else {
            var formatted = phone.val();
        }

        parentPanel.children(".form-item").children("label").text(type.val());
        parentPanel.children(".form-item").children(".form-value").children(".phone").text(formatted);
        if ($.trim(extension.val()) != "") {
            parentPanel.children(".form-item").children(".form-value").children(".extension").text(extension.val());
        } else {
            parentPanel.children(".form-item").find(".phonextension").hide();
        }
        //---
        parentPanel.children(".edit-field").find(".form-select").val(type.val());
        parentPanel.children(".edit-field").find(".form-text").val(formatted);
        parentPanel.children(".edit-field").find(".form-extension").val(extension.val());

        // revert to the original layout.
        parentPanel.children(".form-item").removeClass("hidden");
        parentPanel.children(".edit-field").addClass("hidden");

        $(".add-phone-section").find(".form-select").val("Home");
        $(".add-phone-section").find(".form-text").val("");
        $(".add-phone-section").find(".form-extension").val("");

        $(div).insertBefore(".add-phone-section");
        $(div).hide();
        //--- Send data by AJAX

        var phone_values = GetSerializedPhoneItems();

        var uri = baseURL + $("#user-home-page").val() + $("#user-id").val();
        var newuri = window.location.protocol + "//" + window.location.host + uri;

        $.ajax({
            url: baseURL + $("#save-phone-profile").val() + $("#user-id").val(),
            type: "POST",
            data: phone_values,
            success: function (t) {
                window.location.href = newuri;
            },
            error: function (t) {
                //$(div).remove();
            }
        });
    });

    $("#phones").on("click", ".cancelphone", function (e) {
        // open edit.
        var parentPanel = $(this).parents(".phoneItem");

        if (parentPanel.find(".isnew").val().toString() == "1") {
            $("#phones")[0].removeChild(parentPanel[0]);
        }
        else {
            // revert to the original layout.
            parentPanel.children(".form-item").removeClass("hidden");
            parentPanel.children(".edit-field").addClass("hidden");


            e.preventDefault();
            e.stopPropagation();
        }
        return false;
    });

    $("#phones").on("click", ".savephone", function (e) {
        var phone = $(this).parents(".phoneItem").children(".edit-field").find(".form-text");
        var extension = $(this).parents(".phoneItem").children(".edit-field").find(".form-extension");

        if ($.trim(phone.val()) == "") {
            phone.css("border-color", "#FF0000");
            phone.css("border-width", "2px");
            e.preventDefault();
            return false;
        }
        else {
            if (IsValidTelephone(phone.val())) {
                phone.css("border-color", "");
                phone.css("border-width", "");
            }
            else {
                phone.css("border-color", "#FF0000");
                phone.css("border-width", "2px");
                e.preventDefault();
                return false;
            }
        }

        if ($.trim(extension.val()) != "") {
            if (IsValidNumeric(extension.val())) {
                extension.css("border-color", "");
                extension.css("border-width", "");
            }
            else {
                extension.css("border-color", "#FF0000");
                extension.css("border-width", "2px");
                e.preventDefault();
                return false;
            }
        }

        var phone_values = GetSerializedPhoneItems();

        var uri = baseURL + $("#user-home-page").val() + $("#user-id").val();
        var newuri = window.location.protocol + "//" + window.location.host + uri;

        $.ajax({
            url: baseURL + $("#save-phone-profile").val() + $("#user-id").val(),
            type: "POST",
            data: phone_values,
            success: function (t) {
                window.location.href = newuri;
            },
            error: function (t) {
                //$(div).remove();
            }
        });
    });

    $("#phones").on("click", ".editphone", function (e) {
        // open edit.
        var parentPanel = $(this).parents(".phoneItem");

        var type = parentPanel.children(".form-item").children("label").text();
        var phone = parentPanel.children(".form-item").find(".phone").text();
        var ext = parentPanel.children(".form-item").find(".extension").text();

        // set the data in the edit panel
        parentPanel.children(".edit-field").find(".form-select").val(type);
        parentPanel.children(".edit-field").find(".form-text").val(phone);
        parentPanel.children(".edit-field").find(".form-extension").val(ext);

        // display the edit panel / hide the view panel
        parentPanel.children(".form-item").addClass("hidden");
        parentPanel.children(".edit-field").removeClass("hidden");
        e.preventDefault();
        e.stopPropagation();
    });

    $("#phones").on("click", ".deletephone", function (e) {
        var parentPanel = $(this).parents(".phoneItem");
        $(this).parents(".phoneItem").remove();

        var phone_values = GetSerializedPhoneItems();

        $.ajax({
            url: baseURL + $("#save-phone-profile").val() + $("#user-id").val(),
            type: "POST",
            data: phone_values,
            success: function (t) {

            },
            error: function (t) {

            }
        });
    });

    // Save button serialization
    $(".save-button").on("click", function () {
        if (CommonFormValidate($("#userform")) == true) {
            var email = $("#primary_email");

            if (email[0] == undefined) {
                var user = $("#userform").serializeObject();
                $("#userform").submit();
            }
            else if (IsValidEmailAddress($("#primary_email").val()) == true) {
                var user = $("#userform").serializeObject();
                $("#userform").submit();
            }
            else {
                $("#primary_email").css("border-color", "#FF0000");
                $("#primary_email").css("border-width", "2px");
            }

        }
        else {
            return false;
        }
    });

    //For changing category of product and to change products field selected. 
    $("#category").on("change", function (t) {
        var category = $("#category").val();

        GetProducts(category, function (list) {
            var listproducts = list;
            $('#product').find("option").remove();

            //for (var i in list) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];

                $('#product').append($('<option>', {
                    value: item.ID,
                    text: item.Name
                }));

            }



        });
    });

    $("#primary-tutor-change").click(function () {
        showOverlay();
        $('#primary-tutor-change-form').show();
        return false;
    });

    $("#secondary-tutor-change").click(function () {
        showOverlay();
        $('#secondary-tutor-add-form').show();
        return false;
    });

    $("#popup-edit-payrate .ok-button").click(function (e) {
        if (CommonFormValidate($(this)) == true) {
            $("#popup-edit-payrate form").submit();
            $("#old-product-id").val("");
        }
    });

    $("#popup-edit-qualification .ok-button").click(function (e) {
        if (CommonFormValidate($(this)) == true) {
            $("#popup-edit-qualification form").submit();
            $("#old-lang").val("");
        }
    });

    $("#Impersonate").click(function (e) {
        var user_id = $(this).attr("user-id-data");
        var url = baseURL + "/Impersonate/" + user_id;
        var new_url = window.location.protocol + "//" + window.location.host + url;
        window.location.href = new_url;

        e.preventDefault();
        return false;
    });

    $("#Activate").click(function (e) {
        //var user_id = $(this).attr("user-id-data");

        //var post = function (user_id) {
        //    $.post("/EnableUser/" + user_id, function (data) {
        //        $("#status").val(data);
        //    });
        //}

        //post(user_id);

        //e.preventDefault();
        //return false;

        var user_id = $(this).attr("user-id-data");
        var url = baseURL + "/EnableUser/" + user_id;
        var new_url = window.location.protocol + "//" + window.location.host + url;
        window.location.href = new_url;

        e.preventDefault();
        return false;
    });

    $("#Deactivate").click(function (e) {
        //var user_id = $(this).attr("user-id-data");

        //var post = function (user_id) {
        //    $.post("/DisableUser/" + user_id, function (data) {
        //        $("#status").val(data);
        //    });
        //}

        //post(user_id);

        //e.preventDefault();
        //return false;

        var user_id = $(this).attr("user-id-data");
        var url = baseURL + "/DisableUser/" + user_id;
        var new_url = window.location.protocol + "//" + window.location.host + url;
        window.location.href = new_url;

        e.preventDefault();
        return false;
    });

    $("#Delete").click(function (e) {
        showOverlay();
        $('#delete-user-popup').show();
        //$('#reset-password-popup').show();
    });

    $("#add-pay-rate").click(function (e) {
        showOverlay();

        $('#popup-edit-payrate #product').find("option").removeAttr("disabled");

        $(".editable-tab.pay-rate").find(".payrate-product").each(function () {
            $('#popup-edit-payrate #product').find("option[value='" + $(this).val() + "']").attr('disabled', 'disabled');
        });

        $("#popup-edit-payrate").show();

        e.preventDefault();
        return false;
    });

    $("#add-qualification").click(function (e) {
        showOverlay();

        $('#popup-edit-qualification #languageQualification').find("option").removeAttr("disabled");

        var lang = '';
        $(".editable-tab.qualification").find(".qualification-lang").each(function () {
            if ($(this).text().toUpperCase() == 'ENGLISH')
                lang = 'EN';
            else if ($(this).text().toUpperCase() == 'FRENCH')
                lang = 'FR';

            $('#popup-edit-qualification #languageQualification').find("option[value='" + lang + "']").attr('disabled', 'disabled');
        });

        $("#popup-edit-qualification").show();

        e.preventDefault();
        return false;
    });

    $("#popup-edit-qualification form").submit(function (e) {
        if ($("#languageQualification").val() == null) {
            $("#languageQualification").css("border-color", "#FF0000");
            $("#languageQualification").css("border-width", "2px");

            e.preventDefault();
            return false;
        }
        else {
            $("#languageQualification").css("border-color", "");
            $("#languageQualification").css("border-width", "");
        }
    });

    $(".reset-password-link").click(function (e) {
        showOverlay();
        $('#reset-password-popup').show();

        e.preventDefault();
        return false;
    });

    $('.change-password-link').click(function (e) {
        showOverlay();
        $('#change-password-popup').show();

        if ($("p.errorMessage").length > 0) {
            $("p.errorMessage").hide();
        }

        if ($("#errorMessageValidation").length > 0) {
            $("#errorMessageValidation").hide();
        }

        e.preventDefault();
        return false;
    })

    $('#reset-password-popup .cancel-button').click(function (e) {
        $('#reset-password-popup').hide();
        $('body .body-overlay').hide();

        e.preventDefault();
        return false;
    });

    $('#change-password-popup .cancel-button').click(function (e) {
        $('#old_password').val('');
        $('#new_password').val('');
        $('#new_password2').val('');
        $('#change-password-popup').hide();
        $('body .body-overlay').hide();

        if ($("#change-password-popup .errorMessage").length > 0)
        {
            $("#change-password-popup .errorMessage").remove();
        }

        e.preventDefault();
        return false;
    });

    $("#change-password-popup form").submit(function (e) {
        if (!ValidateForm($(this))) {

            $("#errorMessageValidation").show();

            if ($("p.errorMessage").length > 0) {
                $("p.errorMessage").hide();
            }

            e.preventDefault();
            return false;
        }

        return true;
    });

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

});

function ValidateForm(form) {
    var required = form.find("[data-required=true]");

    var isValid = true;

    var offset = null;

    required.each(function () {
        var valid = !IsNullOrEmpty($(this).val());

        if (valid) {
            $(this).css("border", "");
        }
        else {
            $(this).css("border", "3px solid red");

            if (!offset) {
                offset = $(this).offset();
            }
        }

        isValid &= valid;
    });


    if (isValid) {
        var compareto = form.find("[data-compareto]");

        compareto.each(function () {
            var fieldname = $(this).attr("data-compareto");


            var valid = $("#" + fieldname).val() == $(this).val();

            if (valid) {
                $(this).css("border", "");
                $("#" + fieldname).css("border", "");
            }
            else {
                $(this).css("border", "3px solid red");
                $("#" + fieldname).css("border", "3px solid red");

                if (!offset) {
                    offset = $(this).offset();
                }

            }

            isValid &= valid;
        });


    }

    return isValid;
}

function GetProducts(category, callback) {
    var userID = "00000000-0000-0000-0000-000000000000";


    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/user/" + userID + "/CategoryProducts/?category=" + category,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { alert("Get category products Error: " + t.status + "  " + t.statusText); }
    });
}

function ValidateForm(form) {
    var required = form.find("[data-required=true]");

    var isValid = true;

    var offset = null;

    required.each(function () {
        var valid = !IsNullOrEmpty($(this).val());

        if (valid) {
            $(this).css("border", "");
        }
        else {
            $(this).css("border", "3px solid red");

            if (!offset) {
                offset = $(this).offset();
            }
        }

        isValid &= valid;
    });


    if (isValid) {
        var compareto = form.find("[data-compareto]");

        compareto.each(function () {
            var fieldname = $(this).attr("data-compareto");


            var valid = $("#" + fieldname).val() == $(this).val();

            if (valid) {
                $(this).css("border", "");
                $("#" + fieldname).css("border", "");
            }
            else {
                $(this).css("border", "3px solid red");
                $("#" + fieldname).css("border", "3px solid red");

                if (!offset) {
                    offset = $(this).offset();
                }

            }

            isValid &= valid;
        });


    }

    if (IsValidPassword($("#new_password").val()) == false) {
        $("#new_password").css("border", "3px solid red");

        if (!offset) {
            offset = $("#new_password").offset();
        }

        isValid &= false;
    }

    if (IsValidPassword($("#new_password2").val()) == false) {
        $("#new_password2").css("border", "3px solid red");

        if (!offset) {
            offset = $("#new_password2").offset();
        }

        isValid &= false;
    }

    return isValid;
}

function GetProducts(category, callback) {
    var userID = "00000000-0000-0000-0000-000000000000";


    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/api/user/" + userID + "/CategoryProducts/?category=" + category,
        data: null,
        dataType: "json",
        success: function (t) { callback(t); },
        error: function (t) { alert("Get category products Error: " + t.status + "  " + t.statusText); }
    });
}

function editpayrate(Object) {
    var item = Object;
    $("#old-product-id").val(item.Product.ID);
    $("#product").val(item.Product.ID);
    $("#rate").val(item.PayRate);
    $("#per").attr("value", item.Type);

    $('#popup-edit-payrate #product').find("option").removeAttr("disabled");

    $(".editable-tab.pay-rate").find("input[name='productdID']").each(function () {
        if ($(this).val() != item.Product.ID) {
            $('#popup-edit-payrate #product').find("option[value='" + $(this).val() + "']").attr('disabled', 'disabled');
        }
    });

    $('.spec-pay-form h6').text('Edit Pay Rate');
    showOverlay();
    $('#popup-edit-payrate').show();
    return false;
}

function editQualification(Object) {
    var item = Object;
    $("#old-lang").val(item.Language);
    $("#languageQualification").val(item.Language);
    $("#level").val(item.Level);
    $("#can-evaluate").attr('checked', item.CanEvaluate == null || item.CanEvaluate == false ? false : true);

    $('#popup-edit-qualification #languageQualification').find("option").removeAttr("disabled");

    $(".editable-tab.qualification").find(".qualification-lang").each(function () {
        if ($(this).text() != item.Language) {
            $('#popup-edit-qualification #languageQualification').find("option[value='" + $(this).text() + "']").attr('disabled', 'disabled');
        }
    });

    showOverlay();
    $('.spec-pay-form h6').text('Edit Qualification');
    $('#popup-edit-qualification').show();
    return false;
}

function Validate(e) {
    var text = ValidatePhone($(e.target).val());
    validating = true;
    $(e.target).val(text);
    validating = false;
}

function ValidatePhone(value) {
    var result = "";

    for (var i = 0; i < value.length; i++) {
        if (isDigit(value[i])) {
            result = result + value[i];
        }
    }

    var valid = result.length >= 10;

    if (valid) {
        $(".savephone").removeAttr('disabled');
    }
    else {
        $(".savephone").attr('disabled', 'disabled');
    }

    return result;
}

function isDigit(char) {
    return ("1234567890".indexOf(char) >= 0);
}

function GetSerializedPhoneItems() {
    //phoneType%5B%5D=Work&phoneNumber%5B%5D=(987)+654-3218&extNumber%5B%5D=55

    var phones = "";

    $("#phones").find(".phoneItem").each(function () {
        phones += "phoneType[]=" + $(this).find(".edit-field [name='phoneType[]']").val() + "&phoneNumber[]=" + $(this).find(".edit-field [name='phoneNumber[]']").val() + "&extNumber[]=" + $(this).find(".edit-field [name='extNumber[]']").val();
        phones += "&";
    });

    return phones.substr(0, phones.length - 1);
}

