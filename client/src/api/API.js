import axios from 'axios';

const setOptions = () => {
  return {
    timeout,
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token')
    }
  };
};

const timeout = { timeout: 15000 };

export default {
  // called in App.js
  getProducts: function() {
    return axios.get('/get/products', timeout);
  },

  // called in the shopping cart
  getEstimate: function(values) {
    return axios.post('/create/estimate', values, setOptions());
  },

  getCarts: function() {
    return axios.get('/get/carts', setOptions());
  },

  getCustomers: function() {
    return axios.get('/get/customers', setOptions());
  },

  getAdmins: function() {
    return axios.get('/get/admins', setOptions());
  },

  // used to display the add to cart button and to check if the admin, login and cart page can be displayed
  checkToken: function() {
    return axios.get('/auth/token', setOptions());
  },

  // used to get info about the user from the token
  decodeToken: function() {
    const token = sessionStorage.getItem('token');
    let userObj;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      userObj = JSON.parse(window.atob(base64));
    } catch (e) {
      return false;
    }
    return userObj;
  },

  // called in Cart.js
  deleteProduct: function(id) {
    return axios.post('/delete/product', id, setOptions());
  },

  deleteCustomer: function(id) {
    return axios.post('/delete/customer', { id }, setOptions());
  },

  deleteAdmin: function(id) {
    return axios.post('/delete/admin', { id }, setOptions());
  },

  deleteUser: function(id, user) {
    if (user === 'customers') {
      return this.deleteCustomer(id);
    }
    return this.deleteAdmin(id);
  },

  // Called in the Login component
  login: function(data, pathname) {
    if (pathname === '/admin') {
      return axios.post('/auth/admin', data, timeout);
    }
    return axios.post('/auth/customer', data, timeout);
  },

  // called in InventoryCard.js
  saveProduct: function(data) {
    return axios.post('/save/product', data, setOptions());
  },

  // called in Cart.js to update the new quantity for a product
  updateQty: function(data) {
    return axios.post('/update/qty', data, setOptions());
  },

  updateCartName: function(cartId, name) {
    return axios.post('/update/cart');
  },

  updateAdmin: function(user) {
    return axios.post('/update/admin', user, setOptions());
  },

  updateCustomer: function(user) {
    return axios.post('/update/customer', user, setOptions());
  },

  updateUser: function(id, user) {
    if (user === 'customers') {
      return this.updateCustomer(id);
    }
    return this.updateAdmin(id);
  },

  createAdmin: function(user) {
    return axios.post('/create/admin', user, setOptions());
  },

  // used in Dashboard/CreateCustomer
  createCustomer: function(customer) {
    return axios.post('/create/customer', customer, setOptions());
  }
};
