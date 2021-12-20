import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';
import {Tag} from 'primereact/tag';
import {Action} from './Actions.class';

const EntityActions = ({tag, flag1, flag2, actions}) => {
    const constructActions = () => {
        const maxActions = 6;
        let counter = 0;
        const tmpActionItems = [];

        while (counter < maxActions) {
            tmpActionItems.push(
                new Action({icon: undefined, action: undefined, position: counter + 1, disabled: true, buttonId: ''})
            );
            counter++;
        }
        counter = 0;
        actions.forEach(action => (tmpActionItems[action.position - 1] = action));
        Object.seal(tmpActionItems);

        const actionCols = [];
        while (counter < maxActions) {
            const col = (
                <div className="col-2 text-center" key={`action-icon_${counter}`}>
                    {!!tmpActionItems[counter]?.icon && (
                        <Button
                            key={tmpActionItems[counter].buttonId}
                            id={tmpActionItems[counter].buttonId}
                            icon={tmpActionItems[counter].icon}
                            onClick={tmpActionItems[counter].action}
                            disabled={tmpActionItems[counter].disabled}
                            className="p-button-text"
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
                <div className="col-12 col-sm-4 col-lg-6">
                    <div className="row">
                        <div className="col-sm-4">{!!tag && <Tag value={tag} />}</div>
                        <div className="col-sm-3">{flag1}</div>
                        <div className="col-sm-3">{flag2}</div>
                    </div>
                </div>
                <div className="col-12 col-sm-8 col-lg-6 text-end">
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
};

EntityActions.defaultProps = {
    tag: '',
    flag1: '',
    flag2: '',
    actions: [],
};

export default EntityActions;
