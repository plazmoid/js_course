var fso = require('fs');
var auto = require('./automata/pi.js');
var subs = require('./substring/substr.js');
var bm = require('./boyer-moore/boyer-moore.js');

function timeit(fun, ...args) {
	 var start = Date.now();
	 var res = fun(...args);
	 console.log(res, Date.now() - start);
}

fso.readFile('shrd_input.txt', 'utf8', function(err, data) {
	data = data.split('\n');
	var s = data[0];
	var t = data[1];
	timeit(subs.bruteforce, s, t);
	timeit(subs.brutehash, s, t);
	timeit(subs.brute_rabin, s, t);
	timeit(auto.pi, t + "&" + s, t.length);
	timeit(auto.morris_pratt, s, t);
	timeit(auto.automata, s, t);
	timeit(bm.boyer_moore_horspool, s, t);
});