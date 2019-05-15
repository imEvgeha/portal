import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import axios from 'axios';

import TagsInput from 'react-tagsinput';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import CustomDropdown from 'material-dashboard-pro-react/dist/components/CustomDropdown/CustomDropdown.js';

import Card from 'material-dashboard-pro-react/dist/components/Card/Card.js';
import CardHeader from 'material-dashboard-pro-react/dist/components/Card/CardHeader.js';
import CardBody from 'material-dashboard-pro-react/dist/components/Card/CardBody.js';
import CardText from 'material-dashboard-pro-react/dist/components/Card/CardText.js';

// core components
import GridContainer from 'material-dashboard-pro-react/dist/components/Grid/GridContainer.js';
import GridItem from 'material-dashboard-pro-react/dist/components/Grid/GridItem.js';
import Button from 'material-dashboard-pro-react/dist/components/CustomButtons/Button.js';

import dashboardStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/dashboardStyle.js';
import regularFormsStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/regularFormsStyle.js';

import {
    loadFilterResults,
    selectFilterResults,
    addKeywordFilter,
    loadSearchResults
} from '../../../stores/actions/media/search';

const style = {
    ...regularFormsStyle,
    ...dashboardStyle,
};

import 'material-dashboard-pro-react/dist/material-dashboard-pro-react.css';

const mapStateToProps = state => {
    return {
        loadedFilters: state.media.filters.loadedFilters,
        selectedFilters: state.media.filters.selectedFilters,
        keywordFilters: state.media.filters.keywordFilters,
        searchResults: state.media.searchResults
    };
};

const mapDispatchToProps = {
    loadFilterResults,
    selectFilterResults,
    addKeywordFilter,
    loadSearchResults
};


class Dashboard extends React.Component {
    state = {
    };


    // REFACTOR TO REMOVE ROOT OF URL
    componentDidMount = async () => {
        let data = await axios.get('https://asset-management-api.dev.vubiquity.com/api/asset-management/v1/asset/search/filter');
        this.props.loadFilterResults(data.data.filters);
    }

    onSelectFilter = (searchParameter, menuItem) => {
        const filter = {
            filterName: searchParameter,
            filterValues: menuItem
        };
        this.props.selectFilterResults(filter);
    }

    onAddKeywordFilter = (tags) => {
        this.props.addKeywordFilter(tags);
    }

    onSubmitSearch = async (e) => {
        e.preventDefault();
        let data = await axios.post('https://asset-management-api.dev.vubiquity.com/api/asset-management/v1/asset/search/', {
            MediaSearchRequest: {
                queryTerms: this.props.keywordFilters,
                filters: [],
            }
        });
        this.props.loadSearchResults(data.data.searchHits);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={'use-material-dashboard-pro-react'}>
                <h3>Media Search Results Cards</h3>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="rose" icon>
                                <h4 className={classes.cardIconTitle}>Filters</h4>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={this.onSubmitSearch}>
                                    <GridContainer xs={12}>
                                        <GridItem xs={12}>
                                            <TagsInput
                                                value={this.props.keywordFilters}
                                                onChange={this.onAddKeywordFilter}
                                                tagProps={{ className: 'react-tagsinput-tag info' }}
                                                inputProps={{ placeholder: 'Search' }}
                                            />
                                        </GridItem>
                                        {this.props.loadedFilters ? (
                                            this.props.loadedFilters.map( (key, index) => (<GridItem xs={12} sm={6} md={2} lg={2} key={index}>
                                                    <CustomDropdown
                                                        hoverColor="info"
                                                        buttonText={this.props.selectedFilters[key.filterSearchParameter] ? this.props.selectedFilters[key.filterSearchParameter] : key.filterDisplayName}
                                                        buttonProps={{
                                                            round: true,
                                                            fullWidth: true,
                                                            style: { marginBottom: '0' },
                                                            color: 'info'
                                                        }}
                                                        dropdownHeader={key.filterDisplayName}
                                                        dropdownList={key.values}
                                                        onClick={(menuItem) => this.onSelectFilter(key.filterSearchParameter, menuItem)}
                                                    />
                                                </GridItem>
                                            ))
                                        ) : ''}
                                        <GridItem xs={12}>
                                            <Button color="info" round type="submit">Submit</Button>
                                        </GridItem>
                                    </GridContainer>
                                </form>
                            </CardBody>
                        </Card>

                        {this.props.searchResults.length > 0 ? (
                            this.props.searchResults.map( (essence, key) =>
                                <GridContainer key={key}>
                                    <GridItem xs={12} sm={12} md={12} lg={12}>
                                        <Card>
                                            <CardHeader color="info" text>
                                                <CardText color="info">
                                                    <h4 className={classes.cardTitleWhite}>{essence.titleComponent.title}</h4>
                                                </CardText>
                                            </CardHeader>
                                            <CardBody>
                                                <p></p>
                                            </CardBody>
                                        </Card>
                                        {essence.essences.map((key, index) => (
                                            <Card key={index}>
                                                <CardBody>
                                                    <GridContainer xs={12}>
                                                        {key.summary.map((summary, index) =>
                                                            (<GridItem xs={6} sm={6} md={4} lg={4} key={index}>
                                                                    <p>{summary.key} {summary.value}</p>
                                                                </GridItem>
                                                            )
                                                        )}
                                                    </GridContainer>
                                                </CardBody>
                                            </Card>))}
                                    </GridItem>

                                </GridContainer>

                            )

                        ) : ''}

                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
    loadFilterResults: PropTypes.func.isRequired,
    loadSearchResults: PropTypes.func.isRequired,
    keywordFilters: PropTypes.arrayOf(PropTypes.string),
    selectFilterResults: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object,
    addKeywordFilter: PropTypes.func.isRequired,
    loadedFilters: PropTypes.array,
    searchResults: PropTypes.arrayOf(PropTypes.object.isRequired),
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Dashboard));