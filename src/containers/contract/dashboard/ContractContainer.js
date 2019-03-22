import React from "react";
import PropTypes from "prop-types";

import ReactTable from "react-table";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import Description from "@material-ui/icons/Description";

// core ../../../components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";

import dashboardStyle from "../../../assets/jss/material-dashboard-pro-react/views/dashboardStyle.jsx";
import regularFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";

const style = {
  ...regularFormsStyle,
  ...dashboardStyle,
}

class Dashboard extends React.Component {

  render() {
    const { classes } = this.props;
    console.log(classes)

    const arrayOfObjects = () => {
      let arr = []
      for (let i = 0; i < 13; i++) {
        arr = arr.concat({
          product: <div className={classes.imgContainer}>
            <Button justIcon color="twitter">
              <Description />
            </Button>
          </div>,
          platform: <span>
            <a href="#" className={classes.tdNameAnchor}>
              Contract
    </a>
            <br />
            <small className={classes.tdNameSmall}>
              {"ID 123456"} <br />
              {"Offer Types: TVOD"} </small>
          </span>,
          availibility: <div>
            <small className={classes.tdNameSmall}>
              {"Licensor: Disney"} <br />
              {"Exclusivity: None"} <br />
              {"Region: LATAM"}
            </small>
          </div>,
          type: <span>
            <small className={classes.tdNameSmall}>
              {"Format: SD"} <br />
              {"Start Date: 1/1/19"} <br />
              {"End Date: 1/1/19"}
            </small>
          </span>,
          actions: <span>
            <h4 className={classes.cardIconTitle}>

              <span className={classes.successText}>
                <Check className={classes.upArrowCardCategory} /> Valid
</span>
            </h4>
            <div className={classes.buttonGroup}>
              <Button
                color="info"
                size="sm"
                round
                className={classes.firstButton}
              >
                <Remove className={classes.icon} />
              </Button>
              <Button
                color="info"
                size="sm"
                round
                className={classes.lastButton}
              >
                <Add className={classes.icon} />
              </Button>
            </div>
          </span>
        })
      }
      return arr
    }

    const arrayOfObjects2 = () => {
      let arr = []
      for (let i = 0; i < 13; i++) {
        arr = arr.concat({
          product: <div><FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot
                }}
              />
            }
            classes={{
              label: classes.label
            }}
          />
          </div>,
          platform: "Movie Title 1",
          availibility: "VOD",
          type: "Feature",
          actions: <span>
            <div className={classes.buttonGroup}>
              <Button
                color="info"
                size="sm"
                round
                className={classes.firstButton}
              >
                <Remove className={classes.icon} />
              </Button>
              <Button
                color="info"
                size="sm"
                round
                className={classes.lastButton}
              >
                <Add className={classes.icon} />
              </Button>
            </div>
          </span>
        })
      }
      return arr
    }

    return (
      <div>
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
                      Header: "Product",
                      accessor: "product",
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "Platform",
                      accessor: "platform"
                    },
                    {
                      Header: "Availibility",
                      accessor: "availibility"
                    },
                    {
                      Header: "Type",
                      accessor: "type"
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false
                    }]}
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
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(Dashboard);
