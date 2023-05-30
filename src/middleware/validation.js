const authorValidation = async (req, res, next) => {
    let { fname, lname, title, email, password } = req.body;
  
    if (!fname || !lname || !title || !email || !password) {
      return res.status(400).send({
        status: false,
        message: "Missing mandatory fields",
      });
    }
  
    if (
      typeof fname !== "string" ||
      typeof lname !== "string" ||
      typeof title !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).send({
          status: false,
        message: "Type is wrong for the fields. They should be strings.",
      });
    }
  
    let pattern = /^[a-zA-Z]{2,}$/;
       fname = fname.trim()
       lname = lname.trim()
  
    if (!pattern.test(fname)) {
       return  res.status(400).send({status: false , message : "fname should contain atleast two or more letters only "})
    } 
  
    if (!pattern.test(lname)) {
       return res.status(400).send({status: false , message : "lname should contain atleast two or more letters only "})
    } 
  
    if (password.length < 6 || password.length > 15) {
      return res.status(400).json({   status: false, message: "Please provide strong password" });
    }
  
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[@_#$&%?]/.test(password)
    ) {
      return res
        .status(400)
        .json({ 
           status: false,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
        });
  
      }
      // All validation checks passed
  next();
  };
  
  
  const blogValidation = (req,res,next)=>{
  let {title, body, category}  = req.body
      if (
          typeof title !== "string" ||
          typeof body !== "string" ||
          typeof category !== "string" 
        ) {
          return res.status(400).send({
              status: false,
            message: "Type is wrong for the fields. They should be strings.",
          });
        }
      next()
  }
  
  
  
  
  
  module.exports = { authorValidation , blogValidation};
  