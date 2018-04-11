import React from 'react';
import { ListGroup,  ListGroupItem} from 'react-bootstrap';

const SearchedListComponent = (props) => (
<ListGroup>
    {props.searchHistory.map((item, i) =>
         <ListGroupItem>
            item
         </ListGroupItem>
    )}
</ListGroup>  
);



export default SearchedListComponent;