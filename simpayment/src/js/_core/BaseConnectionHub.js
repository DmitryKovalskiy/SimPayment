'use strict';

import Events from './Events';


let BaseConnectionHub = function(application, context) {
    
    this.events = new Events();
    
    this._hub = context;
};

BaseConnectionHub.prototype.constructor = BaseConnectionHub;

BaseConnectionHub.prototype.getHub = function() {
    
    return this._hub;
};

BaseConnectionHub.prototype.send = function(eventName) {
    
    return new Promise(function(resolve, reject) {
        this._hub.invoke(eventName)
            .done(resolve)
            .fail(reject);
    });
};

BaseConnectionHub.prototype.on = function(eventName) {
  
    if ( ! eventName) {
        return;
    }

    let me = this;
    
    this._hub.on(eventName, function() {
        const hubArgs = arguments;
        me.events.trigger(eventName, ...hubArgs);
    });
};

BaseConnectionHub.prototype.destructor = function() {
    
    delete this.events;
    
    this._hub = null;
    
    console.log('Hub destructor');
};


export default BaseConnectionHub;