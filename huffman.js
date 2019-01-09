var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

function encode(line) {
	var alph = [], tree = [];
	for(var i of line) {
		alph[i] = (typeof alph[i] === 'undefined')? 1 : alph[i] + 1; //считаем вхождения каждого символа
	}
	for(var i of Object.keys(alph)) { //листья дерева
		tree.push({'symbol': i, 'count': alph[i]})
	}
	console.log(tree)

	var findMinPair = function() { //находим пару с минимальной суммой весов
		var i_min = 0, val_min = 999999, sum = 0;
		for(var i = 0; i < tree.length - 1; i++) {
			sum = tree[i]['count'] + tree[i+1]['count'];
			if(sum < val_min) {
				val_min = sum;
				i_min = i;
			}
		}
		return i_min;
	};
	
	while(tree.length > 1) { //строим дерево
		var i_min = findMinPair();
		var new_node = {
			//'symbol': '', //tree[i_min]['symbol'] + tree[i_min+1]['symbol'], 
			'count': tree[i_min]['count'] + tree[i_min+1]['count'],
			'0': tree[i_min],
			'1': tree[i_min+1]
		}
		tree.splice(i_min, 2, new_node)
		tree.sort((a, b) => a['count'] - b['count'])
		console.log(tree)
	}
	
	var curr_code = [];
	var res = {};
	
	var genBin = function(el) { //кодируем каждый символ, рекурсивно проходя по дереву
		if(typeof el['symbol'] !== 'undefined')
			res[el['symbol']] =  curr_code.join('')
		else
			for(var i of ['0', '1']) {
				curr_code.push(i);
				genBin(el[i]);
				curr_code.pop(i);
			}
	}
	genBin(tree[0])
	
	var enc_str = []
	for(var i of line) // кодируем строку
		enc_str.push(res[i])
	return JSON.stringify(res) + enc_str.join('');
}

function decode(estr) {
	var sep = estr.indexOf('}')+1
	var decoder = {}, tree = JSON.parse(estr.substring(0, sep));
	Object.keys(tree).forEach((k) => {decoder[tree[k]] = k}) // свапаем ключи и значения
	var res = '', tmp = ''
	for(var i of estr.substring(sep)) {
		tmp += i
		if(typeof decoder[tmp] !== 'undefined') {
			res += decoder[tmp];
			tmp = ''
		}
	}
	return res
}

rl.on('line', function (line) {
	var l = encode(line);
	console.log(l)
	console.log(decode(l))
});
