'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

export const PRIMARY_TYPE = 0;
export const SUCCESS_TYPE = 1;
export const WARNING_TYPE = 2;
export const DANGER_TYPE = 3;


export default class AutoCompleteStrategy extends Component {

    static get propTypes() {
        return {
            showOnEmptySearch: PropTypes.bool,
            service: PropTypes.func.isRequired,
            options: PropTypes.array,
            optionValue: PropTypes.any,
            optionText: PropTypes.string,
            optionCaption: PropTypes.string,
            optionCaptionPrefix: PropTypes.string,
            optionTemplate: PropTypes.func,
            optionControlText: PropTypes.string,
            value: PropTypes.any,
            disabled: PropTypes.bool,
            onValidate: PropTypes.func,
            onError: PropTypes.func,
            onChange: PropTypes.func,
            onReset: PropTypes.func,
            onControl: PropTypes.func
        };
    }

    constructor(props) {
        super(props);

        this._timer = null;

        const hasValue =  props.value && typeof props.value === 'object';
        
        this.state = {
            showOnEmptySearch: props.showOnEmptySearch || false,
            searchTerm: props.value && typeof props.value === 'object' ? props.value[props.optionText] : '',
            options: [],
            optionValue: props.optionValue || '',
            optionText: props.optionText || '',
            optionTemplate: props.optionTemplate || null,
            optionCaption: props.optionCaption || null,
            optionCaptionPrefix: props.optionCaptionPrefix || null,
            optionControlText: props.optionControlText || '', 
            value: hasValue ? props.value[props.optionValue] : '',
            selectedItem: props.value || {},
            disabled: props.disabled || false,
            isItemSelected: hasValue ? props.value[props.optionValue] : false,
            inProcess: false,
            isOpened: false,
            isError: false,
            isConnectError: false,
            lastSearchTerm : '',
            error: {
                type: PRIMARY_TYPE,
                message: ''
            }
        };

        this._handlerHideList = this._handlerHideList.bind(this);
        this._handlerTermInput = this._handlerTermInput.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        const {value = null, optionValue} = nextProps;
        const {isError} = this.state;
        
        if (this.state.value !== '' && value === null) {
            this._handlerReset();
        } else if (value === null || this.state.value !== value[optionValue]) {
            this._setValue(value);
        }
        
        if (nextProps.disabled && isError && !nextProps.value) {
            
            this.setState({
                isError: false
            });
        }
    }

    componentDidMount() {

        document.addEventListener('click', this._handlerHideList);
    }

    componentWillUnmount() {

        document.removeEventListener('click', this._handlerHideList);
    }

    _setValue(value) {

        if (value && Object.keys(value).length) {
            this._createCollectionList([value], false);
            this._handlerSelectItem(value, true); 
        } else {
            this.setState({
                searchTerm: '',
                isItemSelected: false,
                selectedItem: {},
                value: ''
            });
        }
    }

    _handlerHideList() {

        if (this._closeStop) {
            this._closeStop = false;
            return;
        }

        if ( ! this.state.isOpened) {
            return;
        }

        const {virtualFocus} = this;
        const {selectedItem = {}, inProcess, searchTerm} = this.state;

        if (virtualFocus){
            
            virtualFocus.blur();
        }

        const isItemSelected = !! Object.keys(selectedItem).length;

        this.setState({
            isItemSelected: isItemSelected,
            isOpened: false,
            searchTerm: inProcess ? searchTerm : ''
        });
    }

    _handlerSelectItem(selectedItem, isForce = false) {

        const {disabled, optionValue, optionText} = this.props;
        const {virtualFocus} = this;

        if (disabled && !isForce) {
            return;
        }

        if ( ! selectedItem || ! Object.keys(selectedItem).length) {
            return;
        }

        let selectedValue = selectedItem[optionValue];
        let selectedText = selectedItem[optionText];

        if (virtualFocus){
            
            virtualFocus.blur();
        }

        this.setState({
            selectedItem: selectedItem,
            searchTerm: selectedText,
            value: selectedValue,
            isItemSelected: true,
            selectedText: selectedText,
            isOpened: false
        }, this._handlerCallBackChange.bind(this, selectedItem));
    }

