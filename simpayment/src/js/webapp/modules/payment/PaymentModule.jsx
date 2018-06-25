'use strict';

import React from 'react';
import BaseModule from 'js/_core/BaseModule';

import ModuleComponent from './components/ModuleComponent';


export default class PaymentModule extends BaseModule {
    
    title = 'Пополнение счета SIM-карты';

    render() {

        return <ModuleComponent
            application={this.getApplication()}
            serverData={this.getServerData()}
            events={this.events}
        />;
    }
}