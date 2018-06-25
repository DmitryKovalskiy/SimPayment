'use strict';

import BaseComponent from 'js/_core/BaseComponent';


function Provider(application, params) {
    BaseComponent.call(this, application, params);

    this._params = params;
    this._map = {};

    this._init();
}

Provider.prototype._init = function() {

    const params = this._params;

    if ('map' in params) {

        let map = params['map'];

        if (map.__esModule) {
            map = map.default;
        }

        if (map.constructor === Object) {
            this._map = map;
        }
    }
};

Provider.prototype._findRoutInMap = function(fragment) {

    const map = this._map;

    let routeTemplate;
    for (routeTemplate in map) {
        if (map.hasOwnProperty(routeTemplate)) {

            const routTemplateRegExp = this._routeToRegExp(routeTemplate);
            const routeReplace = map[routeTemplate];

            if (routTemplateRegExp.test(fragment)) {
                return {
                    targetFragment: fragment,
                    targetTemplate: routeTemplate,
                    replaceTemplate: routeReplace
                };
            }
        }
    }

    return {
        targetFragment: fragment,
        targetTemplate: false,
        replaceTemplate: false
    };
};

Provider.prototype._extractParameters = function(fragment, route, newRoute) {

    let result = {};

    if (route || newRoute) {

        let routeTemplate = this._routeToRegExp(route);
        let fragmentArgs = routeTemplate.exec(fragment).slice(1, -1);
        let routeArgs = routeTemplate.exec(route).slice(1, -1);

        routeArgs.forEach(function(param, index) {
            result[param] = fragmentArgs[index];
        });

        return result;
    }
    return null;
};

Provider.prototype._routeToRegExp = function(route) {

    route = route.replace(/\((.*?)\)/g, '(?:$1)?')
        .replace(/(\(\?)?:\w+/g, function(match, optional) {
            return optional ? match : '([^/?]+)';
        });

    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
};

Provider.prototype._getFragmentsURI = function(route) {

    const path = /^[^#]([\w+]\/?)+/i.exec(route);
    const search = /\?([\s\S]*)?$/i.exec(route);

    return {
        path: path ? path[0] : false,
        search: search ? search[0] : false
    };
};

Provider.prototype._margeFragmentsFromTemplate = function(targetFragment, targetTemplate, replaceTemplate) {

    if ( ! replaceTemplate) {
        return null;
    }

    const execParams = this._extractParameters(targetFragment, targetTemplate);

    if ( ! execParams) {
        return null;
    }

    let key;
    for(key in execParams) {
        if (execParams.hasOwnProperty(key)) {
            replaceTemplate = replaceTemplate.replace(String(key), execParams[key]);
        }
    }

    return replaceTemplate;
};

Provider.prototype.mapping = function(route) {

    const routeFragments = this._getFragmentsURI(route);
    const mappingRoute = this._findRoutInMap(routeFragments['path']);
    const margeFragmentsFromTemplate = this._margeFragmentsFromTemplate(mappingRoute['targetFragment'], mappingRoute['targetTemplate'], mappingRoute['replaceTemplate']);

    if (margeFragmentsFromTemplate) {
        return margeFragmentsFromTemplate + (routeFragments['search'] ? routeFragments['search'] : '');
    }

    return route;
};

export default Provider;