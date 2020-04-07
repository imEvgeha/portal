import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FontAwesome from 'react-fontawesome';
import styled, { css } from 'styled-components';
import Pagination from '@atlaskit/pagination';
import {QuickSearch} from '@atlaskit/quick-search';
import { TextHeader } from '../../components/navigation/CustomNavigationElements';
import { INPUT_TIMEOUT } from '../../constants/common-ui';
import { configService } from './service/ConfigService';
import { getConfigApiValues } from '../../common/CommonConfigService';
import CreateEditConfigForm from './CreateEditConfigForm';
import { Can, can } from '../../../../ability';
import './ConfigUI.scss';

const DataContainer = styled.div`
    width: 65%;
    float: left;
    height: calc(100vh - 90px);
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

const ListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-right: 24px;
    margin: 10px;
`;

const ListItem = styled.div`
    display: flex;
    justify-content: space-between;
    border: 1px solid #DDD;
    padding: 10px;
    width: 100%;
    border-radius: 3px;
    margin-top: 2px;
    &:nth-child(even) {
        background: #F9F9F9;
    }
`;

const CustomButton = styled.div`
    float: right;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    background: #EBEDF0;
    color: #666;
    padding: 7px 10px 7px;
    &:hover {
        background: #B8BABC;
    }
`;

export const cache = {};

