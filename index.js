const fs = require('fs');
const { DexcomApiClient } = require('@diakem/dexcom-api-client');
var play = require('play').Play();
var alert = require('alert-node');
require('dotenv').config()

// Check whether the sound file exists.
if (!fs.existsSync("./noise.mp3")) {
	console.error("write a loud noise to noise.mp3");
	process.exit(1);
}

if (!process.env.USERNAME || !process.env.PASSWORD) {
	console.error("set USERNAME and PASSWORD environment variables");
	process.exit(1);
}

const LOW = process.env.LOW || 40;
const HIGH = process.env.HIGH || 200;

const { read } = DexcomApiClient({
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	server: "US",
});
play.on('error', () => {
	console.error("error playing sound");
	alert("YOUR SOUND IS BROKEN! PLEASE FIX IT!");
})
(async () => {
	while (true) {
		let data = await read();
		let last_data = data[data.length - 1];
		console.log(`${last_data.value}`)
		if (last_data.value < LOW || last_data.value > HIGH) {
			play.sound('./noise.mp3');
		}

		// wait five minutes before checking again
		await new Promise(resolve => setTimeout(resolve, 5*60*1000));
	}
})()