/**
 * Created by Tyler on 5/16/2016.
 */
var mongoose = require('mongoose');

var ParkSchema = new mongoose.Schema({
  type: String,
  Activities: [String],
  Alerts: {},
  Id: String,
  Introduction: String,
  IntroductionThumbnail: String,
  IntroductionThumbnailAltText: String,
  Link: String,
  Locations: [String],
  name: String,
  Parks: String,
  Popular: String,
  StaticLink: String,
  OpenHuntingArea: String
});

mongoose.model('Park', ParkSchema);