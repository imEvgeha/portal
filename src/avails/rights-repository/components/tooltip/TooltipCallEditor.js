import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './TooltipCallEditor.scss';
import {calculateIndicatorType, INDICATOR_NON, INDICATOR_RED} from '../../util/indicator';

class TooltipCallEditor extends Component {
    static propTypes = {
        data: PropTypes.object,
    };

    static defaultProps = {
        data: {},
    };

    constructor(props) {
        super(props);
        const {data} = props;
        this.state = { data };
    }

    isPopup = () => true;

    getValue = () => this.state.data;

    handleChange = (id) => {
        this.setState({
            id
        });
    };
    
    renderContent = () => {
        const {id} = this.state.data;
        switch (calculateIndicatorType(this.state.data)) {
            case INDICATOR_RED:
                return <span>Title | No matching title <a href={`/avails/rights/${id}/title-matching`}><b>FIND MATCH</b></a></span>;
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

export default TooltipCallEditor;

