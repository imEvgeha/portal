import React from 'react';
import {
    ListGroup,
    Card,
    CardHeader,
    CardBody
} from 'reactstrap';
import PropTypes from 'prop-types';

import { Label as LB } from '@atlaskit/field-base';

class CastCrewCardContainer extends React.Component {
    render() {
        return (
            <Card id='cardContainer'>
                    <CardHeader className='clearfix'>
                        <h4 className='float-left'>{this.props.title}</h4>
                    </CardHeader>
                    <CardBody>
                        <ListGroup
                        style={{
                            overflowY: 'scroll',
                            overFlowX: 'hidden',
                            maxHeight: '280px'
                        }}
                        id='listContainer'
                        >
                            <LB
                                label={this.props.label}
                                isFirstChild
                                htmlFor={this.props.htmlFor}
                            >  
                                {this.props.children}                                
                            </LB>
                        </ListGroup>
                    </CardBody>
                    </Card>
        );
    }
}

CastCrewCardContainer.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    label: PropTypes.string,
    htmlFor: PropTypes.string
};

export default CastCrewCardContainer;