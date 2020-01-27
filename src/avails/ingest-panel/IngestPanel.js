import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getIngests, getSelectedIngest, getSelectedAttachmentId, getTotalIngests} from './ingestSelectors';
import {fetchIngests, fetchNextPage, selectIngest} from './ingestActions';
import PanelHeader from './components/panel-header/PanelHeader';
import Ingest from './components/ingest/Ingest';
import Bundle from './components/bundle/Bundle';
import {getFiltersToSend} from './utils';
import './IngestPanel.scss';
import Constants from './constants';

const IngestPanel = ({onFiltersChange, ingests, totalIngests, fetchNextPage, selectedIngest, selectedAttachmentId, ingestClick}) => {
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
    const {attachmentTypes: {EXCEL}} = Constants;
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
                    ingests.map(({id, attachments, received, provider, ingestType}) => {
                        const excelAttachments = attachments.filter(a => a.attachmentType && a.attachmentType === EXCEL);
                        return (excelAttachments.length > 1) ? (
                            <Bundle key={id}
                                    id={id}
                                    attachments={excelAttachments}
                                    received={received}
                                    provider={provider}
                                    ingestType={ingestType}
                                    ingestClick={ingestClick}
                                    selectedAttachmentId={selectedAttachmentId}
                            />) : ((excelAttachments.length === 1) &&
                            (<Ingest key={id}
                                     attachment={excelAttachments[0]}
                                     received={received}
                                     provider={provider}
                                     ingestType={ingestType}
                                     ingestClick={() => ingestClick({
                                         availHistoryId: id,
                                         attachmentId: excelAttachments[0].id
                                     })}
                                     selected={selectedIngest && (selectedIngest.id === id)}
                            />));
                    })
                }
            </div>
        </div>
    );
};

IngestPanel.propTypes = {
    ingests: PropTypes.array,
    totalIngests: PropTypes.number,
    selectedIngest: PropTypes.object,
    selectedAttachmentId: PropTypes.string,
    onFiltersChange: PropTypes.func,
    fetchNextPage: PropTypes.func,
    ingestClick: PropTypes.func,
};

IngestPanel.defaultProps = {
    ingests: [],
    totalIngests: 0,
    selectedIngest: {},
    selectedAttachmentId: '',
    onFiltersChange: () => null,
    fetchNextPage: () => null,
    ingestClick: () => null,
};

const mapStateToProps = () => {
    return (state) => ({
        ingests: getIngests(state),
        totalIngests: getTotalIngests(state),
        selectedIngest: getSelectedIngest(state),
        selectedAttachmentId: getSelectedAttachmentId(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
    fetchNextPage: () => dispatch(fetchNextPage()),
    ingestClick: (payload) => dispatch(selectIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel);
