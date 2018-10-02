import './CarContainer.scss'

import React from 'react'
import {carService} from "./CarService";
import {keycloak} from '../../index'
import ModalExample from "./ModalExample";
import {confirmModal} from "../../components/share/ConfirmModal"
import CarCreate from "./CarCreate";
import {connect} from "react-redux";
import {deleteCar, loadCars} from "../../actions";

const mapState = state => {
    return {
        profileInfo: state.profileInfo,
        cars: state.cars
    };
};

const mapActions = {
    loadCars,
    deleteCar
};

class CarContainer extends React.Component {

    constructor(props) {
        super(props);
        this.loadCars();
        this.confirmDeleteCar = this.confirmDeleteCar.bind(this);
    }

    loadCars() {
        carService.list().then(r => {
            console.log(r);
            this.props.loadCars(r.data);
        });
    }

    deleteCar(id) {
        console.log("Run Deleted car id:" + id);
        carService.deleteCar(id).then(r => {
            console.log("Deleted car id: " + id);
            this.props.deleteCar(id);
        }).catch(() => {
            console.log("Unexpected error");
        })
    }

    confirmDeleteCar(id) {
        confirmModal.open("Do you really want to delete car?", ()=>{this.deleteCar(id);console.log("Deleted car id:" + id)}, ()=>{console.log("cancel")});
    }

    render() {
        return (
            <div>
                <br/>
                <h2 >Cars34 { keycloak.username}</h2>
                { keycloak.hasResourceRole('manage') ? <CarCreate/> : ''}
                <p> </p>
                <table className="table table-striped">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Model</th>
                        <th scope="col">Vin</th>
                        <th scope="col">Owner</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.cars.map((car, index) => {
                            return (
                                <tr key={car.id}>
                                    <th scope="row">{index+1}</th>
                                    <td>{car.brand}</td>
                                    <td>{car.model}</td>
                                    <td>{car.vin}</td>
                                    <td>{car.owner}</td>
                                    <td>
                                        { keycloak.hasResourceRole('manage') ? <button type="button" className="btn btn-danger btn-sm" onClick={() => {this.confirmDeleteCar(car.id)}}>Delete</button> :'' }
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(mapState, mapActions)(CarContainer)