function load(entity, type) {
	if (appinfo.android) return new Promise(async (res, rej) => {
		let result = xhrFetch(entity, type);
		res(result);
	});
	return new Promise(async (res, rej) => {
		database.read("assets", entity, async (read) => {
			let result = null;
			if (typeof read === "undefined") {
				try {
				result = await xhrFetch(entity, type);
				
					database.write("assets", entity, result);
				} catch (e) {

				}
				//console.log(entity)
			} else {
				//console.log(read);
				result = read.value;
			}
			res(result);
		});
	});


}

function loadImage(directory) {
	if (appinfo.android) return new Promise(async (res, rej) => {
		try{
		let result = await xhrFetch(directory, "blob");
		//console.log(result)
		let img = new Image();
		img.src = URL.createObjectURL(result);
		////console.log(img.src)
		img.onload = () => {
			URL.revokeObjectURL(result);
			res(img);
		}
		} catch(e) {
			console.log(e.stack)
		}
		//res(result)
	});
	return new Promise((res, rej) => {

		database.read("assets", directory, async (read) => {
			let result = {};
			////console.log(directory)
			if (typeof read === "undefined") {
				result = await xhrFetch(directory, "blob");
				//console.log(directory)
				try {
					database.write("assets", directory, result);
				} catch (e) {

				}


			} else {
				//console.log(read)
				result = read.value;
			}



			let img = new Image();
			img.src = URL.createObjectURL(result);
			////console.log(img.src)
			img.onload = () => {
				URL.revokeObjectURL(result);
				res(img);
			}
		});


	});
}
/**/

__private.loadImage = loadImage;
__private.load = load;