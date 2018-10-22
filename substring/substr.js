var fso = require('fs');


function hashcode(str) {
	return str.split('').reduce(function(a, b) {return a + b.charCodeAt(0)}, 0);
}

function rabin_carp_hash(str) {
	var strlen = str.length;
	return str.split('').reduce(function(a, b) {return a + (b.charCodeAt(0) * Math.pow(2, strlen - str.indexOf(b)))}, 0);
}

function if_substr(str, ptrn) {
	if(str.length < ptrn.length) return false;
	for(var i = 0; i < ptrn.length; i++)
		if(str[i] !== ptrn[i]) return false;
	return true;
}

function bruteforce(str, ptrn) {
	var indexes = [];
	var ptrn_len = ptrn.length;
	for(var i = 0; i < str.length - ptrn_len + 1; i++) {
		if(if_substr(str.substring(i, i + ptrn_len), ptrn))
			indexes.push(i + 1);
	}	
	return indexes;
}

function brutehash(str, ptrn, hashfunc) {
	var curstr;
	var indexes = [];
	var ptrn_len = ptrn.length;
	var ptrn_hash = hashfunc(ptrn);
	for(var i = 0; i < str.length - ptrn_len + 1; i++) {
		curstr = str.substring(i, i + ptrn_len);
		if(hashfunc(curstr) === ptrn_hash)
			if(if_substr(curstr, ptrn))
				indexes.push(i + 1);
	}	
	return indexes;
}


fso.readFile('input.txt', 'utf8', function(err, data) {
	data = data.split('\n');
	var s = data[0];
	var t = data[1];
	console.log(bruteforce(s, t));
	console.log(brutehash(s, t, hashcode));
	console.log(brutehash(s, t, rabin_carp_hash));
});
