import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './TooltipCellEditor.scss';
import {calculateIndicatorType, INDICATOR_NON, INDICATOR_RED} from '../../util/indicator';

class TooltipCellEditor extends Component {
    static propTypes = {
        data: PropTypes.object,
    };

    static defaultProps = {
        data: {},
    };

    constructor(props) {
        super(props);
    }

    isPopup = () => true;

    getValue = () => this.props.data;

    handleChange = () => {};
    
    renderContent = () => {
        const {id} = this.props.data;
        switch (calculateIndicatorType(this.props.data)) {
            case INDICATOR_RED:
                return <span>Title | No matching title <a href={`/avails/rights/${id}/title-matching`} target='_blank'><b>FIND MATCH</b></a></span>;
            case INDICATOR_NON:
                return <span>Title | Matched title</span>;
        }
    };

    render() {
        return (
            <div className='nexus-c-right-to-match-view__tooltip'>
                {this.renderContent()}
            </div>
        );
    }
}

export default TooltipCellEditor;

