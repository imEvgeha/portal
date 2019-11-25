import React from 'react';
import { Button } from 'reactstrap';
import t from 'prop-types';
import RightsResultTable from '../../dashboard/components/RightsResultTable';
import { profileService } from '../../service/ProfileService';
import { historyService } from '../../service/HistoryService';
import { rightSearchHelper } from '../../dashboard/RightSearchHelper';
import { URL } from '../../../../util/Common';
import { Can } from '../../../../ability';
import DashboardDropableCard from '../../dashboard/card/components/DashboardDropableCard';
import NexusBreadcrumb from '../../../NexusBreadcrumb';
import { RIGHTS_CREATE_FROM_PDF } from '../../../../constants/breadcrumb';
import { connect } from 'react-redux';
import ManualRightsEntryDOPConnector from './components/ManualRightsEntryDOPConnector';
import StatusIcon from '../../components/StatusIcon';
import NexusTooltip from '../../../../ui-elements/nexus-tooltip/NexusTooltip';
import Constants from './Constants.js';
import './ManualRighstEntry.scss';
import ManualRightEntryTableTabs from './components/ManualRightsEntryTableTabs';
import {FATAL, tabFilter} from '../../../../constants/avails/manualRightsEntryTabs';
import * as selectors from './manualRightEntrySelector';

const {REFRESH_INTERVAL, ATTACHMENT_TOOLTIP, ATTACHMENTS, ERROR_MESSAGE} = Constants;

const mapStateToProps = () => {
    const manualRightsEntrySelectedTabSelector = selectors.createManualRightsEntrySelectedTabSelector();
    return (state, props) => ({
        availsMapping: state.root.availsMapping,
        selectedTab: manualRightsEntrySelectedTabSelector(state, props),
    });
};

class RightsCreateFromAttachment extends React.Component {

    static propTypes = {
        match: t.object,
        location: t.object,
        availsMapping: t.any,
        selectedTab: t.string
    };

    static contextTypes = {
        router: t.object
    };

    constructor(props) {
        super(props);
        this.createRight = this.createRight.bind(this);
        this.getHistoryData = this.getHistoryData.bind(this);
        this.refresh = null;
        this.state = {
            availHistoryId: this.props.match.params.availHistoryIds,
            historyData: {}
        };
    }

    componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const sparams = new URLSearchParams(this.props.location.search);
            const availHistoryIds = sparams.get('availHistoryIds');
            if (availHistoryIds) {
                sparams.delete('availHistoryIds');
                this.context.router.history.replace('/avails/history/' + availHistoryIds + '/manual-rights-entry?' + sparams.toString());
                return;
            }
        }
        if (NexusBreadcrumb.empty()) NexusBreadcrumb.set(RIGHTS_CREATE_FROM_PDF);

        if (!this.props.availsMapping) {
            profileService.initAvailsMapping();
            return;
        }

        this.getSearchCriteriaFromURLWithCustomOne();
    }

    getSearchCriteriaFromURLWithCustomOne() {
        const searchCriteria = this.getCustomSearchCriteria(this.props.selectedTab);
        rightSearchHelper.advancedSearch(searchCriteria, false);
        this.getHistoryData();
        if (this.refresh === null) {
            this.refresh = setInterval(this.getHistoryData, REFRESH_INTERVAL);
        }
    }

    getCustomSearchCriteria = (tab) => {
        return Object.assign( {}, tabFilter.get(tab), {availHistoryIds: this.state.availHistoryId});
    };

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping !== this.props.availsMapping || prevProps.selectedTab !== this.props.selectedTab) {
            this.getSearchCriteriaFromURLWithCustomOne();
        }
    }

    componentWillUnmount() {
        if (this.refresh !== null) {
            clearInterval(this.refresh);
            this.refresh = null;
        }
    }

    getHistoryData() {
        if (this.state.availHistoryId) {
            historyService.getHistory(this.state.availHistoryId)
                .then(res => {
                    if (res && res.data) {
                        this.setState({
                            historyData: res.data,
                        });
                    }
                })
                .catch(() => {
                });
        }
    }

    createRight() {
        this.context.router.history.push(URL.keepEmbedded('/avails/history/' + this.state.availHistoryId + '/rights/create'));
    }

    getDownloadLink(attachment) {
        if (!attachment.id) return;

        let filename = 'Unknown';
        if (attachment.link) {
            filename = attachment.link.split(/(\\|\/)/g).pop();
        }

        historyService.getAvailHistoryAttachment(attachment.id)
            .then(response => {
                if (response && response.data && response.data.downloadUrl) {
                    const link = document.createElement('a');
                    link.href = response.data.downloadUrl;
                    link.setAttribute('download', filename);
                    link.click();
                }
            })
            .catch(() => {
                this.setState({
                    errorMessage: ERROR_MESSAGE
                });
            });
    }

    formatAttachmentName = (link) => {
        return link.split(/(\\|\/)/g).pop();
    };

    renderAttachments = (type, icon) => {
        const {attachments = []} = this.state.historyData || {};
        return attachments.filter(({ attachmentType }) => attachmentType === type)
                .map((e, i, arr) => {
                    return (
                        <NexusTooltip key={i} content={ATTACHMENT_TOOLTIP}>
                            <div className={icon ? 'nexus-c-manual-rights-entry__attachment--icon' : ''}>
                                <a href="#"
                                   onClick = {() => this.getDownloadLink(e)}>
                                    {icon ? (<i className={icon}/>) : (this.formatAttachmentName(e.link))}
                                </a>
                                <span className='separator'>{arr.length - 1 === i ? '' : ','}</span>
                            </div>
                        </NexusTooltip>
                    );
                });
    };

    render() {
        const {historyData: {attachments, ingestType, status, externalId = null,
            ingestReport: {errorDetails, fatal} = {}} = {},
            availHistoryId}  = this.state;
        return (
            <div className='mx-2 nexus-c-manual-rights-entry'>
                <ManualRightsEntryDOPConnector/>
                <div className='nexus-c-manual-rights-entry__description'>
                    <div>
                        <div><h3>Manual Rights Entry</h3></div>
                        {
                            attachments && (
                                ATTACHMENTS.map(({label, type, icon, content}) => (
                                    <section className='nexus-c-manual-rights-entry__attachment' key={label}>
                                        <label>{label}:</label>
                                        {this.state.historyData[content]}
                                        {this.renderAttachments(type, icon)}
                                    </section>
                                ))
                            )
                        }
                        <section>
                            <label>Received By:</label>
                            <span>{ingestType}</span>
                        </section>
                        <section>
                            <label>Status:</label>
                            <StatusIcon status={status} />
                        </section>
                        {errorDetails && (<section className='nexus-c-manual-rights-entry__error'>{errorDetails}</section>)}
                    </div>
                    <div>
                        <Can I="create" a="Avail">
                            <DashboardDropableCard externalId={externalId}/>
                        </Can>
                    </div>
                </div>
                {this.props.availsMapping &&
                    <React.Fragment>
                        <div className='nexus-c-manual-rights-entry__table_header'>
                            <ManualRightEntryTableTabs getCustomSearchCriteria={this.getCustomSearchCriteria} fatalCount={fatal}/>
                            <div className='nexus-c-manual-rights-entry__actions'>
                                <Button className='nexus-c-manual-rights-entry__button'
                                        id="right-create"
                                        onClick={this.createRight}>
                                    Create Right
                                </Button>
                            </div>
                        </div>
                        <RightsResultTable
                            fromServer={true}
                            columns={['title', 'productionStudio', 'territory', 'genres', 'start', 'end']}
                            nav={{ back: 'manual-rights-entry', params: { availHistoryId } }}
                            autoload={false}
                            selectedTab={this.props.selectedTab}
                            hidden={this.props.selectedTab === FATAL}
                        />
                        <ManualRightEntryFatalView attachments={attachments}/>
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(RightsCreateFromAttachment);