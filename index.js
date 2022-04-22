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

	const { observe } = DexcomApiClient({
		username: process.env.USERNAME,
		password: process.env.PASSWORD,
		server: "US",
	});
	
	await observe({
		maxAttempts: 50,
		delay: 2000,
		listener: data => {
			console.log(`${data.value}`)
			if (data.value < LOW || data.value > HIGH) {
				play.sound('./noise.mp3');
			}
		}
	})
})()