import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import TagsInput from 'react-tagsinput';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

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
import extendedFormsStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js';

import {
    loadFilterResults,
    selectFilterResults,
    addKeywordFilter,
    loadSearchResults,
} from '../../../stores/actions/media/search';

const style = {
    ...regularFormsStyle,
    ...dashboardStyle,
    ...extendedFormsStyle,
};

import 'material-dashboard-pro-react/dist/material-dashboard-pro-react.css';

import {mediaSearchService} from '../service/MediaSearchService';

const mapStateToProps = state => {
    return {
        loadedFilters: state.media.filters.loadedFilters,
        selectedFilters: state.media.filters.selectedFilters,
        keywordFilters: state.media.filters.keywordFilters,
        searchResults: state.media.searchResults,
    };
};

const mapDispatchToProps = {
    loadFilterResults,
    selectFilterResults,
    addKeywordFilter,
    loadSearchResults,
};

class Dashboard extends React.Component {
    componentDidMount = () => {
        mediaSearchService.getFilters().then(res => {
            if (res) {
                this.props.loadFilterResults(res.filters);
            }
        });
    };

    handleMultiple = (searchParameter, e) => {
        const filter = {
            filterName: searchParameter,
            filterValues: e.target.value.length > 0 ? e.target.value : null,
        };
        this.props.selectFilterResults(filter);
    };

    onAddKeywordFilter = tags => {
        this.props.addKeywordFilter(tags);
    };

    onSubmitSearch = async e => {
        e.preventDefault();
        const filter = {
            queryTerms: this.props.keywordFilters,
            filters: Object.keys(this.props.selectedFilters)
                .map(key => {
                    return {filterName: key, filterValues: this.props.selectedFilters[key]};
                })
                .filter(filt => filt.filterValues),
        };
        mediaSearchService.getAssets(filter).then(res => {
            if (res) {
                this.props.loadSearchResults(res.searchHits);
            }
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <div className="use-material-dashboard-pro-react">
                <h3>Media Search Results Cards</h3>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} item={true}>
                        <Card>
                            <CardHeader color="rose" icon>
                                <h4 className={classes.cardIconTitle}>Filters</h4>
                            </CardHeader>
                            <CardBody>
                                <GridContainer xs={12} item={true}>
                                    <GridItem xs={12} item={true}>
                                        <TagsInput
                                            value={this.props.keywordFilters}
                                            onChange={this.onAddKeywordFilter}
                                            tagProps={{className: 'react-tagsinput-tag info'}}
                                            inputProps={{placeholder: 'Search'}}
                                        />
                                    </GridItem>
                                    {this.props.loadedFilters
                                        ? this.props.loadedFilters.map((val, index) => (
                                              <GridItem xs={12} sm={6} md={2} lg={2} key={index}>
                                                  <FormControl fullWidth className={classes.selectFormControl}>
                                                      <InputLabel
                                                          htmlFor={
                                                              val.multiSelect ? 'multiple-select' : 'simple-select'
                                                          }
                                                          className={classes.selectLabel}
                                                      >
                                                          {val.filterDisplayName}
                                                      </InputLabel>
                                                      <Select
                                                          multiple={val.multiSelect}
                                                          value={
                                                              this.props.selectedFilters[val.filterSearchParameter]
                                                                  ? this.props.selectedFilters[
                                                                        val.filterSearchParameter
                                                                    ]
                                                                  : []
                                                          }
                                                          onChange={e =>
                                                              this.handleMultiple(val.filterSearchParameter, e)
                                                          }
                                                          MenuProps={{
                                                              className: classes.selectMenu,
                                                          }}
                                                          classes={{
                                                              select: classes.select,
                                                          }}
                                                          inputProps={{
                                                              name: val.multiSelect ? 'multipleSelect' : 'simpleSelect',
                                                              id: val.multiSelect ? 'multiple-select' : 'simple-select',
                                                          }}
                                                      >
                                                          {val.values.map(flt => (
                                                              <MenuItem
                                                                  key={flt}
                                                                  value={flt}
                                                                  classes={{
                                                                      root: classes.selectMenuItem,
                                                                      selected: val.multiSelect
                                                                          ? classes.selectMenuItemSelectedMultiple
                                                                          : classes.selectMenuItemSelected,
                                                                  }}
                                                              >
                                                                  {flt}
                                                              </MenuItem>
                                                          ))}
                                                      </Select>
                                                  </FormControl>
                                              </GridItem>
                                          ))
                                        : ''}
                                    <GridItem xs={12}>
                                        <Button color="info" round onClick={this.onSubmitSearch}>
                                            Submit
                                        </Button>
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                        </Card>

                        {this.props.searchResults.length > 0
                            ? this.props.searchResults.map((essence, key) => (
                                  <GridContainer key={key}>
                                      <GridItem xs={12} sm={12} md={12} lg={12}>
                                          <Card>
                                              <CardHeader color="info" text>
                                                  <CardText color="info">
                                                      <h4 className={classes.cardTitleWhite}>
                                                          {essence.titleComponent.title}
                                                      </h4>
                                                  </CardText>
                                              </CardHeader>
                                              <CardBody>
                                                  <p />
                                              </CardBody>
                                          </Card>
                                          {essence.essences.map((key, index) => (
                                              <Card key={index}>
                                                  <CardBody>
                                                      <GridContainer xs={12}>
                                                          {key.summary.map((summary, index) => (
                                                              <GridItem xs={6} sm={6} md={4} lg={4} key={index}>
                                                                  <p>
                                                                      {summary.key} {summary.value}
                                                                  </p>
                                                              </GridItem>
                                                          ))}
                                                      </GridContainer>
                                                  </CardBody>
                                              </Card>
                                          ))}
                                      </GridItem>
                                  </GridContainer>
                              ))
                            : ''}
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
