/// <reference path="/Scripts/jquery.js" />

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

var sessionTimeOut_countup;
var sessionTimeOut_countdown;

var timer = "";
var isBlurred = false;
var windowVisible = true;

var annIntervalID = null;
var currAnnNum = 1;
var learnersChart;
var miniEditorOptions = {
    toolbar: [
		{
		    name: 'clipboard',
		    items: ['Bold', 'Italic', '-', 'RemoveFormat', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'Link', 'Unlink', '-', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
		}
    ],
    removePlugins: 'bidi,font,forms,flash,horizontalrule,iframe,justify,table,tabletools,smiley,styles',
    height: 150
};
var session_timeout_notify_no = 0;

$(document).ready(function () {

    $("#LRDGFavicon").attr("href", $("#imgPath").val() + "LRDGFavicon.png");
  
    window.setInterval(function () {
        windowVisible = vis(); //check if the current tab is open

        if (windowVisible == true) {
                document.title = $("#documentTitle").val();
                $("#LRDGFavicon").attr("href", $("#imgPath").val() + "LRDGFavicon.png");
                clearInterval(timer);
        } else {
            if ($("#popup-sessiontimeout-notif").is(":visible")) {
                if (timer.length == 0) {
                    timer = window.setInterval(function () {
                        document.title = document.title == $("#documentTitle").val() ? $("#sessionTimeoutTitle").val() : $("#documentTitle").val();
                        document.title == $("#documentTitle").val() ? $("#LRDGFavicon").attr("href", $("#imgPath").val() + "LRDGFavicon.png") : $("#LRDGFavicon").attr("href", $("#imgPath").val() + "warning_favicon.png");
                        //$("#LRDGFavicon").attr("href", $("#imgPath").val() + "warning_favicon.png");
                    }, 1000);
                }              
            } 
        }
    }, 1000);

    $(window).focus(function () {
        document.title = $("#documentTitle").val();
        $("#LRDGFavicon").attr("href", $("#imgPath").val() + "LRDGFavicon.png");
    });
    

    if ($(window).width() < 1248) {
        $(".button-book-lesson").hide();
    }

    //if(visible == true) {
    //    if ($("#popup-sessiontimeout-notif").is(":visible")) {
    //        isBlurred = false;
    //        document.title = $("#documentTitle").val();
    //        clearInterval(timer);
    //    }
    //}else {
    //    if ($("#popup-sessiontimeout-notif").is(":visible")) {
    //        isBlurred = true;
    //        timer = window.setInterval(function () {
    //            document.title = document.title == $("#documentTitle").val() ? "Session time out" : $("#documentTitle").val();
    //        }, 1000);
    //    }
    //}

    $('.content').hide();
    $('.listelement').find('li').on('click', function () {
        //if (!($(this).parent().children('.content').is(':visible'))) {
        //    $(this).parent().children('.content').slideDown();
        //    $(this).parent('.central-block').slideDown();
        //} else {
        //    $(this).parent().children('.content').slideUp(); 
        //    $(this).parent('.central-block').slideUp();
        //}

        if (isChrome || isSafari) {
            if ($(this).parent().find('li').css('background-image') == 'url(' + $("#base-address").val() + 'img/collapsed.png' + ')') {
                $(this).parent().find('li').css('background-image', 'url(../img/expanded.png)');
                $(this).parent().children('.content').slideDown();
                //$(this).parent('.central-block').slideDown();
            } else {
                $(this).parent().find('li').css('background-image', 'url(../img/collapsed.png)');
                $(this).parent().children('.content').slideUp();
                //$(this).parent('.central-block').slideUp();
            }
        } else {
            if ($(this).parent().find('li').css('background-image') == 'url("' + $("#base-address").val() + 'img/collapsed.png")') {
                $(this).parent().find('li').css('background-image', 'url(../img/expanded.png)');
                $(this).parent().children('.content').slideDown();
                //$(this).parent('.central-block').slideDown();
            } else {
                $(this).parent().find('li').css('background-image', 'url(../img/collapsed.png)');
                $(this).parent().children('.content').slideUp();
                //$(this).parent('.central-block').slideUp();
            }
        }

        
    });

    if ($('.faq2').length )
	{
		$('.faq2>li>a>span.arrow').parent().click ( function ()
		{
			if ( $(this).parent().hasClass('collapsed') ) 
			{
				$(this).parent().find('ul').slideDown(300);
				$(this).parent().delay(150).removeClass('collapsed');
			}
			else
			{
				$(this).parent().find('ul').slideUp(300);
				$(this).parent().delay(150).addClass('collapsed');					
			}
			//onResize();
			return false
		});
    }

    if ($('.faq-page').length) {

        $('.more-link').click(function () {
            var moreBlock = $(this).parent().find('.more-content');
            if ($(moreBlock).css('display') == 'none') {
                $(moreBlock).slideDown();
                $(this).html('Less &uarr;');
            }
            else {
                $(moreBlock).slideUp();              
                $(this).html('More &darr;');
            }
            //return false;
        });

        $('.q>a').click(function () {
            showOverlay();
            $('#popup-faq-answer').css('margin-top', -$('#popup-faq-answer').height() / 2).show();

            //showing of popup with question and answer
            //$('#popup-faq-answer h6').html('Qestion');
            //$('#popup-faq-answer .answer').html('Answer');

            return false;
        });


        $('#popup-faq-answer .copy-button').click(function () {
            //alert( $('#popup-faq-answer .answer').text() );
            //copyToClipboard( $('#popup-faq-answer .answer').text() );

            $(".copy-button").zclip({
                path: "js/ZeroClipboard.swf",
                copy: function () {
                    //alert('copied');
                    return $('#popup-faq-answer .answer').text()
                }
            });
            return false;
        });

        $('#popup-faq-answer .print-button').click(function () {
            var printHtml = '<html><body style="padding:20px;"><h3 style="font:normal 19px Arial, Helvetica, sans-serif; margin-bottom:10px;">' + $('#popup-faq-answer h6').text() + '</h3>';
            printHtml += '<div style="font:normal 14px Arial, Helvetica, sans-serif;">' + $('#popup-faq-answer .answer').html() + '</div></body></html>';

            printWin = window.open('', 'printWindow', 'Toolbar=0,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0');
            printWin.document.open();
            printWin.document.write(printHtml);
            printWin.document.close();
            printWin.print();

            return false;

        });
    }

    $(".button-accessibility").keypress(function(e) {
        if (e.keyCode == 13) {
            if ($("#accessibility-checkbox").is(':checked')) {
                $("#accessibility-checkbox").prop('checked', false);
                $("#zenbox_tab").show();
                $(".chat-button").show();
            } else {
                $("#accessibility-checkbox").prop('checked', true);
                $("#zenbox_tab").hide();
                $(".chat-button").hide();
            }
        }
    });

    $(".button-accessibility").keydown(function (e) {
        if (e.keyCode == 13) {
            if ($("#accessibility-checkbox").is(':checked')) {
                $("#accessibility-checkbox").prop('checked', false);
                $("#zenbox_tab").show();
                $(".chat-button").show();
            } else {
                $("#accessibility-checkbox").prop('checked', true);
                $("#zenbox_tab").hide();
                $(".chat-button").hide();
            }        
        }
    });

    $("#accessibility-checkbox").change(function () {
        if (this.checked) {
            $("#zenbox_tab").hide();
            $(".chat-button").hide();
        } else {
            $("#zenbox_tab").show();
            $(".chat-button").show();
        }
    });

    $("#skipToMainContent").keypress(function (e) {
        if (e.keyCode == 13) {
            alert('yeah');
        }
    });

    //$(".myprogram-icon").keydown(function (e) {

    //    if (e.which == 9)
    //        alert("Hurray!!!");
    //});

    //CollapsibleLists.applyTo(document.getElementById('collapsibleList'));

    if ($("#session-time-out").length > 0 && $("#before-session-time-out").length > 0) {
        session_timeout_notify_no = parseInt($("#session-time-out").val()) - parseInt($("#before-session-time-out").val());
        //session_timeout_notify_no = 2;
        check_timeout(0);
    }

    if ($(".right-block").length > 0) {
        $(".button-book-lesson").css("margin-right", $(".right-block").outerWidth() + 11);
    }

    if ($('#zenbox_tab').length > 0) {
        $('#zenbox_tab').css('top', '58%');
        $('#zenbox_tab').css('background-color', 'rgb(255,128,0)');
        $('#zenbox_tab').css('border-color', 'rgb(112,156,200)');
        $('#zenbox_tab').css('border-width', '0px');

        $('#zenbox_tab').css('-moz-border-radius', '7px 0px 0px 7px');
        $('#zenbox_tab').css('-webkit-border-radius', '7px 0px 0px 7px');
        $('#zenbox_tab').css('border-radius', '7px 0px 0px 7px');

        if ($('#zenbox_tab').attr('title').toUpperCase() == 'SUPPORT') {
            //--- EN
            if ($('#zenbox_tab').find('img').length > 0) {
                $('#zenbox_tab').find('img').attr('src', '../img/zendesk_tab_support_right_en.png');
                $('#zenbox_tab').find('img').attr('onerror', 'this.src="../../img/zendesk_tab_support_right_en.png"');
            }
        }
        else if ($('#zenbox_tab').attr('title').toUpperCase() == 'ASSISTANCE') {
            //--- FR
            if ($('#zenbox_tab').find('img').length > 0) {
                $('#zenbox_tab').find('img').attr('src', '../img/zendesk_tab_support_right_fr.png');
                $('#zenbox_tab').find('img').attr('onerror', 'this.src="../../img/zendesk_tab_support_right_fr.png"');
            }
        }

    }

    if ($('.video').length) {

        $('.video-block a.img').click(function () {
            showOverlay();
            $('#popup-video').show();

            jwplayer("video-container").setup({
                primary: "flash",
                file: $(this).attr('href'),
                image: $(this).find('img').attr('src'),
                width: 800,
                height: 400,
                wmode: 'transparent',
                logo: { hide: false, file: '../img/transparent.png' }
            }).play();
            return false;
        });

    }

    $('#view-test').click(function () {
        showOverlay();
        $('#popup-placement-test').show();
        return false;
    });

    if ($('#account-perfomance').length) {

        var optionsAccChart = {
            series: {
                stack: true,
                lines: { show: false },
                points: { show: false },
                bars: { show: true, align: "center", lineWidth: 1.5, fill: true, barWidth: 0.7 },
                shadowSize: 0
            },
            legend: { noColumns: 2 },
            xaxis: { position: "bottom", minTickSize: 1, ticks: accTicks },
            yaxis: { min: 0, autoscaleMargin: 0.1, tickFormatter: currencyTicks },
            grid: { backgroundColor: "#fff", color: '#575757', borderWidth: 1, hoverable: true, clickable: true },

            colors: ['#edc240', '#34cbbb']
        };

        $.plot($("#account-perfomance"), accData, optionsAccChart);

        $("#account-perfomance").bind("plothover", function (event, pos, item) {

            if (item) {
                $("#chart-tooltip").remove();
                var y = item.datapoint[1].toFixed(2);
                showTooltip(item.pageX + 5, item.pageY - 30, '<b>' + y + '</b>');
            } else {
                $("#chart-tooltip").remove();
            }

        });

    }

    if ($('.pie-chart').length) {
        var radius = 0.95;
        var labelRadius = 2 / 3;
        var showLabel = true;

        if ($('.home-grid').length) {
            radius = 0.7;
            labelRadius = 0.5;
            showLabel = true;
        }

        var optionsPie = {
            series: {
                pie: {
                    show: true,
                    radius: radius,
                    label: {
                        show: showLabel,
                        radius: labelRadius,
                        formatter: function (label, series) {
                            return '<div style="font-size:11px;text-align:center;padding:2px;color:white;">' + roundNumber(series.percent, 1) + '%</div>';
                        },

                        threshold: 0.07
                    },
                    offset: {
                        top: 0,
                        left: -50//'auto'
                    }
                }
            },
            colors: ['#edc240', '#8ccafb', '#d73a3a', '#4ebb4e', '#9a42f7', '#e2832e', '#34cbbb', '#c0376b', '#6b9e35', '#4575d5'],
            grid: { backgroundColor: "#fff", color: '#575757', borderWidth: 1, hoverable: true, clickable: true, autoHighlight: true }

        };


        var optionsPie2 = {
            series: {
                pie: {
                    show: true,
                    radius: radius,
                    label: {
                        show: showLabel,
                        radius: labelRadius,
                        formatter: function (label, series) {
                            return '<div style="font-size:11px;text-align:center;padding:2px;color:white;">' + roundNumber(series.percent, 1) + '%</div>';
                        },

                        threshold: 0.07
                    },
                    offset: {
                        top: 0,
                        left: 'auto'
                    }
                }
            },
            legend: {
                show: true,
                container: $('#learners-devision').parents('.pie-chart').find('.legend')
            },
            colors: ['#edc240', '#8ccafb', '#d73a3a', '#4ebb4e', '#9a42f7', '#e2832e', '#34cbbb', '#c0376b', '#6b9e35', '#4575d5'],
            grid: { backgroundColor: "#fff", color: '#575757', borderWidth: 1, hoverable: true, clickable: true, autoHighlight: true }

        };
        var pie;

        try {


            if ($("#student-summary").length) {
                optionsPie.series.pie.radius = 1;
                optionsPie.series.pie.label.radius = 0.8;
                $.plot($("#student-summary"), dataChart, optionsPie);
            }

            if ($("#top-tutors").length)
                $.plot($("#top-tutors"), tutorsDataChart, optionsPie);

            if ($("#clientTimeshit").length)
                $.plot($("#clientTimeshit"), clientsTimeshitData, optionsPie);

            if ($("#tutor-hours").length)
                $.plot($("#tutor-hours"), tutorsHoursData, optionsPie);

            if ($("#learners-prof").length)
                $.plot($("#learners-prof"), learnersProfData, optionsPie);

            if ($("#learners-status").length)
                $.plot($("#learners-status"), learnersStatusData, optionsPie);

            if ($("#learners-devision").length)
                $.plot($("#learners-devision"), learnersDevisionData, optionsPie2);

        }
        catch (e) {
            // do nothing
        }

        $("#learners-status, #learners-devision, #learners-prof, #tutor-hours, #clientTimeshit, #top-tutors").bind("plothover", function (event, pos, item) {
            if (item) {
                $("#chart-tooltip").remove();
                var y = item.datapoint[0].toFixed(2);

                //console.log (item, pos, event);
                showTooltip(pos.pageX + 5, pos.pageY - 30, '<b>' + y + '%</b>');
            } else {
                $("#chart-tooltip").remove();

            }

        });

    }

    if ($('#contract-summary').length) {
        var optionsStackChart = {
            series: {
                stack: true,
                lines: { show: false },
                points: { show: false },
                bars: { show: true, align: "center", lineWidth: 1.5, fill: true, barWidth: 0.7 },
                shadowSize: 0
            },
            legend: { noColumns: 2 },
            xaxis: { position: "bottom", minTickSize: 1, ticks: contractTicks },
            yaxis: { min: 0, autoscaleMargin: 0.1, tickFormatter: currencyTicks },
            grid: { backgroundColor: "#fff", color: '#575757', borderWidth: 1, hoverable: true, clickable: true },

            colors: ['#edc240', '#34cbbb']
        };

        //	console.log ( $("#learner-perfomance"), learnerDataChart, optionsLearnerChart );
        var contractChart = $.plot($("#contract-summary"), contractDataChart, optionsStackChart);

        $("#contract-summary").bind("plothover", function (event, pos, item) {

            if (item) {
                $("#chart-tooltip").remove();
                var y = item.datapoint[1].toFixed(2);
                showTooltip(item.pageX + 5, item.pageY - 30, '<b>' + y + '$</b>');
            } else {
                $("#chart-tooltip").remove();
            }

        });
    }



    if ($('.global-settings').length) {
        // for programmers: you need additional work on Report Template popup, I did only front-end logic independent from logic serve (for example saving data)

        $('#report-template-popup .preview-button').click(function () {
            $('#report-template-popup').hide();
            $('#preview-popup').show();
            showPreview();
            return false;
        });

        $('#preview-popup .cancel-button').unbind('click').click(function () {
            $('#report-template-popup').show();
            $('#preview-popup').hide();
            return false;
        });

        defineScrollItems();

        $('.scroll-and-panel .button-panel .delete-button').click(function () {

            var scroll = $(this).parent().parent().find('.scroll');
            var selected = $(scroll).find('.selected');
            var near = $(selected).prev();
            if ($(near).length == 0)
                near = $(selected).next();
            $(selected).remove();
            $(near).addClass('selected');
            return false;
        });

        $('.scroll-and-panel .button-panel .add-button').click(function () {
            var scroll = $(this).parent().parent().find('.scroll');
            $(scroll).find('.selected').removeClass('selected');
            var nextCounter = $(scroll).find('.item').length + 1;

            if ($(scroll).hasClass('answers'))
                $(scroll).append('<div class="item selected"><input type="text" name="a-' + nextCounter + '" value=""></div>');
            else
                $(scroll).append('<a href="#" class="item selected"><span class="title">Question</span><span class="type" data-type="sort-text" data-usage="none">Short Text</span></a>');

            var newElement = $(scroll).find('.selected');
            defineScrollItems();

            showQuestionData(newElement)

            return false;
        });


        $('.scroll-and-panel .button-panel .top-button').click(function () {
            var scroll = $(this).parent().parent().find('.scroll');
            var selected = $(scroll).find('.selected');

            if ($(selected).prev().length) {
                if ($(scroll).hasClass('answers')) {
                    $(selected).prev().before('<div class="item selected">' + $(selected).html() + '</div>');
                }
                else {
                    $(selected).prev().before('<a href="#" class="item selected">' + $(selected).html() + '</a>');
                }
                $(selected).remove();
                defineNewNames($(scroll));
                defineScrollItems();
            }
            return false;
        });

        $('.scroll-and-panel .button-panel .bottom-button').click(function () {
            var scroll = $(this).parent().parent().find('.scroll');
            var selected = $(scroll).find('.selected');

            if ($(selected).next().length) {
                if ($(scroll).hasClass('answers')) {
                    $(selected).next().after('<div class="item selected">' + $(selected).html() + '</div>');

                }
                else {
                    $(selected).next().after('<a href="#" class="item selected">' + $(selected).html() + '</a>');
                }
                $(selected).remove();
                defineNewNames($(scroll));
                defineScrollItems();
            }
            return false;
        });


        $('#question-type').change(function () {
            $('.col-1 .scroll-and-panel .selected .type').attr('data-type', $(this).find('option:selected').val()).text($(this).find('option:selected').text());

            var selected = $(this).find('option:selected').val();
            if (selected == 'multiple-choice' || selected == 'checkbox' || selected == 'radiobutton')
                $('#multiple').show();
            else
                $('#multiple').hide();

        });

        $('#question-usage').change(function () {
            $('.col-1 .scroll-and-panel .selected .type').attr('data-usage', $(this).find('option:selected').val());

        });

        $('#title').keyup(function () {
            $('.col-1 .scroll-and-panel .selected .title').text($(this).val());
        });


        $('.global-settings .col-3 .add-button').click(function () {
            showOverlay();
            $('#report-template-popup h6').text('Add Report Template');
            $('#report-template-popup').show();
            return false;
        });

        $('.global-settings .col-3 .edit-button').click(function () {
            showOverlay();
            $('#report-template-popup h6').text('Edit Report Template');
            // fill inputs here
            $('#report-template-popup').show();
            return false;
        });


        //$('.global-settings .col-1 .add-button').click(function () {
        //    showOverlay();
        //    $('#popup-category h6').text('Add Category');
        //    $('#popup-category').show();
        //    return false;
        //});

        //$('.global-settings .col-1 .edit-button').click(function () {
        //    showOverlay();
        //    $('#popup-category h6').text('Edit Category');
        //    // fill inputs here
        //    $('#popup-category').show();
        //    return false;
        //});

        //$('.global-settings .col-2 .add-button').click(function () {
        //    showOverlay();
        //    $('#popup-settings-product h6').text('Add Product');
        //    $('#popup-settings-product').show();
        //    return false;
        //});

        //$('.global-settings .col-2 .edit-button').click(function () {
        //    showOverlay();
        //    $('#popup-settings-product h6').text('Edit Product');
        //    // fill inputs here
        //    $('#popup-settings-product').show();
        //    return false;
        //});

        //$('.global-settings .col-4 .add-button').click(function () {
        //    showOverlay();
        //    $('#add-user-popup').show();
        //    return false;
        //});


    }

    //if ($('.forum .form-question').length) {
    //    CKEDITOR.replace('editor', miniEditorOptions);
    //}


    if ($('.announcements').length) {
        //CKEDITOR.replace('mini-editor', miniEditorOptions);

        $('.announcements .add-button').click(function () {
            showOverlay();
            $('#popup-announcement h6').text('Add Announcement');
            $('#popup-announcement').show();
            return false;
        });

        //$('.announcements .edit-button').click(function () {
        //    showOverlay();
        //    $('#popup-announcement h6').text('Edit Announcement');
        //    // fill inputs				
        //    $('#popup-announcement').show();
        //    return false;
        //});

    }

    $("#popup-sessiontimeout-notif .ok-notif").click(function () {

        if ($("#is-time-finished").val() != null && $("#is-time-finished").val().toString().length > 0) {
            window.location.href = "/logout";
        }
        else {
            $(this).parents('.popup-form').hide();
            $('body .body-overlay').hide();
            clearTimeout(sessionTimeOut_countdown);
            check_timeout(0);
        }
    });

    $("#quick-search .form-mastersubmit").click(function (e) {
        // get filters and build URI here
        var pageItem = pageClient ? pageClient : pageUser;

        //var uri = "/studentlist/" + pageItem.ID + "?";
        var uri = baseURL + "/studentlist?";

        var lastname = $("#quick-search").find("#lastname").val();
        var firstname = $("#quick-search").find("#firstname").val();
        var queryString = "lastName=" + lastname + "&firstName=" + firstname;

        uri = uri + queryString;

        var newuri = window.location.protocol + "//" + window.location.host + uri;

        window.location.href = newuri;

        e.preventDefault();
        return false;
    });

    $("#quick-search input[type='text']").bind('keypress', function (e) {
        if (e.keyCode == 13) {
            $("#quick-search .form-mastersubmit").click();
        }
    });

    $('#edit-parent-client-button').click(function () {
        showOverlay();
        $('#edit-parent-client-popup').show();

        $("#clients").val($("#clientParentID").val());

        return false;
    });

    $('#delete-parent-client-button').click(function () {
        showOverlay();
        $('#delete-parent-client-popup').show();

        return false;
    });

    $('#edit-contact-person-button').click(function () {
        showOverlay();
        $('#edit-contact-person-popup').show();

        $("#user_name").val($("#contact_person_id").val());

        return false;
    });

    $('.lessons-block .one-tab h5').click(function () {
        if ($(this).parent().hasClass('closed-tab'))
            $(this).parent().removeClass('closed-tab')
        else
            $(this).parent().addClass('closed-tab')

        onResize();

    });

    $('#add-Lessons').click(function () {
        showOverlay();
        $('.popup-add-Lesson').show();
        return false;
    });

    if ($('.contracts .contracts-block').length) {
        // see documentation on http://jstree.com/
        $('.contracts .contracts-block').jstree({ plugins: ["themes", "html_data", "ui"] })  // 
        .bind("select_node.jstree", function (e, data) {
            window.location = $(data.args[0]).attr('href');
        })

        //$('.contracts .col-1 .add-button').click(function () {
        //    showOverlay();
        //    $('#popup-contract h6').text('Add Contract');
        //    $('#popup-contract input[type=text], #popup-contract input[type=textarea]').val('');
        //    $('#popup-contract').show();
        //    return false;
        //});


        $('.contracts .col-1 .edit-button').click(function () {
            showOverlay();
            $('#popup-contract h6').text('Edit Contract');

            // need to fill inputs in the form 

            $('#popup-contract').show();
            return false;
        });


        $('.contracts .col-2 .add-button').click(function () {
            showOverlay();
            $('#popup-contract-product h6').text('Add Product');
            $('#popup-contract-product').show();
            return false;
        });

        $('#popup-contract-product #select-esl').click(function () {
            $('#popup-contract-product .checkbox-container input[data-type=ESL]').attr('checked', 'checked');
        });

        $('#popup-contract-product #select-fsl').click(function () {
            $('#popup-contract-product .checkbox-container input[data-type=FSL]').attr('checked', 'checked');
        });

        $('.contracts .col-2 .edit-button').click(function () {
            showOverlay();
            $('#popup-contract-product h6').text('Edit Product');

            // need to fill inputs in the form 

            $('#popup-contract-product').show();
            return false;
        });

        $('.contracts .col-2 .view-button').click(function () {
            showOverlay();
            // need to fill inputs in the form 
            $('#popup-contract-product-view').show();
            return false;
        });
    }


    $('.Group .tab-bottom-button').click(function () {
        $(this).parent().find('.tab1 tr.hidden').each(function (index, element) {
            if (index > 10) {
                return
            }
            else {
                $(element).removeClass('hidden');
            }
        });
        if ($(this).parent().find('.tab1 tr.hidden').length == 0) $(this).css('display', 'none');
        return false
    });

    //$('.chat-button').click ( function ()
    //{
    //	if ( $('.chat-win').css('opacity') == '0' )
    //	{
    //		$('.chat-win').css( {display:'block',opacity:0} );
    //		onResize();
    //		$('.chat-win').stop().animate( {marginRight:0, opacity:1} , 500)

    //	}
    //	else
    //	{
    //		$('.chat-win').stop().animate( {marginRight:-275, opacity:0} , 500);
    //	}
    //	return false;
    //});

    //$('.chat-list li a').click ( function ()
    //{
    //	$('.chat-list li a.selected').removeClass('selected');
    //	$(this).addClass('selected');
    //	openNewDialog($(this).find('span').text(), $(this).attr('href') );
    //	return false;
    //});

    //initChatDialogs();

    $('#chat-user-type').change(function () {
        if ($(this).val() == 'Learner') {
            $('#chat-client-item').show();
        }
        else {
            $('#chat-client-item').hide()
        }
        onResize();
    });

    $('.chat-search').keyup(
        function () {
            filterUsers($(this).val());
        }
    ).change(
        function () {
            filterUsers($(this).val());
        }
    );

    $(".chat-tabs").tabs();


    if ($('.course-plan').length) {
        $('#add-module').click(function () {
            $("#popup-modules .error-message").hide();

            showOverlay();
            //K: $("#popup-modules .form-mode").val("ADD");
            $('#popup-modules').show();
            return false;
        });

        $('#add-hours').click(function () {
            showOverlay();
            $('#popup-hours').show();
            return false;
        });

        $('#edit-current-module').click(function () {
            showOverlay();
            $('#popup-learner-modules').show();
            $('#popup-learner-modules select[name=module]').val($('#current-module').attr('data-module'));
            return false;
        });

        $('#add-Lessons').click(function () {
            showOverlay();
            $('#popup-add-Lessons').show();
            return false;
        });


    }

    $("table.calendar .cell .event").tooltip({
        content: function () {
            return $(this).find('.tooltip-content').html();
        }, show: { effect: "fadeIn", duration: 300 }, tooltipClass: "event-tooltip", hide: { effect: "fadeOut", duration: 100 }, track: true
    });


    $('table.calendar .event').tooltip({
        content: function () {
            return $(this).find('.tooltip-content').html();
        }, show: { effect: "fadeIn", duration: 300 }, tooltipClass: "event-tooltip", hide: { effect: "fadeOut", duration: 100 }, track: true
    });

    $('#request-Lessons-link').click(function () {
        showOverlay();
        $('#popup-request-Lessons').show();
        return false;
    });

    $('#request-module-link').click(function () {
        showOverlay();
        $('#popup-request-module').show();
        return false;
    });

    $('.popup-buttons a').click(function () {

        $('#comment').css('border-color', '');

        $('#popup-request h6').text($(this).attr('data-title'));
        $('#popup-request [name=request]').val($(this).attr('data-request'));
        $('#popup-request [name=Lessons]').val($(this).attr('data-Lessons'));
        $('#popup-request [name=reason]').val($(this).attr('data-reason'));

        if ($(this).attr('data-Lessons-disabled')) {
            $('#popup-request [name=Lessons]').addClass('form-disabled');
            $('#popup-request [name=Lessons]').attr('readonly', true);
        }
        else {
            $('#popup-request [name=Lessons]').removeClass('form-disabled');
            $('#popup-request [name=Lessons]').attr('readonly', false);
        }

        if ($(this).attr('data-mandatory')) {
            $('#popup-request .mandatory').show();
            $('#comment').attr('data-mandatory', true);
        }
        else {
            $('.popup-request .mandatory').hide();
            $('#comment').attr('data-mandatory', false);
        }

        $('#req-id').val($(this).attr('data-reqID'))
        $('#request-type').val($(this).attr('data-type'));
        showOverlay();
        $('#popup-request').show();



        $('#requestApproveForm').attr("action", $(this).attr('data-action'));

        return false;
    });

    

    $('#system-comments').click(function () {
        if ($(this).is(':checked'))
            $('.system-comment').css('display', 'table-row');
        else
            $('.system-comment').css('display', 'none');
    });



    if ($('.messages-container').length) {
        checkMessagesSelection();

        //$('.mail-widget').slimScroll({ height:$('.mail-widget').height(), allowPageScroll: false, alwaysVisible: true });



        $('.move').click(function (eventObject) {
            showOverlay();
            $('.popup-move-message').show();
            return false;

        });

        $('.add-folder').click(function (eventObject) {
            showOverlay();
            SetToInValidate($('.popup-folderAdd-message'));
            $('.popup-folderAdd-message').show();
            return false;

        });

        $('.rename-folder').click(function (eventObject) {
            showOverlay();
            SetToInValidate($('.popup-renamefolder-message'));
            $('.popup-renamefolder-message').show();
            return false;

        });

        $('.delete-folder').click(function (eventObject) {
            showOverlay();
            SetToInValidate($('.popup-deletefolder-message'));
            $('.popup-deletefolder-message').show();
            return false;

        });


        $('.mail-widget a').click(function (eventObject) {
            if ($(eventObject.target).attr('type') != 'checkbox') {
                $('.mail-widget a.selected').not(this).removeClass('selected').find('input[type=checkbox]').each(function (index, el) { el.checked = false });

                $(this).addClass('selected');
                $(this).find('input[type=checkbox]').get(0).checked = true;
                checkMessagesSelection();
            }
            else {
                if ($(eventObject.target).is(':checked'))
                    $(this).addClass('selected');
                else
                    $(this).removeClass('selected');

                checkMessagesSelection();

                eventObject.preventDefault();

                var value = eventObject.target.checked;

                setTimeout(function () { eventObject.target.checked = value }, 150);

                return false;
            }


        });

        /*$('.mail-widget a input[type=checkbox]').click( function (eventObject){});*/

        $('#all-messages').click(function () {
            var check = $(this).is(':checked');
            $('.mail-widget a input[type=checkbox]').each(function (index, el) { el.checked = check; });
            if (check)
                $('.mail-widget a').addClass('selected');
            else
                $('.mail-widget a').removeClass('selected');

            checkMessagesSelection();
        });


    }

    $('.all-checks').change(function () {
        var checked = $(this).is(':checked');
        $(this).parents('table').find('td input[type=checkbox]').each(function (index, el) { el.checked = checked })
    });


    $('#recurrent').click(function () {
        if ($(this).is(':checked'))
            $(this).parent().parent().find('.recurrent-block').show();
        else
            $(this).parent().parent().find('.recurrent-block').hide();
    });

    $('input[name=apply-period]').change(function () {
        //console.log ( $('#input[name=apply-period]:checked').val() );
        if ($('#week-period').is(':checked'))
            $('#week-period-tab').show();
        else
            $('#week-period-tab').hide();
    });

    $('#add-availability').click(function () {
        var winHeight = document.getElementsByTagName('html')[0].clientHeight;
        $('.popup-avalability .scroll-container').css('height', winHeight - 180);
        showOverlay();
        $('.popup-avalability').css('margin-top', -winHeight / 2 + 20).show();
        return false;
    });


    $('#book-lesson').click(function () {
        showOverlay();
        SetToInValidate($('.popup-event'));
        $('.popup-event').show();
        return false;
    });


    //$('#add-availability').click( function ()
    //{
    //    OpenAvailability($('#add-availability')[0]);
    //});


    //$('#book-lesson').click( function ()
    //{
    //	showOverlay();
    //	$('.popup-event').show();
    //	return false;
    //});

    $('#reset-password').click(function () {
        showOverlay();
        $('.popup-event').show();
        return false;
    });

    $('#add-other').click(function () {
        showOverlay();
        $('.popup-other').show();
        return false;
    });





    if ($('table.calendar .cell .events').length) {
        $('table.calendar .cell .events').each(function (index, element) {
            $(element).slimScroll({ height: $(element).height(), allowPageScroll: false, alwaysVisible: true });
        });
    }

    $('.tab-data .add-link').click(function () {
        if ($(this).attr('href') == '#') {
            showOverlay();
            $(this).parents('.tab-data').find('.popup-form').show();
            return false;
        }
    });

    $('.popup-form .cancel-button').click(function () {
        try {
            SetToInValidate($(this.form));
        } catch (e) {

        }

        $(this).parents('.popup-form').hide();
        $('body .body-overlay').hide();
    });


    //if ($('#coord-perfomance').length) {

    //    var optionsCoordChart = {
    //        series: {
    //            lines: { show: true, lineWidth: 2 },
    //            points: { show: false },
    //            shadowSize: 0
    //        },
    //        legend: { container: $('#coord-legend'), noColumns: 2 },
    //        xaxis: { position: "bottom", minTickSize: 1, ticks: coordTicks },
    //        yaxis: { min: 0, max: 200, autoscaleMargin: 0.1 },
    //        grid: { backgroundColor: "#fff", color: '#575757', borderWidth: 1 },
    //        colors: ['#92ae00', '#d23a3a']
    //    };
    //    var coordChart = $.plot($("#coord-perfomance"), coordDataChart, optionsCoordChart);

    //}



    if ($('#chargeable-cancellation').length) {
        var optionsChargeable = {
            series: {
                lines: { show: false },
                points: { show: false },
                bars: { show: true, shadowSize: 5, align: "center", lineWidth: 1, fill: true, barWidth: 0.7, fillColor: { colors: [{ opacity: 0.9 }, { opacity: 0.3 }] } },
                shadowSize: 0
            },
            legend: { noColumns: 2 },
            xaxis: { position: "bottom", minTickSize: 1, ticks: chargeableTicks },
            yaxis: { min: 0, autoscaleMargin: 0.1 },
            grid: { backgroundColor: "#fff", color: '#575757', borderWidth: 1, hoverable: true, clickable: true },
            colors: ['#edc240', '#8ccafb', '#d73a3a', '#4ebb4e', '#9a42f7', '#e2832e', '#34cbbb', '#c0376b', '#6b9e35', '#4575d5']

        };

        try {
            //	console.log ( $("#learner-perfomance"), learnerDataChart, optionsLearnerChart );
            var chargeableChart = $.plot($("#chargeable-cancellation"), chargeableData, optionsChargeable);
        }
        catch (e) {
            // do nothing
        }

        $("#chargeable-cancellation").bind("plothover", function (event, pos, item) {
            if (item) {
                $("#chart-tooltip").remove();
                var y = item.datapoint[1].toFixed(2);
                showTooltip(item.pageX + 5, item.pageY - 30, '<b>' + y + '</b>');
            } else {
                $("#chart-tooltip").remove();
            }

        });
    }


    $('.learner-progress td').tooltip();

    $('.password-form .cancel-button').click(function () {
        $('body .body-overlay').hide();
        $('.password-form').hide();
    });

    $('.cards .cancel-button').click(function () {
        $('body .body-overlay').hide();
        $(this).parents('.tutors-form').hide();
    });

    $('.photo-link').click(function () {
        showOverlay();
        $('.photo form').show();
        return false;
    });

    $('#cancel-photo-button').click(function () {
        $('body .body-overlay').hide();
        $('.photo form').hide();
        return false;
    });

    $('.collapsible-block h6 a').click(function () {
        if ($(this).parent().parent().hasClass('opened-collapsible-block')) {
            $(this).parent().parent().removeClass('opened-collapsible-block').addClass('closed-collapsible-block');
        }
        else {
            $(this).parent().parent().removeClass('closed-collapsible-block').addClass('opened-collapsible-block');
        }
        return false;
    });
    $('[data-href]').click(function () {
        window.location.href = $(this).attr('data-href').replace("~", baseURL);
    });
    $('[data-hrefblank]').click(function () {
        window.open($(this).attr('data-hrefblank').replace("~", baseURL));
    });

    $(".form-date").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd.mm.yy",
        firstDay: 0
    });

    initAnnounceNav();

    //$(".home-grid .inner-col").css('height', $('.home-grid').height()+20);

    $(".home-grid .inner-col").sortable({
        connectWith: [".home-grid .inner-col"],
        items: "> .widget",
        start: startDragWidget,
        stop: stopWidgetOpration,
        handle: '.title',
        helper: "clone",
        tolerance: "pointer",
        containment: "document",
        zIndex: 10000,
        placeholder: 'widget-placeholder'
    });

    $('input.with-text').each(function () {

        $(this).focus(function () {
            if (this.value == this.defaultValue) {
                this.value = "";
                if (String(this.id).indexOf('password') >= 0) this.type = 'password';
            }
        });

        $(this).blur(function () {
            if (this.value == "") {
                this.value = this.defaultValue;
                if (String(this.id).indexOf('password') >= 0) this.type = 'text';
            }
        });

    });

    $('textarea.with-text').each(function () {
        $.data(this, 'default', this.value);
    }).focus(function () {
        if (!$.data(this, 'edited')) {
            this.value = "";
        }
    }).change(function () {
        $.data(this, 'edited', this.value != "");
    }).blur(function () {
        if (!$.data(this, 'edited')) {
            this.value = $.data(this, 'default');
        }
    });

    $('[data-href]').addClass('clickable');

    $('#printer-friendly').click(function (e) {
        window.print();

        if ((/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) ||
            (/safari/.test(navigator.userAgent.toLowerCase()))) {
            //Browser is CHROME or SAFARI

            var url = baseURL + $('#printer-friendly-page-address').val();
            window.location.href = url;
        }

        e.preventDefault();
        return false;
    });

    $(window).resize(onResize);

    onResize();

    //$("body").on("submit", "form", function () {
    //    var ff = 0;
    //})

    $("#announcement").click(function () {
        showOverlay();
        $("#popup-select-announcement-type").show();
        return false;
    });

    $('#select-announcements-close').click(function () {
        $(this).parents('.popup-select-announcement-type').hide();
        $('body .body-overlay').hide();
    });

    $('#select-announcements-continue').click(function () {
        if ($("input:radio[name=announcement-type]:checked").val() == "1") {
            var url = $("#mainAddress").val() + "Announcement";
            window.location.href = url;
        } else if ($("input:radio[name=announcement-type]:checked").val() == "2") {
            var url = $("#mainAddress").val() + "ExcitingNewsAnnouncement";
            window.location.href = url;
        }
    });
}
)

