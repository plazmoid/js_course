var fso = require('fs');

fso.readFile('input.txt', 'utf8', function(err, data) {
	if(err) throw err;

	var res = '';
	var cnt = 1;
	var fs_len = data.length;
	var last = data[0];

	for(var i = 1; i < data.length; i++) {
		if(data[i] === last)
			cnt++;
		else {
			if(cnt > 1) {
				res += cnt+last;
				cnt = 1;
			} else
				res += last;
			last = data[i];
		}
	}
	res += cnt > 1? cnt+last : last;
	console.log('Coeff: '+fs_len/res.length);
	fso.writeFile('code.txt', res, 'utf8', function() {});
})