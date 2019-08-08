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
            isLoading: false,
        };

        this.keyInputTimeout = 0;
    }

    componentDidMount() {
        this.loadEndpointData(1);
    }

    loadEndpointData = (page, searchField, searchValue) => {
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);

        this.keyInputTimeout = setTimeout(() => {
            this.setState({
                isLoading: true,
                searchValue: searchValue,
                searchField: searchField,
                currentPage: page,
            });
            getConfigApiValues(this.props.selectedApi.url, page - 1, pageSize, null, searchField, searchValue)
                .then((res) => {
                    this.setState({
                        pages: Array.from({length: (res.data.total / pageSize < 1 ? 1 : res.data.total / pageSize)}, (v, k) => k + 1),
                        data: res.data.data,
                        total: res.data.total,
                        isLoading: false,
                    });
                });
        }, INPUT_TIMEOUT);
    };

    handleTitleFreeTextSearch = (searchValue) => {
        //TODO change searchField due to schema. Somewhere from this.props.selectedApi
        this.loadEndpointData(1, this.props.selectedApi.displayValueFieldName, searchValue);
    };

    onRemoveItem = (item) => {
        deleteConfigItemById(this.props.selectedApi.url, item.id);
        this.loadEndpointData(this.state.currentPage);
    };

    render() {
        return (
            <DataContainer>
                <TextHeader>{this.props.selectedApi['url'] + ' (' + this.state.total + ') '}</TextHeader>
                <DataBody>
                    <CustomContainer left>
                        <QuickSearch
                            isLoading={this.state.isLoading}
                            onSearchInput={({target}) => {
                                this.handleTitleFreeTextSearch(target.value);
                            }}
                            value={this.state.searchValue}
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
                                        {item[this.props.selectedApi.displayValueFieldName]}
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
                    <CustomContainer center><Pagination selectedIndex={this.state.currentPage - 1}
                                                        pages={this.state.pages}
                                                        onChange={(event, newPage) => this.loadEndpointData(newPage, this.state.searchField, this.state.searchValue)}/></CustomContainer>
                </DataBody>
            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    urlBase: PropTypes.string,
    selectedApi: PropTypes.object,
};