import React from 'react';
import t from 'prop-types';
import moment from 'moment';

import ReactAnimatedEllipsis from 'react-animated-ellipsis';

class AvailHistoryRecordRenderer extends React.Component {

    static propTypes = {
        data: t.object,
    };

    constructor(props) {
        super(props);
    }


    render(){
        let atts = this.props.data.attachments.map(attachment => {
            let filename = attachment.link.split(/(\\|\/)/g).pop();
            return (
               <div key={attachment.link}>&nbsp;&nbsp;<a href={attachment.link} title={filename} style={{color:'#A9A9A9', fontSize:'30px', verticalAlign: 'middle'}}><i className={'far fa-file-alt'}></i></a></div>
            );
        });

        return(
            <div style={{display: 'flex', height: '100%', alignItems: 'center', alignContent: 'center'}}>
                <div style={{display: 'flex', flex: 1.6, paddingLeft:'10px', lineHeight: '30px'}}>
                    <div style={{display: 'flex', flex: 0.4, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px'}}>
                        <div style={{display: 'flex', flex: 1}}><b>Provider:</b> &nbsp; {this.props.data.provider} </div>
                        <div style={{display: 'flex', flex: 1}}><b>Received:</b> &nbsp; {moment(this.props.data.received).format('llll')} </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.4, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px'}}>
                        <div style={{display: 'flex', flex: 1}}><b>Received By:</b> &nbsp; {this.props.data.ingestType} </div>
                        <div style={{display: 'flex', flex: 1}}><b>Total Avails:</b> &nbsp; {this.props.data.totalProcessed} </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.2, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px'}}>
                        <div style={{display: 'flex inline'}}><b>Status:</b> &nbsp;
                            { (() => {
                                switch (this.props.data.state) {
                                     case 'COMPLETED':
                                        return <span style={{ color: 'green'}}><i className="fas fa-check-circle"></i></span>;
                                     case 'FAILED':
                                        return <span style={{ color: 'red'}}><i className="fas fa-exclamation-circle"></i></span>;
                                     case 'PENDING':
                                        return <ReactAnimatedEllipsis fontSize='5rem'/>;
                                     default:
                                        return this.props.data.state;
                                     }
                            })()}
                        </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.3, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center'}}>
                        <div style={{display: 'flex', flex: 0.5}}><u><b>Success:</b></u></div>
                        <div style={{display: 'flex', flex: 0.5, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.successfullyProcessed} </div>
                    </div>
                    <div style={{display: 'flex', flex: 0.3, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px', alignItems: 'center', color: '#CF2A27'}}>
                        <div style={{display: 'flex', flex: 0.5}}><u><b>Failed:</b></u></div>
                        <div title={this.props.data.details} style={{display: 'flex', flex: 0.5, fontSize: '25px', fontWeight:'bolder'}}>{this.props.data.failedToProcess} </div>
                    </div>
                </div>
                <div style={{display: 'flex', flex: 0.4, width:'20%', height:'100%', textAlign: 'center', alignItems: 'flex-end', alignContent: 'flex-end',  verticalAlign: 'center !important'}}>
                    <a href={'http://usla-amm-d001.dev.vubiquity.com/temp/test.eml'} target="_new" key={'http://usla-amm-d001.dev.vubiquity.com/temp/test.eml'} style={{color:'#A9A9A9', fontSize: '40px', verticalAlign: 'middle', height:'100%'}}><i className="far fa-envelope"></i></a>
                    {atts}
                </div>
            </div>
        );
    }
}

export default AvailHistoryRecordRenderer;