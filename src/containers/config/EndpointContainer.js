import React, {Component} from 'react';
import Pagination from '@atlaskit/pagination';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import {QuickSearch} from '@atlaskit/quick-search';

import PropTypes from 'prop-types';
import {TextHeader} from '../../components/navigation/CustomNavigationElements';
import styled, {css} from 'styled-components';
import {ListGroup, ListGroupItem} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import {INPUT_TIMEOUT} from '../../constants/common-ui';
import {configService} from './service/ConfigService';
import {getConfigApiValues} from '../../common/CommonConfigService';
import CreateEditConfigForm from './CreateEditConfigForm';

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

const pageSize = 13;

export const cache={};

export class EndpointContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: [1],
            data: [],
            total: 0,
            currentPage: 1,
            // searchValue: '"David Arkin"',
            searchValue: '',
            isLoading: false,
            currentRecord: null,
            containerHeight: 70
        };

        this.keyInputTimeout = 0;
        this.editRecord = this.editRecord.bind(this);
        this.onNewRecord = this.onNewRecord.bind(this);

        getConfigApiValues(this.props.selectedApi.urls['CRUD'], 0 , 1000).then(response => {
            cache[this.props.selectedApi.url] = response.data.data;
        });
    }

    calculatePageSize = () => {
        console.log('Page size', this.state.containerHeight < 40 ? 4 : this.state.containerHeight / 10);
        return Math.floor(this.state.containerHeight < 40 ? 4 : this.state.containerHeight / 5);
    }

    componentDidMount() {
        this.loadEndpointData(1, this.props.selectedApi.displayValueFieldName[0], this.state.searchValue);
        let h = document.getElementById('listContainer').clientHeight;
        let h2 = document.getElementById('listContainer').offsetHeight;
        let h3 = document.getElementById('listContainer').scrollHeight;
        console.log('Heights', h, h2, h3);
        window.addEventListener('resize', function(){
                console.log('Height:', window.innerHeight);    
                console.log('Height:', window.innerHeight / 12 + 'vh');               
                this.setState({containerHeight: window.innerHeight / 12});
        }.bind(this));
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
            getConfigApiValues(this.props.selectedApi.urls['search'], page - 1, this.calculatePageSize(), null, searchField, searchValue)
                .then((res) => {
                    this.setState({
                        pages: Array.from({length: (res.data.total / this.calculatePageSize() < 1 ? 1 : res.data.total / this.calculatePageSize())}, (v, k) => k + 1),
                        data: res.data.data,
                        total: res.data.total,
                        isLoading: false,
                    });
                });
        }, INPUT_TIMEOUT);
    };

    handleTitleFreeTextSearch = (searchValue) => {
        this.loadEndpointData(1, this.props.selectedApi.displayValueFieldName[0], searchValue);
    };

    onEditRecord(rec){
        this.setState({currentRecord:rec});
    }

    editRecord(val){
        const newVal={...this.state.currentRecord, ...val};
        if(newVal.id) {
            configService.update(this.props.selectedApi.urls['CRUD'], newVal.id, newVal)
                .then(response => {
                    let data = this.state.data.slice(0);
                    let index = data.findIndex(item => item.id === newVal.id);
                    data[index] = response.data;
                    this.setState({data: data, currentRecord: null});
                }
            );
        }else{
            configService.create(this.props.selectedApi.urls['CRUD'], newVal)
                .then(response => {
                    let data = this.state.data.slice(0);
                    data.unshift(response.data);
                    this.setState({data: data, currentRecord: null});
                }
            );
        }

    }

    onNewRecord(){
        this.setState({currentRecord:{}});
    }

    onRemoveItem = (item) => {
        configService.delete(this.props.selectedApi.urls['CRUD'], item.id);
        this.loadEndpointData(this.state.currentPage);
    };

    renderList = data => {
        if(data.ratingSystem) {            
            return data.ratingSystem + this.props.selectedApi['displayValueDelimiter'] + data[this.props.selectedApi.displayValueFieldName[0]];
        } else {
            if(this.props.selectedApi.displayValueFieldName) {
                return data[this.props.selectedApi.displayValueFieldName[0]] ? data[this.props.selectedApi.displayValueFieldName[0]] : `[id = ${data.id}]`;
            }
        }
    }

    render() {
        return (
            <DataContainer height={this.state.containerHeight}>
                <TextHeader>{this.props.selectedApi.displayName + ' (' + this.state.total + ') '}
                    {this.state.currentRecord === null  &&
                        <Button onClick = {this.onNewRecord} iconBefore={<AddIcon label="add" />} appearance={'default'} style={{float: 'right'}}>Add</Button>
                    }
                </TextHeader>

                {this.state.currentRecord &&
                <DataBody>
                    <CreateEditConfigForm schema={this.props.selectedApi.uiSchema} value={this.state.currentRecord} onSubmit={this.editRecord} onCancel={() => this.setState({currentRecord:null})}/>
                </DataBody>
                }
                {!this.state.currentRecord && <DataBody>
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
                            overflowY: 'auto',
                            overFlowX: 'hidden',
                            margin: '10px',
                            paddingRight: '24px',
                            height: `${this.state.containerHeight}vh`,
                            border: '1px solid #000',
                        }}
                        id='listContainer'
                    >
                        {this.state.data.map((item, i) => {
                            if(i <= this.calculatePageSize()) {
                                return (
                                    <ListGroupItem key={i} id="list-item-1">
                                        <a href="#"
                                            onClick={() => this.onEditRecord(item)}>
                                            {this.renderList(item)}
                                        </a>
                                        <FontAwesome
                                            className='float-right'
                                            name='times-circle'
                                            style={{marginTop: '5px', cursor: 'pointer'}}
                                            color='#111'
                                            size='lg'
                                            onClick={() => this.onRemoveItem(item)}
                                        />
                                    </ListGroupItem>
                                );
                            }
                        })}
                    </ListGroup>
                    }
                    <CustomContainer center><Pagination selectedIndex={this.state.currentPage - 1}
                                                        pages={this.state.pages}
                                                        onChange={(event, newPage) => this.loadEndpointData(newPage, this.state.searchField, this.state.searchValue)}/></CustomContainer>
                </DataBody>
                }
            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    urlBase: PropTypes.string,
    selectedApi: PropTypes.object,
};