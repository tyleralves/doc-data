var express = require('express');
var router = express.Router();
var http = require('http'); //required for get requests to DOC GIS data
var request = require('request');
var q = require('q');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var proj4 = require('proj4');
var User = mongoose.model('User');
var Park = mongoose.model('Park');

//Static track details stored in json file on server
var trackDetail = require('../public/indexedTracks.json');
var auth = expressJwt({secret: 'SECRET', userProperty: 'payload'});
var convertCoords = function(coords){
  var firstProjection = "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  var secondProjection = 'EPSG:4326';
  var i, length;
  var convertedCoords = [];
  /*for(i = 0, length = coords.length; i<length; i++){
    console.log(proj4(firstProjection,secondProjection,coords[i]).reverse());
    //convertedCoords.push(proj4(firstProjection,secondProjection,coords[i]).reverse());
  }
  return convertedCoords;*/
  return proj4(firstProjection,secondProjection,coords).reverse();
};

//For DOC GIS api request

router.post('/register', function(req,res,next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User;
  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function(err, user){
    if(err){return next(err);}
    return res.json({token: user.generateJWT()});
  });
});

router.post('/login', function(req,res,next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){return next(err);}
    if(user){
      return res.json({token: user.generateJWT()});
    }else{
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/*Used to download json from doc api

router.get('/trackdetails', function(req, res, next){
  var detailPromise = q.Promise(
    function(resolve,reject){
      request({
        url: 'http://www.doc.govt.nz/api/profiles/tracks',
        json: true,
        method: 'GET'
      }, function(error, response, body){
        fs.writeFile('tracks.json', JSON.stringify(body), function(err){
         console.log(err);
         });
        resolve(body);
      });
    }
  );
});
*/

/*Used to index tracks.json (indexedTracks.json)
var trackDetail = require('../public/tracks.json');
router.get('/trackindexer', function(req, res, next){
  var indexObj = {};
  trackDetail.forEach(function(item, index, array){
    var itemId = "http://www.doc.govt.nz/link/"+item.Id.toUpperCase()+".aspx";
    indexObj[itemId]=index;
  });
  trackDetail.unshift(indexObj);
  fs.writeFile('indexedTracks.json', JSON.stringify(trackDetail), function(err){
    console.log(err);
    res.json({done: 'DONE'});
  });
});
*/

router.route('/trackmarkers')
  .get(function(req, res, next){
    Park.find({Name: "Bendigo area"}, function(err, park){
      if(err){
        console.log(err);
        return next(err);
      }else{
        var textSearch = (req.query.hasOwnProperty('text')&&req.query.text.length>0) ? req.query.text : 'Water';
        var parksUrl = 'http://maps.doc.govt.nz/arcgis/rest/services/DTO/NamedExperiences/MapServer/0/query?where=&text=' + textSearch + '&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=OBJECTID%2CName%2CWeb_URL%2CCategory%2CShape%2CShape.STLength%28%29%2CGUID&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json';
        
        
            request({
              url: parksUrl,
              json: true,
              method: 'GET'
            }, function(error, response, body) {
              var locationDetailIndex;
              body.features.forEach(function(item, index, array){
                item.geometry.paths = convertCoords(item.geometry.paths[0][0]);
                item.geometry.paths = {lat: item.geometry.paths[0], lng: item.geometry.paths[1]};
                locationDetailIndex = trackDetail[0][item.attributes.Web_URL]+1;
                console.log(locationDetailIndex);
                item.attributes.details = trackDetail[locationDetailIndex];
              });
              res.json(body.features);
              //resolve(body.features);
            });
     
        
        /*locationPromise
          .then(function(data){
            console.log(data[0]);
            res.json(data);
          });*/
      }
    });
  })
  .post(function(req, res, next){
    var product = new Product(req.body);

    product.save(function(err, product){
      if(err) {return next(err);}
      res.json(product);
    });
  });

router.get('/cart', auth, function(req, res, next){
  User.findOne({username: req.payload.username}, function(err, user){
    user.populate('cart.product', function(err, user){
      if(err){return next(err);}
      res.json(user.cart);
    })
  });
});

router.post('/cartRemoveProduct', auth, function(req, res, next) {
  function findCartIndex(user){
    var i, length;
    for(i = 0, length = user.cart.length; i < length; i++) {
      console.log(i);
      if (user.cart[i].product.equals(req.body.product._id)) {
        return i;
      }
    }
  }
  
  User.findOne({username: req.payload.username}, function (err, user) {
    var removeIndex = findCartIndex(user);
    Product.update({_id: req.body.product._id}, {$inc: {quantity: user.cart[removeIndex].quantity}},
      function (err, product) {
        if (err) {next(err);}
        user.cart.splice(removeIndex, 1);
        user.save(function (err, user) {
          res.json({message: 'Item removed from cart', removeIndex: removeIndex});
        });
      }
    );
    
  });
});
  
router.post('/cartAddProduct', auth, function(req, res, next){
  var newCartItem = {
    product: req.body._id,
    quantity: req.body.quan
  };

  function addCartItem(product){
    User.update({username: req.payload.username, 'cart.product': {$ne: newCartItem.product}},
      {$push: {cart: newCartItem}},
      function(err, user){
        if(err){return next(err);}
        if(!user.nModified){
          res.json({message: 'Item is already in your cart.'});
        }else{
          product.quantity -= newCartItem.quantity;
          product.save();
          res.json({message: 'Item added to cart', addedProduct: newCartItem});
        }
      }
    );
  }
  
  Product.findById({_id:req.body._id, quantity: {$gte: newCartItem.quantity}}, //TODO: need to check 
    function(err, product){
      if(err) {
        return next(err);
      }else if(product.nModified === 0) {
        res.json({message: 'Product no longer has sufficient quantity in stock.'});
      }else{
        addCartItem(product);
      }
  });
});

router.post('/cartModifyQuantity', auth, function(req, res, next){        
  var previousQuantity;
  Product.findOne({_id: req.body.product._id}, function(err, product){
    User.findOne({username: req.payload.username}, function(err, user){
      previousQuantity = user.cart[req.body.index].quantity;
      if(product.quantity >= req.body.quantity-previousQuantity){
        product.quantity += previousQuantity-req.body.quantity;
        product.save(function(err, product){
          user.cart[req.body.index].quantity = req.body.quantity;
          user.save(function(err, user){
            res.json({message: 'Cart quantity changed', product: product});
          });
        });
      }else{
         res.json({message: 'Insufficient inventory, reduce quantity in cart'});
      }
    });
  });
});

module.exports = router;