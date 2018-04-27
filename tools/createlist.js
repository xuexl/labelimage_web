const path = require('path');
const fs = require('fs');
const root = __dirname;

const imgtype = 'sportshoe';
let imgPath = path.join(root, '../', imgtype); 
fs.readdir(imgPath, (err, filelist)=>{
	let ls = '';
	filelist.forEach((f, i)=>{
		ls = ls + '\r\n' + f;
	});
	if(ls.length) ls = ls.replace('\r\n','');
	fs.appendFile(path.join(imgPath, 'ls.txt'), ls, (err)=>{});
});
