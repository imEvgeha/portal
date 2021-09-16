import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import {ErrorMessage} from '@atlaskit/form';
import {isEmpty} from 'lodash';
import {searchPersonById} from '../../../../avails/right-details/rightDetailsServices';
import Loading from '../../../../static/Loading';
import {
    CAST_CREW,
    CANCEL_BUTTON,
    ADD_BUTTON,
    EDITORIAL,
    EDITORIAL_METADATA,
    EMPTY_CAST_CREW,
    EMPTY_EMETS,
    EMETS,
} from './propagateConstants';
import './PropagateForm.scss';

const PropagateForm = ({getValues, setFieldValue, person, onClose}) => {
    const {castCrew, editorial, editorialMetadata} = getValues();
    const persons = isEmpty(person) ? castCrew : [person];
    const isCastCrewEmpty = !castCrew?.length;
    const isEMetsEmpty = !editorialMetadata?.length;
    const [checkedEmet, setCheckedEmet] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [localizationCastCrew, setLocalizationCastCrew] = useState([]);

    useEffect(() => {
        async function fetchLocalizationPersons() {
            setIsLoading(true);
            const allLocalizationsPersons = persons.map(async ({id}) => {
                const localizationPerson = await searchPersonById(id);
                return localizationPerson;
            });

            const localizationPersons = await Promise.all(allLocalizationsPersons);
            setLocalizationCastCrew(localizationPersons);
            setIsLoading(false);
        }
        fetchLocalizationPersons();
    }, [castCrew]);

    const getPropagateMessage = () => `Propagate ${isEmpty(person) ? CAST_CREW : person.displayName} to...`;

    const handleAdd = async () => {
        if (castCrew.length && editorialMetadata.length) {
            const pushUpdatedCastCrew = emet => {
                persons.forEach(person => {
                    const localization = localizationCastCrew.find(({id}) => id === person.id)?.localization;
                    localization && (person.localization = localization);
                });

                if (emet.castCrew) {
                    const uniquePersons = persons.filter(
                        person =>
                            !emet.castCrew.some(
                                emetPerson =>
                                    emetPerson.id === person.id && emetPerson.creditsOrder === person.creditsOrder
                            )
                    );

                    emet.castCrew.push(...uniquePersons);
                } else {
                    emet.castCrew = persons;
                }
                return emet;
            };

            const updateEditorialMetadata = editorialMetadata.map(emet => pushUpdatedCastCrew(emet));
            const updatedEditorial = pushUpdatedCastCrew(editorial);
            await setFieldValue(EDITORIAL, {});
            await setFieldValue(EDITORIAL_METADATA, {});

            setFieldValue(EDITORIAL, updatedEditorial);
            setFieldValue(EDITORIAL_METADATA, updateEditorialMetadata);
            setError(null);
            onClose();
        } else {
            setError(isCastCrewEmpty ? EMPTY_CAST_CREW : EMPTY_EMETS);
        }
    };

    return (
        <>
            <p className="propagate-form__message">{getPropagateMessage()}</p>
            {isLoading ? (
                <Loading />
            ) : (
                <Checkbox
                    label={EMETS}
                    value={EMETS}
                    isChecked={checkedEmet}
                    onChange={() => setCheckedEmet(!checkedEmet)}
                    isDisabled={isCastCrewEmpty || isEMetsEmpty}
                />
            )}

            <div className="propagate-form__error">
                {isCastCrewEmpty && !error && !isEMetsEmpty ? <ErrorMessage>{EMPTY_CAST_CREW}</ErrorMessage> : null}
                {isEMetsEmpty && !error ? <ErrorMessage>{EMPTY_EMETS}</ErrorMessage> : null}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </div>
            <div className="propagate-form__actions">
                <Button onClick={() => onClose()}>{CANCEL_BUTTON}</Button>
                <Button onClick={handleAdd} isDisabled={error || !checkedEmet || isLoading} appearance="primary">
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
