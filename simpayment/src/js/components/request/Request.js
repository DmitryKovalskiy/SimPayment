'use strict';

import BaseComponent from '../../_core/BaseComponent';

import $ from 'jquery';


let RequestComponent = function () {
    BaseComponent.apply(this, arguments);

    this._csrf = null;
    this._headers = {};
};

RequestComponent.prototype = Object.create(BaseComponent.prototype);

RequestComponent.prototype.setHeaders = function (headers) {

    if (headers instanceof Object) {
        this._headers = headers;
    }
};

RequestComponent.prototype._normalizeFragment = function (fragment) {

    let regExp = new RegExp('^[^\/]', 'i');

    if (regExp.test(fragment)) {
        fragment = '/' + fragment;
    }

    return fragment;
};

RequestComponent.prototype._setCsrf = function (value) {
    this._csrf = value;
};

RequestComponent.prototype._getCsrf = function () {
    return this._csrf;
};

RequestComponent.prototype._clearCsrf = function () {
    if ('csrf' in this._headers) {
        delete this._headers['csrf'];
    }
    this._setCsrf(null);
};

RequestComponent.prototype.send = function (url, params, hostDisable, options = {}) {

    const app = this.getApplication();
    const Provider = app.getComponent('provider');
    
    url = Provider.mapping(url);
    
    params = Object.assign({}, {
        data: {},
        type: 'get',
        dataType: 'json',
        processData: true,
        contentType: 'application/json; charset=utf-8'
    }, params);

    if (!hostDisable) {
        if (params.host) {
            url = params.host + this._normalizeFragment(url);
        } else if (this._options && this._options.host) {
            url = this._options.host + this._normalizeFragment(url);
        }
    } else {
        url = this._normalizeFragment(url);
    }

    let csrf = this._getCsrf();

    if (csrf && params.type.toLowerCase() !== 'get') {
        this.setHeaders({
            csrf: csrf
        });
    }

    return new Promise((resolve, reject) => {

        $.support.cors = true;
        
        $.ajax({
            url: url,
            data: params.data,
            type: params.type,
            dataType: params.dataType,
            contentType: params.contentType,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            processData: params.processData,
            headers: this._headers,
            localCache: false,
            cache: false,
            success: function (result) {

                this._successProcess(result, options.statusCodeExclusion)
                    .then(resolve)
                    .catch(reject);
            }.bind(this),
            error: this._errorProcess.bind(this, reject)
        });
    });
};

RequestComponent.prototype._successProcess = function (result, statusCodeExclusion = []) {
    
    return new Promise((resolve, reject) => {
        
        if (result.isSuccess) {
            
            let data = result.data || {};
            
            if (('statusCode' in data)) {
                if (result.data.statusCode !== 0 && statusCodeExclusion.indexOf(data.statusCode) === -1) {
                    reject(this._createError(result));
                }
            }
            
            if ('csrf' in result && result.csrf) {
                this._clearCsrf();
                this._setCsrf(result.csrf);
            }
            
            resolve(data);
        } else {
            
            reject(this._createError(result));
        }
    });
};

RequestComponent.prototype._createError = function (result) {
    
    let error = new Error();
    
    return {
        name: error.name,
        number: ('statusCode' in result.data) ? result.data.statusCode : 0,
        message: result.message,
        stack: error.stack
    };
};

RequestComponent.prototype._errorProcess = function (reject, xhr) {
    
    let app = this.getApplication();
    let router = app.getComponent('router');
    let error = new Error();
    
    console.log('error:', xhr);
    
    switch (xhr.status) {
        case 401:
            router.redirect('/');
            return;
    }

    reject({
        name: error.name,
        number: xhr.status,
        message: error.message,
        stack: error.stack
    });
};


export default RequestComponent;