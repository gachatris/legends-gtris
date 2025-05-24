const gtcharacter = new class {
	constructor() {
		this.characters = [
			{
				core: {
					color: {
						red: 225,
						green: 112,
						blue: 0
					},
					name: "misty_firefox>name",
					description: "misty_firefox>desc",
					date_featured: "9-17-2024",
					version: "0.0.1 Alpha",
					path: "misty_firefox"
				},
				versions: [
					{
						color: {
							red: 225,
							green: 112,
							blue: 0
						},
						path: "main",
						init: "init.json",
						lang_path: "misty_firefox>ver>main",

						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
						name: "name",
				 }
				]
			},
			{
				core: {
					color: {
						red: 225,
						green: 112,
						blue: 0
					},
					name: "rubystudios>name",
					description: "rubystudios>desc",
					date_featured: "9-17-2024",
					version: "0.0.1 Alpha",
					path: "rubystudios"
				},
				versions: [
					{
						color: {
							red: 225,
							green: 2,
							blue: 2
						},
						path: "main",
						init: "init.json",
						lang_path: "rubystudios>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			},
			{
				core: {
					color: {
						red: 225,
						green: 112,
						blue: 0
					},
					name: "dominic_zi>name",
					description: "dominic_zi>desc",
					date_featured: "9-17-2024",
					version: "0.0.1 Alpha",
					path: "dominic_zi"
				},
				versions: [
					{
						color: {
							red: 225,
							green: 2,
							blue: 2
						},
						path: "main",
						init: "init.json",
						lang_path: "dominic_zi>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			},
			{
				core: {
					color: {
						red: 225,
						green: 112,
						blue: 0
					},
					name: "elisha>name",
					description: "elisha>desc",
					date_featured: "9-17-2024",
					version: "0.0.1 Alpha",
					path: "elisha"
				},
				versions: [
					{
						color: {
							red: 225,
							green: 2,
							blue: 2
						},
						path: "main",
						init: "init.json",
						lang_path: "elisha>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			},
			{
				core: {
					color: {
						red: 225,
						green: 112,
						blue: 0
					},
					name: "epicman>name",
					description: "epicman>desc",
					date_featured: "9-17-2024",
					version: "0.0.1 Alpha",
					path: "epicman"
				},
				versions: [
					{
						color: {
							red: 225,
							green: 112,
							blue: 2
						},
						path: "main",
						init: "init.json",
						lang_path: "epicman>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			},
			{
				core: {
					color: {
						red: 3,
						green: 3,
						blue: 122
					},
					name: "flotalendy>name",
					description: "flotalendy>desc",
					date_featured: "9-17-2024",
					version: "0.0.1 Alpha",
					path: "flotalendy"
				},
				versions: [
					{
						color: {
							red: 3,
							green: 3,
							blue: 122
						},
						path: "main",
						init: "init.json",
						lang_path: "flotalendy>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			},
			{
				core: {
					color: {
						red: 3,
						green: 3,
						blue: 122
					},
					name: "eclipse>name",
					description: "eclipse>desc",
					date_featured: "5-25-2025",
					version: "0.0.2 Alpha",
					path: "eclipse"
				},
				versions: [
					{
						color: {
							red: 111,
							green: 3,
							blue: 122
						},
						path: "main",
						init: "init.json",
						lang_path: "eclipse>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			},
		    {
				core: {
					color: {
						red: 20,
						green: 20,
						blue: 122
					},
					name: "abcia2>name",
					description: "abcia2>desc",
					date_featured: "5-25-2025",
					version: "0.0.2 Alpha",
					path: "abcia2"
				},
				versions: [
					{
						color: {
							red: 20,
							green: 20,
							blue: 122
						},
						path: "main",
						init: "init.json",
						lang_path: "abcia2>ver>main",
						name: "name",
						description: "desc",
						select_image: "images/select.png",
						rpg_card: "images/rpg_card.png",
						rpg_attr_init: "rpg_attr.json",
						rpg_init: "rpg_init.json",
				 }
				]
			}
		];

		for (let h in this.characters) {
			let reference = this.characters[h];
			let ver = Object.keys(reference.versions);
			reference.core.verlength = ver.length;
		}
	}
}();