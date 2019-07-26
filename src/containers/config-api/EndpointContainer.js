import React, {Component} from 'react';
import Pagination from '@atlaskit/pagination';
import {deleteConfigItemById, getConfigApiValues, searchItem} from '../metadata/service/ConfigService';
import PropTypes from 'prop-types';
import {TextHeader} from '../../components/navigation/CustomNavigationElements';
import styled from 'styled-components';
import FreeTextSearch from '../metadata/dashboard/components/FreeTextSearch';
import {ListGroup, ListGroupItem} from 'reactstrap';
import FontAwesome from 'react-fontawesome';

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
            total: 0,
            lastPage: 0,
            lastSearchInput: ''
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedApi !== this.props.selectedApi) {
            this.loadEndpointData(1);
            this.setState({
                pages: [1],
                data: [],
                total: 0,
                lastPage: 0,
                lastSearchInput: ''
            });
        }
    }

    componentDidMount() {
        if (this.props.urlBase && this.props.selectedApi.url) {
            this.loadEndpointData(1);
        }
    }

    loadEndpointData = (page) => {
        let requestFunction;
        if (this.state.lastSearchInput) {
            requestFunction = searchItem(this.props.urlBase, this.props.selectedApi.url, 'id', this.state.lastSearchInput, page - 1, pageSize);
        } else {
            requestFunction = getConfigApiValues(this.props.urlBase, this.props.selectedApi.url, page - 1, pageSize);
        }
        requestFunction.then((res) => {
            this.setState({
                pages: Array.from({length: (res.data.total / pageSize < 1 ? 1 : res.data.total / pageSize)}, (v, k) => k + 1),
                data: res.data.data,
                total: res.data.total,
                lastPage: page
            });
        });
    };


    handleTitleFreeTextSearch = (searchCriteria) => {
        this.setState({
            lastSearchInput: searchCriteria.title
        });
        this.loadEndpointData(1);
    };


    onRemoveItem = (item) => {
        deleteConfigItemById(this.props.urlBase, this.props.selectedApi.url, item.id);
        this.loadEndpointData(this.state.lastPage);
    };

    render() {
        return (
            <DataContainer>
                <TextHeader>{this.props.selectedApi.layout['display-name'] + ' {' + this.state.total + '} '}</TextHeader>
                <DataBody>
                    <FreeTextSearch ontainerId={'dashboard-title'}
                                    onSearch={this.handleTitleFreeTextSearch}/>
                    <ListGroup
                        style={{
                            overflowY: 'hidden',
                            overFlowX: 'hidden',
                            // maxHeight: '60vh'
                            margin: '10px'
                        }}
                        id='listContainer'
                    >
                        {this.state.data.map((item, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <ListGroupItem key={i}>
                                        {item.id}
                                        <FontAwesome
                                            className='float-right'
                                            name='times-circle'
                                            style={{marginTop: '5px', cursor: 'pointer'}}
                                            color='#111'
                                            size='lg'
                                            onClick={() => this.onRemoveItem(item)}
                                        />
                                    </ListGroupItem>
                                </React.Fragment>
                            );
                        })}
                    </ListGroup>
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