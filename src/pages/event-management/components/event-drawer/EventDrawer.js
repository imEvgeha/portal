import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {uid} from 'react-uid';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';
import EventDrawerHeader from './components/EventDrawerHeader';
import EventSectionCollapsible from '../event-section-collapsible/EventSectionCollapsible';
import NexusDownload from '../../../../ui/elements/nexus-download/NexusDownload';
import EventHeader from '../event-header/EventHeader';
import NexusJsonView from '../../../../ui/elements/nexus-json-view/NexusJsonView';
import {DRAWER_TITLE, EVENT_MESSAGE, EVENT_HEADER, EVENT_ATTACHMENTS} from '../../eventManagementConstants';
import './EventDrawer.scss';

const EventDrawer = ({event, onDrawerClose}) => (
    <div className='nexus-c-event-drawer'>
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
                            data={event}
                            filename={get(event, 'eventId', '')}
                        />
                    )}
                >
                    <NexusJsonView
                        src={event}
                        name="vuMessage"
                    />
                </EventSectionCollapsible>
                <EventSectionCollapsible
                    title={`${EVENT_ATTACHMENTS}(${event && event.attachments ? Object.keys(event.attachments).length : 0})`}
                    isDefaultOpened
                >
                    {event && event.attachments && Object.keys(event.attachments).map((key, index) => {
                          return (
                              <EventSectionCollapsible
                                  key={uid(key, index)}
                                  title={<span className='nexus-c-event-drawer__attachment-name'>{key}</span>}
                                  header={(
                                      <>
                                          <span className='nexus-c-event-drawer__attachment-mimetype'>MIME type: {event.attachments[key].mimeType}</span>
                                          <span className='nexus-c-event-drawer__attachment-base64'>base64 encoded: {event.attachments[key].base64Encoded.toString()}</span>
                                          <NexusDownload
                                              data={event.attachments[key]}
                                              filename={get(event, 'eventId', '') + key}
                                          />
                                      </>
                                  )}
                                  isDefaultOpened
                              >
                                  <NexusJsonView
                                      src={event.attachments[key]}
                                      name={key}
                                  />
                              </EventSectionCollapsible>
                          );
                        })}
                </EventSectionCollapsible>
            </div>
        </NexusDrawer>
    </div>
);

EventDrawer.propTypes = {
    event: PropTypes.object,
    onDrawerClose: PropTypes.func,
};

EventDrawer.defaultProps = {
    event: null,
    onDrawerClose: () => null,
};

export default EventDrawer;