//---
function check_timeout(t) {
    if (t == session_timeout_notify_no) {
        $("#is-time-finished").val("");
        showOverlay();
        $(".body-overlay").css("z-index", "95");

        $("#popup-sessiontimeout-notif .text-1").show();
        $("#popup-sessiontimeout-notif .text-2").hide();

        $("#popup-sessiontimeout-notif").show();

        //startTime(parseInt($("#before-session-time-out").val()) * 60);
        startTime(parseInt($("#before-session-time-out").val()));

        clearTimeout(sessionTimeOut_countup);
        return;
    }
    else {
        //$("#txt-time").text(t);
        setTimeout(function () { check_timeout(t + 1) }, 60000); //--- 60000 will run it every 1 minute
    }
}

function startTime(t) {
    t = parseInt(t);

    $("#left-minute").text(t < 10 ? "0" + t : t);

    if (t > 0) {
        sessionTimeOut_countdown = setTimeout(function () { startTime(t - 1) }, 60000); //--- 60000 will run it every 1 minute
    }
    else {
        $("#is-time-finished").val(true);
        $("#popup-sessiontimeout-notif .text-1").hide();
        $("#popup-sessiontimeout-notif .text-2").show();
        clearTimeout(sessionTimeOut_countdown);
        return;
    }
}

