import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';
import axios from 'axios';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Input from './components/form/Input/Input';
import moment from 'moment';

// import Button from './components/form/Button/Button';

class App extends Component {
    //form data
  state = {
    quandlForm: {
         ticker: {
                label: 'Enter Ticker:',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'i.e - FB'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2,
                    isAlphabet: true
                },
                valid: false,
                touched: false
            },
        date: {
            label: 'Enter Date:',
                elementType: 'date',
                elementConfig: {
                    type: 'text',
                    placeholder: 'i.e - FB'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            }
      },
      isFormValid: false,
      sentStatus: '',
      startDate: null
    };

    //validation function - checking for the rules we defined on the quandl form data state object

    checkValidation(value, rules) {
       let isValid = true;
       if (!rules) {
            return true;
        }

        if (rules.required) {
          isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength){
          isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isAlphabet) {
            const pattern = /^[a-zA-Z]+$/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

         if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
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

        if(inputId === 'date'){
            newQuandlFormElement.value = event.format("MM/DD/YYYY");
            this.setState({startDate: newQuandlFormElement.value})
        } else {
            newQuandlFormElement.value = event.target.value;
        }

        newQuandlFormElement.valid = this.checkValidation(newQuandlFormElement.value, newQuandlFormElement.validation);
        newQuandlFormElement.touched = true;
        quandlFormCopy[inputId] = newQuandlFormElement;

        let isFormValid = true;
        for(var key in quandlFormCopy){
          isFormValid = quandlFormCopy[key].valid && isFormValid;
        }

        this.setState({quandlForm: quandlFormCopy, isFormValid: isFormValid});
    }

    //function that trigger on form submit 
    formSubmit = (event) => {
      event.preventDefault();
      const userInputs = {};
      for (let inputId in this.state.quandlForm) {
        userInputs[inputId] = this.state.quandlForm[inputId].value;
      }

      const formData = {
        userInputs
      }

        //posting the form data to the server
        axios.post('/api/get-ticker-data', {formData}).then( (response) =>  {
             this.setState({sentStatus: response.data.status})         
         });

    }

  render() {
      //looping on the quandl form state obj and pushing the id and every input type(first name, last name....)
      const contactForm = [];
      for(let key in this.state.quandlForm){
        contactForm.push({
          id: key, //key = first name, last name, email.....
          config: this.state.quandlForm[key]
        })
      }
      
      let form = (
        <form onSubmit={this.formSubmitHandler}>
          {contactForm.map(input => (
            <Input key={input.id}
            Label={input.config.label}
            selectedDate={this.state.startDate}
            elementType={input.config.elementType} //the element type of the quandlForm state obj (input)
            elementConfig={input.config.elementConfig} 
            value={input.config.value} //the element value of the quandlForm state obj (input)
            invalid={!input.config.valid} // we set it on checkValidation function
            shouldValidate={input.config.validation} 
            touched={input.config.touched} //we set it on inputChangedHandler
            changed={(event) => this.inputChangedHandler(event, input.id)}/> 
          ))}
          
           <Button
            style={{marginTop: 20}} 
            bsStyle="success" 
            bsSize="large" 
            disabled={!this.state.isFormValid} 
            >Save</Button>
            <Button
            style={{marginTop: 20}} 
            bsStyle="success" 
            bsSize="large" 
            disabled={!this.state.isFormValid} 
            onClick={this.formSubmit}>Delete</Button>
        </form>
    )
    
     return (
       <Grid>
         <Row>
            <Col xs={12} sm={12} md={12}>
          {form}
           </Col>
            <Col xs={12} sm={12} md={12}>
                 {this.state.sentStatus && <p className={styles.sentStatus}>{this.state.sentStatus}</p>}
            </Col>
        </Row>
      </Grid> 
     );
  }
}

export default App;
