import React from 'react';
import { ListGroup,  ListGroupItem} from 'react-bootstrap';

const SearchedListComponent = (props) => (
    <div>
    <label>Search history:</label>
    <ListGroup>
        {props.searchHistory.map((item, i) =>
        <ListGroupItem item={item}>
            <span><strong>{item.dataset_code}</strong></span> 
            <span class="glyphicon glyphicon-remove"  onClick={() => props.deleteStock(item._id)}></span> 
        </ListGroupItem>
        )}
    </ListGroup>  
    </div>
);



export default SearchedListComponent;