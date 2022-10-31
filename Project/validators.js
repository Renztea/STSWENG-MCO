const { body } = require('express-validator');

const registerValidation = [

  body('username').not().isEmpty().withMessage("Name is required. "),

  body('email').not().isEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),

  body('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),

  body('password2').isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    }),

  body('birthday').isDate().withMessage("Please provide a valid date.").custom(value=>{
    let enteredDate=new Date(value);
    let todaysDate=new Date();
    if(enteredDate>todaysDate){
        throw new Error("Please provide a valid birthdate.");
    }
    return true;
  }),

  body('phone').isMobilePhone().withMessage("Please provide a valid phone number."),
];

const loginValidation = [
  body('email').not().isEmpty().withMessage("Email is required.").isEmail().withMessage("Please provide a valid email."),
  body('password').not().isEmpty().withMessage("Password is required.")
];

const blogValidation = [
  body('title').not().isEmpty().withMessage("The title of the post is required."),
  body('description').not().isEmpty().withMessage("The description of the post is required."),
  body('content').not().isEmpty().withMessage("The content of the post is required."),
]

const editValidation = [

]

const profileValidation = [  
  body('username').not().isEmpty().withMessage("Name is required."),
  body('phone').not().isEmpty().withMessage("Phone number is required.").isMobilePhone().withMessage("Please provide a valid phone number."),
  body('password').not().isEmpty().withMessage("Password is required."),
  body('password2').isLength({ min: 8 }).withMessage("Confirmation of the password is needed to make updates")
];

module.exports = { registerValidation , loginValidation, profileValidation, blogValidation, editValidation};