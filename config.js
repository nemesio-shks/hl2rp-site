/*
 * Site + loading screen settings. Edit this file to set the site up for your server.
 * Written in ES5 so the loading screen also works on the old Awesomium browser in GMod.
 */
var SITE = {
	name: 'City 17',
	tagline: 'Half-Life 2 Roleplay',
	about: 'A serious HL2RP server with an active community. Join the Civil Protection, live as a citizen or work with the resistance in the underground. Staff are online most of the day and we run events every weekend.',
	ip: '127.0.0.1:27015',
	discord: 'https://discord.gg/example',
	rules: 'https://example.com/rules',
	store: 'https://example.com/store',
	workshop: 'https://steamcommunity.com/sharedfiles/filedetails/?id=0',
	accent: '#3fb8d4',

	// Player count. statusUrl should return JSON like {"online":47,"max":128,"map":"rp_city17"}
	// Leave empty to show demoStatus instead.
	statusUrl: '',
	demoStatus: { online: 47, max: 128, map: 'rp_city17_v3' },

	factions: [
		{ icon: 'combine', name: 'Civil Protection', text: 'Keep order in the city. Patrols, checkpoints and interrogations.' },
		{ icon: 'citizen', name: 'Citizens', text: 'Find a job, trade, earn loyalty points or deal on the black market.' },
		{ icon: 'lambda', name: 'Resistance', text: 'Hidden bases, raids and smuggling. Fight back against the Combine.' }
	],

	loading: {
		tips: [
			'If someone has a gun on you, act scared. That\'s FearRP.',
			'Always carry your CID card, CP can ask for it at any time.',
			'Need help? Type @ in chat to message the staff.',
			'Read the rules on our forum before you start playing.',
			'Found a bug? Report it in our Discord.'
		],
		music: '' // optional mp3 URL
	}
};
