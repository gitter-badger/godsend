
var uuid = require('uuid');
var Logger = require('js-logger');
var Class = require('../godsend.js').Class;
var Bus = require('../godsend.js').Bus;

Runner = Class.extend({
	
	initialize : function(properties) {
		
		this.platform = new (require('./Platform.js'))();
		this.platform.start(function() {
			this.run();
		}.bind(this));
	},
	
	run : function() {
		
		var runner = this;
		var test = require('tape');
		
		test('Establishing a connection to the bus with bad credentials.', function(assert) {
			
			new Bus({
				address : 'http://127.0.0.1:8080/'
			}).connect({
				credentials : {
					username : Credentials.get('client').username,
					passphrase : 'wrong',
				},
				responded : function(result) {
					assert.notEquals(result.errors.length, 0, 'Does more than one error exist?');
					assert.pass('The client has attempted to connect with an error.');
					assert.end();
				}.bind(this)
			});
		});
		
		test('Establishing a connection to the bus with good credentials.', function(assert) {
			
			new Bus({
				address : 'http://127.0.0.1:8080/'
			}).connect({
				credentials : {
					username : Credentials.get('client').username,
					passphrase : Credentials.get('client').passphrase,
				},
				responded : function(result) {
					runner.connection = result.connection;
					assert.notEquals(result.connection, null, 'Is the connection connected?');
					assert.pass('The client has connected successfully.');
					assert.end();
				}.bind(this)
			});
		});
		
		test('Sending a message pattern over the bus which is not authorized.', function(assert) {
			
			runner.connection.send({
				pattern : {
					topic : 'post-message-not-authorized'
				},
				data : {
					message : 'Can you hear me now?'
				},
				receive : function(result) {
					console.log('result: ' + JSON.stringify(result, null, 2));
					assert.notEquals(result.errors, undefined, 'Does result exist?');
					assert.notEquals(result.errors, undefined, 'Do errors exist?');
					assert.notEquals(result.errors.length, 0, 'Does more than one error exist?');
					assert.pass('Received a result with error.');
					assert.end();
				}.bind(this)
			});
		});
		
		test('Sending a message pattern over the bus which is authorized.', function(assert) {
			
			runner.connection.send({
				pattern : {
					topic : 'post-message'
				},
				data : {
					message : 'Can you hear me now?'
				},
				receive : function(result) {
					console.log('result: ' + JSON.stringify(result, null, 2));
					assert.notEquals(result, undefined, 'Does result exist?');
					assert.notEquals(result.objects, undefined, 'Does result value exist?');
					assert.ok(result.errors, 'Do result errors exist?');
					assert.pass('Received a valid response.');
					assert.end();
				}.bind(this)
			});
		});
		
		test.onFinish(function() {
			
			console.log('All tests have finished.');
			console.log('Remember to tear down all connections at this time.');
			process.exit(0);
		});
	}
});

new Runner({});
