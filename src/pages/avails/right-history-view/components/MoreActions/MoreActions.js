import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import MoreIcon from '../../../../../assets/more-icon.svg';
import RightViewHistory from '../../RightHistoryView';
import BulkMatchView from '../../../bulk-match/BulkMatchView';

import './MoreActions.scss';

const MoreActions = ({selectedAvails}) => {

    const [menuOpened, setMenuOpened] = useState(false);
    const node = useRef();

    useEffect(function() {
        window.addEventListener('click', removeMenu);

        return () => {
            window.removeEventListener('click', removeMenu);
        };
    }, []);

    const clickHandler = () => setMenuOpened(!menuOpened);
    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    return (
        <div className='rights-more-actions' ref={node}>
            <MoreIcon fill="#A5ADBA" onClick={clickHandler} />
            <div className={`rights-more-actions__menu ${menuOpened?'open':''}`}>
                <RightViewHistory selectedAvails={selectedAvails} />
                <BulkMatchView selectedRights={selectedAvails} />
            </div>
        </div>
    );
};

MoreActions.propTypes = {
    selectedAvails: PropTypes.array
};

MoreActions.defaultProps = {
    selectedAvails: []
};

export default MoreActions;
