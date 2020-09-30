import React from 'react';
import {ListGroup, Card, CardHeader, CardBody} from 'reactstrap';
import PropTypes from 'prop-types';

import {Label} from '@atlaskit/field-base';

class PersonListContainer extends React.Component {
    render() {
        return (
            <Card id="cardContainer">
                <CardHeader className="clearfix">
                    <h4 className="float-left">{this.props.title}</h4>
                </CardHeader>
                <CardBody>
                    <ListGroup
                        style={{
                            overflowY: 'scroll',
                            overFlowX: 'hidden',
                            maxHeight: '280px',
                        }}
                        id="listContainer"
                    >
                        <Label label={this.props.label} isFirstChild htmlFor={this.props.htmlFor}>
                            {this.props.children}
                        </Label>
                    </ListGroup>
                </CardBody>
            </Card>
        );
    }
}

PersonListContainer.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    label: PropTypes.string,
    htmlFor: PropTypes.string,
};

export default PersonListContainer;
