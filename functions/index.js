const functions = require('firebase-functions');
const Base64 = require('js-base64').Base64;
const axios = require('axios');
const builder = require('xmlbuilder');


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const keys = require('./keys.json');

//admin.initializeApp(functions.config().firebase);
admin.initializeApp({
	credential: admin.credential.cert(keys),
	databaseURL: "https://activate-website-2.firebaseio.com"
});

// SLACK api webhook url
const slackUrl = keys.slack_webhook_url;

// deal with CORS problem/security
const cors = require('cors')({
	origin: true
});

exports.saveMessage = functions.https.onRequest((request, response) => {
	//console.log(process.env);

	cors(request, response, () => {
		const message = request.query.message;
		const email = request.query.email;
		const name = request.query.name; // snapshotId;
		const date = new Date().toLocaleString();
		let slackMessage = "";
		let sendMail = true;

		// SLACK hook
		if (name === "" || email === "") {
			slackMessage = {
				"text": "Problém u webového formuláře, jméno nebo e-mail jsou prázdné.  \n*Jméno:* " + name + "\n *e-mail:* " + email + "\n *datum:* " + date + "\n *text:* " + message,
				"mrkdwn": true
			};
			sendMail = false;
		} else {
			slackMessage = {
				"text": "*Nová zpráva z webového formuláře*\n*Jméno:* " + name + "\n *e-mail:* " + email + "\n *datum:* " + date + "\n *text:* " + message,
				"mrkdwn": true
			};
		}
		axios.post(slackUrl, slackMessage)
		.then(function (response) {
			console.log('Done: ', response);
		})
		.catch(function (error) {
			console.log('Error: ', error);
		});

		// MAILKIT API
		const mailkitUrl = "https://api.mailkit.eu/json.fcgi";

		// tvorba json requestu na mailkit
		let mailkitApiCallJson = {
			"function": "mailkit.sendmail",
			"id": "118608497",
			"md5": "da3bee408877b702fd62610de8d1c0a0",
			"parameters": {
				"mailinglist_id": "80296",
				"campaign_id": "84069",
				"main": {
					"send_to": "info@activate.cz",
					//"send_to": "lukas.cech@activate.cz",
					"content": {
						"telo": Base64.encode(message)
					}
				},
				"custom": {
					"custom1": Base64.encode(name),
					"custom2": Base64.encode(email),
					"custom4": Base64.encode(date)
				}
			}
		}
		
		// Hiring kampaň z konzole webu (pošli potvrzení zájemci)
		if (message === "DYCKYMAIL") {
			mailkitApiCallJson.parameters.mailinglist_id = "81773";
			mailkitApiCallJson.parameters.campaign_id = "89333";
			mailkitApiCallJson.parameters.main.send_to = email;
		}

		console.log(mailkitApiCallJson);
		// Mailkit - send mail
		if (sendMail) {
			axios.post(mailkitUrl, mailkitApiCallJson)
			.then(function (response) {
				console.log('MAilkit API status: ', response.data.status);
			})
			.catch(function (error) {
				console.log('Error: ', error);
			});

			// Backup sent e-mail to Firebase database
			let submitData = {
				message: message,
				date: date,
				email: email,
				name: name
			};

			admin.database().ref('submits/' + Base64.encode(email)).push(submitData)
				.then(snapshot => {
					response.json({
						'status': 'ok',
					});
					return 'tadaaaaa';

				})
				.catch(e => {
					console.log('error' + e)
				});
		}
	});
});
