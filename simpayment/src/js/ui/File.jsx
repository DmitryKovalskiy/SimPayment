'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

const DEFAULT_MAX_FILE_SIZE_IN_BYTE = 5 * 1024 * 1024;


const getInternetExplorerVersion = () => {
    let rv = -1;
    if (navigator.appName === 'Microsoft Internet Explorer') {
        let ua = navigator.userAgent;
        let re  = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
        if (re.exec(ua) !== null) {
            rv = parseFloat( RegExp.$1 );
        }
    } else if (navigator.appName === 'Netscape') {
        let ua = navigator.userAgent;
        let re  = new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})');
        if (re.exec(ua) !== null) {
            rv = parseFloat( RegExp.$1 );
        }
    }
    return rv;
};


export default class File extends Component {

    static get propTypes() {
        return {
            name: PropTypes.string,
            accept: PropTypes.string,
            useErrors: PropTypes.bool,
            maxSizeInByte: PropTypes.number,
            onError: PropTypes.func,
            onReset: PropTypes.func,
            onChange: PropTypes.func,
            onSubmit: PropTypes.func
        }
    }

    constructor() {
        super();

        this.state = {
            isIE: !!~getInternetExplorerVersion(),
            isFileSelected: false,
            isMaxSizeOfFile: false,
            fileName: ''
        };
    }

    _resetForm() {

        const {onReset} = this.props;
        const formElement = this['uploadForm'];

        formElement.reset();

        this.setState({
            fileName: '',
            isFileSelected: false
        }, () => {

            if (onReset) {
                onReset.call(this);
            }
        });
    }

    static _getAndCheckMaxSize(fileSizeInByte, maxSizeInByte) {

        return fileSizeInByte > maxSizeInByte;
    }

    _checkSizeOfFile(file) {

        return new Promise((response, reject) => {

            if ('FileReader' in window) {

                const {maxSizeInByte = DEFAULT_MAX_FILE_SIZE_IN_BYTE} = this.props;
                const fr = new FileReader();

                fr.readAsDataURL(file);
                fr.addEventListener('load', event => {

                    const fileSizeInByte = event.total;
                    const isMaxSize = File._getAndCheckMaxSize(fileSizeInByte, maxSizeInByte);

                    if (isMaxSize) {
                        reject();
                    } else {
                        response({type: 'MAX_SIZE'});
                    }
                });
            } else {

                response();
            }
        });
    }

    _handlerChangeFile(event) {

        const {onChange = null, onError = false} = this.props;
        const file = event.target.files[0];

        this.setState({
            fileName: file['name'],
            isFileSelected: true
        });

        this._checkSizeOfFile(file)
            .then(() => {

                this.setState({isMaxSizeOfFile: false});

                if (onChange) {
                    onChange.call(this, file);
                }
            })
            .catch((error) => {
                this.setState({
                    isMaxSizeOfFile: true
                });

                if (onError) {
                    onError.call(this, error);
                }
            });
    }

    _handlerSubmitForm(event) {
        event.preventDefault();

        const form = event.target;
        const {onSubmit = null} = this.props;

        if (onSubmit) {
            onSubmit.call(this, form);
            this._resetForm();
        }
    }

    _handlerReset(event) {
        event.preventDefault();
        event.stopPropagation();

        this._resetForm();
    }

    _handlerClickForChooseFile() {

        const input = this['fileInput'];
        const {isIE} = this.state;

        if ( ! isIE) {

            const mouseEvent = document.createEvent('MouseEvent');

            mouseEvent.initEvent('click', false, false);
            input.dispatchEvent(mouseEvent);
        }
    }

    render() {

        const {accept = '', name = '', useErrors = true, maxSizeInByte = DEFAULT_MAX_FILE_SIZE_IN_BYTE} = this.props;
        const {isIE, fileName = '', isFileSelected, isMaxSizeOfFile} = this.state;

        return (
            <form
                className="file-input"
                ref={ref => this.uploadForm = ref}
                onSubmit={this._handlerSubmitForm.bind(this)}
            >
                <span className="file-input__field" onClick={this._handlerClickForChooseFile.bind(this)}>
                    {
                        isFileSelected
                            ? <span className="file-input__icon-remove" onClick={this._handlerReset.bind(this)}/>
                            : <span className="file-input__icon-add"/>
                    }
                    <p className="file-input__file-name">
                        {
                            isMaxSizeOfFile
                                ? useErrors
                                    ? <span className="file-input__error marker--danger">Файл не должен превышать {(maxSizeInByte / (1024 * 1024)).toFixed(0)}МБ</span>
                                    : fileName
                                : fileName
                        }
                    </p>
                    {
                        isIE
                            ? <input
                                className="file-input__input-ie"
                                ref={ref => this.fileInput = ref}
                                type="file"
                                name={name}
                                accept={accept}
                                onChange={this._handlerChangeFile.bind(this)}
                            />
                            : <input
                                className="file-input__input"
                                ref={ref => this.fileInput = ref}
                                type="file"
                                name={name}
                                accept={accept}
                                onChange={this._handlerChangeFile.bind(this)}
                            />
                    }
                </span>
                <span className="file-input__button">
                    <button
                        className="button button--primary"
                        disabled={ ! isFileSelected}
                        type="submit"
                    >Загрузить</button>
                </span>
            </form>
        );
    }
}