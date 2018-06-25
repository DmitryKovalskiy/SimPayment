'use strict';

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CheckBox from './CheckBox';

export default class Table extends Component {

    static get propTypes() {
        return {
            className: PropTypes.string,
            options: PropTypes.shape({
                sortable: PropTypes.shape({
                    use: PropTypes.bool.isRequired,
                    defaultRow: PropTypes.string,
                    defaultDirect: PropTypes.string,
                    onChange: PropTypes.func
                }),
                multipleSelect: PropTypes.shape({
                    use: PropTypes.bool,
                    onCheck: PropTypes.func
                }),
                rowActions: PropTypes.shape({
                    use: PropTypes.bool.isRequired,
                    onClick: PropTypes.func
                }),
                inProcess: PropTypes.shape({
                    use: PropTypes.bool,
                    state: PropTypes.bool,
                    template: PropTypes.any
                })
            }),
            items: PropTypes.arrayOf(PropTypes.object),
            columns: PropTypes.arrayOf(PropTypes.shape({
                show: PropTypes.bool
            })),
            scrollHeaders: PropTypes.bool,
            disabled: PropTypes.bool,
            nodataComponent: PropTypes.func
        }
    }

    constructor(props) {
        super(props);

        this._isFixedHeader = false;

        this._selectedItems = [];

        this.state = this._setState(props);
    }