    _handlerCallBackChange(item) {

        const {onChange, onValidate} = this.props;

        if (onValidate) {

            const error = onValidate.call(onValidate, item);

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
                    isError: false
                });
            }
        }

        if (onChange) {
            onChange.call(this, item);
        }
    }

    _handlerCallBackError(error) {

        const {onError} = this.props;

        if (onError) {
            onError.call(this, error);
        }
    }

    _handlerTermInput(event) {
        event && event.stopPropagation();

        const searchTerm = event.target.value;

        if (searchTerm) {
            this.setState({searchTerm: searchTerm}, () => this._handlerServiceStart(searchTerm));
        } else {
            this._handlerReset();
        }
    }

    _handlerServiceStart(searchTerm, isOpenList = true) {

        const {service = false} = this.props;
        const {virtualFocus} = this;

        return new Promise((res, rej) => {

            if (service && service instanceof Function) {

                window.clearTimeout(this._timer);

                this._timer = window.setTimeout(() => {

                    const result = service(searchTerm);

                    this.setState({
                        inProcess: true,
                        isOpened: false,
                        isConnectError: false,
                        lastSearchTerm: searchTerm
                    });

                    result
                        .then(result => {
                            this._createCollectionList(result, isOpenList)
                                .then(res)
                                .catch(rej);
                        })
                        .catch(error => {
                            this.setState({
                                isConnectError: true,
                                options: [],
                                isOpened: isOpenList,
                                inProcess: false
                            }, () => {
                                virtualFocus.focus();
                                virtualFocus.setSelectionRange(virtualFocus.value.length, virtualFocus.value.length);
                                this._handlerCallBackError(error);
                                rej(error);
                            });
                        });
                }, 700);
            }
        });
    }

    _createCollectionList(collection, isOpenList) {

        return new Promise(res => {

            this.setState({
                options: collection,
                isOpened: isOpenList,
                inProcess: false,
                isError: false
            }, res);
        });
    }

    _handlerReset(event) {
        event && event.stopPropagation();

        this.setState({
            searchTerm: '',
            isItemSelected: false,
            lastSearchTerm: '',
            options: [],
            selectedItem: {},
            value: '',
            isError: false
        }, () => {
            this._handlerCallBackChange(null);
        });
    }

    _handlerFocusField(event) {
        event && event.stopPropagation();

        const {showOnEmptySearch, searchTerm, options} = this.state;


        if (showOnEmptySearch) {
            this._handlerServiceStart(searchTerm);
        } else {

            if ( ! this._closeStop) {
                if (options.length) {
                    this._closeStop = true;
                    this.setState({isOpened: true});
                }
            }
        }
    }

    _handlerSetNewData(event) {
        event && event.stopPropagation();

        const {
            optionText,
            selectedItem
        } = this.state;

        this.setState({
            isItemSelected: false,
            searchTerm: selectedItem[optionText]
        }, () => {

            const {virtualFocus} = this;

            virtualFocus.focus();
            virtualFocus.setSelectionRange(virtualFocus.value.length, virtualFocus.value.length);
        });
    }
    
    _handlerClickControl(event) {
        event && event.preventDefault();
        
        const {disabled, onControl} = this.props;
        const {virtualFocus} = this;
        const {isConnectError, lastSearchTerm} = this.state;
        
        if (disabled) {
            return;
        }

        virtualFocus.blur();

        if (isConnectError) {
            this.setState({
                searchTerm: lastSearchTerm,
                inProcess: true
            }, () => {
                
                const {searchTerm, lastSearchTerm} = this.state;
                
                this._handlerServiceStart(searchTerm || lastSearchTerm);
            });  
        } else if (onControl) {
            onControl.call(this);
        }
    }

    _renderItems(item, index) {

        const {selectedItem} = this.state;
        const {optionValue, optionText, optionTemplate} = this.props;

        return <span
            key={index}
            className={'auto-complete__item' + (selectedItem && selectedItem[optionValue] === item[optionValue] ? ' auto-complete__item--active' : '')}
            onClick={this._handlerSelectItem.bind(this, item)}
        >
            {optionTemplate
                ? optionTemplate(item)
                : <span className="auto-complete__item-caption">{item[optionText]}</span>}
        </span>;
    }

    render() {

        let className = ['auto-complete'];
        const {optionCaption, optionControlText, optionText, disabled} = this.props;
        const {options, searchTerm, selectedItem, isItemSelected, isConnectError, inProcess, isOpened, isError, error} = this.state;

        if (isError) {

            switch (error['type']) {
                case PRIMARY_TYPE: className.push('auto-complete--primary'); break;
                case SUCCESS_TYPE: className.push('auto-complete--success'); break;
                case WARNING_TYPE: className.push('auto-complete--warning'); break;
                case DANGER_TYPE: className.push('auto-complete--danger'); break;
            }
        }

        return (
            <span className={className.join(' ') + (disabled ? ' auto-complete--disabled' : '') + (isOpened ? ' auto-complete--opened' : '')}>
                <span className="auto-complete__caption">
                    { ! isItemSelected || disabled
                        ? <input
                            className="auto-complete__field"
                            ref={ref => this.virtualFocus = ref}
                            value={searchTerm}
                            placeholder={optionCaption}
                            maxLength={'255'}
                            onFocus={this._handlerFocusField.bind(this)}
                            onChange={this._handlerTermInput.bind(this)}
                            disabled={disabled}
                        />
                        : <span
                            className="auto-complete__text"
                            onClick={this._handlerSetNewData.bind(this)}
                        >
                            {selectedItem[optionText]}
                        </span>}
                    {isItemSelected && !disabled
                        ? <span
                            className="auto-complete__reset"
                            onClick={this._handlerReset.bind(this)}
                        />
                        : null}
                    {inProcess
                        ? <span className="auto-complete__process"/>
                        : <span className="auto-complete__icon"/>}
                    
                </span>
                {isOpened
                    ? <span className="auto-complete__list">
                        {options.map(this._renderItems.bind(this))}
                        {isConnectError || ! options.length
                            ? <span className="auto-complete__error">
                                    <span className="auto-complete__item-caption">
                                        <span className="text-grey">
                                            {isConnectError 
                                                ? <i>Что-то пошло не так. Проверьте интернет соединение и обновите список</i> 
                                                : <i>Ничего не найдено</i>}
                                        </span>
                                    </span>
                              </span>
                            : null}
                        {optionControlText || isConnectError 
                            ? <span className="auto-complete__control">
                                    <hr style={{margin: 0}} />
                                    <span className="auto-complete__item-caption"><a href="#" className="link" onClick={this._handlerClickControl.bind(this)}>{isConnectError ? 'Обновить' : optionControlText}</a></span>
                              </span>
                        : null}
                    </span>
                    : null}
                {isError
                    ? error['message']
                        ? <span className="auto-complete__error-message">{error['message']}</span>
                        : null
                    : null}
            </span>
        );
    }
}