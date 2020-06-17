import React, {useContext, useEffect} from 'react';
import {connect} from 'react-redux';
import './DecoratedRecordsModal.scss';
import {NexusModalContext} from '../../../../../../../ui/elements/nexus-modal/NexusModal';
import usePrevious from "../../../../../../../util/hooks/usePrevious";

const DecoratedRecordsModal = ({isLoading}) => {
    const previousLoading = usePrevious(isLoading);
    const {setModalContent, setModalActions, setModalTitle, setModalStyle, close} = useContext(NexusModalContext);

    useEffect(() => {
        if(!isLoading && previousLoading){
            close();
        }
        if(isLoading) {
            setModalStyle({width: 'small'});
            setModalTitle('Creating Decorated Records');
            setModalContent(buildContent());
            setModalActions([{
                text: 'OK',
                onClick: close
            }]);
        }
    }, [isLoading]);

    const buildContent = () => {
        return (
            <div className='nexus-decorated-modal'>
                The decorated editorial metadata records are being created, you should be able to see them in a few moments.
            </div>
        );
    };

    return (<></>);
};

export default connect()(DecoratedRecordsModal);
