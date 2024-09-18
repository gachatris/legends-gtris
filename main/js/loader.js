
function load(entity, type) {
	return new Promise(async (res, rej) => {
		database.read("assets", entity, async (read) => {
			let result = {};
			if (typeof read === "undefined") {
				result = await xhrFetch(entity, type);
				try {
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
				res(img);
			}
		});


	});
}
/**/