import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";


const SearchedListComponent = props => (
  <div className="searches-container">
    <label>Search history:</label>
    <ListGroup>
      {props.searchHistory.map((item, i) => (
        <ListGroupItem item={item} key={item._id} className="list-group-class">
          <span className="details-contailner"
            onClick={() =>
              props.showSearchedData(item.start_date, item.dataset_code) 
            }>
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
