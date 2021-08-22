import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';

export default function PaginationComp({total, num, history}) {
    // pagination items
    const [items, setItems] = useState([total])
    let itemsTemp = [];
    // init pagination
    // get total pages
    useEffect(() => {
        // console.log("com  "+ total  + " " + num)
        for (let number = 1; number <= total; number++) {
            itemsTemp.push(
                <Pagination.Item onClick={() => {
                    history.push({
                        search: `?page=${number}`
                    });
                }}
                    active={number == num}>{number}</Pagination.Item> 
            );
        }
        setItems(itemsTemp)
        // console.log(itemsTemp)
    }, [num, total])

    return items;
}
