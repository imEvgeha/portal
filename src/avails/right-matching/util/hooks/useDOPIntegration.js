import {useEffect, useContext} from 'react';
import useLocalStorage from '../../../../util/hooks/useLocalStorage';
import DOP from '../../../../util/DOP';
import {NexusModalContext} from '../../../../ui-elements/nexus-modal/NexusModal';

const DOP_POP_UP_TITLE = 'Right Matching';
const DOP_POP_UP_MESSAGE = 'Please, keep in mind not all rights have been matched!';

const useDOPIntegration = (totalCount, localStorageItem) => {
    const [dopCount, setDopCount] = useLocalStorage(localStorageItem, totalCount);
    const {setModalContentAndTitle, setModalActions, close} = useContext(NexusModalContext);
    // DOP integration
    useEffect(() => {
        if (totalCount || totalCount === 0) {
            if (!dopCount || (dopCount && dopCount !== totalCount)) {
                DOP.setErrorsCount(totalCount);
                setDopCount(totalCount);
            }
            if (totalCount > 0) {
                DOP.setDOPMessageCallback(() => openDOPPopUp(totalCount));
            } else {
                DOP.setDOPMessageCallback(null);
            }
        }
    }, [totalCount]);

    // DOP Integration
    useEffect(() => {
        if ((dopCount || dopCount === 0) && totalCount === null) {
            DOP.setErrorsCount(dopCount);
            if (dopCount > 0) {
                DOP.setDOPMessageCallback(() => openDOPPopUp(dopCount));
            } else {
                DOP.setDOPMessageCallback(null);
            }
        }
    }, [dopCount]);

    const openDOPPopUp = (errorCount) => {
        const handlePopUpClick = () => {
            DOP.sendInfoToDOP(errorCount, null);
            close();
        };
        setModalContentAndTitle(DOP_POP_UP_MESSAGE, DOP_POP_UP_TITLE);
        setModalActions([
                        {
            text: 'OK', 
            onClick: handlePopUpClick, 
            appearance: 'primary', 
        }
        ]);
    };

    return openDOPPopUp;
};

export default useDOPIntegration;

