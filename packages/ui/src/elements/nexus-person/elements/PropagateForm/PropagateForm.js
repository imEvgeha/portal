import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import {ErrorMessage} from '@atlaskit/form';
import {RadioGroup} from '@atlaskit/radio';
import {searchPersonById} from '@vubiquity-nexus/portal-utils/lib/services/rightDetailsServices';
import {isEmpty} from 'lodash';
import {ProgressSpinner} from 'primereact/progressspinner';
import {useDispatch, useSelector} from 'react-redux';
import './PropagateForm.scss';
import {checkIfEmetIsEditorial} from '../../../nexus-dynamic-form/utils';
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

const propagateAddPersonsSelector = state => state?.titleMetadata?.propagateAddPersons || [];
const propagateRemovePersonsSelector = state => state?.titleMetadata?.propagateRemovePersons || [];

export const PROPAGATE_ADD_PERSONS = 'PROPAGATE_ADD_PERSONS';

const propagateAddPersons = payload => ({
    type: PROPAGATE_ADD_PERSONS,
    payload,
});

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
    const dispatch = useDispatch();
    const [checkedEmet, setCheckedEmet] = useState(true);
    const [radioValue, setRadioValue] = useState('none');
    const [isLoading, setIsLoading] = useState(false);
    const [localizationCastCrew, setLocalizationCastCrew] = useState([]);
    const propagateAddedPersons = useSelector(propagateAddPersonsSelector);
    const propagateRemovePersons = useSelector(propagateRemovePersonsSelector);

    const {castCrew, contentType, editorial, editorialMetadata} = getValues();
    const persons = isEmpty(person) ? castCrew : [person];
    const isCastCrewEmpty = !castCrew?.length;
    const isEMetsEmpty = !editorialMetadata?.length;

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

    const generateCastCrewToPropagate = emet => {
        const uniquePersons = persons.filter(person => {
            return isEmpty(emet.castCrew)
                ? person
                : !emet.castCrew.some(
                      emetPerson => emetPerson.id === person.id && emetPerson.personType === person.personType
                  );
        });

        const localizedUniquePersons = uniquePersons.map(person => {
            const localization = localizationCastCrew.find(({id}) => id === person.id)?.localization;

            return {
                ...person,
                localization,
            };
        });

        const newCastCrew = isEmpty(emet.castCrew)
            ? localizedUniquePersons
            : [...emet.castCrew, ...localizedUniquePersons];

        const updatedEmet = {
            ...emet,
            castCrew: newCastCrew,
        };
        if (checkIfEmetIsEditorial(emet, editorial)) {
            setFieldValue(EDITORIAL, {...editorial, castCrew: newCastCrew});
        }

        return updatedEmet;
    };

    const handleAddEmetOption = async () => {
        const updateEditorialMetadata = editorialMetadata.map(emet => generateCastCrewToPropagate(emet));

        setFieldValue(EDITORIAL_METADATA, updateEditorialMetadata);
    };

    const handleAddSeasonOption = () => {
        const seasonCastCrewPropagateData = persons.map(person => {
            const {id, personType, order} = person;
            return {
                id,
                personType,
                order,
                propagateToEmet: radioValue === 'emets',
            };
        });

        const payload = {
            added: [...propagateAddedPersons, ...seasonCastCrewPropagateData],
            removed: propagateRemovePersons.filter(person => {
                return !seasonCastCrewPropagateData.some(
                    entry => entry.id === person.id && entry.personType === person.personType
                );
            }),
        };

        dispatch(propagateAddPersons(payload));
    };

    const handleAdd = async () => {
        checkedEmet && !isCastCrewEmpty && !isEMetsEmpty && handleAddEmetOption();
        radioValue !== 'none' && handleAddSeasonOption();

        onClose();
    };

    const onChange = useCallback(event => {
        setRadioValue(event.currentTarget.value);
    }, []);

    return (
        <>
            <p className="propagate-form__message">{getPropagateMessage()}</p>
            {isLoading ? (
                <div className="row">
                    <div className="col-12 text-center">
                        <ProgressSpinner
                            className="nexus-c-data-panel__spinner"
                            strokeWidth="4"
                            animationDuration=".5s"
                        />
                    </div>
                </div>
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
                        <>
                            <hr className="solid" />
                            <div className="propagate-form__section">
                                <h5>{EPISODE}</h5>
                                <div className="propagate-form__radio">
                                    <RadioGroup
                                        label={EPISODE}
                                        value={radioValue}
                                        options={episodePropagateOptions}
                                        onChange={onChange}
                                        isDisabled={isCastCrewEmpty}
                                    />
                                </div>
                            </div>
                        </>
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
                        (radioValue === 'none' && isEMetsEmpty) ||
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