    componentWillReceiveProps(nextProps) {

        const {options = {}} = nextProps;
        const {multipleSelect = {}, inProcess} = options;
        const {onCheck = null} = multipleSelect;

        if (JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items)) {

            this._selectedItems = [];

            this.setState({
                isSelectedAll: false,
                isIndeterminate: false,
                inProcess: inProcess
            });

            if (onCheck) {
                onCheck.call(this, this._selectedItems);
            }
        } else {
            this.setState({
                inProcess: inProcess
            });
        }
    }

    componentDidMount() {

        document.querySelector('#application').addEventListener('scroll', this._scrollDocument.bind(this));
    }

    componentWillUnmount() {

        document.querySelector('#application').removeEventListener('scroll', this._scrollDocument.bind(this));
    }

    componentDidUpdate() {

        const table = this['table'];
        const tableCling = this['tableCling'];
        const tableRECT = table.getBoundingClientRect();

        if (tableCling && this._isFixedHeader) {
            tableCling.style.width = tableRECT.width + 'px';
        }
    }

    _scrollDocument() {

        const {table} = this;
        
        if ( ! table) {
            return;
        }
        
        const tableRECT = table.getBoundingClientRect();

        if (tableRECT.top < 0) {
            if ( ! this._isFixedHeader) {
                this._isFixedHeader = true;
                this.setState({isFixed: this._isFixedHeader});
            }
        } else {
            if (this._isFixedHeader) {
                this._isFixedHeader = false;
                this.setState({isFixed: this._isFixedHeader});
            }
        }
    }

    _setState(state) {

        let sortableProperty = {};

        const {options = {}} = this.props;
        const {sortable = false, rowActions = {}, multipleSelect = {}, inProcess = {}} = options;

        if (sortable) {
            if (sortable.hasOwnProperty('defaultColumn') && !!sortable['defaultColumn']) {
                sortableProperty['column'] = sortable['defaultColumn'];
            }
            if (sortable.hasOwnProperty('defaultDirect') && !!sortable['defaultDirect']) {
                sortableProperty['direct'] = sortable['defaultDirect'];
            }
        }

        return {
            disabled: state.disabled || false,
            rowActions: {
                use: rowActions.use || false,
                onClick: rowActions.onClick || null
            },
            inProcess: {
                use: inProcess.use || false,
                state: inProcess.state || false,
                template: inProcess.template || null
            },
            sortable: {
                column: sortableProperty.column || '',
                direct: sortableProperty.direct || ''
            },
            isMultipleSelect: multipleSelect && multipleSelect.use,
            isFixed: false,
            isSelectedAll: state.isSelectedAll || false,
            isIndeterminate: state.isIndeterminate || false
        };
    }

    _changeSortableColumn(columnName) {

        const {disabled} = this.props;

        if (disabled) {
            return;
        }

        const sortableProperty = {
            column: columnName,
            direct: (this.state.sortable.direct === 'desc') ? 'asc' : 'desc'
        };

        this.setState({
            sortable: sortableProperty
        }, () => {
            this.props.options.sortable.onChange.call(this, sortableProperty.column, sortableProperty.direct);
        });
    }

    _clickOnTableCell(item) {

        const {rowActions, disabled} = this.state;

        if (rowActions.use && ! disabled) {
            if (rowActions.hasOwnProperty('onClick')) {
                rowActions.onClick.call(this, item);
            }
        }
    }

    _processAboveValue(column, value) {

        if ('process' in column) {

            const process = column['process'];

            if ( ! value) {
                if ('defaultValue' in process) {
                    return process.defaultValue;
                }
            }

            if ('formattingValue' in process) {
                return process.formattingValue.call(this, value);
            }
        }

        return value;
    }

    static _renderNoData() {
        
        return <caption className="table__message">
                <p className="tp-paragraph">Нет данных</p>
            </caption>;
    }
    
    static _renderHeaderText(item, key) {
        return <span key={key}>{item}<br/></span>;
    }

    static _renderColGroup(column, index) {
        return <col key={index} width={('props' in column) ? column.props['width'] + 'px' || '' : ''}/>;
    }
    
    static _renderTableBody(item, index) {
        
        const {
            items,
            columns
        } = this.props;
        
        const {
            isMultipleSelect,
            rowActions
        } = this.state;
        
        const isSelectedAll = ! items.length ? false : this.state.isSelectedAll;
        
        return <tbody key={index} className="table__body">
                    <tr
                        className={'table__body-row' + (rowActions['use'] ? '' : ' table__body-row--no-click')}
                        onClick={this._clickOnTableCell.bind(this, item)}
                    >
                        {isMultipleSelect
                            ? <td className="table__header-row" style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                <CheckBox
                                    checked={isSelectedAll || (this._selectedItems.indexOf(item) !== -1)}
                                    onChange={this._handlerSelectItem.bind(this, item)}
                                />
                            </td>
                            : null}
                        {columns.map(this._renderTD.bind(this, item))}
                    </tr>
                </tbody>;
    }

    _renderTD(item, column, index) {

        if ('show' in column) {
            if ( ! column['show']) {
                return;
            }
        }

        return (<td
            style={{'maxWidth':('props' in column) ? column.props['width'] + 'px' || '' : ''}}
            key={index}
            className={Table._createClassNameForAlignCell(column, 'table__body-cell')}
        >
            {('template' in column)
                ? column['template'].call(this, item)
                : <span className="table__body-caption">{this._processAboveValue(column, item[column['alias']])}</span>}
        </td>);
    }

    _renderTH(column, index) {

        const {options} = this.props;
        const {disabled, sortable} = this.state;

        if ('show' in column) {
            if ( ! column['show']) {
                return;
            }
        }

        return (
            <th
                key={index}
                className={Table._createClassNameForAlignCell(column, 'table__header-cell')}
            >
                {(('sortable' in column) && ('sortable' in options) && options.sortable.use)
                    ? <span className={'table__sortable' + (disabled ? ' table__sortable--disabled' : '')}
                            onClick={this._changeSortableColumn.bind(this, column['alias'])}
                    >
                        <span className={'table__arrows' + (sortable.column === column['alias'] ? (sortable.direct === 'desc') ? ' table__arrows--descent' : ' table__arrows--ascent' : '')}>
                            <span className="table__arrow-up"/>
                            <span className="table__arrow-down"/>
                        </span>
                        <span className="table__caption-container">
                            <span className={(sortable.column === column['alias'] ? 'table__header-caption--active' : '') + ' table__header-caption'}>
                                {column['title'] && column['title'].split('\n').map(Table._renderHeaderText.bind(this))}
                            </span>
                        </span>
                    </span>
                    : <span className="table__header-caption">
                        {column['title'] && column['title'].split('\n').map(Table._renderHeaderText.bind(this))}
                    </span>}
            </th>
        );
    }

    static _createClassNameForAlignCell(column, prefix = '') {

        let classesName = [prefix];

        if ('props' in column) {

            const propsObject = column['props'];

            if ('align' in propsObject) {

                const align = propsObject['align'];

                if (align === 'center') {
                    classesName.push(prefix + '--center');
                } else if (align === 'right') {
                    classesName.push(prefix + '--right');
                }
            }
        }

        return classesName.join(' ');
    }

    _handlerSelectAllItems() {

        const {items, options = {}} = this.props;
        const {multipleSelect = {}} = options;
        const {onCheck = null} = multipleSelect;
        const {isSelectedAll} = this.state;

        if (isSelectedAll) {

            this._selectedItems = [];

            this.setState({
                isSelectedAll: false,
                isIndeterminate: false
            });
        } else {

            this._selectedItems = items.slice();

            this.setState({
                isSelectedAll: true,
                isIndeterminate: false
            });
        }

        if (onCheck) {
            onCheck.call(this, this._selectedItems);
        }

    }

    _handlerSelectItem(item) {

        const {items, options = {}} = this.props;
        const {multipleSelect = {}} = options;
        const {onCheck = null} = multipleSelect;
        const indexItem = this._selectedItems.indexOf(item);

        if ( ~ indexItem) {
            this._selectedItems.splice(indexItem, 1);
        } else {
            this._selectedItems.push(item);
        }

        if (this._selectedItems.length > 0 && this._selectedItems.length < items.length) {
            this.setState({
                isSelectedAll: false,
                isIndeterminate: true
            });
        } else if (this._selectedItems.length === items.length) {
            this.setState({
                isSelectedAll: true,
                isIndeterminate: false
            });
        } else {
            this.setState({
                isSelectedAll: false,
                isIndeterminate: false
            });
        }

        if (onCheck) {
            onCheck.call(this, this._selectedItems);
        }
    }

    render() {
        
        const {
            className,
            items,
            columns,
            scrollHeaders,
            nodataComponent
        } = this.props;

        const {
            disabled,
            isFixed,
            isMultipleSelect,
            isIndeterminate,
            inProcess
        } = this.state;

        let {isSelectedAll} = this.state;

        let toScrollHeaders = scrollHeaders !== undefined && scrollHeaders === false ? false : true;

        if ( ! items.length) {

            isSelectedAll = false;
        }

        return(
            <div className={'table-container' + (className ? ` ${className}` : '')}>
                {isFixed && toScrollHeaders
                    ? <table className="table table--cling" ref={ref => this.tableCling = ref}>
                        <colgroup ref={ref => this.tableCols = ref}>
                            {columns.map(Table._renderColGroup.bind(this))}
                            {isMultipleSelect ? <col width={40}/> : null}
                            {columns.map((column, index) => <col key={index} width={('props' in column) ? column.props['width'] || '' : ''}/>)}
                        </colgroup>
                        <thead className="table__header">
                            <tr className="table__header-row">
                                {isMultipleSelect
                                    ? <th className="table__header-row" style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                        <CheckBox
                                            disabled={disabled || ! items.length}
                                            checked={isSelectedAll}
                                            indeterminate={isIndeterminate}
                                            onChange={this._handlerSelectAllItems.bind(this)}
                                        />
                                    </th>
                                    : null}
                                {columns.map(this._renderTH.bind(this))}
                            </tr>
                        </thead>
                    </table>
                    : null
                }
                <table className="table" ref={ref => this.table = ref}>
                    <colgroup ref={ref => this.tableCols = ref}>
                        {isMultipleSelect ? <col width={40}/> : null}
                        {columns.map(Table._renderColGroup.bind(this))}
                    </colgroup>
                    <thead className="table__header" ref={ref => this.tableHead = ref}>
                        <tr className="table__header-row">
                            {isMultipleSelect
                                ? <th className="table__header-row" style={{textAlign: 'center', verticalAlign: 'bottom', padding: '0 0 7px 0'}}>
                                    <CheckBox
                                        disabled={disabled || ! items.length}
                                        checked={isSelectedAll}
                                        indeterminate={isIndeterminate}
                                        onChange={this._handlerSelectAllItems.bind(this)}
                                    />
                                </th>
                                : null}
                            {columns.map(this._renderTH.bind(this))}
                        </tr>
                    </thead>
                    {inProcess && inProcess.use && inProcess.state 
                        ? <caption className="table__message">{inProcess.template()}</caption>
                        : items.length 
                            ? items.map(Table._renderTableBody.bind(this)) 
                            : nodataComponent || Table._renderNoData()}
                    
                </table>
            </div>
        );
    }
}