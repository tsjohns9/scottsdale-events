// require('isomorphic-fetch');
const fs = require('fs');
const { user } = require('../controllers');
const router = require('express').Router();
const mailer = require('../util/mailer');
const db = require('../models');
const Json2csvParser = require('json2csv').Parser;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const debug = require('debug');
const dCheck = debug('express:log');

const Client = require('ftp');
const ftpConfig = require('../config/ftpConfig');

const unAuthedErr = {
  message: 'Unauthorized',
  status: 401
};

// creates a new customer
router.post(
  '/create/customer',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (!req.user.isAdmin) {
      next(unAuthedErr);
      return;
    }
    user
      .createCustomer(req.body)
      .then(result => {
        delete result.dataValues.password;
        res.json({ success: 'New customer created successfully' });
      })
      .catch(next);
  }
);

// creates a new admin
// TODO: secure this route
router.post('/create/admin', (req, res, next) => {
  // if (!req.user.isAdmin) {
  //   next(unAuthedErr);
  //   return;
  // }
  user
    .createAdmin(req.body)
    .then(result => {
      delete result.dataValues.password;
      res.json({ success: 'New admin created successfully' });
    })
    .catch(next);
});

// router.post('/create/cart', (req, res, next) => {
//   user
//     .createCart(req.body.id)
//     .then(result => res.json(result))
//     .catch(next);
// });

// creates a csv file for a customers estimate
router.post(
  '/create/estimate',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // creates the columns for the csv file
    const fields = ['estimateId', 'id', 'qty'];
    let estimateId;
    // contains the rows for the csv file
    const { eventProps, cartProps } = req.body;
    const CartId = cartProps[0].CartId;
    // adds each event info field into a field for the csv file
    Object.keys(eventProps).forEach(a => fields.push(a));
    db.Estimate.create({ _id: '1', CartId: CartId })
      .then(result => {
        estimateId = result.dataValues.id;
        const merged = cartProps.map(product => {
          for (let info in eventProps) {
            product[info] = eventProps[info];
            product['estimateId'] = result.dataValues.id;
          }
          return product;
        });
        // creates the csv file. checks for errors.
        try {
          const client = new Client();
          const parser = new Json2csvParser({ fields, quote: '' });
          const csv = parser.parse(merged);
          client.on('error', err =>
            next({
              error: err,
              message:
                'An error occured while creating your estimate. Please contact us'
            })
          );
          client.on('ready', () => {
            client.put(csv, `estimate-${estimateId}.csv`, err => {
              if (err) next(err);
              user
                .createCart(req.user.id)
                .then(result => {
                  res.json({
                    estimateId: estimateId,
                    activeCart: result.dataValues.id
                  });
                })
                .catch(next);
              client.end();
            });
          });
          client.connect(ftpConfig);
        } catch (err) {
          next(err);
        }
      })
      .catch(next);
  }
);

// contact form email
router.post('/create/email', (req, res, next) => {
  const m = req.body;
  mailer(
    m.email,
    'Information Request',
    'confirmationEmail',
    m,
    (error, success) => {
      if (error) {
        next(error);
      }
      if (success) {
        mailer(
          m.email,
          'Scottsdale Event Decor Confirmation Email',
          'contactEmailForSED',
          m,
          (error, success) => {
            if (error) {
              next(error);
            }
            if (success) {
              res.send({ success: true });
            }
          }
        );
      }
    }
  );
});

router.post(
  '/update/admin',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (!req.user.isAdmin) {
      next(unAuthedErr);
      return;
    }
    user
      .updateAdmin(req.body)
      .then(() => {
        res.json({ success: 'Your profile has been updated' });
      })
      .catch(next);
  }
);

router.post(
  '/update/qty',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { ProductId, qty } = req.body;
    db.CartProduct.update({ qty: qty }, { where: { ProductId: ProductId } })
      .then(() => {
        res.json({ success: 'success' });
      })
      .catch(next);
  }
);

// updates any customer
router.post(
  '/update/customer',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    user
      .updateCustomer(req.body)
      .then(() => {
        res.json({ success: 'Success' });
      })
      .catch(next);
  }
);

