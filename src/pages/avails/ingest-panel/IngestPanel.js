import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import {connect} from 'react-redux';
import Bundle from './components/bundle/Bundle';
import Ingest from './components/ingest/Ingest';
import PanelHeader from './components/panel-header/PanelHeader';
import RefreshConfigBtn from './components/reload-config/ReloadConfigBtn';
import UploadIngestButton from './components/upload-ingest/upload-ingest-button/UploadIngestButton';
import {fetchIngests, fetchNextPage, selectIngest} from './ingestActions';
import {getIngests, getSelectedIngest, getSelectedAttachmentId, getTotalIngests} from './ingestSelectors';
import {getFiltersToSend} from './utils';
import './IngestPanel.scss';
import Constants, {DEBOUNCE_TIMEOUT} from './constants';

const {
    attachmentTypes: {EXCEL, PDF},
} = Constants;

const IngestPanel = ({
    onFiltersChange,
    ingests,
    totalIngests,
    fetchNextPage,
    selectedIngest,
    selectedAttachmentId,
    ingestClick,
    isTableDataLoading,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        onFiltersChange(getFiltersToSend());
    }, [onFiltersChange]);

    const panelRef = React.createRef();

    const toggleFilters = () => setShowFilters(!showFilters);

    const onScroll = e => {
        const {target: {scrollHeight, scrollTop, clientHeight} = {}} = e || {};
        if (scrollHeight - scrollTop - clientHeight < 1 && ingests.length < totalIngests) {
            fetchNextPage();
        }
    };

    const filtersChange = filters => {
        if (panelRef && panelRef.current) {
            panelRef.current.scrollTop = 0;
        }
        onFiltersChange(filters);
    };

    return (
        <div className="ingest-panel">
            <PanelHeader isShowingFilters={showFilters} toggleFilters={toggleFilters} onFiltersChange={filtersChange} />
            <div className="ingest-panel__list" onScroll={onScroll} ref={panelRef}>
                {ingests.map(({id, attachments, received, licensor, ingestType, emailSubject}) => {
                    const excelPdfAttachments = attachments.filter(
                        ({attachmentType}) => attachmentType && (attachmentType === EXCEL || attachmentType === PDF)
                    );

                    const handleIngestClick = () =>
                        ingestClick({
                            availHistoryId: id,
                            attachmentId: excelPdfAttachments[0].id,
                            selectedAttachmentId,
                        });

                    return excelPdfAttachments.length > 1 ? (
                        <Bundle
                            key={id}
                            id={id}
                            attachments={excelPdfAttachments}
                            received={received}
                            licensor={licensor}
                            ingestType={ingestType}
                            ingestClick={ingestClick}
                            selectedAttachmentId={selectedAttachmentId}
                            emailSubject={emailSubject}
                        />
                    ) : (
                        excelPdfAttachments.length === 1 && (
                            <Ingest
                                key={id}
                                attachment={excelPdfAttachments[0]}
                                received={received}
                                licensor={licensor}
                                ingestType={ingestType}
                                ingestClick={
                                    !isTableDataLoading
                                        ? debounce(handleIngestClick, DEBOUNCE_TIMEOUT, {leading: true})
                                        : null
                                }
                                isSelected={selectedIngest && selectedIngest.id === id}
                                ingestId={id}
                                emailSubject={emailSubject}
                            />
                        )
                    );
                })}
            </div>
            <div className="ingest-panel__btns">
                <UploadIngestButton />
                <RefreshConfigBtn />
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
    isTableDataLoading: PropTypes.bool,
};

IngestPanel.defaultProps = {
    ingests: [],
    totalIngests: 0,
    selectedIngest: {},
    selectedAttachmentId: '',
    onFiltersChange: () => null,
    fetchNextPage: () => null,
    ingestClick: () => null,
    isTableDataLoading: false,
};

const mapStateToProps = () => {
    return state => ({
        ingests: getIngests(state),
        totalIngests: getTotalIngests(state),
        selectedIngest: getSelectedIngest(state),
        selectedAttachmentId: getSelectedAttachmentId(state),
    });
};

const mapDispatchToProps = dispatch => ({
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
    fetchNextPage: () => dispatch(fetchNextPage()),
    ingestClick: payload => dispatch(selectIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IngestPanel);