//--- this code is for show in min and sec
//function startTime(t) {
//    t = parseInt(t);
//    var m = 0;
//    var s = 0;

//    if (t % 60 == 0) {
//        m = t / 60;
//        s = 0;
//        }
//        else {
//        m = Math.floor(t / 60);
//        s = t -(m * 60);
//}

//    $("#left-minute").text(m < 10 ? "0" +m: m);
//    $("#left-second").text(s < 10 ? "0" +s: s);

//    if (t > 0) {
//        sessionTimeOut_countdown = setTimeout(function () {
//startTime(t -1)
//}, 1000); //--- 1000 will run it every 1 second
//}
//else {
//$("#is-time-finished").val(true);
//$("#popup-sessiontimeout-notif .text-1").hide();
//$("#popup-sessiontimeout-notif .text-2").show();
//clearTimeout(sessionTimeOut_countdown);
//return;
//}
//}
//---

function showTooltip(x, y, contents) {
    $('<div id="chart-tooltip">' + contents + '</div>').css({
        top: y + 5,
        left: x + 5
    }).appendTo("body").fadeIn(200);
}


function roundNumber(num, after) {
    var nums = String(num).split('.');
    var rounded = num;
    if (nums.length > 1) {
        rounded = nums[0] + '.' + String(nums[1]).substr(0, after);
    }
    return rounded
}

