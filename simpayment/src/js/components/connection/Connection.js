'use strict';

import BaseComponent from '../../_core/BaseComponent';
import $ from 'jquery';


let Connection = function() {
    BaseComponent.apply(this, arguments);
    
    window.jQuery = $;
    require('signalr');
    
    this._connection = $.hubConnection();
    
    this._init();
};

Connection.prototype = Object.create(BaseComponent.prototype);

Connection.prototype._init = function() {
    
    if (this._options && this._options.host) {
        this.setUrl(this._options.host);
    }
};

Connection.prototype._createError = function(result) {

    let error = new Error();

    return {
        name: error.name,
        message: result.message,
        stack: error.stack
    };
};

Connection.prototype.createHub = function(hubName) {
    
    return this._connection.createHubProxy(hubName);
};

Connection.prototype.setUrl = function(host) {
    
    this._connection['url'] = host;
};

Connection.prototype.connect = function() {
    
    return new Promise(function(resolve, reject) {
        this._connection.start()
        .done(() => {
            resolve('Now connected, connection ID=' + this._connection.id);
            this.events.trigger('connection:done');
        })
        .fail(() => reject(this._createError({message: 'Could not connect'})));
    }.bind(this));
};

Connection.prototype.disconnect = function() {
    
    this._connection.stop(() => {
        console.log('Now disconnected, connection ID=' + this._connection.id);
    });
};

export default Connection;