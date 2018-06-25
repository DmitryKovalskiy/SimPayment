'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

export const PRIMARY_TYPE = 0;
export const SUCCESS_TYPE = 1;
export const WARNING_TYPE = 2;
export const DANGER_TYPE = 3;


export default class ComboBox extends Component {

    static get propTypes() {
        return {
            options: PropTypes.arrayOf(PropTypes.object).isRequired,
            optionValue: PropTypes.string.isRequired,
            optionText: PropTypes.string.isRequired,
            optionCaption: PropTypes.string,
            optionCaptionPrefix: PropTypes.string,
            value: PropTypes.any,
            disabled: PropTypes.bool,
            onValidate: PropTypes.func,
            onChange: PropTypes.func
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            options: props.options,
            optionValue: props.optionValue,
            optionText: props.optionText,
            optionCaption: props.optionCaption,
            optionCaptionPrefix: props.optionCaptionPrefix || false,
            value: props.value || -1,
            disabled: props.disabled || false,
            isError: false,
            error: {
                type: PRIMARY_TYPE,
                message: ''
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            options: nextProps.options,
            value: nextProps.value,
            disabled: nextProps.disabled
        });
    }

    _createOption(index, option) {

        const {
            optionText,
            optionValue
        } = this.state;

        return (
            <option
                key={index}
                value={option[optionValue]}
            >{option[optionText]}</option>
        );
    }
    
    _validateSelect(value) {
        
        const {onChange, onValidate} = this.props;

        if (onValidate) {

            const error = onValidate.call(onValidate, value);

            if (error) {
                this.setState({
                    isError: true,
                    error: {
                        type: error['type'] || PRIMARY_TYPE,
                        message: error['message'] || false
                    }
                });
            } else {
                this.setState({
                    isError: false,
                    error: {}
                });
            }
        }
        
        if (onChange) {
            onChange.call(this, value);
        }
    }

    _handlerChange(event) {

        const value = event.target.value;
        
        this.setState({
            value: value
        },  () => this._validateSelect(value));
    }

    render() {

        let className = ['select-universal'];
        const {
            options,
            value,
            optionCaption,
            optionCaptionPrefix,
            disabled,
            isError, 
            error
        } = this.state;

        if (isError) {

            switch (error['type']) {
                case PRIMARY_TYPE: className.push('select-universal--primary'); break;
                case SUCCESS_TYPE: className.push('select-universal--success'); break;
                case WARNING_TYPE: className.push('select-universal--warning'); break;
                case DANGER_TYPE: className.push('select-universal--danger'); break;
            }
        }
        
        return(
            <span className={className.join(' ')}>
                <select
                    className="select select--long"
                    value={value}
                    disabled={disabled}
                    onChange={this._handlerChange.bind(this)}
                >
                    {optionCaption
                        ? <option key={-1} value={-1}>{optionCaptionPrefix ? optionCaptionPrefix + optionCaption : optionCaption}</option>
                        : null}
                    {options.map((option, index) => this._createOption(index, option))}
                </select>
                {isError
                    ? error['message']
                        ? <span className="select-universal__error-message">{error['message']}</span>
                        : null
                    : null}
           </span>
        );
    }
}