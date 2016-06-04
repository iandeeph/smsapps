$(".button-collapse").sideNav();
$(".button-hide").sideNav();

$(document).ready(function() {
    $(".dropdown-button").dropdown();
    $('.collapsible').collapsible({
        accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $('.modal-trigger').leanModal();
    $('.dropdown-button').click(function(){
       $('.dropdown-content').css("top", "54px")
    });
});