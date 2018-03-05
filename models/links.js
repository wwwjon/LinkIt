var links = [];
var index = 1;

function  createNewLink(title, url, sender, date )
{
    links.push({id: index, title: title, url: encodeURI(url), ranking: 0, sender: sender, date: date});
    index++;
}

function getAllLinks(){
    return links;
}

function getLink(id){
	for (var i = 0; i < links.length; i++) {
		if (links[i].id === id) {
			return links[i];
		}
	}
	return null;
}

function deleteLink(id){
	for (var i = 0; i < links.length; i++) {
		if (links[i].id === id) {
			links.splice(i, 1);
		}
	}
}

module.exports = {createNewLink : createNewLink, getAllLinks : getAllLinks, getLink : getLink, deleteLink : deleteLink };
