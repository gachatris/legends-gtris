const log = new class {
	constructor() {
		this.main = $("ERROR-STACK");
		this.a = new ArrayFunctionIterator((at) => {
			for (let ptl = 0; ptl < at.length; ptl++) {
				let pl = at[ptl];
				let element = pl.element,
					parent = element.parentNode;
				pl.frame--;
				if (pl.frame == 15 && pl.delay > 0) {
					pl.frame = 16;
					pl.delay--;
				}
				if (pl.frame > 0) styleelem(element, "animation-delay", `${~~((1000 / (60 * (-1))) * Math.min(pl.maxf - pl.frame))}ms`);
				else {
					this.main.removeChild(element);
					at.splice(ptl, 1);
					ptl--;
					
				}
			}
		});
	}
	createLog(a) {
		a.style["animation-name"] = "error-slide";
		styleelem(a, "animation-duration", `${~~((1000 / (60)) * Math.max(0, 30))}ms`);
		styleelem(a, "animation-iteration-count", 1);
		styleelem(a, "animation-timing-function", "ease-in-out");
		styleelem(a, "animation-delay", 0);
		styleelem(a, "animation-play-state", "paused");
		
		//parent.appendChild()
		this.main.appendChild(a);
		this.a.addItem({
			element: a,
			frame: 30,
			delay: 300,
			maxf: 30
		});
	}
	error_program(event, source, lineno, colno, error) {
		try {
			elem("gtris-error-error", (e) => {
				let g = document.createElement("gtris-error-source");
				g.innerHTML = `${source} ${lineno ? "@" : ""}${lineno}`;
				g.style = `border-bottom:0.5px solid #fff;pointer-events:none`;
				e.appendChild(g);
				let text = document.createElement("gtris-error-source");
				text.innerHTML = `<br />${error}`;
				text.style = `font-size:0.5em;pointer-events:none`;
				e.appendChild(text);
				e.style = `z-index: 500; position: relative; background: rgba(0, 0, 0, 0.7); margin: 0.5 em; padding: 0.4 em; border-left: 5px solid #f00`;
				this.createLog(e);
			})
			menu.playSound("error");
		} catch (o) {
		
		}
	}
	error(title, error) {
		try {
			elem("gtris-error-error", (e) => {
				let g = document.createElement("gtris-error-source");
				g.innerHTML = title;
				g.style = `border-bottom:0.5px solid #fff;pointer-events:none`;
				e.appendChild(g);
				let text = document.createElement("gtris-error-source");
				text.innerHTML = `<br />${error}`;
				text.style = `font-size:0.5em;pointer-events:none`;
				e.appendChild(text);
				e.style = `z-index: 500; position: relative; background: rgba(0, 0, 0, 0.7); margin: 0.5 em; padding: 0.4 em; border-left: 5px solid #f00`;
				this.createLog(e);
			})
			menu.playSound("error");
		} catch (o) {
			
		}
	}
	notification(title, notification) {
		try {
			elem("gtris-error-error", (e) => {
				let g = document.createElement("gtris-error-source");
				g.innerHTML = title;
				g.style = `border-bottom:0.5px solid #fff;pointer-events:none`;
				e.appendChild(g);
				let text = document.createElement("gtris-error-source");
				text.innerHTML = `<br />${notification}`;
				text.style = `font-size:0.5em;pointer-events:none`;
				e.appendChild(text);
				e.style = `z-index: 500; position: relative; background: rgba(0, 0, 0, 0.7); margin: 0.5 em; padding: 0.4 em; border-left: 5px solid #70f`;
				this.createLog(e);
				
			});
			menu.playSound("notification");
		} catch (o) {
			
		}
	}
	warn(title, notification) {
		try {
			elem("gtris-error-error", (e) => {
				let g = document.createElement("gtris-error-source");
				g.innerHTML = title;
				g.style = `border-bottom:0.5px solid #fff;pointer-events:none`;
				e.appendChild(g);
				let text = document.createElement("gtris-error-source");
				text.innerHTML = `<br />${notification}`;
				text.style = `font-size:0.5em;pointer-events:none`;
				e.appendChild(text);
				e.style = `z-index: 500; position: relative; background: rgba(0, 0, 0, 0.7); margin: 0.5 em; padding: 0.4 em; border-left: 5px solid #ff0`;
				this.createLog(e);
				
			});
			menu.playSound("notification");
		} catch (o) {
			
		}
	}
	run() {
		this.a.update();
	}
}();