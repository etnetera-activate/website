const functions = require('firebase-functions');
const Base64 = require('js-base64').Base64;


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// deal with CORS problem/security
const cors = require('cors')({
	origin: true
});

exports.saveMessage = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		const message = request.query.message;
		const email = request.query.email;
		const name = request.query.name; // snapshotId;
		const date = new Date().toISOString()
		let submitData = {
			message: message,
			date: date,
			email: email,
			name: name
		}
		admin.database().ref('submits/' + Base64.encode(email) ).push(submitData)
			.then(snapshot => {
				response.json({
					'status': 'ok',
				});
				return 'tadaaaaa';
				//TODO: napojeni na mailkit api
			})
			.catch(e => {
				console.log('error' + e)
			});
	});
});