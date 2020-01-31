import {useState} from 'react';
import constants from '../../../avails/title-matching/titleMatchingConstants';

export default function useMatchAndDuplicateList() {
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    const handleMatchClick = (data, repo, checked) => {
        const {id} = data || {};
        if (checked) {
            const {VZ, MOVIDA} = constants.repository;
            let newMatchList = {...matchList};
            if (duplicateList[id]){
                let list = {...duplicateList};
                delete list[id];
                setDuplicateList(list);
            }

            newMatchList[repo] = data;
            setMatchList(newMatchList);
        }
    };

    const handleDuplicateClick = (id, name, checked) => {
        if (checked) {
            if (matchList[name] && matchList[name].id === id) {
                let list = {...matchList};
                delete list[name];
                setMatchList(list);
            }

            setDuplicateList({
                ...duplicateList,
                [id]: name
            });
            return;
        }

        let list = {...duplicateList};
        delete list[id];
        setDuplicateList(list);
    };

    return {
        matchList,
        handleMatchClick,
        duplicateList,
        handleDuplicateClick,
    };
}
