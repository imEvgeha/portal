import React from 'react';
import {connect} from 'react-redux';
import {getAvails, getTotalAvails} from '../availsSelectors';
import {fetchAvails, fetchNextPage} from '../availsActions';
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
        const {avails, totalAvails, fetchNextPage} = this.props;
        if ((scrollHeight - scrollTop === clientHeight) && (avails.length < totalAvails)) {
            fetchNextPage();
        }
    };

    onFiltersChange = filters => {
        this.panelRef.current.scrollTop = 0;
        this.props.onFiltersChange(filters);
    };

    render () {
        const {avails} = this.props;
        return (
            <div className='ingest-panel'>
                <PanelHeader
                    showFilters={this.state.showFilters}
                    toggleFilters={this.toggleFilters}
                    onFiltersChange={this.onFiltersChange}
                />
                <div
                    className='ingest-panel__avails-list'
                    onScroll={this.onScroll}
                    ref={this.panelRef}>
                    {
                        avails.map(({id, attachments, received, provider, ingestType}) => (
                            (attachments.length > 1) ? (
                                <div key={id}>Bundle</div>
                            ) : (<Ingest key={id}
                                         attachment={attachments[0]}
                                         received={received}
                                         provider={provider}
                                         ingestType={ingestType}
                            />)
                        ))
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => {
    return (state) => ({
        avails: getAvails(state),
        totalAvails: getTotalAvails(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onFiltersChange: payload => dispatch(fetchAvails(payload)),
    fetchNextPage: () => dispatch(fetchNextPage())
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel); // eslint-disable-line