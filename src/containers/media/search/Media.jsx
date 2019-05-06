import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import axios from 'axios';

import TagsInput from 'react-tagsinput';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// @material-ui/icons

// core components

import CustomDropdown from '../../../components/CustomDropdown/CustomDropdown.jsx';

import Card from '../../../components/Card/Card.jsx';
import CardHeader from '../../../components/Card/CardHeader.jsx';
import CardBody from '../../../components/Card/CardBody.jsx';
import CardText from '../../../components/Card/CardText.jsx';


// material-ui icons

// core components
import GridContainer from '../../../components/Grid/GridContainer.jsx';
import GridItem from '../../../components/Grid/GridItem.jsx';
import Button from '../../../components/CustomButtons/Button.jsx';

import dashboardStyle from '../../../assets/jss/material-dashboard-pro-react/views/dashboardStyle.jsx';
import regularFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx';

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
                queryTerms: this.state.keywordFilters,
                filters: []
            }
        });
        this.props.loadSearchResults(data.data.searchHits);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
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
                                            this.props.loadedFilters.map( (key, index) => (
                                                <GridItem xs={12} sm={6} md={2} lg={2} key={index}>
                                                    <CustomDropdown
                                                        hoverColor="info"
                                                        buttonText={key.filterDisplayName}
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
                                    <GridItem xs={12} sm={12} md={8} lg={8}>
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
                                    <GridItem xs={12} sm={12} md={4} lg={4}>
                                        <Card>
                                            <iframe src="https://www.youtube.com/embed/6ZfuNTqbHE8" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </Card>
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
    addKeywordFilter: PropTypes.func.isRequired,
    loadedFilters: PropTypes.array,
    searchResults: PropTypes.arrayOf(PropTypes.object.isRequired),
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Dashboard));