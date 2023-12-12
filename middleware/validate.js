//This logic moved here from returns.js in Lesson 14.15.
module.exports = (validator) => {//const validate was changed to module.exports
  return (req, res, next) => {
    const { error } = validator(req.body);  
    if (error) return res.status(400).send(error.details[0].message);
    next();
  }
}
