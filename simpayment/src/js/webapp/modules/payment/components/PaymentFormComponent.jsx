'use strict';

import React, { Component } from 'react';

import Select from 'js/ui/Select';
import 'bootstrap'

export default class PaymentFormComponent extends Component {

    render() {
        let operators = ["Ростелеком", "Билайн", "Йота"];
        let tarifs = ["490", "550", "440"]
        return (
            <div className="PaymentFormComponent__content">
                <div style={{ position: 'relative' }}>
                    <div>
                        <form onSubmit={formApi.submitForm} id="form1" className="mb-4">
                            <Select
                                type={'universal'}
                                options={operators}
                                value={period}
                                disabled={disabled}
                                optionValue={'id'}
                                optionText={'name'}
                                isCaptionTemplate={true}
                                onChange={}
                            />
                            <Select
                                type={'universal'}
                                options={tarifs}
                                value={period}
                                disabled={disabled}
                                optionValue={'id'}
                                optionText={'name'}
                                isCaptionTemplate={true}
                                onChange={}
                            />

                            <div class="input-group">
                                <div class="input-group-addon">+7</div>
                                <input type="text" class="form-control" id="exampleInputAmount" placeholder="Введите номер телефона" />
                            </div>
                            <a href ="#">Проверить баланс на номере</a>
                            <button type="submit" className="btn btn-primary">
                                Оплатить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}