function showPreview() {
    if ($('#report-template-popup .questions .selected').length > 0) {

        $('#preview-popup .question').text($('#report-template-popup #title').val()).show();
        $('#preview-popup .input-type').hide();

        var el = $('#type-' + $('#question-type').val());
        $(el).val('').show();

        $("#type-numeric-text").val('0').spinner({ min: 0, step: 1 });

        var code = '';
        if ($('#question-type').val() == "multiple-choice") {
            $('#report-template-popup .answers .item input').each(function (index, element) {
                code += '<option value="a-' + index + '">' + $(element).val() + '</option>';
            });
            $(el).html('').html(code);
        }
        else if ($('#question-type').val() == "checkbox") {
            $('#report-template-popup .answers .item input').each(function (index, element) {
                code += '<label><input type="checkbox" name="a-' + index + '" value="1">' + $(element).val() + '</label>';
            });
            $(el).html('').html(code);
        }
        else if ($('#question-type').val() == "radiobutton") {
            $('#report-template-popup .answers .item input').each(function (index, element) {
                code += '<label><input type="radio" name="answer" value="a-' + index + '">' + $(element).val() + '</label>';
            });
            $(el).html('').html(code);
        }

    }
    else {
        $('#preview-popup .question').hide();
    }
}

function showQuestionData(questionItem) {
    $('.details .inner').show();
    $('#title').val($(questionItem).find('.title').text());
    $('#question-type').val($(questionItem).find('.type').attr('data-type'));
    $('#question-usage').val($(questionItem).find('.type').attr('data-usage'));
}

