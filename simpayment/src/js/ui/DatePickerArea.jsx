'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import DatePicker from 'js/ui/DatePicker';

export default class DatePickerArea extends Component {

    static propTypes = {
        disabled: PropTypes.bool,
        fromDate: PropTypes.number,
        toDate: PropTypes.number,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = this._setState(props);
    }

    componentWillReceiveProps(nextProps) {

        this.setState(this._setState(nextProps));
    }

    static _datePickerBeforeShowFromDate(date) {

        const fixedDate = new Date();
        fixedDate.setDate(1);
        fixedDate.setMonth(0);
        fixedDate.setYear(2016);

        const fixedDay = Math.round(Number(fixedDate.getTime()));
        const day = Number(date.getTime());
        const dayNow = Math.round(Number((new Date()).getTime()));

        return [(day + 1) && ((day >= fixedDay) && (day <= dayNow))];
    }

    _setState(state) {

        return {
            fromDate: state.fromDate,
            toDate: state.toDate,
            disabled: state.disabled || false
        };
    }

    _handlerFromDate(date) {

        let {toDate} = this.state;
        const {onChange} = this.props;

        const fDate = Math.round(date / 1000);
        const tDate = Math.round(toDate / 1000);

        if (fDate > tDate) {
            toDate = date;
        }

        this.setState({
            fromDate: date
        }, () => {
            if (onChange) {
                onChange.call(this, date, toDate);
            }
        });
    }

    _handlerToDate(date) {

        let {fromDate} = this.state;
        const {onChange} = this.props;

        const fDate = Math.round(fromDate / 1000);
        const tDate = Math.round(date / 1000);

        if (fDate > tDate) {
            fromDate = date;
        }

        this.setState({
            toDate: date
        }, () => {
            if (onChange) {
                onChange.call(this, fromDate, date);
            }
        });
    }

    _datePickerBeforeShowToDate(date) {

        const {fromDate} = this.state;
        const day = Number(date.getTime());
        const dayNow = Math.round(Number((new Date()).getTime()));

        return [(day + 1) && ((day >= fromDate * 1000) && (day <= dayNow))];
    }

    render() {

        const {
            fromDate,
            toDate,
            disabled
        } = this.state;

        return(
            <div className="date-picker-area__area">
                <div className="date-picker-area__item">
                    <span className="date-picker-area__label">с:</span>
                    <DatePicker
                        value={fromDate}
                        disabled={disabled}
                        onChange={this._handlerFromDate.bind(this)}
                        options={{
                            beforeShowDay: DatePickerArea._datePickerBeforeShowFromDate.bind(this)
                        }}
                    />
                </div>
                <div className="date-picker-area__item">
                    <span className="date-picker-area__label">по:</span>
                    <DatePicker
                        value={toDate}
                        disabled={disabled}
                        options={{
                            beforeShowDay: this._datePickerBeforeShowToDate.bind(this)
                        }}
                        onChange={this._handlerToDate.bind(this)}
                    />
                </div>
            </div>
        );
    }
}