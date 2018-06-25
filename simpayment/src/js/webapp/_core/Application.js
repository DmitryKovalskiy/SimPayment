'use strict';
import BaseApplication from '../../_core/BaseApplication';

import Request from 'js/components/request/Request';
import Connection from 'js/components/connection/Connection';
import Provider from 'js/components/request/ProviderRequest';
import Router from 'js/components/router/Router';

let Application = function(options) {
    BaseApplication.call(this);

    options = options || {};

    this._options = options;

    this._init();

    console.log('application instance');

};

Application.prototype = Object.create(BaseApplication.prototype);

Application.prototype._init = function() {

    let options = this._options;

    if ('components' in options) {
        this._setCoreComponents(options['components']);
        this.addComponents(options['components']);
    } else {
        throw new Error('Options for core components are not set.');
    }
    
    if ('hubs' in options) {
        this.addHubs(options['hubs']);
    } else {
        throw new Error('Options for core hubs are not set.');
    }

    if ('services' in options) {
        this.addServices(options['services']);
    } else {
        throw new Error('Options for core services are not set.');
    }

    if ('params' in options) {
        this.setParams(options['params']);
    }
};

Application.prototype._setCoreComponents = function(params) {

    params = params || {};

    let components = {
        connection: new Connection(this, params.connection || {}),
        request: new Request(this, params.request || {}),
        provider: new Provider(this, params.provider || {}),
        display: new DisplayManager(this),
        router: new Router(this, params.router),
        profiler: new Profiler(this),
        roles: new Roles(this)
    };

    this.addComponents(components);
};

Application.prototype.getOptionByKey = function(key) {
    return this._options[key] || null;
};

Application.prototype.attachContent = function(view) {

    this._region.show(view);
};

Application.prototype.start = function() {

    let profiler = this.getComponent('profiler');

    profiler.checkAuth()
    .then(this._createApplication.bind(this))
    .catch(function(error) {
        console.log('profiler error:', error);
    });
};

Application.prototype._createApplication = function(authState) {

    let display = this.getComponent('display');
    let router = this.getComponent('router');
    let profiler = this.getComponent('profiler');

    let profilerModel = profiler.getData(true);
    
    profilerModel.on('change', () => display.checkVersionApplication(profilerModel));
    
    if ( ! authState) {
        router.redirect('/');
        return;
    }

    display.create();
    router.start();
    
    console.log('application was created');

    display.checkGlobalAccess(profiler.getData(), router.getFragment());
};


export default Application;