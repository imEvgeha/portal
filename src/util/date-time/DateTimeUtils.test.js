import {sortByDateFn} from './DateTimeUtils';
import {SORT_DIRECTION} from './constants';

describe('Date-Time Utils', () => {
    describe('sortByDateFn', () => {
        const unsortedArray = [
            {
                val: 1,
                nestedItem: {
                    someKindaDate: '1111-01-01T20:41:04.686Z',
                },
            },
            {
                val: 3,
                nestedItem: {
                    someKindaDate: '3333-01-01T20:41:04.686Z',
                },
            },
            {
                val: 2,
                nestedItem: {
                    someKindaDate: '2222-01-01T20:41:04.686Z',
                },
            },
            {
                val: 5,
                nestedItem: {
                    someKindaDate: '5555-01-01T20:41:04.686Z',
                },
            },
            {
                val: 4,
                nestedItem: {
                    someKindaDate: '4444-01-01T20:41:04.686Z',
                },
            },
        ];

        it('sorts an array of objects by date correctly -- ascending', () => {
            const sortedArray = sortByDateFn(unsortedArray, ['nestedItem', 'someKindaDate']);
            expect(sortedArray).toEqual([
                {
                    val: 1,
                    nestedItem: {
                        someKindaDate: '1111-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 2,
                    nestedItem: {
                        someKindaDate: '2222-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 3,
                    nestedItem: {
                        someKindaDate: '3333-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 4,
                    nestedItem: {
                        someKindaDate: '4444-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 5,
                    nestedItem: {
                        someKindaDate: '5555-01-01T20:41:04.686Z',
                    },
                },
            ]);
        });
        it('sorts an array of objects by date correctly -- descending', () => {
            const sortedArray = sortByDateFn(unsortedArray, ['nestedItem', 'someKindaDate'], SORT_DIRECTION.DESCENDING);
            expect(sortedArray).toEqual([
                {
                    val: 5,
                    nestedItem: {
                        someKindaDate: '5555-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 4,
                    nestedItem: {
                        someKindaDate: '4444-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 3,
                    nestedItem: {
                        someKindaDate: '3333-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 2,
                    nestedItem: {
                        someKindaDate: '2222-01-01T20:41:04.686Z',
                    },
                },
                {
                    val: 1,
                    nestedItem: {
                        someKindaDate: '1111-01-01T20:41:04.686Z',
                    },
                },
            ]);
        });
    });
});
