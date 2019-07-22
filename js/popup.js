//Open Scheduler
/*
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("toggle").addEventListener("click", function(){
    window.open("options.html", "_self", false);
  })
})
*/

//Open Blocklist in popup
$(document).ready(function(){
  $("#blocklist").click(function(){
    window.open("blocklist.html", "_self", false);
  });

  //Display list of blocked sites
  var sitesList = $("#sitesList");
  blockedSites = block_list.getBlockedSites();
  for(var i = 0; i < blockedSites.length; i++){
    var site = $('<li/>')
      .text(blockedSites[i])
      .appendTo("#sitesList")
  }

  $("#editlist").click(function(){
    window.open("options.html");
  });

});

/*
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("blocklist").addEventListener("click", function(){
    var website1 = {
			'url': 'www.reddit.com',
			'blocked': "no",
			id: 0
		};
	var website2 = {
			'url': 'www.4chan.com',
			'blocked': "yes",
			id: 1
	};
	var value = JSON.stringify(website1);
	var key = website1.id;
	var value2 = JSON.stringify(website2);
	var key2 = website2.id;

	localStorage.setItem(key, value);
	localStorage.setItem(key2, value2);
	window.open("blocklist.html", "_self", false);
  })
})

//Refresh and load blocklist on blocklist.html
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("refreshlist").addEventListener("click", function(){
    document.getElementById('checklist').innerHTML = "";

	for(var i = 0; i < localStorage.length; i++) {
		var obj = localStorage.getItem(i);
		obj = JSON.parse(obj);
		var container = document.getElementById('checklist');
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.name = obj.url;
		checkbox.value = obj.url;
		checkbox.id = obj.id;
		if (obj.blocked == "yes"){
			checkbox.checked = "checked";
		}


		var label = document.createElement('label')
		label.htmlFor = obj.id;
		label.appendChild(document.createTextNode(obj.url));
		var br = document.createElement("br");
		container.appendChild(checkbox);
		container.appendChild(label);

		container.appendChild(br);
	}

  })
})
*/