function defineScrollItems() {
    $('.scroll-and-panel .scroll .item').unbind('click').click(function () {
        $(this).parent().parent().find('.scroll .selected').removeClass('selected');
        $(this).addClass('selected');

        if ($(this).parents('.answers').length == 0)
            showQuestionData(this);
        return false;
    });

    $('.scroll-and-panel .scroll input').unbind('focus').focus(function () {
        $(this).parent().parent().parent().find('.selected').removeClass('selected');
        $(this).parent().addClass('selected');
        return false;
    });
}

function defineNewNames(container) {
    $(container).find('.item input').each(function (index, element) {
        $(element).attr('name', 'a-' + index);
    });
}






//function initChatDialogs()
//{
//	$('.chat-dialog .title .close').click ( function ()
//	{
//		$(this).parents('.chat-dialog').remove();
//		return false;
//	});

//	$('.chat-dialog .title').click ( function ()
//	{		
//		var dialog = $(this).parents('.chat-dialog');
//		if ( $(dialog).hasClass('minimized') )
//			 $(dialog).removeClass('minimized');
//		else	
//			$(dialog).addClass('minimized');

//		return false;
//	});
//}

//function openNewDialog (name, url) 
//{
//	var messages = '<div class="one-message"><img src="photos/photo_3.jpg" width="32" height="32" alt=""><div class="text">Hello</div></div>';
//	messages += '<div class="one-message"><img src="photos/photo_4.jpg" width="32" height="32" alt=""><div class="text">Hi David,<br>How are you?</div></div>';

