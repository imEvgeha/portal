import React from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import {Button} from 'reactstrap';
import AkButton from '@atlaskit/button';
import {connect} from 'react-redux';
import RightsResultTable from '../../dashboard/components/RightsResultTable';
import {profileService} from '../../service/ProfileService';
import {historyService} from '../../service/HistoryService';
import {URL} from '../../../../../../util/Common';
import {Can} from '../../../../../../ability';
import ManualRightsEntryDOPConnector from './components/ManualRightsEntryDOPConnector';
import ManualRightEntryTableTabs from './components/ManualRightsEntryTableTabs';
import * as selectors from './manualRightEntrySelector';
import ManualRightEntryFatalView from './components/ManualRightEntryFatalView';
import {
    manualRightsResultPageLoading,
    updateManualRightsEntryColumns,
} from '../../../../stores/actions/avail/manualRightEntry';
import UploadIngestButton from '../../../../../avails/ingest-panel/components/upload-ingest/upload-ingest-button/UploadIngestButton';
import NexusTooltip from '../../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import StatusIcon from '../../../../../../ui/elements/nexus-status-icon/StatusIcon';
import StatusTag from '../../../../../../ui/elements/nexus-status-tag/StatusTag';
import TableDownloadRights from '../../../../../../ui/elements/nexus-table-download-rights/TableDownload';
import IngestReport from '../../../../../avails/ingest-panel/components/ingest-report/IngestReport';
import TableColumnCustomization from '../../../../../../ui/elements/nexus-table-column-customization/TableColumnCustomization';
import {ATTACHMENTS_TAB, FATAL, tabFilter, VIEW_JSON} from '../../../../constants/avails/manualRightsEntryTabs';
import attachmentsColumnDefs from '../../../../constants/avails/manualRightsEntryAttachmentsColumnDefs.json';
import Constants from './Constants.js';
import './ManualRighstEntry.scss';
import ReuploadIngestButton from '../../../../../avails/ingest-panel/components/upload-ingest/reupload-ingest-button/ReuploadIngestButton';

const {REFRESH_INTERVAL, ATTACHMENT_TOOLTIP, EMAIL_BUTTON} = Constants;

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
        if (this.props.location && this.props.location.search) {
            const sparams = new URLSearchParams(this.props.location.search);
            const availHistoryIds = sparams.get('availHistoryIds');
            if (availHistoryIds) {
                sparams.delete('availHistoryIds');
                this.context.router.history.replace(
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
        report: ({value}) => (
            <div className="nexus-c-report">
                <IngestReport isShowingError={false} report={value} ingestId={this.state.availHistoryId} hasTooltips />
            </div>
        ),
        status: ({value}) => (
            <div className="nexus-c-status-tag-old">
                <StatusTag status={value} />
            </div>
        ),
        attachment: ({value, data}) => (
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
                {data.attachment.status === 'FAILED' && <ReuploadIngestButton attachment={data.attachment} />}
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
        this.context.router.history.push(
            URL.keepEmbedded('/avails/history/' + this.state.availHistoryId + '/rights/create')
        );
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
        if (table.api) {
            table.api.forEachNode(rowNode => {
                if (rowNode.data && selected.filter(sel => sel.id === rowNode.data.id).length > 0) {
                    selectedOnTab.push(rowNode.data);
                }
            });
        }
        return selectedOnTab;
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
                            <UploadIngestButton ingestData={this.state.historyData} />
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
    location: PropTypes.object,
    availsMapping: PropTypes.any,
    selectedTab: PropTypes.string,
    updateManualRightsEntryColumns: PropTypes.func,
    columns: PropTypes.array,
};

RightsCreateFromAttachment.contextTypes = {
    router: PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(RightsCreateFromAttachment);
