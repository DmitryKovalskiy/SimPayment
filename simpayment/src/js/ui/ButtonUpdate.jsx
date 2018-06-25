'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {dateFullToObject} from 'js/_common/formats/Dates';

export default class ButtonUpdate extends Component {

    static propTypes = {
        date: PropTypes.number,
        disabled: PropTypes.bool,
        process: PropTypes.bool,
        onClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            date: props.date || (new Date).getTime(),
            process: props.process || false,
            disabled: props.disabled || false
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            date: nextProps.date,
            disabled: nextProps.disabled,
            process: nextProps.process
        });
    }

    _transformDate(unixDate) {

        const dateObject = dateFullToObject(unixDate);

        return `${dateObject.hour}:${dateObject.minutes} ${dateObject.day}.${dateObject.month}.${dateObject.year}`;
    }

    _handlerClickButton() {

        const {onClick} = this.props;
        const {disabled, process} = this.state;

        if (onClick && ( ! disabled || ! process)) {
            onClick.call(this);
        }
    }

    render() {

        const {
            date,
            disabled,
            process
        } = this.state;

        return(
            <span
                className={'button-update-component' + (disabled ? ' button-update--disabled' : '') + (process ? ' button-update--process' : '')}
                onClick={this._handlerClickButton.bind(this)}
            >
                <span className="button-update__content">Обновлено в {this._transformDate(date)}</span>
                <span className="button-update__icon"/>
            </span>
        );
    }
}