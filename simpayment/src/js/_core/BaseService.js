'use strict';


let BaseService = function(application) {

    this._application = application;
};

BaseService.prototype._getClientID = function() {
    
    let app = this.getApplication();
    let router = app.getComponent('router');
    let routerParams = router.getParams();
    return routerParams.hasOwnProperty('clientId') ? routerParams['clientId'] : null;     
};

BaseService.prototype._urlModify = function(url, args) {
    
    let clientId = this._getClientID();
    
    let resultUrl = [];
    resultUrl.push(url);
    
    if (clientId !== null && url.indexOf('clientId') === -1) {
        resultUrl.push(url.indexOf('?') > -1 ? `&clientId=${clientId}` : `?clientId=${clientId}`);
    }

    for (let key in args) {
        if (args.hasOwnProperty(key)) {
            resultUrl.push(`${resultUrl.length > 1 ? '&' : '?'}${key}=${args[key]}`);
        }
    }
    
    return resultUrl.join('');
};

BaseService.prototype.send = function() {

    let app = this.getApplication();
    let request = app.getComponent('request');
    
    return request.send.apply(request, arguments);
};

BaseService.prototype.getApplication = function() {

    return this._application;
};


export default BaseService;