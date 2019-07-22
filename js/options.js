function BlockListElement(name){
  var returnVal = "<li class='blocked-site-element'>" + name + "</li>";
  return returnVal;
}

function TimeRangeElement(){
  var returnVal = "<div class='input-group date' id='datetimepicker1'>" +
            "<input type='text' class='form-control' />" +
            "<span class='input-group-addon'>" +
            "<span class='glyphicon glyphicon-calendar'></span>" +
            "</span> </div>";
  return returnVal;
}

$(document).ready(function(){


  $("#createMode").click(function() {

    /* Gets all the selected options */
    var selected_urls = [];
    var i = 0;
    $('#url-select  option:selected').each(function() {
        selected_urls[i] = $(this).text();
        i++;
    });
    console.log(selected_urls);
    var mode_type = document.getElementById("modeType");
    var selectedOption = mode_type.options[mode_type.selectedIndex].text;
    console.log(selectedOption);
    console.log(selected_urls[0]);
    var redirectURL = $("#moderedirctURL").val();
    var modeName = $("#addMode").val();
    newMode = new Mode(selected_urls,[selectedOption,redirectURL,modeName]);
    console.log(newMode);
    
    mode_manager.pushMode(newMode);
  });

  $('#signin-button').click(function() {
    auth.signin();
  });

  $('#sign-out-button').click(function() {
    auth.signout();
  });



  $("#showScheduledSessions").click(function() {
    console.log(master_scheduler.getActiveSessions());
    $("#displayCL").text(master_scheduler.getActiveSessions());
  });

  $("#addURL").click(function(){
	var msg = block_list.updateBlockedSite($("#addSiteInputUrl").val());
	if(msg === "Successfully added url to blocklist!") {
		var colour = "green";
	} else {
		var colour = "red";
	}
    $("#addUrlError").html(msg.fontcolor(colour));
  });

  //Displays each item on the blocklist with an option to remove them.
  block_list.AddOnBlocklistChangedListener(function(blocked){
    document.getElementById('checklist').innerHTML = "";

    /* clear url selection in modes */
    $("#url-select").empty();

    for(var x=0; x < blocked.length; x++){
      var container = $("#checklist");
      var div = $("<div style='padding: 5px;'> </div>");
      var button = $("<button id='" + blocked[x] + "' class='btn btn-primary'>Remove<i class='glyphicon glyphicon-minus'></i></button>");
      button.click(function(){
        console.log("Button remove clicked");
        block_list.removeBlockedSiteByString($(this).attr('id'));
      })
      var label = $("<label style='padding-left: 20px;'> </label>");
      label.html(blocked[x]);
      div.append(button);
      div.append(label);
      container.append(div);

      /* Add url as available option for selection in modes */
      var option = $("<option>" + blocked[x] + "</option>");
      $("#url-select").append(option);

    }


  });

  //Displays Active and Scheduled session on the Scheduler Test Page with an option to remove
  //Following the style of code from the blocklist page
  master_scheduler.AddOnSchedulerChangedListener(function(scheduled){
    document.getElementById('scheduledsession').innerHTML = "";
    document.getElementById('activesession').innerHTML = "";

    // Clear the calendar before re-adding all the eventSources
    // a little inefficient
    $('#calendar').fullCalendar('removeEvents');
    var events = [];

    for(var x=0; x < scheduled.length; x++){
      var container = $("#scheduledsession");
      var div = $("<div style='padding: 5px;'> </div>");
      var button = $("<button id='" + scheduled[x].id + "' class='btn btn-primary'>Remove<i class='glyphicon glyphicon-minus'></i></button>");
      button.click(function(){
        console.log("Button remove clicked");
        master_scheduler.removeSessionById($(this).attr('id'));
      })
      var label = $("<label style='padding-left: 20px;'> </label>");
      label.html(scheduled[x].string + " Mode: "+ scheduled[x].mode);
      div.append(button);
      div.append(label);
      container.append(div);

      // Put the events into an array so that we add them all at once later
      var event_number = x + 1;
      var event={id:scheduled[x].start_time , title: "Event " + event_number, start:  new Date(scheduled[x].start_time), end: new Date(scheduled[x].end_time)};
      events.push(event);
    }

    // Add all those events
    $('#calendar').fullCalendar('renderEvents', events, true);

    master_scheduler.updateActiveSessions(new Date());
    for(var x=0; x < master_scheduler.active_sessions.length; x++){
      var container = $("#activesession");
      var div = $("<div style='padding: 5px;'> </div>");
      var label = $("<label style='padding-left: 20px;'> </label>");
      label.html(master_scheduler.active_sessions[x].string+ " Mode: "+ master_scheduler.active_sessions[x].mode);
      div.append(label);
      container.append(div);
    }




  });

  mode_manager.AddOnModeChangedListener(function(modemodified){
    document.getElementById('currentmodes').innerHTML = "";

    if(modemodified.length == 0)
      document.getElementById('pickmode').innerHTML = "<option>---</option>";



    for(var x=0; x < modemodified.length; x++){
      var container = $("#currentmodes");
      var div = $("<div style='padding: 5px;'> </div>");
      console.log(modemodified[x].modeName);
      var button = $("<button id='" + modemodified[x].modeName + "' class='btn btn-primary'>Remove<i class='glyphicon glyphicon-minus'></i></button>");
      button.click(function(){
        console.log("Button remove clicked");
        mode_manager.removeMode($(this).attr('id'));
        //mode_manager.clearSavedModes();
      })
      var label = $("<label style='padding-left: 20px;'> </label>");
      if(modemodified[x].option != "Redirect")
        label.html("Mode Name: "+modemodified[x].modeName+", Type: "+modemodified[x].option+", Selected URLs: "+modemodified[x].selected_urls);
      else
        label.html("Mode Name: "+modemodified[x].modeName+", Type: "+modemodified[x].option+", Redirect URL: "+modemodified[x].redirectUrl+", Selected URLs: "+modemodified[x].selected_urls); 
      div.append(button);
      div.append(label);
      container.append(div);
      $('#pickmode').append($('<option>', {
        value: modemodified[x].modeName,
        text: modemodified[x].modeName
      }));
      // Put the events into an array so that we add them all at once later
    }

    // Add all those events
    //$('#calendar').fullCalendar('renderEvents', events, true);




  });

  //Converts input from start time and end time into js date and create a session
  //with the dates and add it to the scheduler
  $("#addsessions").click(function(){
    var pickmode = document.getElementById("pickmode");
    var selectedMode = pickmode.options[pickmode.selectedIndex].text;
    master_scheduler.pushSession(
      new Session(new Date($("#addStartTime").val()),new Date($("#addEndTime").val()),selectedMode)
    );
  });

  //Add two hardcoded session to the scheduler. One will be an active session.
  /*$("#addsessionsfixed").click(function(){
    var date1 = new Date("October 13, 2014 11:13:00");
    var date2 = new Date("October 13, 2015 11:13:00");
    var date3 = new Date("October 15, 2016 11:13:00");
    var date4 = new Date("October 15, 2017 13:13:00");
    test1 = new Session(date1,date2);
    test2 = new Session(date3,date4);
    now = new Date();
    master_scheduler.pushSession(test1);
    master_scheduler.pushSession(test2);
  });*/

  //Clear all sessions in the scheduler
  $("#rmsessions").click(function(){
    master_scheduler.clearSavedSessions();
  });
});
