import React, {Component} from 'react';
import {TextHeader} from '../../components/navigation/CustomNavigationElements';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DataContainer = styled.div`
    width: 65%;
    float: left;
    height: 90vh;
    margin-left: 10px;
    padding: 15px;
`;

const DataBody = styled.div`
    width: 90%;
    margin: auto;
    padding: 10px;
`;

export default class GridContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DataContainer>
                <TextHeader>{this.props.header}</TextHeader>
                <DataBody>
                    <div>{this.props.data}</div>
                </DataBody>
            </DataContainer>
        );
    }
}

GridContainer.propTypes = {
    header: PropTypes.string,
    data: PropTypes.string,
};