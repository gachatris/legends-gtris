const npcBoss = new class {
	constructor() {
		this.character = {
			name: "",
		};
		this.isReady = false;
		this.rpg = {
			hp: 12000,
			max: 12000,
			mana: 300,
			absorb: 0,
			skills: [],
			
		}
		this.sprites = {};
	}
}();