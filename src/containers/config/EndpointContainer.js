import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import styled, { css } from 'styled-components';
import Pagination from '@atlaskit/pagination';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import { QuickSearch } from '@atlaskit/quick-search';
import { TextHeader } from '../../components/navigation/CustomNavigationElements';
import { INPUT_TIMEOUT } from '../../constants/common-ui';
import { configService } from './service/ConfigService';
import { getConfigApiValues } from '../../common/CommonConfigService';
import CreateEditConfigForm from './CreateEditConfigForm';
import { Can, can } from '../../ability';
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

        getConfigApiValues(props.selectedApi && props.selectedApi.urls && props.selectedApi.urls['CRUD'], 0, 1000).then(response => {
            cache[props.selectedApi.url] = response.data.data;
        });
    }

    componentDidMount() {
        const {selectedApi} = this.props;
        this.calculatePageSize();
        const fieldNames = (selectedApi && Array.isArray(selectedApi.displayValueFieldNames) && selectedApi.displayValueFieldNames) || []; 
        this.loadEndpointData(1, fieldNames.length > 0 ? fieldNames[0] : '', this.state.searchValue);
        window.addEventListener('resize', function () {
            this.calculatePageSize();
        }.bind(this));
    }

    calculatePageSize = () => {
        let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let windowViewPort = (h) / 10;
        let staticSectionVH = windowViewPort > 90 ? 5 : windowViewPort > 50 ? 20 : 30;
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
                    let data = this.state.data.slice(0);
                    let index = data.findIndex(item => item.id === newVal.id);
                    data[index] = response.data;
                    this.setState({ data, currentRecord: null });
                }
                );
        } else {
            configService.create(selectedApi && selectedApi.urls && selectedApi.urls['CRUD'], newVal)
                .then(response => {
                    let data = this.state.data.slice(0);
                    data.unshift(response.data);
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

    render() {        
        const {selectedApi} = this.props;
        let canUpdate = can('update', 'ConfigUI');
        let canCreate = can('create', 'ConfigUI');

        return (
            <DataContainer>
                <TextHeader>{`${selectedApi && selectedApi.displayName} (${this.state.total})`}
                    {canCreate && (
                        this.state.currentRecord === null &&
                            <Button onClick={this.onNewRecord} iconBefore={<AddIcon label="add" />} appearance={'default'} style={{ float: 'right' }}>
                                Add
                            </Button>
                        
                    )}
                </TextHeader>

                {this.state.currentRecord &&
                    <DataBody>
                        <CreateEditConfigForm schema={selectedApi && selectedApi.uiSchema} value={this.state.currentRecord} onSubmit={this.editRecord} onCancel={() => this.setState({ currentRecord: null })} />
                    </DataBody>
                }
                {!this.state.currentRecord && <DataBody>
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
                        <div style={{ marginBottom: '5px' }}>
                            {this.state.data.map((item, i) => {
                                const {selectedApi = {}} = this.props;
                                const result = selectedApi && Array.isArray(selectedApi.displayValueFieldNames) && selectedApi.displayValueFieldNames.reduce((acc, curr) => {
                                    let result = [...acc];
                                    if (item[curr]) {
                                        result = [...acc, item[curr]];
                                    }
                                    return result;
                                }, []);
                                const label = (Array.isArray(result) && result.join(selectedApi.displayValueDelimiter || ' ,')) || '[id = ' + item.id + ']';
                                if (i < this.state.pageSize) {
                                    return (
                                        <ListGroupItem key={i} style={{display: 'flex', justifyContent: 'space-between'}}>
                                            {
                                                canUpdate ?
                                                    <a href="#" className={'text-truncate'} onClick={() => this.onEditRecord(item)}>
                                                        {label}
                                                    </a>
                                                : <span className={'text-truncate'}>{label}</span>
                                            }
                                            <Can I="delete" a="ConfigUI">
                                                <FontAwesome
                                                    name='times-circle'
                                                    style={{ marginTop: '5px', cursor: 'pointer' }}
                                                    color='#111'
                                                    size='lg'
                                                    onClick={() => this.onRemoveItem(item)}
                                                />
                                            </Can>
                                        </ListGroupItem>
                                    );
                                }
                            })}
                        </div>
                    )}
                    <CustomContainer center>
                        <Pagination 
                            selectedIndex={this.state.currentPage - 1}
                            pages={this.state.pages}
                            onChange={(event, newPage) => this.loadEndpointData(newPage, this.state.searchField, this.state.searchValue)} 
                        />
                    </CustomContainer>
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

EndpointContainer.defaultProps = {
    urlBase: null,
    selectedApi: {},
};
