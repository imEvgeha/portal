import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusDownload from '@vubiquity-nexus/portal-ui/lib/elements/nexus-download/NexusDownload';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import NexusJsonView from '@vubiquity-nexus/portal-ui/lib/elements/nexus-json-view/NexusJsonView';
import NexusXMLView from '@vubiquity-nexus/portal-ui/lib/elements/nexus-xml-view/NexusXMLView';
import {get, isObject} from 'lodash';
import {uid} from 'react-uid';
import {
    DRAWER_TITLE,
    EVENT_ATTACHMENTS,
    EVENT_HEADER,
    EVENT_MESSAGE,
    JSON_DECODING_ERR_MSG,
    JSON_MIME_TYPE,
    JSON_PARSING_ERR_MSG,
    XML_DECODING_ERR_MSG,
    XML_EMPTY_ELEMENT,
    XML_MIME_TYPE,
} from '../../eventManagementConstants';
import {getEventById} from '../../eventManagementService';
import EventHeader from '../event-header/EventHeader';
import EventSectionCollapsible from '../event-section-collapsible/EventSectionCollapsible';
import EventDrawerHeader from './components/EventDrawerHeader';
import './EventDrawer.scss';

const EventDrawer = ({id, onDrawerClose}) => {
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const decodeBase64 = (data, mimeType) => {
        if (!data && mimeType === XML_MIME_TYPE) {
            return XML_EMPTY_ELEMENT;
        }
        if (!data && mimeType === JSON_MIME_TYPE) {
            return '{}';
        }
        let decode = '';
        try {
            decode = atob(data);
        } catch (e) {
            mimeType === XML_MIME_TYPE ? (decode = XML_DECODING_ERR_MSG) : (decode = JSON_DECODING_ERR_MSG);
        }
        return decode;
    };

    const parseJSON = str => {
        if (!str) {
            return {};
        }
        let parsedString = '';
        try {
            parsedString = JSON.parse(str);
        } catch (e) {
            parsedString = JSON_PARSING_ERR_MSG;
        }
        return parsedString;
    };

    useEffect(() => {
        const getEvent = id => {
            setIsLoading(true);
            return getEventById(id).then(evt => {
                const fetchedEvent = {...get(evt, 'event', null), id};
                const message = get(fetchedEvent, 'message', {});
                const metadata = get(fetchedEvent, 'metadata', {});
                const headers = {...get(fetchedEvent, 'headers', {}), id: get(fetchedEvent, 'id', '')};
                const attachments = get(message, 'attachments', {});
                setEvent({
                    headers,
                    message,
                    metadata,
                    attachments,
                });
                setIsLoading(false);
            });
        };

        if (id) {
            getEvent(id);
        }
    }, []);

    const {message, headers, attachments} = event || {};

    return (
        <div className="nexus-c-event-drawer">
            <NexusDrawer
                onClose={onDrawerClose}
                isOpen={!!id}
                isLoading={isLoading}
                title={DRAWER_TITLE}
                width="wide"
                headerContent={headers && <EventDrawerHeader event={event} />}
            >
                <div className="nexus-c-event-drawer__content">
                    <EventSectionCollapsible title={EVENT_HEADER}>
                        <EventHeader event={headers} />
                    </EventSectionCollapsible>
                    <EventSectionCollapsible
                        title={EVENT_MESSAGE}
                        header={
                            <NexusDownload
                                data={message}
                                filename={`${get(headers, 'eventId', '')} - message`}
                                mimeType={JSON_MIME_TYPE}
                            />
                        }
                    >
                        <NexusJsonView src={message} />
                    </EventSectionCollapsible>
                    <EventSectionCollapsible
                        title={`${EVENT_ATTACHMENTS}(${Object.keys(attachments || {}).length})`}
                        isDefaultOpened
                    >
                        {isObject(attachments) &&
                            Object.keys(attachments).map((key, index) => {
                                const {rawData = '', base64Encoded = false, mimeType = ''} = attachments[key];
                                return (
                                    <EventSectionCollapsible
                                        key={uid(key, index)}
                                        title={<span className="nexus-c-event-drawer__attachment-name">{key}</span>}
                                        header={
                                            <>
                                                <span className="nexus-c-event-drawer__attachment-mimetype">
                                                    MIME type: {mimeType}
                                                </span>
                                                <span className="nexus-c-event-drawer__attachment-base64">
                                                    base64 encoded: {base64Encoded.toString()}
                                                </span>
                                                <NexusDownload
                                                    data={base64Encoded ? decodeBase64(rawData, mimeType) : rawData}
                                                    filename={`${get(headers, 'eventId', '')} - ${key}`}
                                                    mimeType={mimeType}
                                                />
                                            </>
                                        }
                                        isDefaultOpened
                                    >
                                        {mimeType === XML_MIME_TYPE ? (
                                            <NexusXMLView
                                                xml={base64Encoded ? decodeBase64(rawData, mimeType) : rawData}
                                                indentSize={4}
                                            />
                                        ) : (
                                            <NexusJsonView
                                                src={
                                                    base64Encoded
                                                        ? parseJSON(decodeBase64(rawData, mimeType))
                                                        : parseJSON(rawData)
                                                }
                                            />
                                        )}
                                    </EventSectionCollapsible>
                                );
                            })}
                    </EventSectionCollapsible>
                </div>
            </NexusDrawer>
        </div>
    );
};

EventDrawer.propTypes = {
    id: PropTypes.string,
    onDrawerClose: PropTypes.func,
};

EventDrawer.defaultProps = {
    id: '',
    onDrawerClose: () => null,
};

export default EventDrawer;
