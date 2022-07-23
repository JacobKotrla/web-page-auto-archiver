var URLs = [];
var archivedURLs = [];
var failedURLs = [];
var requestProcessing = false;
function finishRequest() {
	archivedURLs.push(URLs[0]);
	URLs.shift();
	requestProcessing = false;
}
function archiveURL(url) {
	requestProcessing = true;
	var headers = new Headers();
	var init = {
		method: 'GET',
		headers: headers,
		mode: 'cors',
		cache: 'default'
	};
	var request = new Request('https://web.archive.org/save/' + url, init);
	console.log('request sent');
	console.log(request);
	fetch(request).then(finishRequest());
}


chrome.tabs.onCreated.addListener(function(tab) {
	if (tab.url) {
		URLs.push(tab.url);
		//archiveURL(tab.url);
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.url) {
		URLs.push(changeInfo.url);
		//archiveURL(changeInfo.url);
	}
});

setInterval(function() {
	if (requestProcessing === false) {
		console.log("No requests are being processed.");
		if (URLs[0]) {
			console.log("URLs Present, begining archival of oldest URL, " + URLs[0]);
			archiveURL(URLs[0]);
		} else {
			console.log("No URLs Present");
		}
	} else {
		console.log("There is already a request processing.");
	}
}, 2000);