//	var html = '<div class="chat-dialog"><div class="title"><span class="online"><a href="'+url+'">'+name+'</a></span> <a href="#" class="close">x</a></div><div class="inner">';
//	html += '<div class="dialog">'+messages+'</div><div class="input"><input type="text" class="form-text" value=""></div></div></div>';

//	$('.live-chat').append(html);
//	initChatDialogs();
//}

function filterUsers(searchString) {
    searchString = searchString.toLowerCase();

    $('#chat-list li a').each(
		function (index, element) {
		    var name = $(element).find('span').text().toLowerCase();

		    var ind = name.indexOf(searchString);
		    //console.log ( name, searchString, String(name).substr(ind-1,1) );

		    if (ind == 0 || String(name).substr(ind - 1, 1) == ' ') {
		        $(element).parent().css('display', 'block');
		    }
		    else {
		        $(element).parent().css('display', 'none');
		    }

		}
	);
}

function checkMessagesSelection() {
    if ($('.mail-widget a input[type=checkbox]:checked').length) {
        //$('.messages .buttons-overlay').css('display', 'none');
        // enable buttons
        var selector = $(".toolbar .buttons-right2 .blue-button");
        selector.removeClass("blue-button-disabled");

    }
    else {
        //$('.messages .buttons-overlay').css('display', 'block');	
        // disable buttons
        var selector = $(".toolbar .buttons-right2 .blue-button");
        //selector.prop("disabled", true);
        selector.addClass("blue-button-disabled");

    }

    $('#all-messages').get(0).checked = true;
    $('.mail-widget a input[type=checkbox]').each(function (index, el) {

        if (!el.checked) {
            $('#all-messages').get(0).checked = false;
            return
        }
    });



}

