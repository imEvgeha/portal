import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import {ErrorMessage} from '@atlaskit/form';
import {RadioGroup} from '@atlaskit/radio';
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
    SEASON,
    EPISODE,
} from './propagateConstants';
import './PropagateForm.scss';

const episodePropagateOptions = [
    {
        label: 'None',
        value: 'none',
    },
    {
        label: 'Core',
        value: 'core',
    },
    {
        label: 'Core & EMets',
        value: 'emets',
    },
];

const PropagateForm = ({getValues, setFieldValue, person, onClose}) => {
    const {castCrew, contentType, editorial, editorialMetadata} = getValues();
    const persons = isEmpty(person) ? castCrew : [person];
    const isCastCrewEmpty = !castCrew?.length;
    const isEMetsEmpty = !editorialMetadata?.length;
    const dispatch = useDispatch();
    const [checkedEmet, setCheckedEmet] = useState(true);
    const [radioValue, setRadioValue] = useState('none');
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
                            emetPerson => emetPerson.id === person.id && emetPerson.personType === person.personType
                        )
                );

                const uniquePersonsWithCreditsOrder = uniquePersons.map((person, i) => {
                    return {
                        ...person,
                        creditsOrder: emet.castCrew.length + i,
                    };
                });
                emet.castCrew.push(...uniquePersonsWithCreditsOrder);
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
        const seasonCastCrewPropagateData = persons.map(person => {
            const {id, personType, creditsOrder} = person;
            return {
                id,
                personType,
                creditsOrder,
                propagateToEmet: radioValue === 'emets',
            };
        });

        dispatch({
            type: UPDATE_SEASON_PERSONS,
            payload: seasonCastCrewPropagateData,
        });
    };

    const handleAdd = async () => {
        checkedEmet && handleAddEmetOption();
        radioValue !== 'none' && handleAddSeasonOption();

        onClose();
    };

    const onChange = useCallback(event => {
        setRadioValue(event.currentTarget.value);
    }, []);

    const notSeason = !(contentType === SEASON);

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

                    <hr className="solid" />
                    <div className="propagate-form__section">
                        <h5 className={notSeason && 'disabled'}>{EPISODE}</h5>
                        <div className="propagate-form__radio">
                            <RadioGroup
                                label={EPISODE}
                                isDisabled={notSeason || isCastCrewEmpty}
                                value={radioValue}
                                options={episodePropagateOptions}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="propagate-form__error">
                {isCastCrewEmpty && <ErrorMessage>{EMPTY_CAST_CREW}</ErrorMessage>}
                {isEMetsEmpty && <ErrorMessage>{EMPTY_EMETS}</ErrorMessage>}
                {contentType === SEASON && (
                    <div className="note">
                        Note: You must save changes before propagating from a season to its episodes
                    </div>
                )}
            </div>
            <div className="propagate-form__actions">
                <Button onClick={() => onClose()}>{CANCEL_BUTTON}</Button>
                <Button
                    onClick={handleAdd}
                    isDisabled={
                        (isEMetsEmpty && radioValue === 'none') ||
                        isCastCrewEmpty ||
                        isLoading ||
                        (radioValue === 'none' && !checkedEmet)
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