router.post(
  '/update/cart',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { name, id } = req.body;
    db.Cart.update({ cartName: name }, { where: { id: id } })
      .then(result => {
        res.json({ success: result });
      })
      .catch(next);
  }
);

// deletes a customer
router.post(
  '/delete/customer',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { id } = req.body;
    if (!req.user.isAdmin) {
      next(unAuthedErr);
      return;
    }
    user
      .deleteCustomer(id)
      .then(() => res.send({ success: 'Success' }))
      .catch(next);
  }
);

router.post(
  '/delete/admin',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { id } = req.body;
    if (!req.user.isAdmin) {
      next(unAuthedErr);
      return;
    }
    user
      .deleteAdmin(id)
      .then(() => res.send({ success: 'Success' }))
      .catch(next);
  }
);

router.post(
  '/delete/product',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { cartProductId } = req.body;
    db.CartProduct.destroy({ where: { id: cartProductId } })
      // res is either 1 or 0. 1 is a success, 0 is a fail.
      .then(result => {
        if (result) res.status(200).send('Product removed');
        else next({ message: 'Failed to remove product' });
      })
      .catch(next);
  }
);

// loads all customers
router.get(
  '/get/customers',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (!req.user.isAdmin) {
      next(unAuthedErr);
      return;
    }
    user
      .getAllCustomers()
      .then(result => res.status(200).send({ success: result }))
      .catch(next);
  }
);

// loads all customers
router.get(
  '/get/admins',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (!req.user.isAdmin) {
      next(unAuthedErr);
      return;
    }
    user
      .getAllAdmins()
      .then(result => res.status(200).send({ success: result }))
      .catch(next);
  }
);

// gets all the products. runs on first page load.
router.get('/get/products', (req, res, next) => {
  db.Product.findAll({})
    .then(result => {
      if (!result.length) {
        next({ message: 'Failed to load inventory. Please contact us.' });
      } else {
        res.status(200).send(result);
      }
    })
    .catch(next);
});

router.get(
  '/get/carts',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    user
      .getCarts(req.user.id)
      .then(result => {
        // returns carts sorted by the isActive boolean value
        // ensures the active cart is at index 0
        const x = result.sort((x, y) => {
          return x.isActive === y.isActive ? 0 : x.isActive ? -1 : 1;
        });
        res.status(200).json(x);
      })
      .catch(next);
  }
);

// saves a product to a customers cart
router.post(
  '/save/product',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const { ProductId, CartId } = req.body;
    const sm = { success: 'Product Saved' };
    // this will either create a new product to save to a cart,
    // or it will update an already saved product
    // prevents a cart from having duplicate line items for the same product
    db.CartProduct.findOne({ where: { ProductId: ProductId, CartId: CartId } })
      .then(result => {
        const bodyQty = Number(req.body.qty);
        if (result) {
          const { qty, maxQty } = result.dataValues;
          if (bodyQty + qty > maxQty) {
            next({
              message: `Max Quantity Exceeded. You already saved ${qty} items`
            });
            return false;
          }
          req.body.qty = bodyQty + qty;
          result
            .update(req.body)
            .then(() => res.json(sm))
            .catch(next);
        } else {
          db.CartProduct.create(req.body)
            .then(() => res.json(sm))
            .catch(next);
        }
      })
      .catch(next);
  }
);

// authentictes a customer and sets a token
router.post('/auth/customer', (req, res, next) => {
  const { email, password } = req.body;
  user
    .getCustomer(email, password)
    .then(result => {
      jwt.sign({ result }, 'secretkey', { expiresIn: '1w' }, (err, token) => {
        if (err) next(err);
        res.send({ token, user: result });
      });
    })
    .catch(next);
});

// authentictes an admin and sets a token
router.post('/auth/admin', (req, res, next) => {
  const { email, password } = req.body;
  user
    .getAdmin(email, password)
    .then(result => {
      jwt.sign({ result }, 'secretkey', { expiresIn: '1w' }, (err, token) => {
        if (err) next(err);
        res.send({ token, user: result });
      });
    })
    .catch(next);
});

router.get(
  '/auth/token',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({ isAdmin: req.user.isAdmin });
  }
);

module.exports = router;
