'use strict';

import React, { Component } from 'react';

import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from './../../../../ui/Select';
import PropTypes from 'prop-types';


export default class PaymentFormComponent extends Component {
    static get propTypes() {
        return {
            disabled: PropTypes.bool.isRequired,
        }
    }
    constructor(props, ...args) {
        super(props, ...args);

        this.state = {
            disabled: props.disabled || false
        };
    }

    doNothing() {
        return
    }
    render() {

        const {
            disabled
        } = this.state;

        let operators = ['Ростелеком', 'Билайн', 'Йота'];
        let tarifs = ['490', '550', '440']
        return (
            <div className="PaymentFormComponent">
                <div className="PaymentFormComponent__header">
                    <h3>Онлайн оплата</h3>
                </div>
                <div className="PaymentFormComponent__content">

                    <div style={{ alignContent: 'center', position: 'relative' }}>
                        <div className="center-container">
                            <form onSubmit={this.doNothing} id="form1" className="mb-4">
                                <FormGroup>
                                    <InputGroup>
                                        <Select
                                            options={operators}
                                            defaultName="Выберите оператора"
                                            id="operators"
                                        />
                                    </InputGroup>
                                </FormGroup>

                                <FormGroup>
                                    <InputGroup>
                                        <Select
                                            options={tarifs}
                                            defaultName="Выберите тариф"
                                            id="tarifs"
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Addon>+7</InputGroup.Addon>
                                        <FormControl type="text" className="form-control" id="exampleInputAmount" placeholder="Введите номер телефона"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                <a href="#" className="smallLink">Проверить баланс на номере</a>
                                <ButtonToolbar style={{float:"right"}}>
                                    <Button bsStyle="primary" style={{borderRadius:"20px"}}>Оплатить</Button>
                                </ButtonToolbar>
                                </FormGroup>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}