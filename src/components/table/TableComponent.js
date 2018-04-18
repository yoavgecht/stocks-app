import React from "react";
import { Table } from "react-bootstrap";
import moment from 'moment';

const TableComponent = (props) => {
  if(props.tickerData && props.tickerData.data.length > 0) {
    const closingStockPrice = props.tickerData.data[0][4];
    const getChangePercentage = price => {
    var quote1 = parseInt(closingStockPrice, 10);
    var quote2 = parseInt(price, 10);
    const calc = (((quote2 - quote1)/quote2)*100).toFixed(2)+'%';
    return calc;
  };

  return (
    <div>
      <h3>{props.tickerData.dataset_code}</h3>
      <h3>{moment(props.tickerData.start_date).format("DD/MM/YYYY")} - {moment(props.tickerData.end_date).format("DD/MM/YYYY")}</h3>
      <Table responsive striped bordered condensed hover>
        <thead>
          <tr>
            <th>Date:</th>
            <th>Price</th>
            <th>% Change compared to starting date</th>
          </tr>
        </thead>
        <tbody>
          {props.tickerData.data.map((item, i) => (
            <tr key={i}>
              <td>{moment(item[0]).format("DD/MM/YYYY") }</td>
              <td>{item[4]}</td>
              <td>{getChangePercentage(item[4])}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
    } else if(props.tickerData && props.tickerData.data.length <= 0) {
      return (
      <h4>Couldn't get stock data. Please try again.</h4>
    );
  } else {
    return(<div></div>)
  }
}
export default TableComponent;
