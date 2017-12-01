/*
	unfortunately, ES6 is not supported on TR platforms
*/
const types = {
	hidden: 1, text: 1, textarea: 1, file: 1
};
	
const submit = data => {
	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if(xhr.status === 200) {
				res({data:xhr.response});
			}else {
				rej({error:"System error!"});
			}
		};
		xhr.onerror = () => {
			rej({error:"System error!"});
		};
	xhr.open("post", `/adb/${data.action}`, true);
		if(data.formData) {
			let boundary = "---------------------------" + Date.now().toString(16);
			xhr.setRequestHeader("Content-Type", `${data.contentType}; boundary=${boundary}`);
			xhr.send(`--${boundary}
${data.requestData.join(`--${boundary}
`)}--${boundary}--
`);
		}else {
			xhr.setRequestHeader("Content-Type", data.contentType);
			xhr.responseType = "json";
			xhr.send(data.requestData.join("&"));
		}
	});
};

const checkStatus = data => {
    if(data.status > 0) { return; }
	submit(data).then(result => { 
		console.log(result);
	}).catch(reason => {
		data.objects.onAddMessage(reason.error);
		data.objects.onAddMessageFlag('error');
	});
};

const pushFile = e => {
	let obj = e.target;
	obj.owner.requestData[obj.fileIndex] += `${obj.result}
`;
	obj.owner.status--;
	checkStatus(obj.owner);
};

/*
	only allows post method and the enctype of either application/x-www-form-urlencoded (default) or multipart/form-data
*/
const Http = {
	Post: (f, o) => {
		let [formData, contentType] = (f.enctype && f.enctype === 'multipart/form-data') ? [true, f.enctype] : [false, 'application/x-www-form-urlencoded'];
		let data = { status: 0, requestData: [], formData: formData, contentType: contentType, script: f.action, objects: o };
		for(let elem of Array.from(f.elements).filter(e => e.type.toLowerCase() in types)) {
			if(elem.type.toLowerCase() === 'file') {
				if(elem.files.length > 0) {
					let file = elem.files[0];
					let reader = new FileReader();
					reader.fileIndex = data.requestData.length;
					reader.owner = data;
					reader.onload = pushFile;
					data.requestData.push(
`Content-Disposition: form-data; name="${elem.name}"; filename="${file.name}"
Content-Type: ${file.type}

`
					);
					data.status++;
					reader.readAsDataURL(file);
				}
			}else {
				// regular input or textarea fields
				data.requestData.push(
					formData ? `Content-Disposition: form-data; name="${elem.name}"

${elem.value}
` : `${escape(elem.name)}=${escape(elem.value)}`
				);
			}
		}
		checkStatus(data);
	},
	
	Request: f => {
		let segments = [];
		for(let elem of Array.from(f.elements).filter(e => e.type.toLowerCase() in types)) {
			segments.push(`${escape(elem.name)}=${escape(elem.value)}`);
		}
		return new Promise((res, rej) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = () => {
				if(xhr.status === 200) {
					res({data:xhr.response});
				}else {
					rej({error:"System error in box!"});
				}
			};
			xhr.onerror = () => {
				rej({error:"System error in box!"});
			};
		xhr.open("post", `/adb/${f.action}`, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.responseType = "json";
			xhr.send(segments.join("&"));
		});
	},
	
	Fetch: (d, s) => {
		let segments = [];
		for(let k in d) {
			segments.push(`${escape(k)}=${escape(d[k])}`);
		}
		return new Promise((res, rej) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = () => {
				if(xhr.status === 200) {
					res({data:xhr.response});
				}else {
					rej({error:"System error in fetch!"});
				}
			};
			xhr.onerror = () => {
				rej({error:"System error in fetch!"});
			};
			xhr.open("post", `/adb/${s}`, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.responseType = "json";
			xhr.send(segments.join("&"));
		});
	},
	
	PostRequest: (n, o, d) => {
		if(n === 'login_form') {
			o.onChangeState({userIsSignedIn: true, accessLevel: 2});
		}
	}
};

export { Http };
