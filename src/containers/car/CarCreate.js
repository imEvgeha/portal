import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Form, FormGroup, Input, Label} from "reactstrap";
import {carService} from "./CarService";
import store from "../../stores";
import {addCars} from "../../actions/index"

class CarCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            car: {}
        };

        this.toggle = this.toggle.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    submitForm(e) {
        e.preventDefault();
        this.createCar(this.state.car);
    }

    createCar(car) {
        carService.create(car).then((response) => {
            console.log("New car created: " + response.data);
            store.dispatch( addCars(response.data) );
            this.toggle();
        }).catch(() => {
            console.log("Unexpected error");
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            car: {...this.state.car, [name]: value}
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <Button  style={{'marginBottom': '20px'}} className="float-right" color="primary" onClick={this.toggle}>Create New Car</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Create new car</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.submitForm}>
                            <FormGroup>
                                <Label for="brand">Brand</Label>
                                <Input type="text" name="brand" id="brand" placeholder="Enter brand" onChange={this.handleChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="model">Model</Label>
                                <Input type="text" name="model" id="model" placeholder="Enter model" onChange={this.handleChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="vin">Vin</Label>
                                <Input type="text" name="vin" id="vin" placeholder="Enter vin" onChange={this.handleChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="owner">Owner</Label>
                                <Input type="text" name="owner" id="owner" placeholder="Enter owner" onChange={this.handleChange}/>
                            </FormGroup>
                            <Button color="primary" >Create</Button>
                            <span className="float-right">
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </span>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default CarCreate;