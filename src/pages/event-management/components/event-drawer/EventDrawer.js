import React from 'react';
import PropTypes from 'prop-types';
import {get, isObject} from 'lodash';
import {uid} from 'react-uid';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';
import EventDrawerHeader from './components/EventDrawerHeader';
import EventSectionCollapsible from '../event-section-collapsible/EventSectionCollapsible';
import NexusDownload from '../../../../ui/elements/nexus-download/NexusDownload';
import EventHeader from '../event-header/EventHeader';
import NexusJsonView from '../../../../ui/elements/nexus-json-view/NexusJsonView';
import NexusXMLView from '../../../../ui/elements/nexus-xml-view/NexusXMLView';
import {
    DRAWER_TITLE,
    EVENT_MESSAGE,
    EVENT_HEADER,
    EVENT_ATTACHMENTS,
    JSON_MIME_TYPE,
    XML_MIME_TYPE
} from '../../eventManagementConstants';
import './EventDrawer.scss';

const EventDrawer = ({event, onDrawerClose}) => {
    const message = get(event, 'message', {});
    const attachments = get(message, 'attachments', {});

    const decodeXML = data => {
        const {base64Encoded = false, rawData = ''} = data;
        const xml = base64Encoded ? atob(rawData) : rawData;
        return xml;
    };

    return (
        <div className="nexus-c-event-drawer">
            <NexusDrawer
                onClose={onDrawerClose}
                isOpen={!!(event && event.eventId)}
                title={DRAWER_TITLE}
                width="wide"
                headerContent={event && (
                    <EventDrawerHeader
                        event={event}
                    />
                )}
            >
                <div className="nexus-c-event-drawer__content">
                    <EventSectionCollapsible
                        title={EVENT_HEADER}
                    >
                        <EventHeader event={event} />
                    </EventSectionCollapsible>
                    <EventSectionCollapsible
                        title={EVENT_MESSAGE}
                        header={(
                            <NexusDownload
                                data={message}
                                filename={get(event, 'eventId', '')}
                                mimeType={JSON_MIME_TYPE}
                            />
                        )}
                    >
                        <NexusJsonView
                            src={message}
                        />
                    </EventSectionCollapsible>
                    <EventSectionCollapsible
                        title={`${EVENT_ATTACHMENTS}(${Object.keys(attachments || {}).length})`}
                        isDefaultOpened
                    >
                        {isObject(attachments) && Object.keys(attachments).map((key, index) => (
                            <EventSectionCollapsible
                                key={uid(key, index)}
                                title={<span className="nexus-c-event-drawer__attachment-name">{key}</span>}
                                header={(
                                    <>
                                        <span className="nexus-c-event-drawer__attachment-mimetype">
                                            MIME type: {get(attachments, [key, 'mimeType'], '')}
                                        </span>
                                        <span className="nexus-c-event-drawer__attachment-base64">
                                            base64 encoded: {get(attachments, [key, 'base64Encoded'], '').toString()}
                                        </span>
                                        <NexusDownload
                                            data={attachments[key].base64Encoded
                                                ? atob(attachments[key].rawData)
                                                : attachments[key].rawData}
                                            filename={get(event, 'eventId', '') + key}
                                            mimeType={get(attachments, [key, 'mimeType'], '')}
                                        />
                                    </>
                                )}
                                isDefaultOpened
                            >
                                {attachments[key].mimeType === XML_MIME_TYPE ? (
                                    <NexusXMLView
                                        xml={decodeXML(attachments[key])}
                                        indentSize={4}
                                    />
                            ) : (
                                <NexusJsonView
                                    src={attachments[key].base64Encoded
                                        ? {rawData: JSON.parse(atob(attachments[key].rawData))}
                                        : {rawData: JSON.parse(attachments[key].rawData)}}
                                    name={key}
                                />
                            )}
                            </EventSectionCollapsible>
                        ))}
                    </EventSectionCollapsible>
                </div>
            </NexusDrawer>
        </div>
    );
};

EventDrawer.propTypes = {
    event: PropTypes.object,
    onDrawerClose: PropTypes.func,
};

EventDrawer.defaultProps = {
    event: null,
    onDrawerClose: () => null,
};

export default EventDrawer;
