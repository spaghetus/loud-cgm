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

const LOW = process.env.LOW || 50;
const HIGH = process.env.HIGH || 250;

const { observe } = DexcomApiClient({
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	server: "US",
});
play.on('error', () => {
	console.error("error playing sound");
	alert("YOUR SOUND IS BROKEN! PLEASE FIX IT!");
});
(async () => {
	while (true) {
		await observe({
			maxAttempts: 50,
			delay: 5 * 60 * 1000,
			listener: data => {
				console.log(`${data.value}`)
				if (data.value < LOW || data.value > HIGH) {
					play.sound('./noise.mp3');
				}
			}
		})
	}
})()