import PropTypes from 'prop-types';
import {
    CustomColumn, CustomEllipsis, CustomRow,
    ListItemText, ListText, PersonListFlag
} from '../../../../containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';
import {Container, Row} from 'reactstrap';
import DefaultUserIcon from '../../../../assets/img/default-user.png';
import Lozenge from '@atlaskit/lozenge';
import {getFormatTypeName} from '../../../../constants/metadata/configAPI';
import React from 'react';
import './NexusPersonRO.scss';

const NexusPersonRO = ({
     person,
     showPersonType,
 })=> {
    return (
        <Container>
            <CustomRow>
                <CustomColumn xs={!person.characterName ? 12 : 6}>
                    <CustomEllipsis>
                        <img src={DefaultUserIcon} alt="Cast" className='nexus-c-person-avatar' />
                        {showPersonType && (
                            <PersonListFlag>
                                <span className='nexus-c-person-type'>
                                    <Lozenge appearance="default">
                                        {getFormatTypeName(person.personType)}
                                    </Lozenge>
                                </span>
                            </PersonListFlag>
                        )}
                        <CustomEllipsis title={person.displayName} isInline={true}>
                            {person.displayName}
                        </CustomEllipsis>
                    </CustomEllipsis>
                </CustomColumn>
                {person.characterName ? (
                    <CustomColumn xs={6}>
                        <CustomEllipsis className='nexus-c-person-character-container'>
                            <ListText className='nexus-c-person-character'>
                                <PersonListFlag>
                                    <span className='nexus-c-person-separator'>
                                        <Lozenge appearance="default">CHARACTER
                                        </Lozenge>
                                    </span>
                                </PersonListFlag>
                                <ListItemText title={person.characterName}>
                                    {person.characterName}
                                </ListItemText>
                            </ListText>
                        </CustomEllipsis>
                    </CustomColumn>
                ) : null}
            </CustomRow>
        </Container>
    );
};

NexusPersonRO.propTypes = {
    person: PropTypes.object.isRequired,
    showPersonType: PropTypes.bool
};

NexusPersonRO.defaultProps = {
    showPersonType: true
};

export default NexusPersonRO;