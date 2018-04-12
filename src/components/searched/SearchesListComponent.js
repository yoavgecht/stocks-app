import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";


const SearchedListComponent = props => (
  <div>
    <label>Search history:</label>
    <ListGroup>
      {props.searchHistory.map((item, i) => (
<<<<<<< HEAD
        <ListGroupItem item={item} key={item._id} className="list-group-class">
          <span 
=======
        <ListGroupItem item={item._id} key={item._id}>
          <span
>>>>>>> 003d23ac75fb41d342e0e13c329276031fb294d9
            onClick={() =>
              props.showSearchedData(item._id) 
            }
          >
            <strong>
              {item.dataset_code} - {item.start_date}
            </strong>
          </span>
          <span
            className="glyphicon glyphicon-trash  pull-right text-danger trash-class"
            onClick={() => props.deleteStock(item._id)}
          />
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
);

export default SearchedListComponent;
