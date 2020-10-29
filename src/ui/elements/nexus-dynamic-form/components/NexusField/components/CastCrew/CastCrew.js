import React, {useState} from 'react';
import PropTypes from 'prop-types';
import NexusPersonsList from '../../../../../nexus-persons-list/NexusPersonsList';
import {CAST_CONFIG, CREW_CONFIG} from '../../../../../nexus-persons-list/constants';
import './CastCrew.scss';

const CastCrew = ({persons, isEdit}) => {
    const [cast, setCast] = useState(
        persons
            .filter(person => person.personType === 'Actor')
            .map((e, index) => {
                return {...e, id: index};
            })
    );
    const [crew, setCrew] = useState(
        persons
            .filter(person => person.personType !== 'Actor')
            .map((e, index) => {
                return {...e, id: index};
            })
    );

    return (
        <div className="nexus-c-cast-crew">
            <div className="nexus-c-cast-crew__card">
                <NexusPersonsList
                    personsList={cast}
                    uiConfig={CAST_CONFIG}
                    hasCharacter={false}
                    showPersonType={true}
                    onChange={null}
                    isEdit={isEdit}
                />
            </div>
            <div className="nexus-c-cast-crew__card">
                <NexusPersonsList
                    personsList={crew}
                    uiConfig={CREW_CONFIG}
                    hasCharacter={false}
                    showPersonType={true}
                    onChange={null}
                    isEdit={isEdit}
                />
            </div>
        </div>
    );
};

CastCrew.propTypes = {
    isEdit: PropTypes.bool,
    persons: PropTypes.array,
};

CastCrew.defaultProps = {
    isEdit: false,
    persons: [],
};

export default CastCrew;
