import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import config from 'react-global-configuration';
import Add from '../../../../../assets/chevron-right.svg';
import './UploadIngestButton.scss';

const UploadIngestButton = () => {
    const inputRef = useRef();
    const addClick = () => inputRef && inputRef.current && inputRef.current.click();

    return (
        <div className='ingest-upload'>
            <input className='ingest-upload__input'
                   type="file"
                   accept={config.get('avails.upload.extensions')}
                   ref={inputRef}/>
            <Add onClick={addClick} />
        </div>
    );
};

UploadIngestButton.propTypes = {};

UploadIngestButton.defaultProps = {};

export default UploadIngestButton;