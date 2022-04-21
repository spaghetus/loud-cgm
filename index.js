const fs = require('fs');
const { DexcomApiClient } = require('@diakem/dexcom-api-client');
var player = require('play-sound')(opts = {})
var alert = require('alert-node');
require('dotenv').config();
(async () => {

	// Check whether the sound file exists.
	if (!fs.existsSync("./noise.wav")) {
		console.error("write a loud noise to noise.wav");
		process.exit(1);
	}

	if (!process.env.USERNAME || !process.env.PASSWORD) {
		console.error("set USERNAME and PASSWORD environment variables");
		process.exit(1);
	}

	const LOW = process.env.LOW || 50;
	const HIGH = process.env.HIGH || 250;

	const { read } = DexcomApiClient({
		username: process.env.USERNAME,
		password: process.env.PASSWORD,
		server: "US",
	});
	
	while (true) {
		let data = await read();
		let last_data = data[data.length - 1];
		console.log(`${last_data.value}`)
		if (last_data.value < LOW || last_data.value > HIGH) {
			player.play('./noise.wav', function (err) { alert("YOUR SOUND IS BROKEN PROBABLY?") });
		}

		// wait five minutes before checking again
		await new Promise(resolve => setTimeout(resolve, 5*60*1000));
	}
})()