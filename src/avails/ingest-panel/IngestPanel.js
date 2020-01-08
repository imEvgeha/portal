import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getIngests, getSelectedIngest, getTotalIngests} from '../availsSelectors';
import {fetchIngests, fetchNextPage, selectIngest} from '../availsActions';
import PanelHeader from './components/panel-header/PanelHeader';
import Ingest from './components/ingest/Ingest';
import {getFiltersToSend} from './utils';
import './IngestPanel.scss';

const IngestPanel = ({onFiltersChange, ingests, totalIngests, fetchNextPage, selectedIngest, ingestClick}) => {

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        onFiltersChange(getFiltersToSend());
    }, []);

    const panelRef = React.createRef();

    const toggleFilters = () => setShowFilters(!showFilters);

    const onScroll = e => {
        const {target: {scrollHeight, scrollTop, clientHeight} = {}} = e || {};
        if ((scrollHeight - scrollTop - clientHeight < 1) && (ingests.length < totalIngests)) {
            fetchNextPage();
        }
    };

    const filtersChange = filters => {
        if(panelRef && panelRef.current){
            panelRef.current.scrollTop = 0;
        }
        onFiltersChange(filters);
    };

    return (
        <div className='ingest-panel'>
            <PanelHeader
                showFilters={showFilters}
                toggleFilters={toggleFilters}
                onFiltersChange={filtersChange}
            />
            <div
                className='ingest-panel__list'
                onScroll={onScroll}
                ref={panelRef}>
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
                                     ingestClick={() => ingestClick(id)}
                                     selected={selectedIngest && (selectedIngest.id === id)}
                            />))
                    ))
                }
            </div>
        </div>
    );
};

IngestPanel.propTypes = {
    ingests: PropTypes.array,
    totalIngests: PropTypes.number,
    selectedIngest: PropTypes.object,
    onFiltersChange: PropTypes.func,
    fetchNextPage: PropTypes.func,
    ingestClick: PropTypes.func,
};

IngestPanel.defaultProps = {
    ingests: [],
    totalIngests: 0,
    selectedIngest: {},
    onFiltersChange: () => null,
    fetchNextPage: () => null,
    ingestClick: () => null,
};

const mapStateToProps = () => {
    return (state) => ({
        ingests: getIngests(state),
        totalIngests: getTotalIngests(state),
        selectedIngest: getSelectedIngest(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
    fetchNextPage: () => dispatch(fetchNextPage()),
    ingestClick: payload => dispatch(selectIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel);