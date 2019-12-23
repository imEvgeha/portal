import React, {useState} from 'react';
import {connect} from 'react-redux';
import AvailsIcon from '../../assets/Avails.svg';
import PopOutIcon from '../../assets/action-shortcut.svg';
import FilterIcon from '../../assets/filter.svg';
import FilterSolidIcon from '../../assets/filter-solid.svg';
import IngestFilters from './components/ingest-filters/IngestFilters';
import {getAvails} from '../availsSelectors';
import {updateFilters} from '../availsActions';
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
                <div className='ingest-panel__ingest-header'>
                    <div className='ingest-panel__ingest-header__title'>
                        <AvailsIcon />
                        <div>Avails</div>
                    </div>
                    <div className='ingest-panel__ingest-header__actions'>
                        <PopOutIcon
                            className='ingest-panel__ingest-header__actions--pop'
                            disabled={true}/>
                        <div onClick={this.toggleFilters}>
                            {
                                this.state.showFilters ? <FilterSolidIcon/> : <FilterIcon/>
                            }
                        </div>
                    </div>
                </div>
                {
                    this.state.showFilters && (
                        <IngestFilters onFiltersChange={this.props.onFiltersChange} />
                    )
                }
            </div>
        );
    }
};

const mapStateToProps = () => {
    return (state) => ({
        avails: getAvails(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onFiltersChange: payload => dispatch(updateFilters(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel); // eslint-disable-line