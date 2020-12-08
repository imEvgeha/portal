import React from 'react';
import PropTypes from 'prop-types';
import {Container} from 'reactstrap';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import {PersonListFlag, ListText, CustomRow, CustomColumn, CustomEllipsis, ListItemText} from './CustomComponents';

const PersonListReadOnly = ({showPersonType, getFormatTypeName, person, columnName}) => {
    return (
        <Container>
            <CustomRow>
                <CustomColumn xs={!person.characterName ? 12 : 6}>
                    <CustomEllipsis>
                        <img src={DefaultUserIcon} alt="Cast" style={{width: '30px', height: '30px'}} />
                        {showPersonType && (
                            <PersonListFlag>
                                <span style={{marginLeft: '10px'}}>
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
                        <CustomEllipsis style={{width: '100%'}}>
                            <ListText style={{width: '100%'}}>
                                <PersonListFlag>
                                    <span style={{marginLeft: '10px'}}>
                                        <Lozenge appearance="default">{columnName.toString().toUpperCase()}</Lozenge>
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

PersonListReadOnly.defaultProps = {
    showPersonType: false,
    columnName: 'Default',
};

PersonListReadOnly.propTypes = {
    getFormatTypeName: PropTypes.func,
    showPersonType: PropTypes.bool,
    person: PropTypes.object,
    columnName: PropTypes.string,
};

export default PersonListReadOnly;