function currencyTicks(val, axis) {
    return val + '$'

}


function percentTicks(val, axis) {
    return val + '%'

}


function showOverlay(checkIE) {
    notCheckIE = checkIE || false;

    if ($('body>.body-overlay').length == 0) {
        $('body').append('<div class="body-overlay"></div>');
    }
    //console.log ( navigator.appVersion.indexOf("MSIE 7.") );
    if (!checkIE) {
        //if (navigator.appVersion.indexOf("MSIE 7.") === -1)
        $('body .body-overlay').css('height', $('body').height()).show();
    }
    else {
        $('body .body-overlay').css('height', $('body').height()).show();
    }
}

function initAnnounceNav() {
    $('.announce-block .announce').fadeOut(0);
    if ($('#ann-1').length > 0) {
        $('#ann-1').fadeIn(0);
    }

    $('.home-grid').on('click', '.announce-nav .pause', annPause);
    $('.home-grid').on('click', '.announce-nav .prev', annPrev);
    $('.home-grid').on('click', '.announce-nav .next', annNext);
    $('.home-grid').on('click', '.announce-nav .play', annPlay);
    //$('.announce-nav .play').click(annPlay).click();

    annPlay();
}

function annPause() {
    clearInterval(annIntervalID);
    annIntervalID = null;
    $('.announce-nav .pause').hide();
    $('.announce-nav .play').show();
    return false;
}

