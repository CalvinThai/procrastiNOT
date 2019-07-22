$(document).ready(function(){

  // Changes all svg images to inline svg elements that we can modify using css
  // source: https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  $('img[src$=".svg"]').each(function() {
        var $img = jQuery(this);
        var imgURL = $img.attr('src');
        var attributes = $img.prop("attributes");

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Remove any invalid XML tags
            $svg = $svg.removeAttr('xmlns:a');

            // Loop through IMG attributes and apply on SVG
            $.each(attributes, function() {
                $svg.attr(this.name, this.value);
            });

            // Replace IMG with SVG
            $img.replaceWith($svg);
        }, 'xml');
    });

    $('#getCalendarsButton').click(function() {
      auth.getCalendarList();
    });

    $('#getPrimaryCalendarButton').click(function() {
      auth.getPrimaryCalendar();
    });

    $('#calendar').fullCalendar({
      navLinks: true,
      defaultView: 'month',
      header: {
          right: 'prev,next today',
          left: 'title',
          center: 'month,agendaWeek,agendaDay'
      },
      events: [],
      editable: true,
    eventDrop: function(event, delta, revertFunc) {

        console.log(event.title + " was dropped on " + event.start.format());



    },
      editable: true
    });

});
