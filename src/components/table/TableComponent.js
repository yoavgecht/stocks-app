import React from 'react';
import { Table } from 'react-bootstrap';

const TableComponent = (props) => (
    <div>
    <h3>{props.tickerData.dataset_code}</h3>
    <h3>i.e. {props.tickerData.end_date}</h3>
    <Table responsive striped bordered condensed hover>
    <thead>
        <tr>
            <th>Date:</th>
            <th>Price</th>
            <th>% change compared to entered date</th>
        </tr>
    </thead>
    <tbody>
        {props.tickerData.data.map((item, i) =>
        <tr key={i}>
            <td>{item[0]}</td>
            <td>{item[4]}</td>
            <td></td>
        </tr>
        )}
    </tbody>
</Table>
</div>
    );
    

export default TableComponent;