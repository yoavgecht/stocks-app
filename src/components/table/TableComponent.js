import React from 'react';
import { Table } from 'react-bootstrap';

const TableComponent = (props) => (
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
            <td></td>
            <td>{item[1]}</td>
        </tr>
        )}
    </tbody>
</Table>
    );
    

export default TableComponent;