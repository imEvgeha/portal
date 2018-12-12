import React, { Component } from 'react';
import t from 'prop-types';
import {Button} from 'reactstrap';

export default class CloseableBtn extends Component {

    static propTypes = {
        title: t.string,
        id: t.string,
        value: t.string,
        disabled: t.bool,

        onClick: t.func,
        onClose: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    closeStyle = {
        fontWeight: '800',
        fontSize: '1.4rem',
        position: 'absolute',
        padding: '0 10px 0 2px',
        right: '0px',
        top: '0px'
    };

    render() {
        return (
            <Button outline color="secondary" id={this.props.id} onClick={this.props.onClick}
                    disabled={this.props.disabled}
                    style={{ width: '100%', textAlign: 'left', position: 'relative'}}>
                <div style={{width: '100%', overflow: 'hidden', paddingRight: '20px', textOverflow: 'ellipsis'}}><small><strong>{this.props.title}</strong>{this.props.value}</small></div>
                <a href={'#'} style={this.closeStyle}><span aria-hidden="true">&times;</span></a>
            </Button>
        );
    }
}
