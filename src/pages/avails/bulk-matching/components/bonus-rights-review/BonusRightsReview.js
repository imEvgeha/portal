import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {get} from 'lodash';
import TitleMatchingRightsTable from '../../../title-matching-rights-table/TitleMatchingRightsTable';
import './BonusRightsReview.scss';

const tabs = {
    bonusRights: 'Created Bonus Rights',
    existingBonusRights: 'Existing Bonus Rights',
};

const BonusRightsReview = props => {
    const {closeDrawer} = props;
    const [activeTab, setActiveTab] = useState('bonusRights');
    // eslint-disable-next-line react/prop-types
    const Tab = ({tab}) => (
        <div
            className={`nexus-c-bonus-rights-review__tabs--tab
        ${activeTab === tab ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(tab)}
        >
            {`${tabs[tab]} (${get(props, `${tab}.length`, 0)})`}
        </div>
    );
    return (
        <div className="nexus-c-bonus-rights-review">
            <div className="nexus-c-bonus-rights-review__tabs">
                {Object.keys(tabs).map(tab => (
                    <Tab tab={tab} key={tab} />
                ))}
            </div>
            <TitleMatchingRightsTable data={get(props, activeTab, [])} />
            {closeDrawer && (
                <Button label="Done" onClick={closeDrawer} className="p-button-outlined p-button-secondary" />
            )}
        </div>
    );
};

BonusRightsReview.propTypes = {
    closeDrawer: PropTypes.func,
};

BonusRightsReview.defaultProps = {
    closeDrawer: null,
};

export default BonusRightsReview;
