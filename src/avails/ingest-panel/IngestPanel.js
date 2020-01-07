import React from 'react';
import {connect} from 'react-redux';
import { getIngests, getTotalIngests } from '../availsSelectors';
import {fetchIngests, fetchNextPage} from '../availsActions';
import PanelHeader from './components/panel-header/PanelHeader';
import Ingest from './components/ingest/Ingest';
import {getFiltersToSend} from './utils';
import './IngestPanel.scss';

class IngestPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showFilters: false
        };
        this.panelRef = React.createRef();
    }

    componentDidMount() {
        this.props.onFiltersChange(getFiltersToSend());
    }

    toggleFilters = () => {
        this.setState({
            showFilters: !this.state.showFilters
        });
    };

    onScroll = e => {
        const {target: {scrollHeight, scrollTop, clientHeight} = {}} = e || {};
        const {ingests, totalIngests, fetchNextPage} = this.props;
        if ((scrollHeight - scrollTop - clientHeight < 1) && (ingests.length < totalIngests)) {
            fetchNextPage();
        }
    };

    onFiltersChange = filters => {
        this.panelRef.current.scrollTop = 0;
        this.props.onFiltersChange(filters);
    };

    render () {
        const {ingests, ingestClick, selectedIngest} = this.props;
        return (
            <div className='ingest-panel'>
                <PanelHeader
                    showFilters={this.state.showFilters}
                    toggleFilters={this.toggleFilters}
                    onFiltersChange={this.onFiltersChange}
                />
                <div
                    className='ingest-panel__list'
                    onScroll={this.onScroll}
                    ref={this.panelRef}>
                    {
                        ingests.map(({id, attachments, received, provider, ingestType}) => (
                            (attachments.length > 1) ? (
                                <div key={id}>Bundle</div>
                            ) : ( (attachments.length === 1) &&
                                (<Ingest key={id}
                                         attachment={attachments[0]}
                                         received={received}
                                         provider={provider}
                                         ingestType={ingestType}
                                         ingestClick={ingestClick}
                                         selected={selectedIngest === attachments[0].id}
                                />))
                        ))
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => {
    return (state) => ({
        ingests: getIngests(state),
        totalIngests: getTotalIngests(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
    fetchNextPage: () => dispatch(fetchNextPage())
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel); // eslint-disable-line