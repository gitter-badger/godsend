
require('../../lib/godsend/server/main.js').ready(function(godsend) {

var Server = require('../shared/server/Server.js');
var Authorizer = require('../shared/server/Authorizer.js');
var Credentials = require('../shared/server/Credentials.js');

Example = Class.extend({
	
	initialize : function(properties) {
		
		new Server().start(function() {
			new Authorizer({
				users : this.users
			}).connect(function() {
				new Agent().connect(function() {
					console.log('Everything has been started.');
				}.bind(this));
			});
		}.bind(this));
	},
   
   users : {
		'agent' : {
			credentials : {
				username : Credentials.get('agent').username,
				passphrase : Credentials.get('agent').passphrase,
			},
			patterns : {
				sendable : [],
				receivable : [{
					topic : 'post-message'
				}]
			}
		},
		'client' : {
			credentials : {
				username : Credentials.get('client').username,
				passphrase : Credentials.get('client').passphrase,
			},
			patterns : {
				sendable : [{
					topic : 'post-message'
				}],
				receivable : []
			}
		}
   }
});

Agent = Class.extend({
	
	initialize : function(properties) {
		
		Object.assign(this, properties);
	},
	
	connect : function(callback) {
		
		this.bus = new godsend.Bus({
			local : false
		});
		this.bus.connect({
			credentials : {
				username : Credentials.get('agent').username,
				passphrase : Credentials.get('agent').passphrase,
			},
			connected : function(properties) {
				this.connection = properties.connection;
				this.initializeReceivers();
				callback();
			}.bind(this)
		});
	},
	
	initializeReceivers : function() {
		
		this.connection.receive({
			id : 'post-message',
			on : function(request, response) {
				if (request.matches({
					topic : 'post-message'
				})) {
					request.accept();
				} else {
					request.skip();
				}
			}.bind(this),
			run : function(request, response) {
				response.data = {
					value : 'Received a message from the client securely: ' + JSON.stringify(request.data)
				}
				request.next();
			}.bind(this)
		});
	}
});

new Example({});

});