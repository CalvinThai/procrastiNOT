function Mode(selected_urls, parameters) {
    this.parameters = parameters;
  
    this.selected_urls = selected_urls;
    //"Block" if block, "Redirect" if redirect, "Whitelist" if whitelist
    this.option = parameters[0];
    //string for which website to redirect to
    this.redirectUrl = parameters[1];
    this.modeName = parameters[2];
    this.returnType = function () {
      return this.option;
    };
    this.returnRedirectURL = function () {
      return this.redirectUrl;
    };
    this.returnName = function () {
      return this.modeName;
    };
}

function ModeManager(modeSessions, callback) {
    this.modes = [];
    this.callbacks = [];
  }
  
  //Adds a scheduled session to the scheduler, or replaces one with the same id if it exists
  ModeManager.prototype.pushMode = function (mode, callback) {
    for (var i = 0; i < this.modes.length; i++) {
      if (this.modes[i].modeName == mode.modeName){
        alert("Name already exist!!!");
        console.log("returning 0");
        return 0;
      } 
    }
    this.modes.push(mode);
    console.log("calling from push");
    
    this.OnModeChanged(callback);
  };
  
  //Listener copied over from blocklist and modfied for scheduler
  ModeManager.prototype.AddOnModeChangedListener = function (func) {
    this.callbacks.push(func);
    func(this.modes);
  };
  
  //OnChanged copied over from blocklist and modifed for scheduler
  ModeManager.prototype.OnModeChanged = function () {
    console.log("log changed");
    this.persistModes();
    for (var x = 0; x < this.callbacks.length; x++) {
      this.callbacks[x](this.modes);
    }
  }
  //Removes a scheduled session to the scheduler if it exists
  ModeManager.prototype.removeMode = function (modeName, callback) {
    var newmodeslist = [];
    for (var i = 0; i < this.modes.length; i++) {
      if (this.modes[i].modeName != modeName)
        newmodeslist.push(this.modes[i]);
    }
    this.modes = newmodeslist;
    this.OnModeChanged(callback);
  }
  
  //Removes a scheduled session to the scheduler if it exists using index
  ModeManager.prototype.removeModeByIndex = function (idx, callback) {
    if (this.modes[idx] != undefined)
      this.modes.splice(idx, 1);
    this.OnModeChanged(callback);
  }
  
  
  //Returns the list of sessions that are running at this time.
  ModeManager.prototype.getModes = function () {
    return this.modes;
  }

  //Returns the list of sessions that are running at this time.
  ModeManager.prototype.findMode = function (modeName) {
    for(var x = 0; x < this.modes.length;x++){
      if (this.modes[x].modeName == modeName){
        return this.modes[x];
      }
    }
  }
  
  //Clear localstorage of all mode data
  ModeManager.prototype.clearSavedModes = function () {
    this.modes = [];
    localStorage.setItem("modes", JSON.stringify([]));
    this.OnModeChanged();
  }
  
  //Save the JSON object as a string everytime it's modified.
  ModeManager.prototype.persistModes = function (callback) {
    localStorage.setItem("modes", JSON.stringify(this.modes));
  }
  
  //Try to check if previous modes have been stored in storage.
  ModeManager.prototype.loadModes = function (mode, callback) {
    unmodifiedModes = JSON.parse(localStorage.getItem("modes"));
    if(unmodifiedModes === null || unmodifiedModes === undefined)
      return;
    if (this.modes == null) {
      this.modes = [];
    }
    else {
      for (var i = 0; i < unmodifiedModes.length; i++) {
        this.pushMode(new Mode(unmodifiedModes[i].selected_urls,unmodifiedModes[i].parameters));
      }
    }
  };
  
  mode_manager = new ModeManager();
  mode_manager.loadModes();