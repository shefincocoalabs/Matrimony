var Users = require('../models/user.model.js');
var Otp = require('../models/otp.model.js');
const uuidv4 = require('uuid/v4');
var config = require('../../config/app.config.js');
var otpConfig = config.otp;
exports.profileFor = (req, res) => {
  var profileFor = [];
  profileFor.push({
    title: 'Myself'
  }, {
    title: 'Daughter'
  }, {
    title: 'Son',
  }, {
    title: 'Sister'
  }, {
    title: 'Brother'
  }, {
    title: 'Relative'
  }, {
    title: 'Friend'
  });
  res.status(200).send({
    success: 1,
    items: profileFor,
    message: 'Profile-for listed successfully'
  })
};

exports.signUp = async (req, res) => {
  var profileFor = req.body.profileFor;
  var fullName = req.body.fullName;
  var phone = req.body.phone;
  if (!fullName || !profileFor || !phone) {
    var errors = [];
    if (!fullName) {
      errors.push({
        field: "fullName",
        message: "Name cannot be empty"
      });
    }
    if (!profileFor) {
      errors.push({
        field: "profileFor",
        message: "Profile-for cannot be empty"
      });
    }
    if (!phone) {
      errors.push({
        field: "phone",
        message: "Phone cannot be empty"
      });
    }
    return res.send({
      success: 0,
      statusCode: 400,
      errors: errors,
    });
  };
  var userDetails = {
    profileFor: profileFor,
    fullName: fullName,
    phone: phone
  };

  try {
    var filter = {
      phone: phone,
      status: 1
    };
    let checkUser = await Users.findOne(filter);
    if (checkUser) {
      return res.status(400).send({
        success: 0,
        message: 'User exists, try with a different phone number'
      })
    };
    var expiry = Date.now() + (otpConfig.expirySeconds * 1000);
    let otp = Math.floor(100000 + Math.random() * 900000);
    const apiToken = uuidv4();
    const newOtp = new Otp({
      phone: phone,
      isUsed: false,
      userToken: otp,
      apiToken: apiToken,
      expiry: parseInt(expiry)
    });
    let otpSave = await newOtp.save();
    res.status(200).send({
      success: 1,
      otp: otp,
      apiToken: apiToken,
      userDetails: userDetails,
      message: 'OTP has been send to your registered phone number'
    })
  } catch (err) {
    res.status(500).send({
      success: 0,
      message: err.message
    })
  }
};

exports.verifyOtp = async (req, res) => {
  var phone = req.body.phone;
  var otp = req.body.otp;
  var apiToken = req.body.apiToken;
  var userDetails = req.body.userDetails;
  if (!phone || !otp || !apiToken || !userDetails) {
    var errors = [];
    if (!phone) {
      errors.push({
        field: "phone",
        message: "Phone cannot be empty"
      });
    }
    if (!otp) {
      errors.push({
        field: "otp",
        message: "Otp cannot be empty"
      });
    }
    if (!apiToken) {
      errors.push({
        field: "apiToken",
        message: "apiToken cannot be empty"
      });
    }
    if (!userDetails) {
      errors.push({
        field: "userDetails",
        message: "Userdetails cannot be empty"
      });
    }
    return res.send({
      success: 0,
      statusCode: 400,
      errors: errors,
    });
  };
  var findCriteria = {
    userToken: otp,
    apiToken: apiToken,
    isUsed: false
  }
  var otpData = await Otp.findOne(findCriteria);
  if (otpData) {
    let currentTime = Date.now();

    var otpData1 = await Otp.findOne({
      userToken: otp,
      apiToken: apiToken,
      isUsed: false,
      expiry: {
        $gt: currentTime
      }
    });
    if (otpData1 === null) {
      return res.send({
        success: 0,
        message: 'otp expired,please resend otp to get a new one'
      })
    } else {
      var filter = {
        userToken: otp,
        apiToken: apiToken
      };
      var update = {
        isUsed: true
      };
      let updateOtpData = await Otp.findOneAndUpdate(filter, update, {
        new: true,
        useFindAndModify: false
      });
      if (updateOtpData) {
        const newRegistration = new Users({
          profileFor: userDetails.profileFor,
          fullName: userDetails.fullName,
          phone: userDetails.phone,
          status: 1,
          tsCreatedAt: Date.now(),
          tsModifiedAt: null
        });
        let saveRegistration = await newRegistration.save();
      }
      res.send({
        success: 1,
        statusCode: 200,
        message: 'Otp verified and resgistered successfully'
      })
    }
  } else {
    return res.send({
      success: 0,
      message: 'Otp does not matching'
    })
  }
}
