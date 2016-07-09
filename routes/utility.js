/**
 * Created by Tyler on 7/10/2016.
 */
/*Utilities used for single-use data gathering or modification*/

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
    // itemId is set to the staticURL found in DOC's database, which is not present in DOC's website data but can be produced using the item.Id from the website data(below)
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
 