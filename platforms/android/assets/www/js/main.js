$( document ).ready( function() {

  $('.whiteboard').height($(window).height());
  
  $( window ).resize(function() {
    $('.whiteboard').height($(window).height());
  });

});
