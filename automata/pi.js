var fso = require('fs');

function get_pi(t) {
	var k = 0;
	var ln = t.length;
	var pi = new Array(ln);
	pi[0] = 0;
	
	for(var i = 1; i < ln; i++) {
		while((k > 0) && (t[k] !== t[i]))
			k = pi[k-1];
		if (t[k] === t[i])
			k++;
		pi[i] = k;
	}
	return pi;
}

function pi(t, t_len) {	
	var indexes = new Array();
	var i = 0;
	var pi = get_pi(t);
	while(true) {
		i = pi.indexOf(t_len, i);
		if(i === -1) {
			break
		}
		indexes.push(i++ - 2*t_len);
	}
	return indexes;
}

function morris_pratt(s, t) {
	var pi = get_pi(t);
	var n = s.length, m = t.length;
	var i = 0, j = 0;
	var indexes = [];
	while(i < n) {
		while(j > 0 && s[i] !== t[j])
			j = pi[j-1]
		if(s[i] === t[j])
			j++
		if(j == m) {
			indexes.push(i - m + 1);
			j = pi[j-1]
		}
		i++;
	}
	return indexes;
}

function automata(s, t) {
	var m = t.length
	var alph = new Array()
	var del = new Array(m+1);
	var indexes = [];
	
	for(i=0; i < m; i++)
		alph[t.charAt(i)] = 0
	for(j = 0; j <= m; j++)
		del[j] = new Array(alph.length)
	for(i in alph)
		del[0][i] = 0
	for(j = 0; j < m; j++) {
		prev = del[j][t.charAt(j)]
		del[j][t.charAt(j)] = j + 1
		for(i in alph)
			del[j+1][i] = del[prev][i]
	}
	//for(var i of del)  console.log(i);
	var state = 0;
	for(var i in s) {
		state = del[state][s.charAt(i)] || 0;
		if(state === m)
			indexes.push(i - (m - 1));
	}
	return indexes;
}

fso.readFile('../shrd_input.txt', 'utf8', function(err, data) {
	data = data.split('\n');
	var s = data[0];
	var t = data[1];
	console.log(morris_pratt(s, t));
	//console.log(automata(s, t));
	//console.log(pi(t + "&" + s, t.length));
});