'use strict';

let hostAPI;
let socketHost;
import Application from './_core/Application';

hostAPI = ('http://localhost:3000/_api');

socketHost = ('http://localhost:3000/signalr');
// @endif

// @if DEVELOPMENT_INTEGRATION=true
hostAPI = (window.location.protocol + '//' + window.location.host + '/api');
socketHost = (window.location.protocol + '//' + window.location.host + '/signalr');
// @endif

//IE fix
if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

try {

    let App = new Application({
        selector: '#application',
        components: {
            router: {
                routes: require('./_configs/routes')
            },
            request: {
                host: hostAPI
            },
            connection: {
                host: socketHost
            },
        },
        services: {
            autocomplete: require('./../services/AutocompleteService'),
        },
        hubs: {
           
        },
        params: require('./_configs/params')
    });

    App.start();

} catch (error) {
    window.console.error(error);
}