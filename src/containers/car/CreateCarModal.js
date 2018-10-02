import React from 'react'
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {carService} from "./CarService";

export default class CreateCarModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            car: null
        };
    }

    createCar(car) {
        console.log(car);
        carService.create(car).then(() => {
            this.state.car = car;
            console.log("New car created: " + car);
        }).catch(() => {
            console.log("Unexpected error");
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    render() {
        return <div id="myModal" tabIndex="-1" className="modal fade" role="dialog">
            <div className="modal-dialog" role="document">

                <div className="modal-content">
                    <div className="modal-header" style={{display: 'block'}}>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Modal Header</h4>
                    </div>
                    <div className="modal-body">
                        {
                            // !this.state.car &&
                            // <Form onSubmit={this.createCar}>
                            //     <FormGroup>
                            //         <Label for="model">Model</Label>
                            //         <Input type="text" name="model" id="model" placeholser="Enter model"/>
                            //     </FormGroup>
                            //     <Button>Submit</Button>
                            // </Form>


                            // <Form
                            //     onSubmit={values => {
                            //         console.log(values);
                            //         this.createCar(values);
                            //     }}
                            //     render={({submitForm}) => (
                            //         <form onSubmit={submitForm}>
                            //             <div className="form-group">
                            //                 <label htmlFor="inputModel">Model</label>
                            //                 <input class="form-control" ty name="model"
                            //                       placeholder='enter model' onChange={this.handleChange}/>
                            //             </div>
                            //
                            //             <div className="form-group">
                            //                 <label htmlFor="inputBrand">Brand</label>
                            //                 <input class="form-control" id="inputBrand" field="brand"
                            //                       placeholder='enter brand'/>
                            //             </div>
                            //             <div className="form-group">
                            //                 <label htmlFor="inputVin">Vin</label>
                            //                 <input className="form-control" id="inputVin" field="vin"
                            //                       placeholder='enter vin'/>
                            //             </div>
                            //             <div className="form-group">
                            //                 <label htmlFor="inputOwner">Owner</label>
                            //                 <input className="form-control" id="inputOwner" field="owner"
                            //                       placeholder='enter owner'/>
                            //             </div>
                            //
                            //             <button type="submit" className="btn btn-primary btn-block">Create</button>
                            //         </form>
                            //     )}
                            // />
                        }
                        { this.state.car &&
                            <span> {this.state.car}</span>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>

            </div>
        </div>;
    }
}