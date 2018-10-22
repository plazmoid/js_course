function isdigit(c) {return /\d/.test(c);}

fso = require('fs');

fso.readFile('code.txt', 'utf8', function(err, data) {
	if(err) throw err;

	var res = '';
	var last = data[0];
	var cnt = 0;

	for(var i = 0; i < data.length; i++) {
		if(isdigit(data[i])) {
			if(isdigit(data[i+1]))
				cnt = cnt*10 + +data[i];
			else {
				cnt = cnt*10 + +data[i]-1;
				res += data[i+1].repeat(cnt);
				cnt = 0;
			}
		} else
			res += data[i];
	}
	console.log(res);
	fso.writeFile('decode.txt', res, 'utf8', function(){});
})