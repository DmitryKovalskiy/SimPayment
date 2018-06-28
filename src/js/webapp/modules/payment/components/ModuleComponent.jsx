'use strict';

import React, {Component} from 'react';

//import { amountTransform } from 'js/_common/formats/Numbers';

import PaymentFormComponent from './PaymentFormComponent';

export default class ModuleComponent extends Component {

    render() {

        return (
            <section className="paymentForm">
                <div>><h5>Онлайн-оплата</h5></div>
                <div className="centralizing-container">
                    <div className="paymentForm__content">
                        <PaymentFormComponent/>
                    </div>
                </div>
            </section>
        );
    }
}