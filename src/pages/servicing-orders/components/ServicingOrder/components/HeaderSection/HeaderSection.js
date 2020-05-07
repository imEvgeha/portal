import React from 'react';
import {Link} from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {backArrowColor} from '../../../../../legacy/constants/avails/constants';
import {SERVICING_ORDERS} from '../../../../../../ui/elements/nexus-navigation/constants';
import './HeaderSection.scss';

const HeaderSection = () => {

    return (
        <div className='panel-header'>
            <div className='panel-header__title'>
                <Link to={`/${SERVICING_ORDERS.toLowerCase()}`}>
                    <ArrowLeftIcon size='large' primaryColor={backArrowColor} />
                </Link>
                <span>Servicing Order</span>
            </div>
        </div>
    );
};

export default HeaderSection;