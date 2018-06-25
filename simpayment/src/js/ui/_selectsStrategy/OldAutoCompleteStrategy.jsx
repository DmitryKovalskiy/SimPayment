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
            value: PropTypes.any,
            disabled: PropTypes.bool,
            onValidate: PropTypes.func,
            onError: PropTypes.func,
            onChange: PropTypes.func,
            onReset: PropTypes.func
        };
    }

    constructor(props) {
        super(props);

        this._timer = null;

        this.state = {
            showOnEmptySearch: props.showOnEmptySearch || false,
            searchTerm: '',
            options: [],
            optionValue: props.optionValue || '',
            optionText: props.optionText || '',
            optionTemplate: props.optionTemplate || null,
            optionCaption: props.optionCaption || null,
            optionCaptionPrefix: props.optionCaptionPrefix || null,
            value: props.value || -1,
            disabled: props.disabled || false,
            isItemSelected: false,
            inProcess: false,
            isOpened: false,
            isError: false,
            error: {
                type: PRIMARY_TYPE,
                message: ''
            }
        };

        this._handlerHideList = this._handlerHideList.bind(this);
        this._handlerTermInput = this._handlerTermInput.bind(this);
    }

    componentDidMount() {

        const {value, optionValue} = this.props;

        if (typeof value === 'object') {
            if (value && Object.keys(value).length) {
                this._createCollectionList([value], false);
                this._handlerSelectItem(value); 
            }
        } 
        else if (value && value !== -1) {
            this._handlerServiceStart(value, false)
                .then(() => {
                    const item = this._findItemInCollectionByAttribute(optionValue, value);
                    this._handlerSelectItem(item);
                });
        }

        document.addEventListener('click', this._handlerHideList);
    }

    componentWillUnmount() {

        document.removeEventListener('click', this._handlerHideList);
    }

    _handlerHideList() {

        if (this._closeStop) {
            this._closeStop = false;
            return;
        }

        if ( ! this.state.isOpened) {
            return;
        }

        const {selectedItem = {}} = this.state;

        this.setState({
            isItemSelected: !! Object.keys(selectedItem).length,
            isOpened: false
        });
    }

    _findItemInCollectionByAttribute(attr, value) {

        return this.state.options.filter(item => {
            return String(item[attr]) === String(value);
        })[0];
    }

    _handlerSelectItem(selectedItem = false) {

        const {disabled, optionValue, optionText} = this.props;
        const {virtualFocus} = this;

        if (disabled) {
            return;
        }

        if ( ! selectedItem || ! Object.keys(selectedItem).length) {
            return;
        }

        let selectedValue = selectedItem[optionValue];
        let selectedText = selectedItem[optionText];

        virtualFocus.blur();
        
//        event.stopPropagation();
//        event.preventDefault();

        this.setState({
            selectedItem: selectedItem,
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
        event.stopPropagation();

        const searchTerm = event.target.value;

        this.setState({searchTerm}, () => this._handlerServiceStart(searchTerm));
    }

    _handlerServiceStart(searchTerm, isOpenList = true) {

        const {service = false} = this.props;

        return new Promise((res, rej) => {

            if (service && service instanceof Function) {

                window.clearTimeout(this._timer);

                this._timer = window.setTimeout(() => {

                    const result = service(searchTerm);

                    this.setState({
                        inProcess: true,
                        isOpened: false
                    });

                    result
                        .then(result => {
                            this._createCollectionList(result, isOpenList)
                                .then(res)
                                .catch(rej);
                        })
                        .catch(error => {
                            this._handlerCallBackError(error);
                            rej(error);
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
                inProcess: false
            }, res);
        });
    }

    _handlerReset(event) {
        event.stopPropagation();

        this.setState({
            searchTerm: '',
            isItemSelected: false,
            selectedItem: {},
            value: void 0,
            isError: false
        }, () => {

            const {outlet} = this.state;

            this._handlerCallBackChange(outlet);
        });
    }

    _handlerFocusField(event) {
        event.stopPropagation();

        const {showOnEmptySearch} = this.state;

        if (showOnEmptySearch) {
            this._handlerTermInput(event);
        }
        else {
            const {options} = this.state;

            if ( ! this._closeStop) {
                if (options.length) {
                    this._closeStop = true;
                    this.setState({isOpened: true});
                }
            }
        }
    }

    _handlerSetNewData(event) {
        event.stopPropagation();

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
        });
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
        const {optionCaption, optionText, disabled} = this.props;
        const {options, searchTerm, selectedItem, isItemSelected, inProcess, isOpened, isError, error} = this.state;

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
                    { ! isItemSelected
                        ? <input
                            className="auto-complete__field"
                            ref={ref => this.virtualFocus = ref}
                            value={searchTerm}
                            placeholder={optionCaption}
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
                    {isItemSelected
                        ? <span
                            className="auto-complete__reset"
                            onClick={this._handlerReset.bind(this)}
                        />
                        : null}
                    {inProcess
                        ? <span className="auto-complete__process"/>
                        : <span className="auto-complete__icon"/>}
                    {isOpened
                        ? <span className="auto-complete__list">
                            {options.map(this._renderItems.bind(this))}
                        </span>
                        : null}
                </span>
                {isError
                    ? error['message']
                        ? <span className="auto-complete__error-message">{error['message']}</span>
                        : null
                    : null}
            </span>
        );
    }
}