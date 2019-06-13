const functions = require('firebase-functions');
const Base64 = require('js-base64').Base64;
const httpRequest = require('request');
const builder = require('xmlbuilder');


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// SLACK api webhook url
const slackUrl = "https://hooks.slack.com/services/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";
// test slack url
//const slackUrl = "https://hooks.slack.com/services/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";

// deal with CORS problem/security
const cors = require('cors')({
	origin: true
});

exports.saveMessage = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		const message = request.query.message;
		const email = request.query.email;
		const name = request.query.name; // snapshotId;
		const date = new Date().toLocaleString();
		let slackMessage = "";
		let sendMail = true;

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
		// SLACK hook


		httpRequest.post({
			url: slackUrl,
			json: true,
			body: slackMessage
		}, function (error, response, body) {
			if (error) {
				console.log('Error: ' + error);
			} else {
				console.log('Done.');
			}
		});


		// MAILKIT API
		const mailkitUrl = "https://api.mailkit.eu/rpc.fcgi";

		// tvorba xml requestu na mailkit
		let xml = builder.create({
			methodCall: {
				methodName: 'mailkit.sendmail',
				params: {
					param: [
						{
							value: {
								int: 118608497
							}
						}, {
							value: {
								string: 'da3bee408877b702fd62610de8d1c0a0'
							}
						}, {
							value: {
								int: 80296
							}
						}, {
							value: {
								int: 84069
							}
						}, {
							value: {
								struct: {
									member: [
										{
											name: 'send_to',
											value: {
												string: 'info@activate.cz'
											}
										},
										{
											name: 'content',
											value: {
												struct: {
													member: {
														name: 'telo',
														value: {
															string: Base64.encode(message)
														}
													}
												}
											}
										}
									]
								}
							}
						}, {
							value: {
								struct: ''
							}
						}, {
							value: {
								struct: ''
							}
						}, {
							value: {
								struct: {
									member: [
										{
											name: 'custom1',
											value: {
												string: Base64.encode(name)
											}
										}, {
											name: 'custom2',
											value: {
												string: Base64.encode(email)
											}
										}, {
											name: 'custom3',
											value: {
												string: Base64.encode(message)
											}
										}, {
											name: 'custom4',
											value: {
												string: Base64.encode(date)
											}
										}
									]
								}
							}
						}
					]
				}
			}
		}).end({
			allowEmpty: true
		});

		if (message === "DYCKYMAIL") {
			xml = builder.create({
				methodCall: {
					methodName: 'mailkit.sendmail',
					params: {
						param: [
							{
								value: {
									int: 118608497
								}
							}, {
								value: {
									string: 'da3bee408877b702fd62610de8d1c0a0'
								}
							}, {
								value: {
									int: 81773
								}
							}, {
								value: {
									int: 89333
								}
							}, {
								value: {
									struct: {
										member: {
											name: 'send_to',
											value: {
												string: email
											}
										}
									}
								}
							}, {
								value: {
									struct: ''
								}
							}, {
								value: {
									struct: ''
								}
							}, {
								value: {
									struct: {
										member: [
											{
												name: 'custom1',
												value: {
													string: Base64.encode(name)
												}
											}, {
												name: 'custom2',
												value: {
													string: Base64.encode(email)
												}
											}, {
												name: 'custom3',
												value: {
													string: Base64.encode(message)
												}
											}, {
												name: 'custom4',
												value: {
													string: Base64.encode(date)
												}
											}
										]
									}
								}
							}
						]
					}
				}
			}).end({
				allowEmpty: true
			});
		}

		if (sendMail) {
			httpRequest.post({
				url: mailkitUrl,
				headers: {
					'Content-type': 'text/xml'
				},
				body: xml
			}, function (error, response, body) {
				if (error) {
					console.log('mailkit Error: ' + error);
				} else {
					console.log('mailkit Done: ' + response);
				}
			});


			// Firebase database
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
