import React from 'react';
import t from 'prop-types';
import moment from 'moment';

import LoadingElipsis from '../../../../../src/img/ajax-loader.gif';
import {Link} from 'react-router-dom';

import {historyService} from '../../service/HistoryService';

class AvailHistoryRecordRenderer extends React.Component {

    static propTypes = {
        data: t.object,
    };

    constructor(props) {
        super(props);
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
        let email = null;
        let counter = 0;
        let atts = [];
        let firstName = '';
        if(this.props.data && this.props.data.attachments){
            atts = this.props.data.attachments.map(attachment => {
                if(attachment.attachmentType==='Email'){
                    email = attachment;
                    return '';
                }else{
                    let filename = 'Unknown';
                    if(attachment.link) {
                        filename = attachment.link.split(/(\\|\/)/g).pop();
                    }
                    if(!firstName) firstName = filename;

                    return (
                       <div key={counter++} style={{display:'inline-block', width:'32px', boxSizing: 'border-box'}}><a href="#" onClick = {() => this.getDownloadLink(attachment)} title={filename} style={{color:'#A9A9A9', fontSize:'30px', verticalAlign: 'middle'}}><i className={'far fa-file-alt'}></i></a></div>
                    );
                }
            }).filter( elem=> {
                return elem !== '';
            });
        }

        return(
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', minWidth:'400px', width:'25%'}}>
                    {this.props.data.ingestType === 'Email' ?
                        (<div style={{display: 'flex', maxWidth:'100%'}}><b>Provider:</b> &nbsp; {this.props.data.provider} </div>)
                        :
                        (<div style={{display: 'flex', maxWidth:'100%'}}><b>Document Name:</b> &nbsp; <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}} title={firstName}>{firstName}</div> </div>)
                    }
                    <div style={{display: 'flex'}}><b>Received:</b> &nbsp; {this.props.data.received ? moment(this.props.data.received).format('llll'):''} </div>
                </div>
                <div style={{display: 'flex', flex:0.5, minWidth:'30px'}}/>
                <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', minWidth:'182px'}}>
                    <div style={{display: 'flex'}}><b>Received By:</b> &nbsp; {this.props.data.ingestType} </div>
                    <div style={{display: 'flex inline'}}><b>Status:</b> &nbsp;
                        { (() => {
                            switch (this.props.data.status) {
                                 case 'COMPLETED':
                                    return <span style={{ color: 'green'}}><i className="fas fa-check-circle"> </i></span>;
                                 case 'FAILED':
                                    return <span title={this.props.data.errorDetails} style={{ color: 'red'}}><i className="fas fa-exclamation-circle"> </i></span>;
                                 case 'PENDING':
                                    return <img src={LoadingElipsis}/>;
                                 default:
                                    return this.props.data.status;
                                 }
                        })()}
                    </div>
                </div>
                <div style={{display: 'flex', flex:1, minWidth:'30px'}}/>
                <div style={{display: 'flex', paddingLeft:'10px', lineHeight: '30px', width:'345px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', width:'125px'}}>
                        <div style={{display: 'flex', flex: 1}}><u><b>
                            {this.props.data.totalProcessed > 0 ?
                                (<Link to={{ pathname: '/avails', state: {availHistory: this.props.data}}}>
                                    Total Avails:
                                </Link>)
                                :
                                (<div>
                                    Total Avails:
                                </div>)
                            }
                        </b></u></div>
                        <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight:'bolder'}}>
                            {this.props.data.totalProcessed > 0 ?
                                (<Link to={{ pathname: '/avails', state: {availHistory: this.props.data}}}>
                                    {this.props.data.totalProcessed}
                                </Link>)
                                :
                                (<div>
                                    {this.props.data.totalProcessed}
                                </div>)
                            }
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', width:'95px'}}>
                        <div style={{display: 'flex', flex: 1}}><u><b>
                            {this.props.data.successfullyProcessed > 0 ?
                                (<Link to={{ pathname: '/avails', state: {availHistory: this.props.data, rowInvalid: 'false'}}}>
                                    Success:
                                </Link>)
                                :
                                (<div>
                                    Success:
                                 </div>)
                            }
                        </b></u></div>
                        <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight:'bolder'}}>
                            {this.props.data.successfullyProcessed > 0 ?
                                (<Link to={{ pathname: '/avails', state: {availHistory: this.props.data, rowInvalid: 'false'}}}>
                                    {this.props.data.successfullyProcessed}
                                </Link>)
                                :
                                (<div>
                                    {this.props.data.successfullyProcessed}
                                </div>)
                            }
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', width:'85px'}}>
                        <div style={{display: 'flex', flex: 1}}><u><b>
                            {this.props.data.failedToProcess > 0 ?
                                (<Link className={'error-link'} to={{ pathname: '/avails', state: {availHistory: this.props.data, rowInvalid: 'true'}}}>
                                    Errors:
                                </Link>)
                                :
                                (<div>
                                    Errors:
                                </div>)
                            }
                        </b></u></div>
                        <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight:'bolder'}}>
                            {this.props.data.failedToProcess > 0 ?
                                (<Link className={'error-link'} to={{ pathname: '/avails', state: {availHistory: this.props.data, rowInvalid: 'true'}}}>
                                    {this.props.data.failedToProcess}
                                </Link>)
                                :
                                (<div>
                                    {this.props.data.failedToProcess}
                                </div>)
                            }
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', flex:1}}/>
                <div style={{display: 'flex', width:'274px', verticalAlign: 'middle !important'}}>
                    {email && <a href="#" onClick={()=> this.getDownloadLink(email)} key={email} style={{color:'#A9A9A9', fontSize: '30px', verticalAlign: 'middle', height:'100%', width:'40px', display:'inline-block'}}><i className="far fa-envelope"></i></a>}
                    {!email && <div key={email} style={{width: '40px', display:'inline-block'}}></div>}
                    <div style={{width: '224px', display:'inline-block', whiteSpace: 'normal'}}>
                        {atts}
                    </div>
                </div>
            </div>
        );
    }
}

export default AvailHistoryRecordRenderer;