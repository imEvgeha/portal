import React from 'react';
import {Button} from 'reactstrap';
import t from 'prop-types';
import RightsResultTable from '../dashboard/components/RightsResultTable';
import {profileService} from '../service/ProfileService';
import {historyService} from '../service/HistoryService';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import {URL} from '../../../util/Common';
import {Can} from '../../../ability';
import DashboardDropableCard from '../dashboard/card/DashboardDropableCard';

export default class RightsCreateFromAttachment extends React.Component {

    static propTypes = {
        match: t.object
    };

    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);
        this.createRight = this.createRight.bind(this);
        this.state={
            availHistoryId: this.props.match.params.availHistoryIds,
            historyData:{},
        };
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        rightSearchHelper.advancedSearch({availHistoryIds: this.state.availHistoryId}, false);
        this.getHistoryData();
    }

    getHistoryData() {
        if(this.state.availHistoryId){
            historyService.getHistory(this.state.availHistoryId)
                .then(res => {
                    if(res && res.data) {
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

    getDownloadLink(attachment){
        if(!attachment.id) return;

        let filename = 'Unknown';
        if(attachment.link) {
            filename = attachment.link.split(/(\\|\/)/g).pop();
        }

        historyService.getAvailHistoryAttachment(attachment.id)
            .then(response => {
                if(response && response.data && response.data.downloadUrl){
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

    render(){
        let counter = 0;
        let atts = [];
        let firstName = '';
        if(this.state.historyData && this.state.historyData.attachments){
            atts = this.state.historyData.attachments.map(attachment => {
                let filename = 'Unknown';
                if(attachment.link) {
                    filename = attachment.link.split(/(\\|\/)/g).pop();
                }
                if(!firstName) firstName = filename;

                return (
                    <div key={counter++} style={{display:'inline-block'}}><a href="#" className={'text-danger'} onClick = {() => this.getDownloadLink(attachment)}>{filename}</a>&nbsp;&nbsp;&nbsp;</div>
                    // <div key={counter++} style={{display:'inline-block', width:'32px', boxSizing: 'border-box'}}><a href="#" onClick = {() => this.getDownloadLink(attachment)} title={filename} style={{color:'#A9A9A9', fontSize:'30px', verticalAlign: 'middle'}}><i className={'far fa-file-alt'}></i></a></div>
                );
            }).filter( elem=> {
                return elem !== '';
            });
        }

        return(
            <div className={'mx-2'}>
                <div className={'d-flex justify-content-between'}>
                    <div>
                        <div><h3>Create Rights from PDF </h3></div>
                        <div> Studio: {this.state.historyData.provider} </div>
                        <div> PDF Attachments: &nbsp;{atts} </div>
                        <Button className={'align-bottom mt-5'} id="right-create" onClick={this.createRight}>Create Right</Button>
                    </div>
                    <div>
                        <Can I="create" a="Avail">
                            <DashboardDropableCard
                                externalId = {this.state.historyData ? this.state.historyData.externalId : null}
                            />
                        </Can>
                    </div>
                </div>
                <hr style={{color:'black', backgroundColor:'black'}}/>
                <div> Rights Created </div>
                <RightsResultTable
                    fromServer = {true}
                    columns = {['title', 'productionStudio', 'territory', 'genres', 'start', 'end']}
                    nav = {{back : 'create_from_attachments', params: {availHistoryId: this.state.availHistoryId}}}
                    autoload = {false}
                />
            </div>
        );
    }
}