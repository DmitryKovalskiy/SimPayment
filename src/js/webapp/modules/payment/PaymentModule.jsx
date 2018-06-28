'use strict';

import React from 'react';

import ModuleComponent from './components/ModuleComponent';


export default class PaymentModule extends Component {
    
    title = 'Пополнение счета SIM-карты';

    render() {

        return <ModuleComponent
            application={this.getApplication()}
            serverData={this.getServerData()}
            events={this.events}
        />;
    }
}