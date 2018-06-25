'use strict';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import {dateFormat} from 'js/_common/formats/Dates';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {dateToUnixTime} from 'js/_common/formats/Dates';

$.datepicker.setDefaults($.datepicker.regional['ru'] = {
    'closeText': 'Закрыть',
    'currentText': 'Сегодня',
    'dateFormat': 'DD.MM.YY',
    'dayNames': ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    'dayNamesMin': ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    'dayNamesShort': ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'суб'],
    'firstDay': 1,
    'isRTL': false,
    'monthNames': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
        'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    'monthNamesParentCase': ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая',
        'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
    'monthNamesShort': ['Янв', 'Фев', 'Мар', 'Апр', 'Май',
        'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    'nextText': 'След.',
    'placeholder': {'day': 'д', 'full': 'дд.мм.гггг', 'month': 'м', 'year': 'г'},
    'prevText': 'Пред.',
    'showMonthAfterYear': false,
    'weekHeader': 'Нед',
    'yearSuffix': ''
});

export default class DatePicker extends Component {

    static propTypes = {
        options: PropTypes.object,
        disabled: PropTypes.bool,
        value: PropTypes.number,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            disabled: props.disabled
        };

        this._hideDatePicker = this._hideDatePicker.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        const element = this['datePicker'];

        $(element).datepicker('option', 'disabled', nextProps.disabled);

        this.setState({
            value: nextProps.value,
            disabled: nextProps.disabled
        });
    }

    componentDidMount() {

        const {options = {}, disabled} = this.props;
        const element = this['datePicker'];
        const applicationElement = document.querySelector('#application');

        $(element).datepicker({
            showOn: 'button',
            dateFormat: 'dd.mm.yy',
            altFormat: '@',
            autoclose: true,
            onSelect: this._handlerChangeDate.bind(this),
            disabled: disabled,
            ...options
        });

        applicationElement.addEventListener('scroll', this._hideDatePicker);
        window.addEventListener('resize', this._hideDatePicker);
    }

    componentWillUnmount() {

        const element = this['datePicker'];
        const applicationElement = document.querySelector('#application');

        $(element).datepicker('destroy');

        applicationElement.removeEventListener('scroll', this._hideDatePicker);
        window.removeEventListener('resize', this._hideDatePicker);
    }

    _hideDatePicker() {

        const element = this['datePicker'];

        $(element).datepicker('hide');
    }

    _handlerChangeDate() {

        const {onChange} = this.props;
        const element = this['datePicker'];
        const value = dateToUnixTime($(element).datepicker('getDate'));

        this.setState({
            value: value
        }, () => {
            if (onChange) {
                onChange.call(this, value);
            }
        });

    }

    render() {

        let {value, disabled} = this.state;

        value = dateFormat(value * 1000);

        return(
            <span className={'date-picker' + (disabled ? ' date-picker--disabled' : '')}>
                <input
                    ref={ref => this.datePicker = ref}
                    className="date-picker__input"
                    type="datetime"
                    readOnly={true}
                    value={value}
                />
            </span>
        );
    }
}