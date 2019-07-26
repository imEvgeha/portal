import React, {Component} from 'react';
import Pagination from '@atlaskit/pagination';
import {getConfigApiValues} from '../metadata/service/ConfigService';
import PropTypes from 'prop-types';
import {ListElement, ListParent, TextHeader} from '../../components/navigation/CustomNavigationElements';
import styled from 'styled-components';
import FreeTextSearch from '../metadata/dashboard/components/FreeTextSearch';
import { Button, Row } from 'reactstrap';

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

const pageSize = 10;

export class EndpointContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: [1],
            data: [],
            total: 0
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedApi !== this.props.selectedApi) {
            this.loadEndpointData(1);
        }
    }

    componentDidMount() {
        if (this.props.urlBase && this.props.selectedApi.url) {
            this.loadEndpointData(1);
        }
    }

    loadEndpointData = (page) => {
        getConfigApiValues(this.props.urlBase, this.props.selectedApi.url, page - 1, pageSize).then((res) => {
            this.setState({
                pages: Array.from({length: (res.data.total / pageSize < 1 ? 1 : res.data.total / pageSize)}, (v, k) => k + 1),
                data: res.data.data,
                total: res.data.total
            });
            console.log(res)
        });
    };

    handleTitleFreeTextSearch = (searchCriteria) => {
        console.log(searchCriteria);
    }

    render() {
        return (
            <DataContainer>
                <TextHeader>{this.props.selectedApi.layout['display-name'] + ' {' + this.state.total + '} '}</TextHeader>
                <DataBody>
                    <FreeTextSearch ontainerId={'dashboard-title'}
                                    onSearch={this.handleTitleFreeTextSearch}/>
                    <ListParent>


                        {this.state.data.map((e, i) => (
                            <Row key={i}><ListElement>{e.displayName}</ListElement><Button className="float-right">X</Button></Row>
                        ))}
                    </ListParent>
                    <Pagination pages={this.state.pages} onChange={(event, newPage) => this.loadEndpointData(newPage)}/>
                </DataBody>
            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    urlBase: PropTypes.string,
    selectedApi: PropTypes.object,
};