const defaultPageSize = 13;

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
            currentRecord: null,
            pageSize: defaultPageSize
        };

        this.keyInputTimeout = 0;
        this.editRecord = this.editRecord.bind(this);
        this.onNewRecord = this.onNewRecord.bind(this);
    }

    componentDidMount() {
        const {selectedApi, visible} = this.props;
        this.calculatePageSize();
        const fieldNames = (selectedApi && Array.isArray(selectedApi.displayValueFieldNames) && selectedApi.displayValueFieldNames) || [];
        if(visible) {
            this.loadEndpointData(1, fieldNames.length > 0 ? fieldNames[0] : '', this.state.searchValue);
        }
        window.addEventListener('resize', function () {
            this.calculatePageSize();
        }.bind(this));
    }

    componentDidUpdate(prevProps) {
        const {selectedApi, visible} = this.props;
        const fieldNames = (selectedApi && Array.isArray(selectedApi.displayValueFieldNames) && selectedApi.displayValueFieldNames) || [];
        if(visible && visible !== prevProps.visible){
            this.loadEndpointData(1, fieldNames.length > 0 ? fieldNames[0] : '', this.state.searchValue);
        }
    }

    calculatePageSize = () => {
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const windowViewPort = (h) / 10;
        const staticSectionVH = windowViewPort > 90 ? 5 : windowViewPort > 50 ? 20 : 30;
        let numberOfItems = Math.ceil((defaultPageSize * (windowViewPort - staticSectionVH)) / 100);
        numberOfItems = numberOfItems <= 0 ? 1 : numberOfItems;
        this.setState({
            pageSize: numberOfItems
        });
    }

    loadEndpointData = (page, searchField, searchValue) => {
        const {selectedApi} = this.props;
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);

        this.keyInputTimeout = setTimeout(() => {
            this.setState({
                isLoading: true,
                searchValue: searchValue,
                searchField: searchField,
                currentPage: page,
            });
            getConfigApiValues(selectedApi && selectedApi.urls && selectedApi.urls['search'], page - 1, this.state.pageSize, null, searchField, searchValue)
                .then((res) => {
                    this.setState({
                        pages: Array.from({ length: Math.ceil(res.data.total / this.state.pageSize < 1 ? 1 : res.data.total / this.state.pageSize) }, (v, k) => k + 1),
                        data: res.data.data,
                        total: res.data.total,
                        isLoading: false,
                    });
                });
        }, INPUT_TIMEOUT);
    };

    handleTitleFreeTextSearch = (searchValue) => {
        const {selectedApi} = this.props;
        const fieldNames = (selectedApi && Array.isArray(selectedApi.displayValueFieldNames) && selectedApi.displayValueFieldNames) || []; 
        this.loadEndpointData(1, fieldNames.length > 0 ? fieldNames[0] : '', searchValue);
    };

    onEditRecord(rec) {
        this.setState({ currentRecord: rec });
    }

    editRecord(val) {
        const {selectedApi} = this.props;
        const newVal = { ...this.state.currentRecord, ...val };
        if (newVal.id) {
            configService.update(selectedApi && selectedApi.urls && selectedApi.urls['CRUD'], newVal.id, newVal)
                .then(response => {
                    const data = this.state.data.slice(0);
                    const index = data.findIndex(item => item.id === newVal.id);
                    data[index] = response.data;
                    this.setState({ data, currentRecord: null });
                }
                );
        } else {
            configService.create(selectedApi && selectedApi.urls && selectedApi.urls['CRUD'], newVal)
                .then(response => {
                    const data = this.state.data.slice(0);
                    data.unshift(response.data);
                    if(cache[selectedApi.urls['CRUD']]) {     
                        cache[selectedApi.urls['CRUD']] = data;
                    }
                    this.setState(prevState => ({ data, total: prevState.total + 1, currentRecord: null }));
                }
                );
        }

    }

    onNewRecord() {
        this.setState({ currentRecord: {} });
    }

    onRemoveItem = (item) => {
        const {selectedApi} = this.props;
        configService.delete(selectedApi && selectedApi.urls && selectedApi.urls['CRUD'], item.id);
        this.loadEndpointData(this.state.currentPage);
    };

    getLabel(selectedApi, item, noEmpty = true){
        const result = selectedApi && Array.isArray(selectedApi.displayValueFieldNames) && selectedApi.displayValueFieldNames.reduce((acc, curr) => {
            let result = [...acc];
            if (item[curr]) {
                result = [...acc, item[curr]];
            }
            return result;
        }, []);
        return (Array.isArray(result) && result.join(selectedApi.displayValueDelimiter || ' ,')) || (noEmpty && '[id = ' + item.id + ']');
    }

    render() {        
        const {selectedApi} = this.props;
        const canUpdate = can('update', 'ConfigUI');
        const canCreate = can('create', 'ConfigUI');

        return (
            <DataContainer>
                <TextHeader>{`${selectedApi && selectedApi.displayName} (${this.state.total})`}
                    {canCreate && this.state.currentRecord === null && (
                        <CustomButton onClick={this.onNewRecord}>
                            <FontAwesome

                                name='plus'
                                style={{marginTop: '5px', cursor: 'pointer', color: '#666', fontSize: '15px', marginRight: '5px'}}
                                color='#111'
                            />
                            Add
                        </CustomButton>
                      )}

                    <div style={{clear: 'both'}} />
                </TextHeader>
                {this.state.currentRecord && (
                    <DataBody>
                        <CreateEditConfigForm onRemoveItem={this.onRemoveItem} schema={selectedApi && selectedApi.uiSchema} label={this.getLabel(selectedApi, this.state.currentRecord, false)} displayName={selectedApi && selectedApi.displayName} value={this.state.currentRecord} onSubmit={this.editRecord} onCancel={() => this.setState({ currentRecord: null })} />
                    </DataBody>
                  )}
                <DataBody>
                    <CustomContainer left>
                        <QuickSearch
                            isLoading={this.state.isLoading}
                            onSearchInput={({ target }) => {
                                this.handleTitleFreeTextSearch(target.value);
                            }}
                            value={this.state.searchValue}
                        />
                    </CustomContainer>
                    {!this.state.isLoading && (
                        <ListContainer>
                            {this.state.data.map((item, i) => {
                                const label = this.getLabel(selectedApi, item);
                                if (i < this.state.pageSize) {
                                    return (
                                        <ListItem key={i}>
                                            {
                                                canUpdate ? (
                                                    <a href="#" className="text-truncate" onClick={() => this.onEditRecord(item)}>
                                                        {label}
                                                    </a>
                                                  )
                                                : <span className="text-truncate">{label}</span>
                                            }
                                            <Can I="delete" a="ConfigUI">
                                                <FontAwesome
                                                    name='times'
                                                    style={{marginTop: '5px', cursor: 'pointer', color: '#666', fontSize: '16px'}}
                                                    color='#111'
                                                    onClick={() => this.onRemoveItem(item)}
                                                />
                                            </Can>
                                        </ListItem>
                                    );
                                }
                            })}
                        </ListContainer>
                    )}
                    <CustomContainer center>
                        <Pagination 
                            selectedIndex={this.state.currentPage - 1}
                            pages={this.state.pages}
                            onChange={(event, newPage) => this.loadEndpointData(newPage, this.state.searchField, this.state.searchValue)} 
                        />
                    </CustomContainer>
                </DataBody>

            </DataContainer>
        );
    }
}

EndpointContainer.propTypes = {
    selectedApi: PropTypes.object,
    visible: PropTypes.bool,
};

EndpointContainer.defaultProps = {
    selectedApi: {},
    visible: false
};
