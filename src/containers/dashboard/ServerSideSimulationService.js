let data = makeData();

function range(len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
}

function makeData(len = 150) {
    return range(len).map(d => {
        return {
            id: d,
            title: 'Test' + d,
            studio: 'Test',
            territory: 'Test',
            genre: 'Test',
            availStartDate: 'Test',
            availEndDate: 'Test'
        };
    });
}

function sortBy(byValue) {
    let newArray = data.slice();
    newArray.sort(function (a, b) {
        let x = a[byValue];
        let y = b[byValue];
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
    return newArray;
}

function sortAvails(sortByValue, isSortDesc, pageSize) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if (isSortDesc) {
                resolve(sortBy(sortByValue).slice(0, pageSize));
            } else {
                resolve(sortBy(sortByValue).reverse().slice(0, pageSize));
            }
        }, 2000);
    })
}

function getAvails(page, startPageSize, pageSizeIncrement, sortedParams) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            let from;
            let to;
            if (page === 0) {
                from = 0;
                to = startPageSize;
            } else {
                from = startPageSize + (page - 1) * pageSizeIncrement;
                to = from + pageSizeIncrement;
            }
            console.log("From: " + from + " To: " + to);
            console.log(sortedParams);
            if (sortedParams && sortedParams.sortBy) {
                let sortedData = sortBy(sortedParams.sortBy);
                console.log(sortedParams.desc);
                if (!sortedParams.desc) {
                    sortedData.reverse();
                }
                resolve(sortedData.slice(from, to));
            } else {
                resolve(data.slice(from, to));
            }
        }, 2000);
    })
}

export {data, sortAvails, getAvails}