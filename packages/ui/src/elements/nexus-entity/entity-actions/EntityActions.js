import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {Tag} from 'primereact/tag';
import {Action} from './Actions.class';
import './EntityActions.scss';

const EntityActions = ({tag, flag1, flag2, actions, totalEnabled}) => {
    const constructActions = () => {
        const maxActions = 4;
        let counter = 0;
        const tmpActionItems = [];

        while (counter < maxActions) {
            tmpActionItems.push(
                new Action({icon: undefined, action: undefined, position: counter + 1, disabled: false, buttonId: ''})
            );
            counter++;
        }
        counter = 0;
        actions.forEach(action => (tmpActionItems[action.position - 1] = action));
        Object.seal(tmpActionItems);

        const actionCols = [];
        while (counter < maxActions) {
            const isDisabled = !totalEnabled || tmpActionItems[counter].disabled;
            const col = (
                <div className="col text-center" key={`action-icon_${counter}`}>
                    {!!tmpActionItems[counter]?.icon && (
                        <Button
                            key={tmpActionItems[counter].buttonId}
                            id={tmpActionItems[counter].buttonId}
                            icon={tmpActionItems[counter].icon}
                            onClick={tmpActionItems[counter].action}
                            disabled={isDisabled}
                            className="p-button-text nexus-c-entity-button"
                        />
                    )}
                </div>
            );
            actionCols.push(col);

            counter++;
        }
        return actionCols;
    };

    return (
        <div className="nexus-c-entity-actions">
            <div className="row text-center text-sm-start align-items-center">
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="row">
                        <div className="col-sm-4">{!!tag && <Tag value={tag} />}</div>
                        <div className="col-sm-3">{flag1}</div>
                        <div className="col-sm-3">{flag2}</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-8">
                    <div className="row">{constructActions()}</div>
                </div>
            </div>
        </div>
    );
};

EntityActions.propTypes = {
    tag: PropTypes.string || PropTypes.element,
    flag1: PropTypes.string || PropTypes.element,
    flag2: PropTypes.string || PropTypes.element,
    actions: PropTypes.array,
    totalEnabled: PropTypes.bool,
};

EntityActions.defaultProps = {
    tag: '',
    flag1: '',
    flag2: '',
    actions: [],
    totalEnabled: false,
};

export default EntityActions;
