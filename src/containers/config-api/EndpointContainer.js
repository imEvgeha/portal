import React, {Component} from 'react';
import Pagination from '@atlaskit/pagination';
import {QuickSearch} from '@atlaskit/quick-search';

import {deleteConfigItemById, getConfigApiValues, searchConfigItem} from '../metadata/service/ConfigService';
import PropTypes from 'prop-types';
import {TextHeader} from '../../components/navigation/CustomNavigationElements';
import styled, {css} from 'styled-components';
import {ListGroup, ListGroupItem} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import {INPUT_TIMEOUT} from '../../constants/metadata/configAPI';

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

const CustomContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    ${props => props.left && css`
        width: 100%;
    `}
    ${props => props.center && css`
        width: 400px;        
        margin: auto;
    `}
    ${props => props.right && css`
        float:right;
    `}
`;

const pageSize = 10;

export class EndpointContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: [1],
            data: [],
            total: 0,
            lastPage: 1,
            lastSearchInput: '',
            isLoading: false
        };

        this.keyInputTimeout = 0;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedApi !== this.props.selectedApi) {
            this.loadEndpointData(1);
            this.setState({
                pages: [1],
                data: [],
                total: 0,
                lastPage: 1,
                lastSearchInput: '',
                lastSearchField: ''
            });
        }
    }

    loadEndpointData = (page, searchField, searchInput) => {
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);

        this.keyInputTimeout = setTimeout(() => {
            let requestFunction = this.getRequestFunction(page, searchField, searchInput);
            this.setState({isLoading: true});
            requestFunction.then((res) => {
                this.setState({
                    pages: Array.from({length: (res.data.total / pageSize < 1 ? 1 : res.data.total / pageSize)}, (v, k) => k + 1),
                    data: res.data.data,
                    total: res.data.total,
                    lastPage: page,
                    isLoading: false,
                });
            });
        }, INPUT_TIMEOUT);
    };

    getRequestFunction = (page, searchField, searchInput) => {
        if (searchInput !== '' && searchField !== '') {
            this.setState({
                lastSearchInput: searchInput,
                lastSearchField: searchField
            });
            return searchConfigItem(this.props.urlBase, this.props.selectedApi.url, searchField, searchInput, page - 1, pageSize);
        } else {
            return getConfigApiValues(this.props.urlBase, this.props.selectedApi.url, page - 1, pageSize);
        }
    };

    handleTitleFreeTextSearch = (searchInput) => {
        //TODO change searchField due to schema. Somewhere from this.props.selectedApi
        this.loadEndpointData(1, 'id', searchInput);
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
                    <CustomContainer left>
                        <QuickSearch
                            isLoading={this.state.isLoading}
                            onSearchInput={({target}) => {
                                this.handleTitleFreeTextSearch(target.value);
                            }}
                            value={this.state.lastSearchInput}
                        />
                    </CustomContainer>

                    {!this.state.isLoading &&
                    <ListGroup
                        style={{
                            overflowY: 'hidden',
                            overFlowX: 'hidden',
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
                    }
                    <CustomContainer center><Pagination pages={this.state.pages}
                                                        onChange={(event, newPage) => this.loadEndpointData(newPage, this.state.lastSearchField, this.state.lastSearchInput)}/></CustomContainer>
                </DataBody>
            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    urlBase: PropTypes.string,
    selectedApi: PropTypes.object,
};