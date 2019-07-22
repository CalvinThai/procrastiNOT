/** 
Session 
Class that keeps track of scheduled instances where the app should be active
*/

function Session(start_time, end_time, mode) {

	this.start_time = start_time.getTime();
	this.end_time = end_time.getTime();
	this.mode = mode;
	//If two session share the same start time, then they will be considered the same session and will share an id
	this.id = start_time.getTime();
	this.string = (start_time.toLocaleString() + " to " + end_time.toLocaleString());
	this.isActive = function (current_time) {
		if (false == current_time instanceof Date) {
			new Error("Session.isActive was given invalid date");
		}

		return (start_time <= current_time.getTime() && current_time.getTime() < end_time);
	};


}


/** 
Scheduler 
Class that keeps track of all sessions and which sessions should be active.
*/

function Scheduler(modeSessions, callback) {

	this.scheduled_sessions = [];
	this.active_sessions = [];
	this.callbacks = [];
}

//Adds a scheduled session to the scheduler, or replaces one with the same id if it exists
Scheduler.prototype.pushSession = function (session, callback) {
	if (this.checkIdInScheduler(session.id) != -1)
		this.scheduled_sessions[this.checkIdInScheduler(session.id)] = session;
	else
		this.scheduled_sessions.push(session);
	this.OnSchedulerChanged(callback);
};

//Return the index of the session if id exist in scheduled sessions, return -1 otherwise
Scheduler.prototype.checkIdInScheduler = function (id) {
	var x = -1;
	for (var i = 0; i < this.scheduled_sessions.length; i++) {
		if (this.scheduled_sessions[i].id == id)
			x = i;
	}
	return x;
};

//Listener copied over from blocklist and modfied for scheduler
Scheduler.prototype.AddOnSchedulerChangedListener = function (func) {
	this.callbacks.push(func);
	func(this.scheduled_sessions);
};

//OnChanged copied over from blocklist and modifed for scheduler
Scheduler.prototype.OnSchedulerChanged = function () {
	this.persistSessions();
	for (var x = 0; x < this.callbacks.length; x++) {
		this.callbacks[x](this.scheduled_sessions);
	}
}
//Removes a scheduled session to the scheduler if it exists
Scheduler.prototype.removeSession = function (session, callback) {
	for (var i = 0; i < this.scheduled_sessions.length; i++) {
		if (this.scheduled_sessions[i].id == session.id)
			this.scheduled_sessions.splice(i, 1);
	}
	this.OnSchedulerChanged(callback);
}

//Removes a scheduled session to the scheduler if it exists using index
Scheduler.prototype.removeSessionByIndex = function (idx, callback) {
	if (this.scheduled_sessions[idx] != undefined)
		this.scheduled_sessions.splice(idx, 1);
	this.OnSchedulerChanged(callback);
}

//Removes a scheduled session to the scheduler if it exists using session id
Scheduler.prototype.removeSessionById = function (id, callback) {
	for (var i = 0; i < this.scheduled_sessions.length; i++) {
		if (this.scheduled_sessions[i].id == id)
			this.scheduled_sessions.splice(i, 1);
	}
	this.OnSchedulerChanged(callback);
}

//Returns the list of sessions that are running at this time.
Scheduler.prototype.getActiveSessions = function () {
	return this.active_sessions;
}

//Clear localstorage of all session data
Scheduler.prototype.clearSavedSessions = function () {
	this.scheduled_sessions = [];
	this.active_sessions = [];
	localStorage.setItem("sessions", JSON.stringify([]));
	this.OnSchedulerChanged();
}

//Save the JSON object as a string everytime it's modified.
Scheduler.prototype.persistSessions = function (callback) {
	localStorage.setItem("sessions", JSON.stringify(this.scheduled_sessions));
}

//Try to check if previous sessions have been stored in storage.
Scheduler.prototype.loadSessions = function (session, callback) {
	unmodifiedSessions = JSON.parse(localStorage.getItem("sessions"));
	if(unmodifiedSessions === null || unmodifiedSessions === undefined)
		return;
	if (this.scheduled_sessions == null) {
		this.scheduled_sessions = [];
		this.active_sessions = [];
	}
	else {
		for (var i = 0; i < unmodifiedSessions.length; i++) {
			this.pushSession(new Session(new Date(unmodifiedSessions[i].start_time), new Date(unmodifiedSessions[i].end_time), unmodifiedSessions[i].mode));
		}
	}
};

//Updates active_sessions to be the sessions that should be active at a certain time period.
Scheduler.prototype.updateActiveSessions = function (date, callback) {

	if (false == (date instanceof Date))
		new Error("Invalid date given to Scheduler at updateSessions function");
	this.active_sessions = [];
	//Iterate through scheduled sessions and let active_sessions be the set of sessions active with the current date.
	for (var i = 0; i < this.scheduled_sessions.length; i++) {
		if (this.scheduled_sessions[i].isActive(date)) {
			this.active_sessions.push(this.scheduled_sessions[i]);
		}
	}
	//this.OnSchedulerChanged(callback);
}

master_scheduler = new Scheduler();
master_scheduler.loadSessions();