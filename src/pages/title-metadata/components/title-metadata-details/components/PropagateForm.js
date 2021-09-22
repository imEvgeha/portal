import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import {ErrorMessage} from '@atlaskit/form';
import {isEmpty} from 'lodash';
import {useDispatch} from 'react-redux';
import {searchPersonById} from '../../../../avails/right-details/rightDetailsServices';
import Loading from '../../../../static/Loading';
import {UPDATE_SEASON_PERSONS} from '../../../titleMetadataActionTypes';
import {
    CAST_CREW,
    CANCEL_BUTTON,
    PROPAGATE,
    EDITORIAL,
    EDITORIAL_METADATA,
    EMPTY_CAST_CREW,
    EMPTY_EMETS,
    EMETS,
    CORE,
    SEASON,
    EPISODE,
} from './propagateConstants';
import './PropagateForm.scss';

const PropagateForm = ({getValues, setFieldValue, person, onClose}) => {
    const {castCrew, contentType, editorial, editorialMetadata} = getValues();
    const persons = isEmpty(person) ? castCrew : [person];
    const isCastCrewEmpty = !castCrew?.length;
    const isEMetsEmpty = !editorialMetadata?.length;
    const dispatch = useDispatch();
    const [checkedEmet, setCheckedEmet] = useState(true);
    const [seasonCheckedCore, setSeasonCheckedCore] = useState(contentType === SEASON || false);
    const [seasonCheckedEmet, setSeasonCheckedEmet] = useState(contentType === SEASON || false);
    const [isLoading, setIsLoading] = useState(false);
    const [localizationCastCrew, setLocalizationCastCrew] = useState([]);

    useEffect(() => {
        async function fetchLocalizationPersons() {
            setIsLoading(true);
            const allLocalizationsPersons = persons.map(async ({id}) => {
                try {
                    const localizationPerson = await searchPersonById(id);
                    return localizationPerson;
                } catch (err) {
                    return;
                }
            });

            const localizationPersons = await Promise.all(allLocalizationsPersons);
            setLocalizationCastCrew(localizationPersons);
            setIsLoading(false);
        }
        !isEmpty(persons) && fetchLocalizationPersons();
    }, [castCrew]);

    const getPropagateMessage = () => `Propagate ${isEmpty(person) ? CAST_CREW : person.displayName} to...`;

    const handleAddEmetOption = async () => {
        const pushUpdatedCastCrew = emet => {
            persons.forEach(person => {
                const localization = localizationCastCrew.find(({id}) => id === person.id)?.localization;
                localization && (person.localization = localization);
            });

            if (emet.castCrew) {
                const uniquePersons = persons.filter(
                    person =>
                        !emet.castCrew.some(
                            emetPerson => emetPerson.id === person.id && emetPerson.creditsOrder === person.creditsOrder
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
    };

    const handleAddSeasonOption = () => {
        const seasonCastCrewPropagateData = {
            addPersons: persons.map(person => {
                const {id, personType, creditsOrder} = person;
                return {
                    id,
                    personType,
                    creditsOrder,
                    propagateToEmet: seasonCheckedEmet,
                };
            }),
        };

        dispatch({
            type: UPDATE_SEASON_PERSONS,
            payload: seasonCastCrewPropagateData,
        });
    };

    const handleAdd = async () => {
        checkedEmet && handleAddEmetOption();
        (seasonCheckedCore || seasonCheckedEmet) && handleAddSeasonOption();

        onClose();
    };

    return (
        <>
            <p className="propagate-form__message">{getPropagateMessage()}</p>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="propagate-form__section">
                        <h5>{contentType !== 'AD' ? contentType : 'ADVERTISMENT'}</h5>
                        <Checkbox
                            id="emets"
                            label={EMETS}
                            isChecked={checkedEmet}
                            onChange={() => setCheckedEmet(!checkedEmet)}
                            isDisabled={isCastCrewEmpty || isEMetsEmpty}
                        />
                    </div>

                    {contentType === SEASON && (
                        <div className="propagate-form__season">
                            <div className="propagate-form__section">
                                <h5>{EPISODE}</h5>

                                <Checkbox
                                    id="episodeCore"
                                    label={CORE}
                                    isChecked={seasonCheckedCore}
                                    onChange={() => setSeasonCheckedCore(!seasonCheckedCore)}
                                    isDisabled={isCastCrewEmpty || isEMetsEmpty}
                                />
                                <Checkbox
                                    id="episodeEmets"
                                    label={EMETS}
                                    isChecked={seasonCheckedEmet}
                                    onChange={() => setSeasonCheckedEmet(!seasonCheckedEmet)}
                                    isDisabled={isCastCrewEmpty || isEMetsEmpty}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="propagate-form__error">
                {isCastCrewEmpty && <ErrorMessage>{EMPTY_CAST_CREW}</ErrorMessage>}
                {isEMetsEmpty && <ErrorMessage>{EMPTY_EMETS}</ErrorMessage>}
            </div>
            <div className="propagate-form__actions">
                <Button onClick={() => onClose()}>{CANCEL_BUTTON}</Button>
                <Button
                    onClick={handleAdd}
                    isDisabled={
                        (!checkedEmet && !seasonCheckedEmet && !seasonCheckedCore) ||
                        (isCastCrewEmpty && !checkedEmet) ||
                        isEMetsEmpty ||
                        isLoading
                    }
                    appearance="primary"
                >
                    {PROPAGATE}
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
