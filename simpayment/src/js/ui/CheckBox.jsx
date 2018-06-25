'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class CheckBox extends Component {

    static propTypes = {
        children: PropTypes.string,
        checked: PropTypes.bool,
        indeterminate: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            indeterminate: props.indeterminate || false
        };
    }

    componentDidMount() {

        const {indeterminate} = this.props;

        this._setIndeterminate(indeterminate);
    }

    _setIndeterminate(indeterminate) {

        const node = this['checkboxInput'];
        node.indeterminate = indeterminate;
    }

    componentWillReceiveProps(nextProps) {

        const {indeterminate} = nextProps;

        this._setIndeterminate(indeterminate);
    }

    _changeCheckedState() {

        const {onChange = false, checked = false} = this.props;
        const state = {
            checked: ! checked
        };

        if (onChange) {
            onChange.call(this, state.checked);
        }
    }

    render() {

        const {
            children,
            checked,
            disabled
        } = this.props;

        return(
            <label className="checkbox">
                <input
                    ref={ref => this.checkboxInput = ref}
                    className="checkbox__input"
                    type="checkbox"
                    disabled={disabled}
                    checked={checked}
                    onChange={this._changeCheckedState.bind(this)}
                />
                <span className="checkbox__visual"/>
                {children
                    ? <span className="checkbox__caption">{children}</span>
                    : null}
            </label>
        );
    }
}