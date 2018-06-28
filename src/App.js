'use strict';
import React, { Component } from 'react';
import logo from './images/signal-tower.svg';
import './App.css';
import {Grid,Row,Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PaymentModule from './js/webapp/modules/payment/components/PaymentFormComponent';



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <Grid>
                <Row className="show-grid">
                    <Col xs={1} md={1}>
                      <img src={logo} className="App-logo" alt="logo" />
                    </Col>
                    <Col xs={9} md={9}>
                    <Grid>
                        <Row className="show-grid"><h3>Operators Agents Tariff Payment System</h3></Row>
                        <Row className="show-grid"><h4>Платежная система по агентским тарифам операторов</h4></Row>
                        </Grid>
                    </Col>
                </Row>
            </Grid>
        </header>
        <Grid>
          <Row className="show-grid">
            <Col xs={1} md={3}>
              
            </Col>
            <Col xs={10} md={6}>
                <PaymentModule disabled = {false}/>
            </Col>
            <Col xs={1} md={3}>
            </Col>
          </Row>
          </Grid>
       
      </div>
    );
  }
}

export default App;
