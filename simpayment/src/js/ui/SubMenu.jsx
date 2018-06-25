'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class SubMenu extends Component {

    static propTypes = {
        defaultActiveLink: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            add: PropTypes.object,
            disabled: PropTypes.bool,
            visible: PropTypes.bool
        }))
    };

    constructor(props) {
        super(props);

        this.state = this._setState(props);
    }

    componentWillReceiveProps(nextProps) {

        this.setState(this._setState(nextProps));
    }

    _setState(state) {

        return {
            defaultActiveLink: state.defaultActiveLink,
            items: state.items
        };
    }

    render() {

        const {defaultActiveLink, items} = this.state;

        return (
            <nav className="sub-navigate">
                {items.map((item, index) => {

                    const isActive = (new RegExp(`^(#?)(${defaultActiveLink})$`, 'ig')).test(item.url);
                    const isDisabled = item.disabled || false;
                    const isVisible = (item.visible !== undefined) ? item.visible : true;

                    return (
                        isVisible
                            ? <span
                                key={index}
                                className={
                                    'sub-navigate__item' +
                                    (isActive ? ' sub-navigate__item--active' : '') +
                                    (isDisabled ? ' sub-navigate__item--disabled' : '')
                                }
                            >
                                {isDisabled
                                    ? <span className="sub-navigate__link">
                                        <span className="sub-navigate__caption">{item.caption}</span>
                                    </span>
                                    : <div className="sub-navigate__link" onClick={() => location.href = item.url}>
                                        <span className="sub-navigate__caption">{item.caption}</span>
                                        {item.add || null}
                                    </div>
                                }
                            </span>
                            : null
                    );
                })}
            </nav>
        );
    }
}