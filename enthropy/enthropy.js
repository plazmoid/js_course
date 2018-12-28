function getBaseLog(x, y) {
  return x > 1 ? Math.log(y) / Math.log(x) : 0;
}

var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

var alph = [];
rl.on('line', function (line) {
	for(var s in line) {
		s = line[s];
		if(alph[s])
			alph[s]++;
		else
			alph[s] = 1;
	}
	var ln_len = line.length;
	var alph_len = Object.keys(alph).length;
	var sum = 0;
	for(var k in alph) {
		sum += (alph[k]/ln_len) * getBaseLog(alph_len, alph[k]/ln_len);
		console.log(k, alph[k]/ln_len);
	}
	sum = -sum;
	console.log(sum);
	rl.close();
});