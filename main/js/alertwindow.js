const alertWindow = new class {
	constructor() {
		this.isShown = false;
		this.a = id("GTRIS-ALERT-WINDOW");
		this.text = id("AW-TEXT");
		this.frame = {
			hide: 0,
			show: 0,
		};
		
	}
	showhide(bool) {
		this.isShown = bool;
		this.frame.show = -1;
		this.frame.hide = -1;
		if (this.isShown) {
			styleelem(this.a, "display", "flex");
			this.frame.show = 20;
		} else {
			this.frame.hide = 20;
		}
	}
	editText(m) {
		ihelem(this.text, m);
	}
	update() {
		if (this.frame.show > 0) {
			this.frame.show--;
			this.a.style.setProperty("opacity", bezier((20 - this.frame.show) / 20, 0, 1, 0, 0, 0, 1));
		}
		if (this.frame.hide > 0) {
			this.frame.hide--;
			if (this.frame.hide == 0) {
				styleelem(this.a, "display", "none");
			}
			
			this.a.style.setProperty("opacity", bezier(this.frame.hide / 20, 0, 1, 0, 0, 0, 1));
		}
	}
	resize(w, h, fs) {
		styleelem(this.a, "width", `${w}px`);
		styleelem(this.a, "height", `${h}px`);
		
		styleelem(this.text, "fontSize", `${fs}px`);
	}
}();