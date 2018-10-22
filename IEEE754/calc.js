function isdigit(c) {return /\d/.test(c);}

function zeropadding(num, zcnt=32) {
	return '0'.repeat(zcnt > num.length? zcnt - num.length : 0) + num;
}

function to_string(num) {
	var res = zeropadding(num.toString(2));
	var unres = from_I3E754(num);
	for (var i of [1, 10]) {
		res = res.slice(0, i) + ' ' + res.slice(i);
	}
	return unres.real_val.toFixed(4) + ' = ' + res;	
}

function to_I3E754(num) {
	if(typeof num === 'number') {
		var sgn = +(num < 0);
		num = Math.abs(num);
		var exp = Math.floor(Math.log2(num));
		var mnt = num / Math.pow(2, exp);
		return sgn << 31 | (exp + 127) << 23 | ((mnt * (1 << 23)) & 0x7FFFFF);
	} else 
		return num.sgn << 31 | num.exp << 23 | num.mnt;
}

function from_I3E754(num) {
	var result = [];
	result.stored_val = num;
	result.sgn = num >> 31;
	result.exp = (num >> 23) & 0xFF;
	result.mnt = num & 0x7FFFFF;
	if(result.exp == 0 && result.mnt == 0)
		result.real_val = 0;
	else
		result.real_val = (result.sgn ? -1 : 1) * Math.pow(2, result.exp-127) * (result.mnt / Math.pow(2, 23) + 1);
	return result;
}

function f_operation(num1, num2, op) {
	num1 = from_I3E754(num1);
	num2 = from_I3E754(num2);
	num1.mnt |= 0x800000; //денормализуем
	num2.mnt |= 0x800000;
	var result = from_I3E754(0);
	var dif = num1.exp - num2.exp;
	
	var exp_mnt_padding = function(num, rng) {
		num.exp += rng;
		(rng > 0) ? num.mnt >>= rng : num.mnt <<= -rng;
	}
	
	var normalize = function(num) { //нормализуем
		var offset = num.mnt.toString(2).length - 24;
		exp_mnt_padding(num, offset);
		num.mnt &= 0x7FFFFF;
	}

	if(dif) exp_mnt_padding((dif > 0) ? num2 : num1, Math.abs(dif)); //выравниваем
	result.exp = num1.exp;
	
	if(op == '-') {
		if((num1.exp < num2.exp) || ((num1.exp == num2.exp) && (num1.mnt < num2.mnt))) { //меньше ли уменьшаемое вычитаемого
			num1.mnt = -num1.mnt;
			result.sgn = 1;
		} else
			num2.mnt = -num2.mnt;
	}
	result.mnt = num1.mnt + num2.mnt;
	normalize(result);
	return to_I3E754(result);
}

function parse_(f) {
	var res = to_I3E754(f);
	console.log(to_string(res));
	return res;
}

function tests() {
	var a = 5.31337, //num1
		b = 2.1488, //num2
		c, //answer
		fc = 0, //fails counter
		s, //real answer
		pres = 2, //presicion
		mod = 100.1, //modulus
		op = '-', //operation
		total = 800, //tests amount
		msg;
	
	b *= op == '-' ? -1 : 1;
	for(var i = 0; i < total; i++) {
		c = from_I3E754(f_operation(to_I3E754(a), to_I3E754(b), op)).real_val.toFixed(pres);
		s = (a+b).toFixed(pres);
		if(s !== c) {
			msg = 'wrong';
			fc += 1;
		} else 
			msg = 'right';
		if(msg == 'wrong')
			console.log(i, msg+': ' + a.toFixed(pres) + op +Math.abs(b).toFixed(pres) +' = '+c + ', must be ' + s);
		a = a*2 % mod;
		b = b*3 % mod;
	}
	console.log('Tests failed:', fc, 'of', total);
}


//tests();/*
var fso = require('fs');

fso.readFile('input.txt', 'utf8', function(err, data) {
	if(err) throw err;

	var fl1 = '', fl2 = '', op;
	for(var c of data) {
		if(isdigit(c) || c == '.') {
			if(!op)
				fl1 += c;
			else
				fl2 += c;
		} else if(c == '+' || c == '-')
			op = c;
	}
	fl1 = parse_(parseFloat(fl1));
	console.log(op);
	fl2 = parse_(parseFloat(fl2));
	console.log('=');
	var sum = f_operation(fl1, fl2, op);
	console.log(to_string(sum));

	//fso.writeFile('code.txt', res, 'utf8', function() {});
});//*/

