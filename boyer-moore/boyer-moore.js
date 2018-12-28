
var fso = require('fs');
//var alph = 'abcdefghijklmnopqrtsuvwxyz'

function boyer_moore_horspool(raw, templ) {
	var indexes = [];
	var stop_table = {};
	var t_len = templ.length;
	var start_offset = 0;
	var curr_substr = '';
	for(var i = 0; i < t_len - 1; i++) {
		stop_table[templ[i]] = t_len - i - 1;
	}
	//console.log(stop_table);
	while(true) {
		curr_substr = raw.substr(start_offset, t_len);
		//console.log(curr_substr, start_offset, t_len);
		if(curr_substr === templ)
			indexes.push(start_offset)
		if(start_offset + t_len > raw.length)
			break
		lsymb = curr_substr[curr_substr.length-1]
		start_offset += stop_table[lsymb]? stop_table[lsymb] : t_len;
	}
	return indexes
}

function boyer_moore(raw, templ) {
	m = templ.length
	n = raw.length;
	indexes = []
	suffshift = new Array()
	z = new Array()
	StopTable = new Array()
	maxZidx = 0
	maxZ = 0;
	
	for(var i = 0; i < m - 1; i++) {
		StopTable[templ[i]] = m - i - 1;
	}
	
	for (var j = 0; j <=m; j++) {
		z[j]=0;
		suffshift[j]=m;
	}

	for (var j = 1; j < m; j++) {
	   if (j <= maxZ) 
		   z[j] = Math.min(maxZ - j + 1, z[j - maxZidx]);
	   while (j + z[j] < m && templ.charAt(m - 1 - z[j]) == templ.charAt(m - 1 - (j + z[j]))) 
		   z[j]++;
	   if (j + z[j] - 1 > maxZ) {
		   maxZidx = j;
		   maxZ = j + z[j] - 1;
	   }
	}
	
	for (var j = m - 1; j > 0; j--) suffshift[m - z[j]] = j;  // цикл №1
	
	r = 0;
	for (var j = 1;  j <= m - 1; j++)  // цикл №2
		if ((j + z[j]) == m)
			for( ; r <= j; r++)
				if (suffshift[r] == m) suffshift[r] = j;
	
	var j, bound = 0; //всегда либо bound = 0, либо bound = m - suffshift[0]
	for (var i = 0; i <= n - m;) {
		for (j = m - 1; j >= bound && raw[j] == templ[i + j]; j--);
			if (j < bound) {
				indexes.push(i);
				bound = m - suffshift[0];
				j = -1; //установить j так, как будто мы прочитали весь шаблон s, а не только до границы bound
			} else {
				bound = 0;
			}
		if (j < bound) i += suffshift[j+1]; 
		  	else i += Math.max(suffshift[j+1], j - StopTable[templ[i + j]]);
	}
	return indexes;
}

module.exports = {
		boyer_moore_horspool:boyer_moore_horspool
}

if (require.main === module) {
	fso.readFile('../shrd_input.txt', 'utf8', function(err, data) {
		if(err) throw err;
		
		var s = data.split('\n');
		console.log(timeit(boyer_moore_horspool, s[0], s[1]));
	});
}