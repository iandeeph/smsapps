$(document).ready(function() {
    $(".button-collapse").sideNav();
    $(".button-hide").sideNav();
    $('.collapsible').collapsible({
        accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $('.modal-trigger').leanModal();
    $('ul.tabs').tabs();

    var chatElem = $('.chat-wrapper');
    if (chatElem.length > 0) {
        chatElem.animate({scrollTop: chatElem[0].scrollHeight}, 1000);
    }

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 10 // Creates a dropdown of 15 years to control year
    });

    $('.dropdown-button-mini').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );

    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var today = day +" " + monthNames[monthIndex] + ", " + year;
    var reportDayElem = $('#reportDay');
    if (reportDayElem.length > 0) {
        reportDayElem.val(today);
    }

    setTimeout(function(){
        $('.valueLabel, .valueLabelLight').remove();
    }, 5000);
});