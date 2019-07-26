import React, {Component} from 'react';
import Pagination from '@atlaskit/pagination';
import Spinner from '@atlaskit/spinner';
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
            lastSearchInput: '',
            isLoading: false
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

    loadEndpointData = (page, searchInput) => {
        let requestFunction;
        if (searchInput) {
            this.setState({
                lastSearchInput: searchInput
            });
            requestFunction = searchItem(this.props.urlBase, this.props.selectedApi.url, 'id', searchInput, page - 1, pageSize);
        } else {
            requestFunction = getConfigApiValues(this.props.urlBase, this.props.selectedApi.url, page - 1, pageSize);
        }
        this.setState({isLoading: true});
        requestFunction.then((res) => {
            this.setState({
                pages: Array.from({length: (res.data.total / pageSize < 1 ? 1 : res.data.total / pageSize)}, (v, k) => k + 1),
                data: res.data.data,
                total: res.data.total,
                lastPage: page,
                isLoading: false
            });
        });
    };

    handleTitleFreeTextSearch = (searchCriteria) => {
        this.loadEndpointData(1, searchCriteria.title);
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
                    <FreeTextSearch containerId={'setting-api'}
                                    onSearch={this.handleTitleFreeTextSearch}/>
                    { this.state.isLoading && <div style={{width: '400px', margin: 'auto'}}><Spinner size="xlarge" /></div> }
                    { !this.state.isLoading &&
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
                    <div style={{width: '400px', margin: 'auto'}}><Pagination pages={this.state.pages}
                                     onChange={(event, newPage) => this.loadEndpointData(newPage)}/></div>
                </DataBody>
            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    urlBase: PropTypes.string,
    selectedApi: PropTypes.object,
};