import React from 'react';
import t from 'prop-types';

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
                <a href={attachment.link} key={attachment.link}>{filename}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
            );
        });

        return(
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flex: 1, flexDirection: 'column', paddingLeft:'10px', lineHeight: '30px'}}>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex', flex: 0.25}}><b>Provider:</b> &nbsp; {this.props.data.provider} </div>
                        <div style={{display: 'flex', flex: 0.25}}><b>Received By:</b> &nbsp; {this.props.data.ingestType} </div>
                        <div style={{display: 'flex', flex: 0.25}}><b>Total Avails:</b> &nbsp; {this.props.data.totalProcessed} </div>
                        <div style={{display: 'flex inline', flex: 0.25}}><b>Status:</b> &nbsp;
                                        { (() => {
                                            switch (this.props.data.state) {
                                                 case 'COMPLETED':
                                                     return <span style={{ color: 'green'}}><i className="fas fa-check-circle"></i></span>;
                                                 case 'FAILED':
                                                     return <span style={{ color: 'red'}}><i className="fas fa-exclamation-circle"></i></span>;
                                                 case 'PENDING':
                                                     //return <span style={{ color: 'Dodgerblue'}}><i className="fas fa-ellipsis-h"></i></span>;
                                                     return <span style={{ color: 'Dodgerblue'}}><i className="fas fa-spinner"></i></span>;
                                                 default:
                                                     return this.props.data.state;
                                                 }
                                        })()}
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex', flex: 0.25}}><b>Received:</b> &nbsp; {this.props.data.received} </div>
                        <div style={{display: 'flex', flex: 0.25}}><b>Success:</b> &nbsp; {this.props.data.successfullyProcessed} </div>
                        <div title={this.props.data.details} style={{display: 'flex', flex: 0.25}}><b>Failed:</b> &nbsp; {this.props.data.failedToProcess} </div>
                    </div>
                    <div>
                        {atts}
                    </div>
                </div>
                <div style={{display: 'flex', width:'20%', textAlign: 'center'}}>
                    <a href={'http://usla-amm-d001.dev.vubiquity.com/temp/test.eml'} target="_new" key={'http://usla-amm-d001.dev.vubiquity.com/temp/test.eml'}><i className="fas fa-envelope fa-5x"></i></a>
                </div>
            </div>
        );
    }
}

export default AvailHistoryRecordRenderer;