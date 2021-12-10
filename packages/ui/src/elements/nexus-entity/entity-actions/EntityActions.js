import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';
import {Tag} from 'primereact/tag';
import {Action} from './Actions.class';
import './EntityActions.scss';

const EntityActions = ({tag, season, episode, actions}) => {
    const constructActions = () => {
        const maxActions = 6;
        let counter = 0;
        const tmpActionItems = [];

        while (counter < maxActions) {
            tmpActionItems.push(new Action(undefined, undefined, counter + 1, true));
            counter++;
        }
        counter = 0;
        actions.forEach(action => (tmpActionItems[action.position - 1] = action));
        Object.seal(tmpActionItems);
        console.log(actions);
        console.log(tmpActionItems);
        const actionCols = [];
        while (counter < maxActions) {
            const col = (
                <div className="col-sm-2 text-center">
                    {!!tmpActionItems[counter]?.icon && (
                        <Button
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
        <div className="entity__actions">
            <div className="row align-items-center">
                <div className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-4">{!!tag && <Tag value={tag} />}</div>
                        <div className="col-sm-3">{season}</div>
                        <div className="col-sm-3">{episode}</div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="row">{constructActions()}</div>
                </div>
            </div>
        </div>
    );
};

EntityActions.propTypes = {
    tag: PropTypes.string || PropTypes.element,
    season: PropTypes.string || PropTypes.element,
    episode: PropTypes.string || PropTypes.element,
    actions: PropTypes.array,
};

EntityActions.defaultProps = {
    tag: '',
    season: '',
    episode: '',
    actions: [],
};

export default EntityActions;
