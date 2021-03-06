var ss = require('socket.io-stream');

Broker = module.exports = Class.extend({

	initialize: function(properties) {

		Object.assign(this, properties);
		this.exchange.broker = this;
	},

	start: function(callback) {

		console.log('Server.start');
		this.connections = [];
		var io = require('socket.io').listen(this.server);
		io.on('connection', function(socket) {
			socket = ss(socket);
			this.connections.push(socket);
			socket.on('authenticate', function(credentials, respond) {
				this.authenticate(credentials, respond, socket);
			}.bind(this));
			socket.on('send', function(request, stream) {
				this.send(request, stream, socket);
			}.bind(this));
			socket.on('disconnect', function() { // need to purge the user and clear credentials
				console.log('Client disconnected.');
				socket.credentials = null;
				delete socket.credentials;
				var index = this.connections.indexOf(socket);
				if (index > -1) {
					this.connections.splice(index, 1);
				}
			}.bind(this));
		}.bind(this));
		io.on('error', function(socket) {
			console.log('error: ' + error);
		});
		callback();
	},

	send: function(request, stream, socket) {

		if (this.secure) {
			if (socket.credentials) {
				this.exchange.exchange(request, stream, socket);
			} else {
				console.log('Connection is missing credentials.');
			}
		} else {
			this.exchange.exchange(request, stream, socket);
		}
	},

	authenticate: function(credentials, respond, socket) {

		if (this.exchange.authenticate) {
			this.exchange.load(credentials, function() {
				var authentic = this.exchange.authenticate(credentials);
				if (authentic) {
					socket.credentials = credentials;
					var message = '"' + credentials.username + '" is authentic.'
					console.log(message);
					respond({
						value: {
							authentic: authentic
						},
						errors: []
					});
				} else {
					var message = '"' + credentials.username + '" is not authentic.'
					respond({
						value: {
							authentic: authentic
						},
						errors: [message]
					});
					console.log(message);
				}
			}.bind(this));
		} else {
			socket.credentials = credentials;
			respond({
				value: {},
				errors: []
			});
		}
	},

	findConnection: function(id) {

		var result = null;
		this.connections.forEach(function(each) {
			if (each.id == id) {
				result = each;
			}
		}.bind(this));
		return result;
	}
});
