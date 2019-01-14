import React from 'react';
import t from 'prop-types';
import moment from 'moment';

import LoadingElipsis from '../../../img/ajax-loader.gif';
import {Link} from 'react-router-dom';

class AvailHistoryRecordRenderer extends React.Component {

    static propTypes = {
        data: t.object,
    };

    constructor(props) {
        super(props);
    }


    render(){
        let email = null;
        let counter = 0;
        let atts = this.props.data.attachments.map(attachment => {
            if(attachment.type==='Email'){
                email = attachment.link;
                return '';
            }else{
                let filename = attachment.link.split(/(\\|\/)/g).pop();
                switch (attachment.type) {
                    case 'Excel':
                        return (
                           <div key={counter++} style={{display:'inline-block', width:'32px', boxSizing: 'border-box'}}><a href={attachment.link} title={filename} style={{color:'#A9A9A9', fontSize:'30px', verticalAlign: 'middle'}}><i className={'far fa-file-alt'}></i></a></div>
                        );
                    default:
                        return '';
                }


            }
        }).filter( elem=> {
            return elem !== '';
        });

        return(
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', minWidth:'360px'}}>
                    <div style={{display: 'flex', flex: 1}}><b>Provider:</b> &nbsp; {this.props.data.provider} </div>
                    <div style={{display: 'flex', flex: 1}}><b>Received:</b> &nbsp; {this.props.data.received ? moment(this.props.data.received).format('llll'):''} </div>
                </div>
                <div style={{display: 'flex', flex:1}}/>
                <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', minWidth:'182px'}}>
                    <div style={{display: 'flex', flex: 1}}><b>Received By:</b> &nbsp; {this.props.data.ingestType} </div>
                    <div style={{display: 'flex inline'}}><b>Status:</b> &nbsp;
                        { (() => {
                            switch (this.props.data.status) {
                                 case 'COMPLETED':
                                    return <span style={{ color: 'green'}}><i className="fas fa-check-circle"></i></span>;
                                 case 'FAILED':
                                    return <span title={this.props.data.errorDetails} style={{ color: 'red'}}><i className="fas fa-exclamation-circle"></i></span>;
                                 case 'PENDING':
                                    return <img src={LoadingElipsis}/>;
                                 default:
                                    return this.props.data.status;
                                 }
                        })()}
                    </div>
                </div>
                <div style={{display: 'flex', flex:1}}/>
                <div style={{display: 'flex', paddingLeft:'10px', lineHeight: '30px', width:'345px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', width:'125px'}}>
                        <div style={{display: 'flex', flex: 1}}><u><b><Link to={{ pathname: '/dashboard', state: {availHistory: this.props.data}}}>Total Avails:</Link></b></u></div>
                        <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.totalProcessed} </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', width:'95px'}}>
                        <div style={{display: 'flex', flex: 1}}><u><b><Link to={{ pathname: '/dashboard', state: {availHistory: this.props.data, rowInvalid: false}}}>Success:</Link></b></u></div>
                        <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.successfullyProcessed} </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', color: '#CF2A27', width:'85px'}}>
                        <div style={{display: 'flex', flex: 1}}><u><b><Link to={{ pathname: '/dashboard', state: {availHistory: this.props.data, rowInvalid: true}}}>Errors:</Link></b></u></div>
                        <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.failedToProcess} </div>
                    </div>
                </div>
                <div style={{display: 'flex', flex:1}}/>
                <div style={{display: 'flex', width:'274px', verticalAlign: 'middle !important'}}>
                    {email && <a href={email} target="_new" key={email} style={{color:'#A9A9A9', fontSize: '30px', verticalAlign: 'middle', height:'100%', width:'40px', display:'inline-block'}}><i className="far fa-envelope"></i></a>}
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