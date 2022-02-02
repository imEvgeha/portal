// import React from 'react';
// import Datetime from 'react-datetime';
// import TagsInput from 'react-tagsinput';
// import PropTypes from 'prop-types';
//
// // @material-ui/core components
// import withStyles from '@material-ui/core/styles/withStyles';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormLabel from '@material-ui/core/FormLabel';
//
// // @material-ui/icons
// import Check from '@material-ui/icons/Check';
// import CloudDownload from '@material-ui/icons/CloudDownload';
// import ZoomIn from '@material-ui/icons/ZoomIn';
//
// // core components
// import GridContainer from 'material-dashboard-pro-react/dist/components/Grid/GridContainer.js';
// import GridItem from 'material-dashboard-pro-react/dist/components/Grid/GridItem.js';
// import Button from 'material-dashboard-pro-react/dist/components/CustomButtons/Button.js';
// import CustomInput from 'material-dashboard-pro-react/dist/components/CustomInput/CustomInput.js';
// import Clearfix from 'material-dashboard-pro-react/dist/components/Clearfix/Clearfix.js';
// import Card from 'material-dashboard-pro-react/dist/components/Card/Card.js';
// import CardBody from 'material-dashboard-pro-react/dist/components/Card/CardBody.js';
// import CardHeader from 'material-dashboard-pro-react/dist/components/Card/CardHeader.js';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
// import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
//
// import userProfileStyles from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/userProfileStyles.js';
// import extendedFormsStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js';
// import regularFormsStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/regularFormsStyle.js';
// import dashboardStyle from 'material-dashboard-pro-react/dist/assets/jss/material-dashboard-pro-react/views/dashboardStyle.js';
//
// import avatar from '@vubiquity-nexus/portal-assets/img/contract.png';
//
// const style = {
//     ...userProfileStyles,
//     ...extendedFormsStyle,
//     ...regularFormsStyle,
//     ...dashboardStyle,
// };
//
// class UserProfile extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             checked: [1, 2],
//             simpleSelect: '2',
//             tags: ['Horror', 'Sci-Fi', 'Metadata'],
//         };
//     }
//
//     handleToggle(value) {
//         const {checked} = this.state;
//         const currentIndex = checked.indexOf(value);
//         const newChecked = [...checked];
//
//         if (currentIndex === -1) {
//             newChecked.push(value);
//         } else {
//             newChecked.splice(currentIndex, 1);
//         }
//
//         this.setState({
//             checked: newChecked,
//         });
//     }
//
//     handleSimple = event => {
//         this.setState({[event.target.name]: event.target.value});
//     };
//     handleChange = name => event => {
//         this.setState({[name]: event.target.checked});
//     };
//     handleTags = regularTags => {
//         this.setState({tags: regularTags});
//     };
//
//     render() {
//         const {classes} = this.props;
//         return (
//             <div className="use-material-dashboard-pro-react">
//                 <GridContainer>
//                     <GridItem xs={12} sm={12} md={4}>
//                         <Card product className={classes.cardHover}>
//                             <CardHeader image className={classes.cardHeaderHover}>
//                                 <a href="" onClick={e => e.preventDefault()}>
//                                     <img src={avatar} alt="..." />
//                                 </a>
//                             </CardHeader>
//                             <CardBody profile>
//                                 <div className={classes.cardHoverUnder}>
//                                     <Button color="rose" simple>
//                                         <ZoomIn className={classes.underChartIcons} />
//                                         View
//                                     </Button>
//                                     <Button color="rose" simple>
//                                         <CloudDownload className={classes.underChartIcons} />
//                                         Download PDF
//                                     </Button>
//                                 </div>
//                                 <h6 className={classes.cardCategory}>Contract Name</h6>
//                                 <h4 className={classes.cardTitle}>ID 123456</h4>
//                                 <p className={classes.description}>Contract description...</p>
//                             </CardBody>
//                         </Card>
//                     </GridItem>
//                     <GridItem product xs={12} sm={12} md={8}>
//                         <Card>
//                             <CardHeader color="rose" icon>
//                                 {/* <CardIcon color="rose">
//                   <PermIdentity />
//                 </CardIcon> */}
//                                 <h4 className={classes.cardIconTitle}>
//                                     ODM Latam TVOD - <small>The Walt Disney Company Limited</small>
//                                 </h4>
//                             </CardHeader>
//                             <CardBody>
//                                 <GridContainer xs={12}>
//                                     <GridItem xs={12} sm={12} md={6} lg={6}>
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Studio
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Studio
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     The Walt Disney Company Limited
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Licensor
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Licensor
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     The Walt Disney Company Limited
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Region
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Region
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     LATAM
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Territory
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Territory
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     All
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Affiliates
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Affiliates
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     All
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Devices
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Devices
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     All
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </GridItem>
//                                     <GridItem xs={12} sm={12} md={6} lg={6}>
//                                         <FormControl fullWidth className={classes.selectFormControl}>
//                                             <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
//                                                 Offer Types
//                                             </InputLabel>
//                                             <Select
//                                                 MenuProps={{
//                                                     className: classes.selectMenu,
//                                                 }}
//                                                 classes={{
//                                                     select: classes.select,
//                                                 }}
//                                                 value={this.state.simpleSelect}
//                                                 onChange={this.handleSimple}
//                                                 inputProps={{
//                                                     name: 'simpleSelect',
//                                                     id: 'simple-select',
//                                                 }}
//                                             >
//                                                 <MenuItem
//                                                     disabled
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                     }}
//                                                 >
//                                                     Choose Offer Type
//                                                 </MenuItem>
//                                                 <MenuItem
//                                                     classes={{
//                                                         root: classes.selectMenuItem,
//                                                         selected: classes.selectMenuItemSelected,
//                                                     }}
//                                                     value="2"
//                                                 >
//                                                     TVOD
//                                                 </MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                         <br /> <br />
//                                         <InputLabel className={classes.label}>Formats</InputLabel> <br />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     tabIndex={-1}
//                                                     onClick={() => this.handleToggle(1)}
//                                                     checked={this.state.checked.indexOf(1) !== -1 ? true : false}
//                                                     checkedIcon={<Check className={classes.checkedIcon} />}
//                                                     icon={<Check className={classes.uncheckedIcon} />}
//                                                     classes={{
//                                                         checked: classes.checked,
//                                                         root: classes.checkRoot,
//                                                     }}
//                                                 />
//                                             }
//                                             classes={{
//                                                 label: classes.label,
//                                             }}
//                                             label="SD"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     tabIndex={-1}
//                                                     onClick={() => this.handleToggle(2)}
//                                                     checked={this.state.checked.indexOf(2) !== -1 ? true : false}
//                                                     checkedIcon={<Check className={classes.checkedIcon} />}
//                                                     icon={<Check className={classes.uncheckedIcon} />}
//                                                     classes={{
//                                                         checked: classes.checked,
//                                                         root: classes.checkRoot,
//                                                     }}
//                                                 />
//                                             }
//                                             classes={{
//                                                 label: classes.label,
//                                             }}
//                                             label="HD"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     tabIndex={-1}
//                                                     onClick={() => this.handleToggle(3)}
//                                                     checked={this.state.checked.indexOf(3) !== -1 ? true : false}
//                                                     checkedIcon={<Check className={classes.checkedIcon} />}
//                                                     icon={<Check className={classes.uncheckedIcon} />}
//                                                     classes={{
//                                                         checked: classes.checked,
//                                                         root: classes.checkRoot,
//                                                     }}
//                                                 />
//                                             }
//                                             classes={{
//                                                 label: classes.label,
//                                             }}
//                                             label="3D"
//                                         />
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     tabIndex={-1}
//                                                     onClick={() => this.handleToggle(4)}
//                                                     checked={this.state.checked.indexOf(4) !== -1 ? true : false}
//                                                     checkedIcon={<Check className={classes.checkedIcon} />}
//                                                     icon={<Check className={classes.uncheckedIcon} />}
//                                                     classes={{
//                                                         checked: classes.checked,
//                                                         root: classes.checkRoot,
//                                                     }}
//                                                 />
//                                             }
//                                             classes={{
//                                                 label: classes.label,
//                                             }}
//                                             label="4K"
//                                         />
//                                         <br /> <br />
//                                         <InputLabel className={classes.label}>Start Date</InputLabel>
//                                         <br />
//                                         <FormControl fullWidth>
//                                             <Datetime
//                                                 timeFormat={false}
//                                                 inputProps={{placeholder: 'Date Picker Here'}}
//                                             />
//                                         </FormControl>
//                                         <br /> <br />
//                                         <InputLabel className={classes.label}>End Date</InputLabel>
//                                         <br />
//                                         <FormControl fullWidth>
//                                             <Datetime
//                                                 timeFormat={false}
//                                                 inputProps={{placeholder: 'Date Picker Here'}}
//                                             />
//                                         </FormControl>
//                                     </GridItem>
//                                     <Button color="rose" className={classes.updateProfileButton}>
//                                         Update Profile
//                                     </Button>
//                                     <Clearfix />
//                                 </GridContainer>
//                             </CardBody>
//                         </Card>
//                     </GridItem>
//                     <GridItem xs={12} lg={12}>
//                         <Card>
//                             <CardHeader color="rose" icon>
//                                 {/* <CardIcon color="rose">
//                   <PermIdentity />
//                 </CardIcon> */}
//                                 <h4 className={classes.cardIconTitle}>Metadata</h4>
//                             </CardHeader>
//                             <CardBody>
//                                 <GridContainer>
//                                     <GridItem xs={12} sm={2}>
//                                         <FormLabel className={classes.labelHorizontal}>Metadata Tags</FormLabel>
//                                     </GridItem>
//                                     <GridItem xs={12} sm={10}>
//                                         <TagsInput
//                                             value={this.state.tags}
//                                             onChange={this.handleTags}
//                                             tagProps={{className: 'react-tagsinput-tag info'}}
//                                         />
//                                     </GridItem>
//                                 </GridContainer>
//                                 <GridContainer>
//                                     <GridItem xs={12} sm={2}>
//                                         <FormLabel className={classes.labelHorizontal}>Metadata</FormLabel>
//                                     </GridItem>
//                                     <GridItem xs={12} sm={10}>
//                                         <CustomInput
//                                             id="help-text"
//                                             formControlProps={{
//                                                 fullWidth: true,
//                                             }}
//                                             inputProps={{
//                                                 type: 'text',
//                                             }}
//                                             helpText="Metadata input goes here"
//                                         />
//                                     </GridItem>
//                                 </GridContainer>
//                                 <GridContainer>
//                                     <GridItem xs={12} sm={2}>
//                                         <FormLabel className={classes.labelHorizontal}>Metadata</FormLabel>
//                                     </GridItem>
//                                     <GridItem xs={12} sm={10}>
//                                         <CustomInput
//                                             id="help-text"
//                                             formControlProps={{
//                                                 fullWidth: true,
//                                             }}
//                                             inputProps={{
//                                                 type: 'text',
//                                             }}
//                                             helpText="Metadata input goes here"
//                                         />
//                                     </GridItem>
//                                 </GridContainer>
//                                 <GridContainer>
//                                     <GridItem xs={12} sm={2}>
//                                         <FormLabel className={classes.labelHorizontal}>Metadata</FormLabel>
//                                     </GridItem>
//                                     <GridItem xs={12} sm={10}>
//                                         <CustomInput
//                                             id="help-text"
//                                             formControlProps={{
//                                                 fullWidth: true,
//                                             }}
//                                             inputProps={{
//                                                 type: 'text',
//                                             }}
//                                             helpText="Metadata input goes here"
//                                         />
//                                     </GridItem>
//                                 </GridContainer>
//                                 <GridContainer>
//                                     <GridItem xs={12} sm={2}>
//                                         <FormLabel className={classes.labelHorizontal}>Metadata</FormLabel>
//                                     </GridItem>
//                                     <GridItem xs={12} sm={10}>
//                                         <CustomInput
//                                             id="help-text"
//                                             formControlProps={{
//                                                 fullWidth: true,
//                                             }}
//                                             inputProps={{
//                                                 type: 'text',
//                                             }}
//                                             helpText="Metadata input goes here"
//                                         />
//                                     </GridItem>
//                                 </GridContainer>
//                             </CardBody>
//                         </Card>
//                     </GridItem>
//                 </GridContainer>
//             </div>
//         );
//     }
// }
//
// UserProfile.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
//
// export default withStyles(style)(UserProfile);
