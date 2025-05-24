const androidSounds = new class {
	constructor() {
		this.android = AndroidIO;
	}
	playSound(name) {
		this.android.callJavaSync("sounds", (an) => {
			an.playSound();
		})
	}
}