import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import moment from 'moment';


const SearchedListComponent = (props) => {
  if(props.searchHistory.length > 0){
    return ( 
      <div className="searches-container">
        <label>Search history:</label>
        <ListGroup>
          {props.searchHistory.map((item, i) => (
            <ListGroupItem item={item} key={item._id} className="list-group-class">
              <span className="details-contailner"
                onClick={() =>
                  props.showSearchedData(item.start_date, item.dataset_code) 
                }>
                <strong>{item.dataset_code}</strong> &nbsp;&nbsp;&nbsp;{moment(item.start_date).format('DD/MM/YYYY')} - {moment(item.end_date).format('DD/MM/YYYY')}
              </span>
              <span
                className="glyphicon glyphicon-trash  pull-right text-danger trash-class"
                onClick={() => props.deleteStock(item._id)}
              />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div> ) 
  } else if(props.searchHistory.length <= 0) {
    return (
      <h4>You don't have search history yet</h4>
    )
  }
}

export default SearchedListComponent;
