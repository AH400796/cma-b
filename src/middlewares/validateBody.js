const { HttpError } = require("../helpers");

const validateBody = schema => {
  const innerFunction = (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log(error.details);
      const fields = [];
      error.details.map(el => {
        fields.push(el.context.label);
        return null;
      });
      const errorFields = fields.join(", ");
      const isPluralError = fields.length > 1 ? "s" : "";
      const errorMessage = `Invalid value on <${errorFields}> field${isPluralError}`;
      next(HttpError(400, errorMessage));
    }
    next();
  };
  return innerFunction;
};

module.exports = validateBody;
