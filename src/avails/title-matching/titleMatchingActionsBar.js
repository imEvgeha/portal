import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';

const ActionsBar = () => {
    const onCancel = () => {
      //future implementation
    };

    const onMatch = () => {
      //future implementation (gets the matchList in the props)
    };

    const onMatchAndCreate = () => {
      //future implementation (gets the matchList and duplicateList in the props)
    };

    return (
        <React.Fragment>
            <div className="nexus-c-title-matching-custom-actions">
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onMatch}>Match</Button>
                <Button onClick={onMatchAndCreate}>Match & Create</Button>
            </div>
        </React.Fragment>
    );
};
ActionsBar.propTypes = {
    matchList: PropTypes.object,
    duplicateList: PropTypes.object,
};

ActionsBar.defaultProps = {
    matchList: {},
    duplicateList: {},
};


export default ActionsBar;