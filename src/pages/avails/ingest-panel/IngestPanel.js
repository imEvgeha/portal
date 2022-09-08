import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@atlaskit/icon/glyph/add';
import {Restricted} from '@portal/portal-auth/permissions';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import NexusUploadButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload-button/NexusUploadButton';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {debounce} from 'lodash';
import {connect} from 'react-redux';
import Bundle from './components/bundle/Bundle';
import Ingest from './components/ingest/Ingest';
import PanelHeader from './components/panel-header/PanelHeader';
import RefreshConfigBtn from './components/reload-config/ReloadConfigBtn';
import InputForm from './components/upload-ingest/InputForm/InputForm';
import {fetchIngests, fetchNextPage, selectIngest} from './ingestActions';
import {getIngests, getSelectedIngest, getSelectedAttachmentId, getTotalIngests} from './ingestSelectors';
import {getFiltersToSend} from './utils';
import './IngestPanel.scss';
import Constants, {DEBOUNCE_TIMEOUT, UPLOAD_TITLE} from './constants';

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

    const buildForm = data => {
        const {ingestData, closeUploadModal, file, browseClick, openModalCallback, closeModalCallback} = data;
        return (
            <InputForm
                ingestData={ingestData}
                closeModal={closeUploadModal}
                file={file}
                browseClick={browseClick}
                openModalCallback={openModalCallback}
                closeModalCallback={closeModalCallback}
            />
        );
    };

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
            <div className="row w-100 align-items-center">
                <div className="col-6">
                    <Restricted resource="availsIngestButton">
                        <NexusUploadButton
                            modalContext={NexusModalContext}
                            modalCallback={buildForm}
                            title={UPLOAD_TITLE}
                            icon={AddIcon}
                            withModal
                            extensionsAccepted={getConfig('avails.upload.extensions')}
                        />
                    </Restricted>
                </div>

                <div className="col-6 text-end">
                    <RefreshConfigBtn />
                </div>
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
