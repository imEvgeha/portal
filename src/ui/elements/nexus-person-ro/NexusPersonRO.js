/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import {Container, Row} from 'reactstrap';
import './NexusPersonRO.scss';
import DefaultUserIcon from '../../../assets/img/default-user.png';
import {getFormatTypeName} from '../../../pages/legacy/constants/metadata/configAPI';
import {
    CustomColumn,
    CustomEllipsis,
    CustomRow,
    ListItemText,
    ListText,
    PersonListFlag,
} from '../../../pages/legacy/containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';

const NexusPersonRO = ({person, showPersonType}) => {
    return (
        <Container>
            <CustomRow>
                <CustomColumn xs={!person.characterName ? 12 : 6}>
                    <CustomEllipsis>
                        <img src={DefaultUserIcon} alt="Cast" className="nexus-c-person-avatar" />
                        {showPersonType && (
                            <PersonListFlag>
                                <span className="nexus-c-person-type">
                                    <Lozenge appearance="default">{getFormatTypeName(person.personType)}</Lozenge>
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
                        <CustomEllipsis className="nexus-c-person-character-container">
                            <ListText className="nexus-c-person-character">
                                <PersonListFlag>
                                    <span className="nexus-c-person-separator">
                                        <Lozenge appearance="default">CHARACTER</Lozenge>
                                    </span>
                                </PersonListFlag>
                                <ListItemText title={person.characterName}>{person.characterName}</ListItemText>
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
    showPersonType: PropTypes.bool,
};

NexusPersonRO.defaultProps = {
    showPersonType: true,
};

export default NexusPersonRO;
