import React, {useContext, useEffect, useRef, useState} from 'react';
import config from 'react-global-configuration';
import Add from '../../../../../../assets/action-add.svg';
import {NexusModalContext} from '../../../../../../ui/elements/nexus-modal/NexusModal';
import InputForm from '../InputForm/InputForm';
import './UploadIngestButton.scss';

const TITLE = 'Avail Ingest';

const UploadIngestButton = ({ingestData}) => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const {setModalContentAndTitle, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    useEffect(() => {
        if(file) {
            setModalStyle({width: 'small'});
            setModalActions([]);
            setModalContentAndTitle(buildForm(), TITLE);
        }
    }, [file]);

    const inputClick = () => inputRef && inputRef.current && inputRef.current.click();

    const browseClick = () => {
        closeModal();
        inputClick();
    };

    const buildForm = () => {
  return (
      <InputForm
          ingestData={ingestData}
          closeModal={closeModal}
          file={file}
          browseClick={browseClick}
      />
);
};

    const handleUpload = (e) => {
        const {files} = e.target;
        if (files && files.length > 0) {
            setFile(Array.from(files)[0]);
            e.target.value = null;
        }
    };

    const closeModal = () =>{
        setFile(null);
        close();
    };

    return (
        <div className='ingest-upload'>
            <input
                className='ingest-upload__input'
                type="file"
                accept={config.get('avails.upload.extensions')}
                ref={inputRef}
                onInput={handleUpload}
            />
            {ingestData ? <button className="btn btn-primary" onClick={inputClick}>Upload</button>
                : <Add onClick={inputClick} />}
        </div>
    );
};

export default UploadIngestButton;
