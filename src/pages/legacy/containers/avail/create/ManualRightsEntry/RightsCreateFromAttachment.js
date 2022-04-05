import React from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import AddIcon from '@atlaskit/icon/glyph/add';
import {Button} from 'reactstrap';
import AkButton from '@atlaskit/button';
import {connect} from 'react-redux';
import RightsResultTable from '../../dashboard/components/RightsResultTable';
import {profileService} from '../../service/ProfileService';
import {historyService} from '../../service/HistoryService';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Can} from '@vubiquity-nexus/portal-utils/lib/ability';
import ManualRightsEntryDOPConnector from './components/ManualRightsEntryDOPConnector';
import ManualRightEntryTableTabs from './components/ManualRightsEntryTableTabs';
import * as selectors from './manualRightEntrySelector';
import ManualRightEntryFatalView from './components/ManualRightEntryFatalView';
import {
    manualRightsResultPageLoading,
    updateManualRightsEntryColumns,
} from '../../../../stores/actions/avail/manualRightEntry';
import NexusUploadButton from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload-button/NexusUploadButton';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import StatusIcon from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-icon/StatusIcon';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import TableDownloadRights from '../../../../containers/avail/nexus-table-download-rights/TableDownload';
import IngestReport from '../../../../../avails/ingest-panel/components/ingest-report/IngestReport';
import TableColumnCustomization from '@vubiquity-nexus/portal-ui/lib/elements/nexus-table-column-customization/TableColumnCustomization';
import {ATTACHMENTS_TAB, FATAL, tabFilter, VIEW_JSON} from '../../../../constants/avails/manualRightsEntryTabs';
import attachmentsColumnDefs from '../../../../constants/avails/manualRightsEntryAttachmentsColumnDefs.json';
import moment from 'moment';
import Constants from './Constants.js';
import './ManualRighstEntry.scss';
import ReuploadIngestButton from '../../../../../avails/ingest-panel/components/upload-ingest/reupload-ingest-button/ReuploadIngestButton';
import InputForm from '../../../../../avails/ingest-panel/components/upload-ingest/InputForm/InputForm';
import {getConfig} from '../../../../../../config';
import withRouter from '@vubiquity-nexus/portal-ui/lib/hocs/withRouter';

const {REFRESH_INTERVAL, ATTACHMENT_TOOLTIP, EMAIL_BUTTON, UPLOAD_TITLE} = Constants;

