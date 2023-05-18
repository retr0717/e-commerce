var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper');
var userHelper = require('../helpers/user-helper');

const verifyLogin = (req,res,next) => {

  if(req.session.loggedIn)
  {
    next();
  }
  else
  {
    res.redirect('/login');
  }
}

/* GET users home page. */
router.get('/', async function(req, res, next){

  let user = req.session.user;
  console.log(user);

  let Products = await productHelper.getAllProducts();

    res.render('user/view-products', { Products, user })

});

//route to add the items to cart.
router.get('/add-to-cart/:id',verifyLogin,(req,res) => {

  console.log(req.params.id);

  userHelper.addToCart(req.params.id,req.session.user._id).then(() => {
    res.redirect('/')
  })
})

//cart router to return the cart hbs file.
router.get('/cart',verifyLogin,(req,res) => {

  res.render('user/cart');
})

//login get router to destroy the session
router.get('/logout',(req,res) => {

  req.session.destroy();
  res.redirect('/');

})

//login get router to provide login hbs template.
router.get('/login',(req,res) => {

  if(req.session.loggedIn)
  {
    res.redirect('/')
  }
  else
  {
    console.log(req.session.loginErr);
    res.render('user/login',{"Error":req.session.loginErr});
    req.session.loginErr = null;
  }
})

//login post router to login.
router.post('/login',(req,res) => {

  userHelper.doLogin(req.body).then(response => {

    if(response.status)
    {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    }
    else{
      req.session.loginErr = "Invalid Credentials";
      res.redirect('/login');
    }
  })
})

//signup get router to provide signup hbs template.
router.get('/signup',(req,res) => {

  res.render('user/signup');
})

//signup post router to create the user.
router.post('/signup',(req,res) => {

  userHelper.doSignUp(req.body).then((response) => {
    console.log(response);

    req.session.loggedIn = true;
    req.session.user = response;

    res.redirect('/');
  })

})

module.exports = router;