import React, {useState} from 'react';
import {connect} from 'react-redux';
import IngestFilters from './components/ingest-filters/IngestFilters';
import {getAvails} from '../availsSelectors';
import {updateFilters} from '../availsActions';
import PanelHeader from './components/panel-header/PanelHeader';
import './IngestPanel.scss';

class IngestPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showFilters: false
        };
    }

    componentDidMount() {
        this.props.onFiltersChange({});
    }

    toggleFilters = () => {
        this.setState({
            showFilters: !this.state.showFilters
        });
    };

    render () {
        return (
            <div className='ingest-panel'>
                <PanelHeader
                    showFilters={this.state.showFilters}
                    toggleFilters={this.toggleFilters}
                    onFiltersChange={this.props.onFiltersChange}/>
            </div>
        );
    }
}

const mapStateToProps = () => {
    return (state) => ({
        avails: getAvails(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onFiltersChange: payload => dispatch(updateFilters(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel); // eslint-disable-line