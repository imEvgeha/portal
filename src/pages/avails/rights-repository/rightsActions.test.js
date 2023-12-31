import * as actionTypes from './rightsActionTypes';
import * as actions from './rightsActions';

describe('rights actions', () => {
    const payload = {};

    it('should create action to add selected rights to store', () => {
        const expectedAction = {
            type: actionTypes.SET_SELECTED_RIGHTS,
            payload,
        };
        expect(actions.setSelectedRights(payload)).toEqual(expectedAction);
    });

    it('should create action to add filter to store rights state', () => {
        const expectedAction = {
            type: actionTypes.SET_RIGHTS_FILTER,
            payload,
        };
        expect(actions.setRightsFilter(payload)).toEqual(expectedAction);
    });
});
