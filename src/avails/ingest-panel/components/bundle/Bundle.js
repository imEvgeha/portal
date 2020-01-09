import React, {useState} from 'react';
import PropTypes from 'prop-types';
import BundleTitle from '../bundle-title/BundleTitle';
import Chevron from '../../../../assets/chevron-right.svg';
import IngestStatus from '../ingest-status/IngestStatus';
import Ingest from '../ingest/Ingest';
import './Bundle.scss';


const Bundle = ({id, ingestType, received, provider, attachments, selectedIngest, ingestClick}) => {
    const [showIngests, setShowIngests] = useState(false);

    const onBundleClick = e => {
        e.stopPropagation();
        setShowIngests(!showIngests);
    };

    return (
        <div className='avail-bundle'>
            <div className='avail-bundle__cell' onClick={onBundleClick}>
                <BundleTitle provider={provider} totalAttachments={attachments.length} />
                <div className='avail-bundle__cell__details'>
                    <span
                        className={`avail-bundle__cell__details--${showIngests ? 'open' : 'close' }`}
                        onClick={onBundleClick}>
                        <Chevron/>
                    </span>
                    <IngestStatus date={received} />
                </div>
            </div>
            {
                showIngests && <div className='avail-bundle__ingests'>
                    {
                        attachments.map((attachment) =>
                            <Ingest key={attachment.id}
                                    attachment={attachment}
                                    received={received}
                                    provider={provider}
                                    ingestType={ingestType}
                                    ingestClick={() => ingestClick(id)}
                                    selected={selectedIngest && (selectedIngest.id === id)}
                            />)
                    }
                </div>
            }
        </div>
    );
};

Bundle.propTypes = {
    ingestType: PropTypes.string,
    received: PropTypes.string,
    provider: PropTypes.string,
    attachments: PropTypes.array,
    selected: PropTypes.bool,
    ingestClick: PropTypes.func,
};

Bundle.defaultProps = {
    ingestType: '',
    received: '',
    provider: '',
    attachments: [],
    selected: false
};

export default Bundle;