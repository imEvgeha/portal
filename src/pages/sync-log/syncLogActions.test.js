import * as actionTypes from './syncLogActionTypes';
import * as actions from './syncLogActions';

describe('SyncLog Actions', () => {
    it('should create a setDateFrom action', () => {
        const payload = 'someDateFrom';
        const expectedAction = {
            type: actionTypes.SAVE_DATE_FROM,
            payload: 'someDateFrom',
        };
        expect(actions.createSaveDateFromAction(payload)).toEqual(expectedAction);
    });

    it('should create a setDateTo action', () => {
        const payload = 'someDateTo';
        const expectedAction = {
            type: actionTypes.SAVE_DATE_TO,
            payload: 'someDateTo',
        };
        expect(actions.createSaveDateToAction(payload)).toEqual(expectedAction);
    });
});
