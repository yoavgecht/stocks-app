import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import moment from 'moment';
import { Grid, Row, Col, Button } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PushComponent from "./components/pushComponent";
import TableComponent from "./components/table/TableComponent";
import SearchedListComponent from "./components/searched/SearchesListComponent";
import Input from "./components/form/Input/Input";
import {
  saveStockData,
  deleteStock,
  getSavedSerchesList,
  showClickedSearchItem
} from "./actions/data-actions";


class App extends Component {
  //form data
  state = {
    quandlForm: {
      ticker: {
        label: "Enter Ticker:",
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Search Stock"
        },
        value: "",
        validation: {
          required: true,
          minLength: 1,
          isAlphanumeric: true
        },
        valid: false,
        touched: false
      },
      startDate: {
        label: "Enter starting and ending dates:",
        elementType: "date",
        elementConfig: {
          type: "text",
          placeholder: ""
        },
        value: moment().format("MM/DD/YYYY"),
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
     endDate: {
        label: "",
        elementType: "endDate",
        elementConfig: {
          type: "text",
          placeholder: ""
        },
        value: moment().format("MM/DD/YYYY"),
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
    },
    isFormValid: false,
    tickerData: null,
    searchHistory: [],
    startDate: null,
    endDate: null,
    focusedInput: null
  };

  componentDidMount() {
    this.getSearchHistoryList();
  }

   //validation function - checking for the rules we defined on the quandl form data state object

  checkValidation(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isAlphanumeric) {
      const pattern = /^([a-zA-Z0-9 _-]+)$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  //function that trigger on input onChange event
  inputChangedHandler = (event, inputId) => {
    //copy of the original quandl form

    const quandlFormCopy = {
      ...this.state.quandlForm
    };
    const newQuandlFormElement = {
      ...quandlFormCopy[inputId]
    };

   
    newQuandlFormElement.value = event.target.value;
    
    newQuandlFormElement.valid = this.checkValidation(
      newQuandlFormElement.value,
      newQuandlFormElement.validation
    );
    newQuandlFormElement.touched = true;
    quandlFormCopy[inputId] = newQuandlFormElement;

    let isFormValid = true;
    let startDate = this.state.startDate;
    if(inputId === 'startDate' || inputId === 'endDate') this.onDataChangeHandler('date', startDate);
    
    for (var key in quandlFormCopy) {
      isFormValid = quandlFormCopy[key].valid && isFormValid;
    }

    this.setState({ quandlForm: quandlFormCopy, isFormValid: isFormValid });
  };

  //function that trigger on form submit
  formSubmitHandler = (event) => {
    event.preventDefault();
    const userInputs = {};
    for (let inputId in this.state.quandlForm) {
      userInputs[inputId] = this.state.quandlForm[inputId].value;
    }

    const formData = {
      userInputs
    };

    //posting the form data to the server
    axios.post("/api/get-ticker-data", { formData }).then(response => {
      console.log(response);
      this.setState({ tickerData: response.data.data.dataset });
    });
  };

  getSearchHistoryList = () => {
    this.props.getSavedSerchesList().then(res => {
      this.setState({ searchHistory: this.props.searchHistory });
    });
   
  };

  saveStockDataHandler = () => {
    var data = this.state.tickerData;
    this.props.saveStockData(data).then(res => {
      if(data.status === 'data already saved' ) {
        console.log('data already saved');
      } else{
         this.setState({ searchHistory: this.props.searchHistory });
      }
    });
  };

  deleteStockDataHandler = (stockId) => {
    this.props.deleteStock(stockId).then(res => {
      this.setState({ searchHistory: this.props.searchHistory });
    });
  };

  showSearchedDataHandler = (searchDate, stockName) => {
    this.props.showClickedSearchItem(searchDate, stockName).then(res => {
      this.setState({ tickerData: this.props.data[0][0] });
    });
  }

  onDateChangeHandler = ({startDate, endDate}) => {
    if(!startDate) return false; 
    let inputId = startDate && !endDate ? 'startDate' : startDate && endDate ? 'endDate' : null;

     const quandlFormCopy = {
      ...this.state.quandlForm
    };
    const newQuandlFormElement = {
      ...quandlFormCopy[inputId]
    };
    
    inputId === 'startDate' ? newQuandlFormElement.value = moment(startDate, "MM-DD-YYYY") : newQuandlFormElement.value = moment(endDate, "MM-DD-YYYY")

    inputId === 'endDate' ? newQuandlFormElement.valid = this.checkValidation(endDate, inputId) : newQuandlFormElement.valid = this.checkValidation(startDate, inputId)

    newQuandlFormElement.touched = true;
    quandlFormCopy[inputId] = newQuandlFormElement;

    let isFormValid = true;
    for (var key in quandlFormCopy) {
      isFormValid = quandlFormCopy[key].valid && isFormValid;
    }

    inputId === 'endDate' ? 
    this.setState(() => ({quandlForm: quandlFormCopy, endDate: endDate, isFormValid})) :
    this.setState(() => ({quandlForm: quandlFormCopy, startDate: startDate , isFormValid}))
    
    
    
  }

  onFocusChangeHandler = ({focusedInput}) => {
    this.setState(() => ({focusedInput: focusedInput}))
  }

  render() {
    //looping on the quandl form state obj and pushing the id and every input type(first name, last name....)
    const contactForm = [];
    for (let key in this.state.quandlForm) {
      contactForm.push({
        id: key, //key = first name, last name, email.....
        config: this.state.quandlForm[key]
      });
    }

    let form = (
      <form onSubmit={this.formSubmitHandler}>
        {contactForm.map(input => (
  
          <Input
            key={input.id}
            Label={input.config.label}
            startDate={this.state.startDate}
            endDate={this.state.endDate}  
            focusedInput={this.state.focusedInput}  
            onDatesChange={this.onDateChangeHandler.bind(this)}
            onFocusChange={this.onFocusChangeHandler.bind(this)}
            focused={this.state.calenderFocused}
            elementType={input.config.elementType} //the element type of the quandlForm state obj (input)
            elementConfig={input.config.elementConfig}
            value={input.config.value} //the element value of the quandlForm state obj (input)
            invalid={!input.config.valid} // we set it on checkValidation function
            shouldValidate={input.config.validation}
            touched={input.config.touched} //we set it on inputChangedHandler
            changed={(event) => this.inputChangedHandler(event, input.id)}
          />
        ))}

        <Button
          style={{ marginTop: 20 }}
          bsStyle="success"
          bsSize="large"
          type="submit"
          disabled={!this.state.isFormValid}
        >
          Get Ticker Data
        </Button>
      </form>
    );

    return (
      <Grid>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Header />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={4}>
            {form}
          </Col>
          <Col xs={12} sm={12} md={4}></Col>
          <Col xs={12} sm={12} md={4}>
             <SearchedListComponent showSearchedData={this.showSearchedDataHandler} deleteStock={this.deleteStockDataHandler} searchHistory={this.state.searchHistory} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <TableComponent tickerData={this.state.tickerData} /> 
          </Col>
        </Row>
        <Row>
          {this.state.tickerData && (
            <Col xs={12} sm={12} md={12}>
              <Button
                style={{ marginTop: 20 }}
                bsStyle="success"
                bsSize="large"
                disabled={!this.state.isFormValid || this.state.tickerData.data.length <= 0}
                onClick={this.saveStockDataHandler}
              >
                Save
              </Button>
            </Col>
          )}
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <PushComponent />
            <Footer />
          </Col>
        </Row>
      </Grid>
    );
  }
}

// Make data  array available in  props
function mapStateToProps(state) {
  return {
    data: state.dataReducer.data,
    searchHistory: state.dataReducer.searchHistory
  };
}

export default connect(mapStateToProps, {saveStockData, deleteStock, getSavedSerchesList, showClickedSearchItem})(App);
