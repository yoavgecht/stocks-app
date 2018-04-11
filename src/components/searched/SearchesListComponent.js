import React from 'react';
import { ListGroup,  ListGroupItem} from 'react-bootstrap';

const SearchedListComponent = (props) => (
    <div>
    <label>Search history:</label>
    <ListGroup>
        
            {props.searchHistory.map((item, i) =>
            <ListGroupItem>
                {item}
            </ListGroupItem>
        )}
    </ListGroup>  
    </div>
);



export default SearchedListComponent;