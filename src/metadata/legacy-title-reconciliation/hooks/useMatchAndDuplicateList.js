import {useState} from 'react';
import TitleSystems from '../../../constants/metadata/systems';

export default function useMatchAndDuplicateList() {
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    const handleMatchClick = (data, repo, checked) => {
        const {id} = data || {};
        if (checked) {
            const {NEXUS, VZ, MOVIDA} = TitleSystems;
            let newMatchList = {...matchList};
            if (duplicateList[id]){
                let list = {...duplicateList};
                delete list[id];
                setDuplicateList(list);
            }
            if (repo === NEXUS){
                delete newMatchList[VZ];
                delete newMatchList[MOVIDA];
            } else {
                delete newMatchList[NEXUS];
            }
            newMatchList[repo] = data;
            setMatchList(newMatchList);
        }
    };

    const handleDuplicateClick = (data, repo, checked) => {
        const {id} = data || {};
        if (checked) {
            if (matchList[repo] && matchList[repo].id === id) {
                let list = {...matchList};
                delete list[repo];
                setMatchList(list);
            }

            setDuplicateList({
                ...duplicateList,
                [id]: data
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
