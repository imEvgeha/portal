import React from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import Card from 'material-dashboard-pro-react/dist/components/Card/Card.js';
import CardHeader from 'material-dashboard-pro-react/dist/components/Card/CardHeader.js';
import CardBody from 'material-dashboard-pro-react/dist/components/Card/CardBody.js';

// material-ui icons
import Check from '@material-ui/icons/Check';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';
import Description from '@material-ui/icons/Description';

// core components
import GridContainer from 'material-dashboard-pro-react/dist/components/Grid/GridContainer.js';
import GridItem from 'material-dashboard-pro-react/dist/components/Grid/GridItem.js';
import Button from 'material-dashboard-pro-react/dist/components/CustomButtons/Button.js';

import dashboardStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/dashboardStyle.js';
import regularFormsStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/regularFormsStyle.js';

const style = {
    ...regularFormsStyle,
    ...dashboardStyle,
};

class Dashboard extends React.Component {
    render() {
        const {classes} = this.props;

        const arrayOfObjects = () => {
            let arr = [];
            for (let i = 0; i < 13; i++) {
                arr = arr.concat({
                    product: (
                        <div className={classes.imgContainer}>
                            <Button justIcon color="twitter">
                                <Description />
                            </Button>
                        </div>
                    ),
                    platform: (
                        <span>
                            <a href="#" className={classes.tdNameAnchor}>
                                Contract
                            </a>
                            <br />
                            <small className={classes.tdNameSmall}>
                                ID 123456
                                <br />
                                Offer Types: TVOD
                            </small>
                        </span>
                    ),
                    availibility: (
                        <div>
                            <small className={classes.tdNameSmall}>
                                Licensor: Disney
                                <br />
                                Exclusivity: None <br />
                                Region: LATAM
                            </small>
                        </div>
                    ),
                    type: (
                        <span>
                            <small className={classes.tdNameSmall}>
                                Format: SD <br />
                                Start Date: 1/1/19 <br />
                                End Date: 1/1/19
                            </small>
                        </span>
                    ),
                    actions: (
                        <span>
                            <h4 className={classes.cardIconTitle}>
                                <span className={classes.successText}>
                                    <Check className={classes.upArrowCardCategory} /> Valid
                                </span>
                            </h4>
                            <div className={classes.buttonGroup}>
                                <Button color="info" size="sm" round className={classes.firstButton}>
                                    <Remove className={classes.icon} />
                                </Button>
                                <Button color="info" size="sm" round className={classes.lastButton}>
                                    <Add className={classes.icon} />
                                </Button>
                            </div>
                        </span>
                    ),
                });
            }
            return arr;
        };

        return (
            <div className="use-material-dashboard-pro-react">
                <h3>Contract Search Results Cards</h3>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="rose" icon>
                                <h4 className={classes.cardIconTitle}>Contract Search Results</h4>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={arrayOfObjects()}
                                    filterable
                                    columns={[
                                        {
                                            Header: 'Product',
                                            accessor: 'product',
                                            sortable: false,
                                            filterable: false,
                                        },
                                        {
                                            Header: 'Platform',
                                            accessor: 'platform',
                                        },
                                        {
                                            Header: 'Availibility',
                                            accessor: 'availibility',
                                        },
                                        {
                                            Header: 'Type',
                                            accessor: 'type',
                                        },
                                        {
                                            Header: 'Actions',
                                            accessor: 'actions',
                                            sortable: false,
                                            filterable: false,
                                        },
                                    ]}
                                    defaultPageSize={5}
                                    showPaginationTop
                                    showPaginationBottom={false}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(style)(Dashboard);
