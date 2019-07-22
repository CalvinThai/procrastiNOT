function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

/**
BlockList
Class that keeps track of all the sites set to be blocked.
*/

BlockList = function(){

	this.blockedSites = [];
	this.callbacks = [];

	//Adds a blocked site to the list at the given index.
	this.updateBlockedSite = function(string, index){

		if(index > this.blockedSites.length){
			return "Index is invalid";
		}

		if(!this.validURL(string)){
			return "Website url is invalid!";
		}

		if(this.blockedSites.indexOf(string) != -1){
			return "Already in list";
		}

		string = this.cleanUrlString(string);

		if(index == undefined || index == this.blockedSites.length){
			this.blockedSites.push(string);
		} else {
			this.blockedSites[index] = string;
		}
		this.OnBlocklistChanged();
		return "Successfully added url to blocklist!";
	};

	this.removeBlockedSiteByString = function(string){
		remove(this.blockedSites, string);
		this.OnBlocklistChanged();
	}

	//Returns the list of blocked sites
	this.getBlockedSites = function(){
		return this.blockedSites;
	}

	//Saves the blocked site data using chrome storage.
	this.save = function(callback){
		localStorage.setItem("blockedSites", JSON.stringify(this.blockedSites));
	}

	//Checks if the string is in the block list.
	this.isBlocked = function(string){
		for(var x=0; x<this.blockedSites.length; x++){
			if(this.urlInBlocklist(this.blockedSites[x], string)){
				return true;
			}
		}
		return false;
	}

	//Retrives blocked site settings from chrome storage
	this.loadBlockedSites = function(){
		this.blockedSites = JSON.parse(localStorage.getItem("blockedSites"));
		if(this.blockedSites == null)
			this.blockedSites = [];
	};

	this.AddOnBlocklistChangedListener = function(func){
		this.callbacks.push(func);
		func(this.blockedSites);
	};

	this.OnBlocklistChanged = function(){
		this.save();
		for(var x=0; x<this.callbacks.length; x++){
			this.callbacks[x](this.blockedSites);
		}
	}

}

BlockList.prototype.cleanUrlString = function(str){

	return str.replace(/(http:\/\/|https:\/\/)?(www\.)?/i,"");

};

//Checks if the input is a valid URL:
//Credit to Daveo @ https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
BlockList.prototype.validURL = function(str){
	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);

	return str.match(regex);
};

//Return true if str is a url that should be blocked based off the fact that url is in the blocklist.
BlockList.prototype.urlInBlocklist = function(url, str){

    url = url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    url += "(?:(?:\\/|\\?).*|$)";

    str = str.replace(/(http:\/\/|https:\/\/)?(www\.)?/i,"");
    var re = new RegExp(url);
    return re.test(str);
};

block_list = new BlockList();
block_list.loadBlockedSites();
