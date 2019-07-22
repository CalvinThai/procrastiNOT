chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	block_list = new BlockList();
	block_list.loadBlockedSites();
	master_scheduler = new Scheduler();
	master_scheduler.loadSessions();
	master_scheduler.updateActiveSessions(new Date());
	mode_manager = new ModeManager();
	mode_manager.loadModes();
	if(changeInfo.url){
		var active_session = master_scheduler.getActiveSessions();
		if(active_session.length >0){
			for (var x = 0; x < active_session.length; x++){
				if (active_session[x].mode == "Default"){
					if(block_list.isBlocked(changeInfo.url)){
						notification_window.showNotification();														
						chrome.tabs.update(tab.id, {url: "pages/blocker.html"});
					}
				}
				else{				
					var sessionmode = mode_manager.findMode(active_session[x].mode);
					if(sessionmode.returnType()=="Block"){
						for(var i=0; i<sessionmode.selected_urls.length; i++){
							if(block_list.urlInBlocklist(sessionmode.selected_urls[i], changeInfo.url)){
								notification_window.showNotification();																
								chrome.tabs.update(tab.id, {url: "pages/blocker.html"});
							}
						}
					}else if(sessionmode.returnType()=="Redirect"){
						var redirect_url = sessionmode.returnRedirectURL();
						for(var i=0; i<sessionmode.selected_urls.length; i++){
							if(block_list.urlInBlocklist(sessionmode.selected_urls[i], changeInfo.url)){
								notification_window.showNotification();
								chrome.tabs.update(tab.id, {url: redirect_url});
							}
						}
					}else if(sessionmode.returnType()=="Whitelist"){
						var found = false;
						for(var i=0; i<sessionmode.selected_urls.length; i++){
							if((block_list.urlInBlocklist(sessionmode.selected_urls[i], changeInfo.url))){
								found = true;
							}
						}
						if (found == false){
							if(changeInfo.url.substring(0,16)!="chrome-extension")
								notification_window.showNotification();								
								chrome.tabs.update(tab.id, {url: "pages/blocker.html"});
						}
					}
				}
			}
		}
   			
	}
}); 