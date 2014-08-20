"use strict";

var fs = require('fs');

module.exports = function(){

	var self = {};

	return {
		init: function(settings){
			self = {
				statusCode: 200,
				headers: {},
				store: {buffer : {}}
			};
			this.set("settings", settings);
			var cookies = new (require('gereji-cookies'));
			this.set("cookies", cookies);
			var broker = new (require('gereji-broker'));
			broker.set("context", this);
			this.set("user", (new (require('gereji-user'))));
			var encryption = new (require('gereji-encryption'));
			encryption.init(this);
			this.set("encryption", encryption);
			this.set("storage", storage);
			this.set("broker", broker);
			return this;
		},
		set : function(name, value) {
			self.store[name] = value;
			return this;
		},
		get : function(name) {
			return self.store[name] ? self.store[name] : null;
		},
		statusCode: function(){
			var statusCode =  arguments[0];
			if(statusCode)
				self.statusCode = statusCode;
			return self.statusCode;
		},
		header: function(){
			var key = arguments[0] ? arguments[0].toLowerCase() : arguments[0];
			var value = arguments[1];
			if(value)
				self.headers[key] = value;
			if(key && !value)
				return self.headers[key];
			return this;
		},
		headers: function(){
			return self.headers;
		},
		buffer: function(){
			if(!arguments[0])
				return self.store.buffer;
			var app = arguments[0].app.app;
			var handler = arguments[0].app.handler;
			self.store.buffer = self.store.buffer ? self.store.buffer : {};
			self.store.buffer[app] = self.store.buffer[app] ? self.store.buffer[app] : {};
			self.store.buffer[app][handler] = self.store.buffer[app][handler] ? self.store.buffer[app][handler] : [];
			self.store.buffer[app][handler].push(arguments[0].content);
			return this;
		},
		log: function(severity, message){
			var logfile = self.store.settings.path + self.store.settings.debug.file;
			var uri = self.store.uri;
			var method = self.store.method;
			if(severity > self.store.settings.debug.level)
				return;
			var line = (new Date()) + ' (' + severity + ') : [' + uri + '] ' + ' {' + method + '} ' + (JSON.stringify(message));
			fs.appendFile(logfile, line, function(){
				console.log(line);
			});
			return this;
		},
		require: function(){
			return require(self.store["settings"].path + arguments[0]);
		}
	}
};
