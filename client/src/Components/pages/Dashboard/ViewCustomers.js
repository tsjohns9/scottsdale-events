import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'mdbreact';
import API from '../../../api/API';
import CustomerCard from './CustomerCard';

const styles = {
  h2: {
    marginTop: '20px',
    marginLeft: '20px',
    marginBottom: '30px'
  }
};

export default class ViewCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = { allCustomers: null, allAdmins: null };
  }

  componentDidMount() {
    if (this.props.location.pathname.includes('customers')) {
      this.getAllCustomers();
    } else {
      this.getAllAdmins();
    }
  }

  // this function gets passed down as a prop into the CustomerCard component
  // to update the state of this component when a customer is deleted so that
  // the customer is removed on the page right away
  deleteCustomer = id => {
    const updatedCustomers = this.state.allCustomers.filter(a => a.id !== id);
    this.setState({ allCustomers: updatedCustomers });
  };

  getAllAdmins = () => {
    API.getAdmins()
      .then(result => {
        const { success } = result.data;
        if (success) {
          console.log(success);
          // this.setState({allAdmins: success})
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          if (err.response.status === 401) {
            this.props.checkAuth(true);
          }
        }
      });
  };

  // loads all customers when the component mounts
  getAllCustomers = () => {
    API.getCustomers()
      .then(result => {
        const { success } = result.data;
        if (success) {
          this.setState({ allCustomers: success });
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          if (err.response.status === 401) {
            this.props.checkAuth(true);
          }
        }
      });
  };

  render() {
    console.log(this.state);
    if (this.state.allCustomers === null) {
      return <div className="loader" />;
    }
    return (
      <Fragment>
        <div className="hideIcon">
          <i onClick={this.props.toggleSideBar} className="fa fa-bars icon" />
        </div>
        <Container>
          <Row>
            <div style={styles.h2}>
              <h2>View and modify your customers</h2>
            </div>
            <Col md="8" className="offset-md-2">
              {this.state.allCustomers &&
                this.state.allCustomers.map(a => (
                  <CustomerCard
                    key={a.email}
                    customer={a}
                    deleteCustomer={this.deleteCustomer}
                    checkAuth={this.props.checkAuth}
                  />
                ))}
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
