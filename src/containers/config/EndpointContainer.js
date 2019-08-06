import React, {Component} from 'react';
import Pagination from '@atlaskit/pagination';
import {QuickSearch} from '@atlaskit/quick-search';

import PropTypes from 'prop-types';
import {TextHeader} from '../../components/navigation/CustomNavigationElements';
import styled, {css} from 'styled-components';
import {ListGroup, ListGroupItem} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import {INPUT_TIMEOUT} from '../../constants/common-ui';
import {deleteConfigItemById} from './service/ConfigService';
import {getConfigApiValues} from '../../common/CommonConfigService';

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
            currentPage: 1,
            searchValue: '',
            isLoading: false
        };

        this.keyInputTimeout = 0;
    }

    componentDidMount() {
        this.loadEndpointData(1);
    }

    loadEndpointData = (page, searchField, searchValue) => {
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);

        this.keyInputTimeout = setTimeout(() => {
            let requestFunction = this.getRequestFunction(page, searchField, searchValue);
            this.setState({
                isLoading: true,
                searchValue: searchValue,
                searchField: searchField
            });
            requestFunction.then((res) => {
                this.setState({
                    pages: Array.from({length: (res.data.total / pageSize < 1 ? 1 : res.data.total / pageSize)}, (v, k) => k + 1),
                    data: res.data.data,
                    total: res.data.total,
                    currentPage: page,
                    isLoading: false,
                });
            });
        }, INPUT_TIMEOUT);
    };

    getRequestFunction = (page, searchField, searchValue) => {
        if (searchValue !== '' && searchField !== '') {
            return getConfigApiValues(this.props.selectedApi.url, page - 1, pageSize, null, searchField, searchValue);
        } else {
            return getConfigApiValues(this.props.selectedApi.url, page - 1, pageSize);
        }
    };

    handleTitleFreeTextSearch = (searchInput) => {
        //TODO change searchField due to schema. Somewhere from this.props.selectedApi
        this.loadEndpointData(1, 'id', searchInput);
    };

    onRemoveItem = (item) => {
        deleteConfigItemById(this.props.urlBase, this.props.selectedApi.url, item.id);
        this.loadEndpointData(this.state.currentPage);
    };

    render() {
        return (
            <DataContainer>
                <TextHeader>{this.props.selectedApi.layout['display-name'] + ' (' + this.state.total + ') '}</TextHeader>
                <DataBody>
                    <CustomContainer left>
                        <QuickSearch
                            isLoading={this.state.isLoading}
                            onSearchInput={({target}) => {
                                this.handleTitleFreeTextSearch(target.value);
                            }}
                            value={this.state.searchInput}
                        />
                    </CustomContainer>

                    {!this.state.isLoading &&
                    <ListGroup
                        style={{
                            overflowY: 'hidden',
                            overFlowX: 'hidden',
                            margin: '10px',
                            paddingRight: '24px'
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
                                                        onChange={(event, newPage) => this.loadEndpointData(newPage, this.state.searchField, this.state.searchInput)}/></CustomContainer>
                </DataBody>
            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    urlBase: PropTypes.string,
    selectedApi: PropTypes.object,
};