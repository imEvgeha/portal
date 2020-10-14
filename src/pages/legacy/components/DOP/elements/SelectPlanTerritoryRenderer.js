import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const SelectPlanTerritoryRenderer = ({node, promotedRights}) => {
    const right = promotedRights.find(el => el.rightId === node.id);
    const territories = right && right.territories;
    let result = territories && territories.join(', ');
    if (territories && territories.length > 2) {
        result = `${territories.slice(0, 2).join(', ')} (+${territories.slice(2).length})`;
    }

    return <div className="nexus-select-plan-territory">{result}</div>;
};

SelectPlanTerritoryRenderer.propTypes = {
    node: PropTypes.object,
    promotedRights: PropTypes.array,
};

SelectPlanTerritoryRenderer.defaultProps = {
    node: null,
    promotedRights: null,
};

const mapStateToProps = state => ({
    promotedRights: state.dopReducer.session.promotedRights,
});

export default connect(mapStateToProps)(SelectPlanTerritoryRenderer);
