import {getValidDate} from './utils';

describe('Utils', () => {
    describe('getValidDate', () => {
        it('should render header title', () => {
            expect(getValidDate('2020/10/12')).toEqual('2020-10-12');
        });
    });
});
