
const http = require('http');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const Buffer = require('buffer').Buffer;

const hostname = '127.0.0.1';
const port = 3000;
const root = __dirname;
const imgtype = 'landslide';
const imgdir = `../${imgtype}/`;
const server = http.createServer((req, res) => {
	route(req.url, res);
	
});

server.listen(port, hostname, () => {
	init();
	console.log(`Server running at http://${hostname}:${port}/`);
});

var files = [];
var cur = 0;
function init(){	
	let imgPath = path.join(root, imgtype); 	
	fs.readdir(imgPath, (err, filelist)=>{
		files = filelist;
	});	
}

//route
function route(url, res){	
	//根据url 转入不同的处理函数
	if(url.includes('index')){		
		index(res);
	}
	else if(url.includes('curr')){
		curr(res);
	}
	else if(url.includes('prev')){
		prev(res);
	}
	else if(url.includes('next')){
		next(res);
	}
	else if(url.includes('tag')){
		saveTag(res, url);
	}
	else if(url.includes(imgtype)){
		showImg(res, url);
	}
	else index(res);
}

function index(res){
	fs.readFile('index.html', (err, content)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');	
		res.write(content);
		res.end();
	});	
}

function curr(res){
	//当前图片	
	let f = files[cur];
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');	
	res.write(path.join(imgdir, f));
	res.end();	
}

function prev(res){
	//上一张图片
	if(cur > 0) cur--;
	let f = files[cur];
	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');	
	res.write(path.join(imgdir, f));
	res.end();	
}

function next(res){
	//下一张图片
	if(cur < (files.length - 1)) cur++;
	let f = files[cur];
	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');	
	res.write(path.join(imgdir, f));
	res.end();
}

function saveTag(res, url){
	//保存标记
	//解析标记参数
	url = url.substring(url.indexOf('?') + 1, url.length);
	
	let params = querystring.parse(url);
	let f = files[cur];
	
	let imageFolder = imgtype;
	let imageName = f;
	let w = params.w;
	let h = params.h;
	let objectType = imgtype;
	let pos = JSON.parse(params.pos);
	let objs = '';
	pos.forEach((p)=>{
		let l = p.l;
		let t = p.t;
		let ml = p.ml;
		let mt = p.mt;		
		objs = objs + `<object>
		<name>${objectType}</name>
		<pose>Unspecified</pose>
		<truncated>1</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>${l}</xmin>
			<ymin>${t}</ymin>
			<xmax>${ml}</xmax>
			<ymax>${mt}</ymax>
		</bndbox>
	</object>`;
	});
	let xml = 
`<annotation>
	<folder>${imageFolder}</folder>
	<filename>${imageName}</filename>
	<source>
		<database>Unknown</database>		
	</source>
	<size>
		<width>${w}</width>
		<height>${h}</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>
	${objs}
</annotation>`;	
	let xmlFileName = imageName.replace('jpg', 'xml');
	appendToFileList(xmlFileName, xml);
	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end();
}

function appendToFileList(xmlFileName, xmlContent){
	//添加到文件列表
	
	fs.appendFileSync(path.join(root, 'voc', imgtype, xmlFileName), xmlContent);	
}

function showImg(res, url){
	let f = url;
	
	fs.readFile(path.join(root, f), 'binary', (err, content)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'image/jpeg');	
		res.write(content, "binary");
		res.end();
	});
	
}
