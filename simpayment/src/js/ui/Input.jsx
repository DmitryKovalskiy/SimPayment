'use strict';

import $ from 'jquery';
import React, {Component} from 'react';
import PropType from 'prop-types';

export const PRIMARY_TYPE = 0;
export const SUCCESS_TYPE = 1;
export const WARNING_TYPE = 2;
export const DANGER_TYPE = 3;


export default class Input extends Component {

    static get propTypes() {
        return {
            value: PropType.any.isRequired,
            mask: PropType.string,
            serviceValidate: PropType.func,
            placeholder: PropType.string,
            maskOptions: PropType.any,
            maxLength: PropType.number,
            disabled: PropType.bool,
            onValidate: PropType.func,
            onInput: PropType.func
        }
    }

    constructor(props) {
        super(props);
        
        this._timer = null;
        this._active = false;
        this._autoFocus = false;
        
        this.state = {
            value: props.value || '',
            isError: false,
            disabled: false,
            error: {
                type: PRIMARY_TYPE,
                message: ''
            }
        };
    }
    
    componentWillReceiveProps(nextProps) {
        
        const {isError} = this.state;

        if (this.state.value !== nextProps.value) {
            
            this.setState({
                value: nextProps.value
            }, () => this._validateInput(nextProps.value));
        }
        
        if (nextProps.disabled && isError && !nextProps.value) {
            
            this.setState({
                isError: false
            });
        }
    }
    
    componentDidMount() {
        
        const {input} = this;
        const {mask, maskOptions = {}} = this.props;
        
        input.onblur = () => {
            this._active = false;
        };
        input.onfocus = () => {
            this._active = true;
        };
        
        if (mask) {
            $(input).mask(mask, maskOptions);
        }
    }
    
    componentDidUpdate() {
        
        const {input} = this;
        const {disabled} = this.state;
        
        if (this._autoFocus && !disabled) {
            this._autoFocus = false;
            input.focus();
        }
    }
    
    _serviceValidateInput(value) {
        
        const {isError} = this.state;
        const {serviceValidate} = this.props;
        
        const isServiseValidate = serviceValidate && serviceValidate instanceof Function;
        
        if (isServiseValidate && !isError) {
            
            window.clearTimeout(this._timer);

            this._timer = window.setTimeout(() => {
                
                this.setState({disabled: true});
                
                serviceValidate(value)
                .then(result => {
                    
                    if (result.isError) {
                        
                        this.setState({
                            isError: true,
                            disabled: false,
                            error: {
                                type: result['type'] || DANGER_TYPE,
                                message: result['message'] || false
                            }
                        });
                    } else {
                        
                        this.setState({disabled: false});
                    }
                })
                .catch(error => {
                    
                    this.setState({
                        isError: true,
                        disabled: false,
                        error: {
                            type: DANGER_TYPE,
                            message: error.message || 'Ошибка соединения с сервисом'
                        }
                    });
                });
            }, 700);
        }
    }
    
    _validateInput(value) {
        
        const {onInput, onValidate} = this.props;
        
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
                    error: {
                        type: PRIMARY_TYPE,
                        message: ''
                    }
                }, () => this._serviceValidateInput(value));
            }
        }
        
        if (onInput) {
            onInput.call(this, value);
        }
    }

    _handleInput(event) {

        let value = event.target.value;

        this.setState({
            value: value,
            isError: false
        }, () => this._validateInput(value));
    }

    render() {

        let className = ['input-field'];
        const {maxLength = '', placeholder = ''} = this.props;
        const {value, isError, error} = this.state;
        
        const disabled = this.props.disabled || this.state.disabled;

        if (disabled) {
            if (this._active) {
                this._autoFocus = true;
            }
        }
        
        if (isError) {

            switch (error['type']) {
                case PRIMARY_TYPE: className.push('input-field--primary'); break;
                case SUCCESS_TYPE: className.push('input-field--success'); break;
                case WARNING_TYPE: className.push('input-field--warning'); break;
                case DANGER_TYPE: className.push('input-field--danger'); break;
            }
        }

        return(
            <span className={className.join(' ')}>
                <input
                    ref={ref => this.input = ref}
                    type="text"
                    className="input-field__element"
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    disabled={disabled}
                    onChange={this._handleInput.bind(this)}
                />
                {isError
                    ? error['message']
                        ? <span className="input-field__error-message">{error['message']}</span>
                        : null
                    : null}
            </span>
        );
    }
}