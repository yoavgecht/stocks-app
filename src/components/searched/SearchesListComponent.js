import React from 'react';
import { ListGroup,  ListGroupItem} from 'react-bootstrap';

const SearchedListComponent = (props) => (
    <div>
    <label>Search history:</label>
    <ListGroup>
        {props.searchHistory.map((item, i) =>
        <ListGroupItem>
            <p>{item.dataset_code}</p> 
            <span class="glyphicon glyphicon-remove"  onClick={() => props.deleteStock(item.dataset_code)}></span> 
    </ListGroupItem>
        )}
    </ListGroup>  
    </div>
);



export default SearchedListComponent;