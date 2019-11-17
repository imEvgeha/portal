import React from 'react';
import { Button } from 'reactstrap';
import t from 'prop-types';
import RightsResultTable from '../dashboard/components/RightsResultTable';
import { profileService } from '../service/ProfileService';
import { historyService } from '../service/HistoryService';
import { rightSearchHelper } from '../dashboard/RightSearchHelper';
import { URL } from '../../../util/Common';
import { Can } from '../../../ability';
import DashboardDropableCard from '../dashboard/card/DashboardDropableCard';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import { RIGHTS_CREATE_FROM_PDF } from '../../../constants/breadcrumb';
import { connect } from 'react-redux';
import ManualRightsEntryDOPConnector from './ManualRightsEntryDOPConnector';
import ManualRightEntryTableTabs from './ManualRightsEntryTableTabs';
import {FATAL, tabFilter} from '../../../constants/avails/manualRightsEntryTabs';

const REFRESH_INTERVAL = 5 * 1000; //5 seconds

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectedTab: state.manualRightsEntry.session.selectedTab,
    };
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
    }

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
                    errorMessage: 'Download Failed. Url not available.'
                });
            });
    }

    formatAttachmentName = (link) => {
        return link.split(/(\\|\/)/g).pop();
    }

    renderAttachments = (type, icon) => {
        return this.state.historyData &&
            this.state.historyData.attachments &&
            this.state.historyData.attachments
                .filter(({ attachmentType }) => attachmentType === type)
                .map((e, i, arr) => {
                    if(icon) {
                        return (
                            <div key={i} style={{display:'inline-block', width:'32px', boxSizing: 'border-box'}}>
                                    <a href="#" onClick = {() => this.getDownloadLink(e)} title={this.formatAttachmentName(e.link)} style={{color:'#A9A9A9', fontSize:'30px', verticalAlign: 'middle'}}><i className={icon}></i></a>
                                </div>
                        );
                    } else {
                        return (
                            <div key={i} style={{ display: 'inline-block' }}>
                                <a href="#" className={'text-danger'} onClick={() => this.getDownloadLink(e)}>{this.formatAttachmentName(e.link)}</a>{arr.length - 1 === i ? '' : ','}&nbsp;&nbsp;&nbsp;
                                </div>
                        );
                    }
                });
    }

    render() {
        return (
            <div className={'mx-2'}>
                <ManualRightsEntryDOPConnector/>
                <div className={'d-flex justify-content-between'}>
                    <div>
                        <div><h3>Manual Rights Entry </h3></div>
                        {this.state.historyData && this.state.historyData.attachments && ( 
                            <React.Fragment>
                                <div> Studio: {this.state.historyData.provider} &nbsp; {this.renderAttachments('Email', 'far fa-envelope')}</div>
                                <div> PDF Attachments: &nbsp; {this.renderAttachments('PDF')}</div>
                                <div> Upload Attachments: &nbsp; {this.renderAttachments('Excel')}</div>
                            </React.Fragment>)}
                        <Button className={'align-bottom mt-5'} id="right-create" onClick={this.createRight}>Create Right</Button>
                    </div>
                    <div>
                        <Can I="create" a="Avail">
                            <DashboardDropableCard
                                externalId={this.state.historyData ? this.state.historyData.externalId : null}
                            />
                        </Can>
                    </div>
                </div>
                <hr style={{ color: 'black', backgroundColor: 'black' }} />
                <div> Rights Created </div>
                {this.props.availsMapping &&
                    <React.Fragment>
                        <ManualRightEntryTableTabs getCustomSearchCriteria={this.getCustomSearchCriteria}/>
                        <RightsResultTable
                            fromServer={true}
                            columns={['title', 'productionStudio', 'territory', 'genres', 'start', 'end']}
                            nav={{ back: 'manual-rights-entry', params: { availHistoryId: this.state.availHistoryId } }}
                            autoload={false}
                            selectedTab={this.props.selectedTab}
                            hidden={this.props.selectedTab === FATAL}
                        />
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(RightsCreateFromAttachment);