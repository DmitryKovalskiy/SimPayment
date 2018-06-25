'use strict';

import Events from 'js/_core/Events';


let BaseApplication = function(params) {

    params = params || {};

    this.events = new Events();

    this._id = params.id || this.generateID();

    this._components = {};
    this._services = {};
    this._hubs = {};
    this._params = {};

};

BaseApplication.prototype.update = function(type, data) {

    this.events.trigger(`update${type ? `:${type}` : ''}`, data);
};

BaseApplication.prototype.generateID = function() {
    return (new Date()).getTime();
};

BaseApplication.prototype.addService = function(serviceName, object) {

    if (object.__esModule) {
        object = object.default;
    }

    this._services[serviceName] = new object(this);
};

BaseApplication.prototype.hasService = function(serviceName) {
    return Boolean(serviceName in this._services);
};

BaseApplication.prototype.getService = function(serviceName) {

    if (this.hasService(serviceName)) {
        return this._services[serviceName];
    }
    return null;
};

BaseApplication.prototype.addServices = function(listServices) {

    let serviceName;

    if (listServices.__esModule) {
        listServices = listServices.default;
    }

    for (serviceName in listServices) {
        if (listServices.hasOwnProperty(serviceName)) {
            if ( ! this.hasService(serviceName)) {
                this.addService(serviceName, listServices[serviceName]);
            }
        }
    }
};

BaseApplication.prototype.addHub = function(hubName, object) {
    
    if (object.__esModule) {
        object = object.default;
    }
    
    let connection = this.getComponent('connection');
    let hub = connection.createHub(hubName);
    
    this._hubs[hubName] = new object(this, hub);
};

BaseApplication.prototype.hasHub = function(hubName) {
    
    return Boolean(hubName in this._hubs);
};

BaseApplication.prototype.getHub = function(hubName) {

    if (this.hasHub(hubName)) {
        return this._hubs[hubName];
    }
    
    return null;
};

BaseApplication.prototype.addHubs = function(listHubs) {

    let hubName;
    let Connection = this.getComponent('connection');

    if (listHubs.__esModule) {
        listHubs = listHubs.default;
    }

    for (hubName in listHubs) {
        if (listHubs.hasOwnProperty(hubName)) {
            if ( ! this.hasService(hubName)) {
                this.addHub(hubName, listHubs[hubName]);
            }
        }
    }
    
    if (Object.keys(listHubs).length > 0) {
        Connection.connect()
            .then(result => {
                console.log(result);
                return null;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
    }
};

BaseApplication.prototype.addComponent = function(componentName, object) {

    if ('instance' in object) {

        let params = object.params || {};
        let Instance = object.instance;

        if (Instance.__esModule) {
            Instance = Instance.default;
        }

        object = new Instance(this, params);
    }

    this._components[componentName] = object;
    
    this.events.trigger(`component:${componentName}:add`);
};

BaseApplication.prototype.hasComponent = function(componentName) {
    return Boolean(componentName in this._components);
};

BaseApplication.prototype.getComponent = function(componentName) {

    if (this.hasComponent(componentName)) {
        return this._components[componentName];
    }
    return null;
};

BaseApplication.prototype.addComponents = function(listComponents) {

    let componentName;

    if (listComponents.__esModule) {
        listComponents = listComponents.default;
    }

    for (componentName in listComponents) {
        if (listComponents.hasOwnProperty(componentName)) {
            if ( ! this.hasComponent(componentName)) {
                this.addComponent(componentName, listComponents[componentName]);
            }
        }
    }
};

BaseApplication.prototype.removeComponent = function(componentName) {

    if (this.hasComponent(componentName)) {
        this._components.delete(componentName);
        return true;
    }
    return false;
};

BaseApplication.prototype.setParam = function(paramName, value) {

    if (value.__esModule) {
        value = value.default;
    }

    this._params[paramName] = value;
};

BaseApplication.prototype.setParams = function(params) {

    let paramName;

    if (params.__esModule) {
        params = params.default;
    }

    for (paramName in params) {
        if (params.hasOwnProperty(paramName)) {
            if ( ! this.hasParam(paramName)) {
                this.setParam(paramName, params[paramName]);
            }
        }
    }
};

BaseApplication.prototype.getParam = function(paramName) {

    if (this.hasParam(paramName)) {
        return this._params[paramName];
    }
    return null;
};

BaseApplication.prototype.hasParam = function(paramName) {
    return Boolean(paramName in this._params);
};

BaseApplication.prototype.removeParam = function(paramName) {

    if (this.hasParam(paramName)) {
        delete this._params[paramName];
        return true;
    }
    return false;
};


export default BaseApplication;