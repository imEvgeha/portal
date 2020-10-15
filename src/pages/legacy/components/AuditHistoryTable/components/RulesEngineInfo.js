import React from 'react';
import Constants from '../Constants';
import './RulesEngineInfo.scss';

const RulesEngineInfo = params => {
    const {value, rowIndex, api} = params;
    const {data: {availSource, updatedBy, createdBy} = {}} = api.getRowNode(rowIndex);
    const author = updatedBy || createdBy;

    return (
        author === Constants.SYSTEM && (
            <div className="nexus-c-rules-popup">
                <div className="nexus-c-rules-popup__header">Rules Engine Changes</div>
                <div className="nexus-c-rules-popup__content">
                    <div className="nexus-c-rules-popup__content__field">
                        <label>Original Value:</label>
                        <span>{value}</span>
                    </div>
                    {Constants.RULES_ENGINE_INFO.map(rule => (
                        <div key={rule.field} className="nexus-c-rules-popup__content__field">
                            <label>{rule.displayName}:</label>
                            <span>{availSource[rule.field]}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default RulesEngineInfo;
