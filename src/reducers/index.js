import {
    ADD_CARS,
    LOAD_CARS,
    DELETE_CARS,
    LOAD_PROFILE_INFO,
    LOAD_BOATS
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
    cars: [],
    boats: []
};

const rootReducer = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_INFO:
            return { ...state, profileInfo: action.payload};
        case LOAD_CARS:
            return { ...state, cars: action.payload};
        case ADD_CARS:
            return { ...state, cars: state.cars.concat(action.payload)};
        case DELETE_CARS:
            return { ...state, cars: state.cars.filter((car) => car.id !== action.carId)};
        case LOAD_BOATS:
            return { ...state, boats: action.payload};
        default:
            return state;
    }
};

export default rootReducer;