const mapStateToProps = () => {
    const manualRightsEntrySelectedTabSelector = selectors.createManualRightsEntrySelectedTabSelector();
    const manualRightsEntryColumnsSelector = selectors.createManualRightsEntryColumnsSelector();
    return (state, props) => ({
        availsMapping: state.root.availsMapping,
        selectedTab: manualRightsEntrySelectedTabSelector(state, props),
        columns: manualRightsEntryColumnsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    updateManualRightsEntryColumns: payload => dispatch(updateManualRightsEntryColumns(payload)),
});

class RightsCreateFromAttachment extends React.Component {
    // Flag that tells if a component is mounted or not and is used as a failsafe in async requests
    // if component gets unmounted during call execution to prevent setting state on an unmounted component
    _isMounted = false;

    constructor(props) {
        super(props);
        this.createRight = this.createRight.bind(this);
        this.getHistoryData = this.getHistoryData.bind(this);
        this.refresh = null;
        this.state = {
            availHistoryId: this.props.match.params.availHistoryIds,
            historyData: {},
            // eslint-disable-next-line react/no-unused-state
            table: null,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getHistoryData();
        if (this.props.router.location && this.props.router.location.search) {
            const sparams = new URLSearchParams(this.props.router.location.search);
            const availHistoryIds = sparams.get('availHistoryIds');
            if (availHistoryIds) {
                sparams.delete('availHistoryIds');
                this.props.router.history.replace(
                    '/avails/history/' + availHistoryIds + '/manual-rights-entry?' + sparams.toString()
                );
                return;
            }
        }

        if (!this.props.availsMapping) {
            profileService.initAvailsMapping();
            return;
        }
    }

    getCustomSearchCriteria = tab => {
        return Object.assign({}, tabFilter.get(tab), {availHistoryIds: this.state.availHistoryId});
    };

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping !== this.props.availsMapping || prevProps.selectedTab !== this.props.selectedTab) {
            // this.getSearchCriteriaFromURLWithCustomOne();
            this.getHistoryData();
            if (this.refresh === null) {
                this.refresh = setInterval(this.getHistoryData, REFRESH_INTERVAL);
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.refresh !== null) {
            clearInterval(this.refresh);
            this.refresh = null;
        }
    }

    cellRenderers = {
        report: ({value, data}) => (
            <div className="nexus-c-report">
                <IngestReport
                    isShowingError={false}
                    report={value}
                    ingestId={this.state.availHistoryId}
                    attachmentId={data.attachment.id}
                />
            </div>
        ),
        status: ({value}) => (
            <div className="nexus-c-status-tag-old">
                <StatusTag status={value} />
            </div>
        ),
        attachment: ({value, data}) => (
            <div>
                <div className="nexus-c-attachment">
                    <NexusTooltip
                        content={
                            <div>
                                {ATTACHMENT_TOOLTIP}
                                <div className="nexus-c-attachment-name">{this.formatAttachmentName(value.link)}</div>
                            </div>
                        }
                    >
                        <div className="nexus-c-attachment-link-old">
                            <AkButton appearance="link" onClick={() => this.getDownloadLink(value)}>
                                <>{typeof value.link === 'string' && this.formatAttachmentName(value.link)}</>
                            </AkButton>
                        </div>
                    </NexusTooltip>
                    {data.attachment.status === 'FAILED' && (
                        <ReuploadIngestButton attachment={data.attachment} ingestData={this.state.historyData} />
                    )}
                </div>
                <div className="nexus-c-received-date ">
                    {moment(this.state.historyData.received).format('ddd, MMM D, YYYY | hh:mm:ss A')}
                </div>
            </div>
        ),
        error: ({value}) => (
            <div className="nexus-c-attachment-error-old">
                {value && (
                    <>
                        <span className="nexus-c-attachment-error-old__icon">⚠</span>
                        {value}
                    </>
                )}
            </div>
        ),
    };

    getAttachmentsColumnDefs = (initialColumnDefs = []) => {
        return initialColumnDefs.map(colDef => ({
            ...colDef,
            cellRenderer: colDef.field,
            cellStyle: params => {
                if (params.colDef.field === 'error')
                    return {
                        'white-space': 'normal',
                        'overflow-y': 'auto',
                    };
                return {
                    'white-space': 'normal',
                };
            },
        }));
    };

    getAttachmentsRowData = (attachments = []) => {
        return (
            Array.isArray(attachments) &&
            attachments
                .filter(({attachmentType}) => attachmentType !== 'Email')
                .map((attachment = {}) => {
                    const {status = '', ingestReport} = attachment || {};

                    const {errorDetails = ''} = ingestReport || {};

                    return {
                        error: errorDetails,
                        attachment,
                        status,
                        report: ingestReport,
                    };
                })
        );
    };

    getHistoryData() {
        if (this.state.availHistoryId) {
            historyService
                .getHistory(this.state.availHistoryId, true)
                .then(res => {
                    if (res && this._isMounted) {
                        this.setState({
                            historyData: res,
                        });
                    }
                })
                .catch(() => {});
        }
    }

    createRight() {
        this.props.router.navigate(URL.keepEmbedded('/avails/history/' + this.state.availHistoryId + '/rights/create'));
    }

    getDownloadLink(attachment) {
        if (!attachment.id) return;

        let filename = 'Unknown';
        if (attachment.link) {
            filename = attachment.link.split(/(\\|\/)/g).pop();
        }

        historyService
            .getAvailHistoryAttachment(attachment.id)
            .then(response => {
                if (response && response.downloadUrl) {
                    const link = document.createElement('a');
                    link.href = response.downloadUrl;
                    link.setAttribute('download', filename);
                    link.click();
                }
            })
            .catch(() => {});
    }

    formatAttachmentName = link => {
        return link.split(/(\\|\/)/g).pop();
    };

    renderAttachments = (type, icon) => {
        const {attachments = []} = this.state.historyData || {};
        return attachments
            .filter(({attachmentType}) => attachmentType === type)
            .map((e, i, arr) => {
                return (
                    <NexusTooltip key={i} content={ATTACHMENT_TOOLTIP}>
                        <div className={icon ? 'nexus-c-manual-rights-entry__attachment--icon' : ''}>
                            <a href="#" onClick={() => this.getDownloadLink(e)}>
                                {icon ? <i className={icon} /> : this.formatAttachmentName(e.link)}
                            </a>
                            <span className="separator">{arr.length - 1 === i ? '' : ','}</span>
                        </div>
                    </NexusTooltip>
                );
            });
    };

    updateColumnsOrder = cols => {
        this.props.updateManualRightsEntryColumns(cols);
        manualRightsResultPageLoading(true); //force refresh
    };

    onTableLoaded = table => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({table});
    };

    getSelectedBasedOnTab = () => {
        const {selected} = this.props || [];
        const {table} = this.state || {};
        const selectedOnTab = [];
        if (table.api && selected) {
            table.api.forEachNode(rowNode => {
                if (rowNode.data && selected.filter(sel => sel.id === rowNode.data.id).length > 0) {
                    selectedOnTab.push(rowNode.data);
                }
            });
        }
        return selectedOnTab;
    };

    buildForm = data => {
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

    render() {
        const {
            historyData: {
                attachments,
                ingestType,
                status,
                externalId = null,
                ingestReport: {errorDetails, created, updated, fatal} = {},
            } = {},
            availHistoryId,
        } = this.state;
        const {availsMapping, selectedTab, columns} = this.props;

        return (
            <div className="mx-2 nexus-c-manual-rights-entry">
                <ManualRightsEntryDOPConnector />
                <div className="nexus-c-manual-rights-entry__description">
                    <div>
                        <div>
                            <h3>Manual Rights Entry</h3>
                        </div>
                        <section className="nexus-c-manual-rights-entry__attachment">
                            <label>Received By:</label>
                            {ingestType} {this.renderAttachments(EMAIL_BUTTON.type, EMAIL_BUTTON.icon)}
                        </section>
                        <section className="nexus-c-manual-rights-entry__attachment">
                            <label>Status:</label>
                            <StatusIcon status={status} />
                        </section>
                        {errorDetails && (
                            <section className="nexus-c-manual-rights-entry__error">{errorDetails}</section>
                        )}
                    </div>
                    <div>
                        <Can I="create" a="Avail">
                            <NexusUploadButton
                                modalContext={NexusModalContext}
                                modalCallback={this.buildForm}
                                title={UPLOAD_TITLE}
                                ingestData={this.state.historyData}
                                icon={AddIcon}
                                withModal
                                extensionsAccepted={getConfig('avails.upload.extensions')}
                            />
                        </Can>
                    </div>
                </div>
                {availsMapping && (
                    <>
                        <div className="nexus-c-manual-rights-entry__table_header">
                            <ManualRightEntryTableTabs
                                getCustomSearchCriteria={this.getCustomSearchCriteria}
                                createdCount={created}
                                updatedCount={updated}
                                historyData={this.state.historyData}
                                availHistoryId={availHistoryId}
                                fatalCount={fatal}
                            />
                            <div className="nexus-c-manual-rights-entry__actions">
                                <Button
                                    className="nexus-c-manual-rights-entry__button"
                                    id="right-create"
                                    onClick={this.createRight}
                                >
                                    Create Right
                                </Button>
                                <TableColumnCustomization
                                    availsMapping={availsMapping}
                                    updateColumnsOrder={this.updateColumnsOrder}
                                    columns={columns}
                                />
                                <TableDownloadRights
                                    getColumns={() => columns}
                                    allowDownloadFullTab={true}
                                    exportCriteria={this.getCustomSearchCriteria(selectedTab)}
                                    selectedTab={selectedTab}
                                    getSelected={this.getSelectedBasedOnTab}
                                />
                            </div>
                        </div>
                        {![VIEW_JSON, ATTACHMENTS_TAB].includes(selectedTab) && (
                            <RightsResultTable
                                fromServer={true}
                                columns={columns}
                                nav={{back: 'manual-rights-entry', params: {availHistoryId}}}
                                autoload={false}
                                status={status}
                                selectedTab={selectedTab}
                                historyData={this.state.historyData}
                                hidden={selectedTab === FATAL}
                                searchCriteria={this.getCustomSearchCriteria(selectedTab)}
                                onTableLoaded={this.onTableLoaded}
                            />
                        )}
                        {selectedTab === ATTACHMENTS_TAB && (
                            <div className="ag-theme-balham" style={{height: 'calc(100vh - 224px)'}}>
                                <AgGridReact
                                    columnDefs={this.getAttachmentsColumnDefs(attachmentsColumnDefs)}
                                    rowData={this.getAttachmentsRowData(attachments)}
                                    headerHeight="52"
                                    rowHeight="75"
                                    frameworkComponents={{
                                        status: this.cellRenderers['status'],
                                        attachment: this.cellRenderers['attachment'],
                                        report: this.cellRenderers['report'],
                                        error: this.cellRenderers['error'],
                                    }}
                                />
                            </div>
                        )}
                        <ManualRightEntryFatalView attachments={attachments} hidden={selectedTab !== FATAL} />
                    </>
                )}
            </div>
        );
    }
}
RightsCreateFromAttachment.propTypes = {
    match: PropTypes.object,
    router: PropTypes.object,
    availsMapping: PropTypes.any,
    selectedTab: PropTypes.string,
    updateManualRightsEntryColumns: PropTypes.func,
    columns: PropTypes.array,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RightsCreateFromAttachment));