function annPlay() {
    $('.announce-nav .pause').show();
    $('.announce-nav .play').hide();
    //annIntervalID = setInterval(runPlayAnnounce, 5000);
    return false;
}

function annNext() {
    if (annIntervalID) {
        clearInterval(annIntervalID);
        annPlay();
    }

    runPlayAnnounce();
    return false;
}

function annPrev() {
    if (annIntervalID) {
        clearInterval(annIntervalID);
        annPlay();
    }

    runPlayAnnounce(true);
    return false;
}


function runPlayAnnounce(prev) {
    prev = prev || false;

    $('#ann-' + currAnnNum).fadeOut(200);

    //setTimeout(function () {
        if (!prev) {
            if (currAnnNum < $('.announce').length)
                currAnnNum++;
            else
                currAnnNum = 1;
        } else {

            if (currAnnNum > 1)
                currAnnNum--;
            else
                currAnnNum = $('.announce').length;

        }
        $('#ann-' + currAnnNum).fadeIn(200);

    //}, 400);
}

function onResize() {
    $('.central-block').css('height', 'auto');
    var winHeight = document.getElementsByTagName('html')[0].clientHeight;
    var bodyHeight = $('.main-cont').height();

    $('.live-chat .chat-list').height(winHeight - ($('.live-chat .top').height() + 73));

    if (bodyHeight > winHeight - 42) {
        $('body').css('height', 'auto');
        $('.central-block').css('height', 'auto');
    }
    else {
        $('body').css('height', '100%');

        $('.central-block').css('height', winHeight - 200);
    }
}

function startDragWidget(event, ui) {
    $('.widget-placeholder').css('height', $(ui.item).height());
}

function stopWidgetOpration(event, ui) {
    //$(".home-grid .inner-col").css('height','auto').css('height',$('.home-grid').height()+20);
    SaveDashboard();
    onResize();
}

function SetToInValidate(obj) {
    var required = obj.find("[data-required]");

    required.each(function () {
        $(this).css("border-color", "");
        $(this).css("border-width", "");
    });
}

function CommonFormValidate(obj) {
    var required = obj.find("[data-required]");

    var isValid = true;

    required.each(function () {
        var valid = true;
        if (this.type && (this.type == "radio" || this.type == "checkbox")) {
            valid = this.checked;
        }
        else {
            valid = !IsNullOrEmpty($(this).val());
        }

        if (valid) {
            $(this).css("border-color", "");
            $(this).css("border-width", "");
        }
        else {
            $(this).css("border-color", "#FF0000");
            $(this).css("border-width", "2px");
        }

        isValid &= valid;
    });



    return isValid;
}

function IsValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

function IsValidTelephone(value) {
    //var pattern = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
    var pattern = /^[0-9-+\(\)\s]+$/;
    return pattern.test(value);
};

function IsValidNumeric(value) {
    var pattern = /^[0-9]*$/;
    return pattern.test(value);
};

function IsValidPassword(value) {
    if (value.length >= 8 && value.length <= 20) {
        var pattern1 = new RegExp(/[a-z]/);
        var pattern2 = new RegExp(/[A-Z]/);
        var pattern3 = new RegExp(/\d/);
        var pattern4 = new RegExp(/^[a-zA-Z0-9]*$/);

        return pattern1.test(value) // min 1 lowercase
            && pattern2.test(value) // min 1 uppercase
            && pattern3.test(value) // min 1 digit
            && !pattern4.test(value) // min 1 symbole
            && (value.indexOf(' ') < 0) // Doesn't have a white space
    }
    else
        return false;
}

var vis = (function () {
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();
