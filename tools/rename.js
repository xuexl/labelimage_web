
const path = require('path');
const fs = require('fs');
const root = __dirname;

const imgtype = 'landslide';
let imgPath = path.join(root, '../', imgtype); 
fs.readdir(imgPath, (err, filelist)=>{
	filelist.forEach((f, i)=>{
		//fs.copyFile(path.join(imgPath, f), path.join(imgPath, f.replace('yundongxie', imgtype)), (err)=>{});		
		fs.copyFile(path.join(imgPath, f), path.join(imgPath, imgtype, imgtype + '_google_' + i + '.jpg'), (err)=>{});		
	});	
});	
