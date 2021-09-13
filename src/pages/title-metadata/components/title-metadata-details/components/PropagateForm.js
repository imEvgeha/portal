import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import {ErrorMessage} from '@atlaskit/form';
import {isEmpty} from 'lodash';
import {CAST_CREW, CANCEL_BUTTON, ADD_BUTTON, EDITORIAL, EDITORIAL_METADATA, EMPTY, EMETS} from './propagateConstants';
import './PropagateForm.scss';

const PropagateForm = ({getValues, setFieldValue, person, onClose}) => {
    const {castCrew, editorial, editorialMetadata} = getValues();
    const isEMetsButtonsDisabled = !(castCrew.length && editorialMetadata.length);
    const [checkedEmet, setCheckedEmet] = useState(false);
    const [error, setError] = useState(null);

    const getPropagateMessage = () => `Propagate ${isEmpty(person) ? CAST_CREW : person.displayName} to...`;

    const handleAdd = () => {
        if (castCrew.length && editorialMetadata.length) {
            const updatedCastCrew = isEmpty(person) ? castCrew : [person];

            const pushUpdatedCastCrew = emet => {
                if (emet.castCrew) {
                    const uniquePersons = updatedCastCrew.filter(
                        updatedPerson =>
                            !emet.castCrew.some(
                                person =>
                                    person.id === updatedPerson.id && person.creditsOrder === updatedPerson.creditsOrder
                            )
                    );

                    emet.castCrew.push(...uniquePersons);
                } else {
                    emet.castCrew = updatedCastCrew;
                }
                return emet;
            };

            const updateEditorialMetadata = editorialMetadata.map(emet => pushUpdatedCastCrew(emet));
            const updatedEditorial = pushUpdatedCastCrew(editorial);
            setFieldValue(EDITORIAL, updatedEditorial);
            setFieldValue(EDITORIAL_METADATA, updateEditorialMetadata);
            setError(null);
            onClose();
        } else {
            setError(EMPTY);
        }
    };

    return (
        <>
            <p className="propagate-form__message">{getPropagateMessage()}</p>
            <Checkbox
                label={EMETS}
                value={EMETS}
                isChecked={checkedEmet}
                onChange={() => setCheckedEmet(!checkedEmet)}
                isDisabled={isEMetsButtonsDisabled}
            />
            <div className="propagate-form__error">
                {isEMetsButtonsDisabled && !error ? <ErrorMessage>{EMPTY}</ErrorMessage> : null}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </div>
            <div className="propagate-form__actions">
                <Button onClick={() => onClose()}>{CANCEL_BUTTON}</Button>
                <Button onClick={handleAdd} isDisabled={error || !checkedEmet} appearance="primary">
                    {ADD_BUTTON}
                </Button>
            </div>
        </>
    );
};

PropagateForm.propTypes = {
    person: PropTypes.object,
    getValues: PropTypes.func,
    setFieldValue: PropTypes.func,
    onClose: PropTypes.func.isRequired,
};

PropagateForm.defaultProps = {
    person: {},
    getValues: () => null,
    setFieldValue: () => null,
};

export default PropagateForm;
