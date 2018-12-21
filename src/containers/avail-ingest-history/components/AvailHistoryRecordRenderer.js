import React from 'react';
import t from 'prop-types';
import moment from 'moment';

import LoadingElipsis from '../../../img/ajax-loader.gif';

class AvailHistoryRecordRenderer extends React.Component {

    static propTypes = {
        data: t.object,
    };

    constructor(props) {
        super(props);
    }


    render(){
        let email = null;
        let atts = this.props.data.attachments.map(attachment => {
            if(attachment.type==='Email'){
                email = attachment.link;
                return '';
            }else{
                let filename = attachment.link.split(/(\\|\/)/g).pop();
                return (
                   <div key={attachment.link}>&nbsp;&nbsp;<a href={attachment.link} title={filename} style={{color:'#A9A9A9', fontSize:'30px', verticalAlign: 'middle'}}><i className={'far fa-file-alt'}></i></a></div>
                );
            }
        });
        return(
            <div style={{display: 'flex', height: '100%', alignItems: 'center', alignContent: 'center'}}>
                <div style={{display: 'flex', flex: 1.6, paddingLeft:'10px', lineHeight: '30px'}}>
                    <div style={{display: 'flex', flex: 0.4, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', minWidth:'310px'}}>
                        <div style={{display: 'flex', flex: 1}}><b>Provider:</b> &nbsp; {this.props.data.provider} </div>
                        <div style={{display: 'flex', flex: 1}}><b>Received:</b> &nbsp; {this.props.data.received ? moment(this.props.data.received).format('llll'):''} </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.4, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', minWidth:'125px'}}>
                        <div style={{display: 'flex', flex: 1}}><b>Received By:</b> &nbsp; {this.props.data.ingestType} </div>
                        <div style={{display: 'flex inline'}}><b>Status:</b> &nbsp;
                            { (() => {
                                switch (this.props.data.state) {
                                     case 'COMPLETED':
                                        return <span style={{ color: 'green'}}><i className="fas fa-check-circle"></i></span>;
                                     case 'FAILED':
                                        return <span style={{ color: 'red'}}><i className="fas fa-exclamation-circle"></i></span>;
                                     case 'PENDING':
                                        return <img src={LoadingElipsis}/>;
                                     default:
                                        return this.props.data.state;
                                     }
                            })()}
                        </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.1, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', minWidth:'125px'}}>
                        <div style={{display: 'flex', flex: 0.5}}><u><b>Total Avails:</b></u></div>
                        <div style={{display: 'flex', flex: 0.5, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.totalProcessed} </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.1, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', minWidth:'125px'}}>
                        <div style={{display: 'flex', flex: 0.5}}><u><b>Success:</b></u></div>
                        <div style={{display: 'flex', flex: 0.5, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.successfullyProcessed} </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.1, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', color: '#CF2A27', minWidth:'125px'}}>
                        <div style={{display: 'flex', flex: 0.5}}><u><b>Errors:</b></u></div>
                        <div title={this.props.data.details} style={{display: 'flex', flex: 0.5, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.failedToProcess} </div>
                    </div>
                </div>
                <div style={{display: 'flex', flex: 0.4, width:'20%', height:'100%', textAlign: 'center', alignItems: 'flex-end', alignContent: 'flex-end',  verticalAlign: 'center !important'}}>
                    {email && <a href={email} target="_new" key={email} style={{color:'#A9A9A9', fontSize: '30px', verticalAlign: 'middle', height:'100%'}}><i className="far fa-envelope"></i></a>}
                    {atts}
                </div>
            </div>
        );
    }
}

export default AvailHistoryRecordRenderer;