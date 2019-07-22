/**
Notification
Creates and has a function that shows the notification window when called
*/

NotificationWindow = function() {
	
	this.n_window = {
		type: "basic",
		title: "Hey! Get back to work!",
		message: "It is currently time for you to work. Please stay on task.",
		iconUrl: "../notification-image.jpg"
	};
	
	this.showNotification = function() {
		chrome.notifications.create(this.n_window);
	};
}

notification_window = new NotificationWindow();