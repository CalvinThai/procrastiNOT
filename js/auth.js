/**
Auth
Class that lets you authenticate your account with chrome.
*/

Auth = function(){

  this.signin = function() {

    chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    console.log("Signed in.");
  });
  }

  this.signout = function() {
    //user_info_div.innerHTML="";
    chrome.identity.getAuthToken({ 'interactive': false },
      function(current_token) {
        if (!chrome.runtime.lastError) {

          chrome.identity.removeCachedAuthToken({ token: current_token },
            function() {});

          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
                   current_token);
          xhr.send();
          console.log("Signed out.");

        }
    });
  }

  /*this.getCalendarList = function() {
    xhr.open('GET', 'https://www.googleapis.com/calendar/v3/users/me/calendarList');
    xhr.send();
    console.log("Get user calendar list");
  }*/

  function xhrWithAuth(method, url, interactive, callback) {
    var access_token;

    var retry = true;

    getToken();

    function getToken() {
      chrome.identity.getAuthToken({ interactive: interactive }, function(token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }

        access_token = token;
        requestStart();
      });
    }

    function requestStart() {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      xhr.onload = requestComplete;
      xhr.send();
    }

    function requestComplete() {
      if (this.status == 401 && retry) {
        retry = false;
        chrome.identity.removeCachedAuthToken({ token: access_token },
                                              getToken);
      } else {
        callback(null, this.status, this.response);
      }
    }

  }

  // Get a list of all of the user's calendars
  this.getCalendarList = function() {
    xhrWithAuth('GET',
                'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                false, //interactive,
                onUserInfoFetched);
  }
  // @corecode_end getProtectedData

  // Get the user's primary calendar
  this.getPrimaryCalendar = function() {
    xhrWithAuth('GET',
                'https://www.googleapis.com/calendar/v3/calendars/' + "primary" + "/" + "events",
                false, //interactive,
                onUserInfoFetched);

  }

  this.createSimpleEvent = function() {

  }

  // Code updating the user interface, when the user information has been
  // fetched or displaying the error.
  function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
      //changeState(STATE_AUTHTOKEN_ACQUIRED);
      //sampleSupport.log(response);
      var calendar_list = JSON.parse(response);
      populateUserInfo(calendar_list);
    } else {
      //changeState(STATE_START);
    }
  }

  function populateUserInfo(calendar_list) {
    $('#displayCL').text (calendar_list);

    /*$('#calendar2').fullCalendar('addEventSource', {
      googleCalendarApiKey: "AIzaSyDA8nFAbRkMbc2E98hn2BRk2poTjwTZbVg",
      events: {
          googleCalendarId: "cktlorehbk3klqdv3a5m5gcl0s@group.calendar.google.com",
          color: 'yellow',   // an option!
          textColor: 'black' // an option!
      }
    });*/
    /*$('#calendar').fullCalendar({
        eventSources: [
          {
            googleCalendarApiKey: "AIzaSyDA8nFAbRkMbc2E98hn2BRk2poTjwTZbVg",
            googleCalendarId: "cktlorehbk3klqdv3a5m5gcl0s@group.calendar.google.com"
          }
          ]

    });*/
    /*$('#calendar2').fullCalendar('addEventSource', {

        googleCalendarId: "cktlorehbk3klqdv3a5m5gcl0s@group.calendar.google.com",
        color: 'yellow',   // an option!
        textColor: 'black' // an option!
    });*/

    console.log(calendar_list);
    //fetchImageBytes(calendar_list);
  }



}

var auth = new Auth();
