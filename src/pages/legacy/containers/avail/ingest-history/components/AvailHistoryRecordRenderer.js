import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import LoadingElipsis from '@vubiquity-nexus/portal-assets/img/ajax-loader.gif';
import {Link} from 'react-router-dom';

import {historyService} from '../../service/HistoryService';
import RightsURL from '../../util/RightsURL';

class AvailHistoryRecordRenderer extends React.Component {
    constructor(props) {
        super(props);
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

    render() {
        let email = null;
        let counter = 0;
        let atts = [];
        let firstName = '';
        const {data} = this.props;
        if (data && data.attachments) {
            atts = data.attachments
                .map(attachment => {
                    if (attachment.attachmentType === 'Email') {
                        email = attachment;
                        return '';
                    } else {
                        let filename = 'Unknown';
                        if (attachment.link) {
                            filename = attachment.link.split(/(\\|\/)/g).pop();
                        }
                        if (!firstName) firstName = filename;

                        return (
                            <div
                                key={counter++}
                                style={{display: 'inline-block', width: '32px', boxSizing: 'border-box'}}
                            >
                                <a
                                    href="#"
                                    onClick={() => this.getDownloadLink(attachment)}
                                    title={filename}
                                    style={{color: '#A9A9A9', fontSize: '30px', verticalAlign: 'middle'}}
                                >
                                    <i className="far fa-file-alt" />
                                </a>
                            </div>
                        );
                    }
                })
                .filter(elem => {
                    return elem !== '';
                });
        }

        const {ingestReport} = data;

        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: '10px',
                        lineHeight: '30px',
                        minWidth: '400px',
                        width: '25%',
                    }}
                >
                    {data.ingestType === 'Email' ? (
                        <div style={{display: 'flex', maxWidth: '100%'}}>
                            <b>Licensor:</b> &nbsp; {data.licensor}{' '}
                        </div>
                    ) : (
                        <div style={{display: 'flex', maxWidth: '100%'}}>
                            <b>Document Name:</b> &nbsp;{' '}
                            <div
                                style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
                                title={firstName}
                            >
                                {firstName}
                            </div>{' '}
                        </div>
                    )}
                    <div style={{display: 'flex'}}>
                        <b>Received:</b> &nbsp; {data.received ? moment(data.received).format('llll') : ''}{' '}
                    </div>
                </div>
                <div style={{display: 'flex', flex: 0.5, minWidth: '30px'}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: '10px',
                        lineHeight: '30px',
                        minWidth: '182px',
                    }}
                >
                    <div style={{display: 'flex'}}>
                        <b>Received By:</b> &nbsp; {data.ingestType}{' '}
                    </div>
                    <div title={'ID: ' + data.id} style={{display: 'flex inline'}}>
                        <b>Status:</b> &nbsp;
                        {(() => {
                            switch (data.status) {
                                case 'COMPLETED':
                                    return (
                                        <span style={{color: 'green'}}>
                                            <i className="fas fa-check-circle"> </i>
                                        </span>
                                    );
                                case 'FAILED':
                                    return (
                                        <span title={data.errorDetails} style={{color: 'red'}}>
                                            <i className="fas fa-exclamation-circle"> </i>
                                        </span>
                                    );
                                case 'MANUAL':
                                    return (
                                        <span title={data.errorDetails} style={{color: 'gold'}}>
                                            <i className="fas fa-circle"> </i>
                                        </span>
                                    );
                                case 'PENDING':
                                    return <img src={LoadingElipsis} />;
                                default:
                                    return data.status;
                            }
                        })()}
                    </div>
                </div>
                <div style={{display: 'flex', flex: 1, minWidth: '30px'}} />
                {ingestReport && (
                    <div style={{display: 'flex', paddingLeft: '10px', lineHeight: '30px', width: '345px'}}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '10px',
                                lineHeight: '30px',
                                alignItems: 'center',
                                width: '125px',
                            }}
                        >
                            <div style={{display: 'flex', flex: 1}}>
                                <u>
                                    <b>
                                        {ingestReport.total > 0 ? (
                                            <Link
                                                to={{
                                                    pathname: RightsURL.getRightsSearchUrl(data.id).split('?')[0],
                                                    search: RightsURL.getRightsSearchUrl(data.id).split('?')[1],
                                                    state: data,
                                                }}
                                            >
                                                Total Avails:
                                            </Link>
                                        ) : (
                                            <div>Total Avails:</div>
                                        )}
                                    </b>
                                </u>
                            </div>
                            <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight: 'bolder'}}>
                                {ingestReport.total > 0 ? (
                                    <Link
                                        to={{
                                            pathname: RightsURL.getRightsSearchUrl(data.id).split('?')[0],
                                            search: RightsURL.getRightsSearchUrl(data.id).split('?')[1],
                                            state: data,
                                        }}
                                    >
                                        {ingestReport.total}
                                    </Link>
                                ) : (
                                    <div>{ingestReport.total}</div>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '10px',
                                lineHeight: '30px',
                                alignItems: 'center',
                                width: '95px',
                            }}
                        >
                            <div style={{display: 'flex', flex: 1}}>
                                <u>
                                    <b>
                                        {ingestReport.success > 0 ? (
                                            <Link
                                                to={{
                                                    pathname: RightsURL.getSuccessRightsSearchUrl(data.id).split(
                                                        '?'
                                                    )[0],
                                                    search: RightsURL.getSuccessRightsSearchUrl(data.id).split('?')[1],
                                                    state: data,
                                                }}
                                            >
                                                Success:
                                            </Link>
                                        ) : (
                                            <div>Success:</div>
                                        )}
                                    </b>
                                </u>
                            </div>
                            <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight: 'bolder'}}>
                                {ingestReport.success > 0 ? (
                                    <Link
                                        to={{
                                            pathname: RightsURL.getSuccessRightsSearchUrl(data.id).split('?')[0],
                                            search: RightsURL.getSuccessRightsSearchUrl(data.id).split('?')[1],
                                            state: data,
                                        }}
                                    >
                                        {ingestReport.success}
                                    </Link>
                                ) : (
                                    <div>{ingestReport.success}</div>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '10px',
                                lineHeight: '30px',
                                alignItems: 'center',
                                width: '85px',
                            }}
                        >
                            <div style={{display: 'flex', flex: 1}}>
                                <u>
                                    <b>
                                        {ingestReport.errors > 0 ? (
                                            <Link
                                                className="error-link"
                                                to={{
                                                    pathname: RightsURL.getErrorRightsSearchUrl(data.id).split('?')[0],
                                                    search: RightsURL.getErrorRightsSearchUrl(data.id).split('?')[1],
                                                    state: data,
                                                }}
                                            >
                                                Errors:
                                            </Link>
                                        ) : (
                                            <div>Errors:</div>
                                        )}
                                    </b>
                                </u>
                            </div>
                            <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight: 'bolder'}}>
                                {ingestReport.errors > 0 ? (
                                    <Link
                                        className="error-link"
                                        to={{
                                            pathname: RightsURL.getErrorRightsSearchUrl(data.id).split('?')[0],
                                            search: RightsURL.getErrorRightsSearchUrl(data.id).split('?')[1],
                                            state: data,
                                        }}
                                    >
                                        {ingestReport.errors}
                                    </Link>
                                ) : (
                                    <div>{ingestReport.errors}</div>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '10px',
                                lineHeight: '30px',
                                alignItems: 'center',
                                width: '85px',
                            }}
                        >
                            <div style={{display: 'flex', flex: 1}}>
                                <u>
                                    <b>
                                        <Link
                                            target="_blank"
                                            className={ingestReport.fatal > 0 ? 'error-link' : ''}
                                            to={{
                                                pathname: RightsURL.getFatalsRightsSearchUrl(data.id),
                                            }}
                                        >
                                            Fatals:
                                        </Link>
                                    </b>
                                </u>
                            </div>
                            <div style={{display: 'flex', flex: 1, fontSize: '25px', fontWeight: 'bolder'}}>
                                <Link
                                    target="_blank"
                                    className={ingestReport.fatal > 0 ? 'error-link' : ''}
                                    to={{
                                        pathname: RightsURL.getFatalsRightsSearchUrl(data.id),
                                    }}
                                >
                                    {ingestReport.fatal}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{display: 'flex', flex: 1}} />
                <div style={{display: 'flex', width: '274px', verticalAlign: 'middle !important'}}>
                    {email && (
                        <a
                            href="#"
                            onClick={() => this.getDownloadLink(email)}
                            key={email}
                            style={{
                                color: '#A9A9A9',
                                fontSize: '30px',
                                verticalAlign: 'middle',
                                height: '100%',
                                width: '40px',
                                display: 'inline-block',
                            }}
                        >
                            <i className="far fa-envelope" />
                        </a>
                    )}
                    {!email && <div key={email} style={{width: '40px', display: 'inline-block'}} />}
                    <div style={{width: '224px', display: 'inline-block', whiteSpace: 'normal'}}>{atts}</div>
                </div>
            </div>
        );
    }
}

AvailHistoryRecordRenderer.propTypes = {
    data: PropTypes.object,
};

export default AvailHistoryRecordRenderer;
