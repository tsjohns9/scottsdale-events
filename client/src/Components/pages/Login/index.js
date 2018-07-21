import './index.css';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Input, Button, Card, CardBody } from 'mdbreact';
import API from '../../../api/API';

class Login extends React.Component {
  state = { username: '', password: '' };

  onChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    const { username, password } = this.state;
    API.login({ username, password })
      .then(res => {
        if (res.data) {
          sessionStorage.setItem('isAuthed', true);
          sessionStorage.setItem('userName', res.data.email);
          sessionStorage.setItem('activeCart', res.data.carts[0].id);
          sessionStorage.setItem('userId', res.data.id);
          this.setState({ isAuthed: true });
        } else {
          sessionStorage.setItem('isAuthed', false);
        }
      })
      .catch(err => {
        console.log('err:', err);
        this.setState({ error: 'error' });
      });
  };

  render() {
    // console.log(this.state);
    if (this.state.isAuthed) {
      return <Redirect to="/" />;
    } else {
      return (
        <Container>
          <section className="form-simple">
            <Row>
              <Col lg="8" className="offset-lg-2">
                <Card>
                  <div className="header pt-3 grey lighten-2">
                    <Row className="d-flex justify-content-start">
                      <h3 className="deep-grey-text mt-3 mb-4 pb-1 mx-5">
                        Log in
                      </h3>
                    </Row>
                  </div>
                  <CardBody className="mx-4 mt-4">
                    <Input
                      onChange={this.onChange}
                      name="username"
                      label="Your email"
                      group
                      type="text"
                      validate
                    />
                    <Input
                      onChange={this.onChange}
                      name="password"
                      label="Your password"
                      group
                      type="password"
                      validate
                      containerClass="mb-0"
                    />
                    <p className="font-small grey-text d-flex justify-content-end">
                      Forgot{' '}
                      <a
                        href="#"
                        className="dark-grey-text font-weight-bold ml-1"
                      >
                        {' '}
                        Password?
                      </a>
                    </p>
                    {this.state.error && (
                      <p className="text-danger text-center">
                        Username or password is incorrect
                      </p>
                    )}
                    <div className="text-center mb-4 mt-5">
                      <Button
                        onClick={this.onSubmit}
                        color="danger"
                        type="button"
                        className="btn-block z-depth-2"
                      >
                        Log in
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </section>
        </Container>
      );
    }
  }
}

export default Login;