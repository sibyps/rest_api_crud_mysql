
const createError = require("http-errors");
const { genAccessToken, genRefreshToken } = require("../helpers/JWT");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

let refreshTokens = []





module.exports.login = async (req, res, next) => {

  const admin = {_id:process.env.ADMIN_ID,email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD };

  try {
    const { email, password } = req.body;
    if(email != admin.email || password != admin.password) throw createError.Unauthorized("Incorrect email or password")


    //generate jwt and sent it to the client
    const authToken = await genAccessToken(admin);
    const refreshToken = await genRefreshToken(admin);


    refreshTokens.push(refreshToken)


    //sending response to the client
    res
      .status(200)
      .cookie("authToken", authToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
      })

      .json({ success: true,  refreshToken });


  } catch (error) {
    next(error);
  }
};





module.exports.refreshToken = async (req, res, next) => {
  const admin = {_id:process.env.ADMIN_ID,email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD };
  try {
    const { refToken } = req.body;
    
    //if there is no ref token throwing err
    if (!refToken)
     throw createHttpError.InternalServerError("no refresh token found");

    //get the ref token from the array with
    if(!refreshTokens.includes(refToken)) throw createError.Unauthorized("Invalid refresh token")

    //verify the ref token from array
    jwt.verify(
      refToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, data) => {
        if (err) throw createError.InternalServerError(err);

        //black listing the used refresh token
        refreshTokens = refreshTokens.filter((item => item != refToken))

        //if it matches create a new pair of auth token and refresh token
        const authToken = await genAccessToken(admin);
        const refreshToken = await genRefreshToken(admin);

        //saving the new refresh token to array
        refreshTokens.push(refreshToken)

        //sending response to the client
        res
          .status(200)
          .cookie("authToken", authToken, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
          })
          .json({ success: true,message:"new pair of tokens created", refreshToken });
      }
    );

  } catch (error) {
    next(error);
  }
};




module.exports.logout = async (req, res, next) => {
  try {
    //get the ref token from body
    const { refToken } = req.body;


    //if there is no ref token throwing err
     if (!refToken)
       throw createHttpError.InternalServerError("no refresh token found");
   
    //get the ref token from the array with
      if(!refreshTokens.includes(refToken)) throw createError.Unauthorized("Invalid refresh token")
   

    //if it matches
    jwt.verify(
      refToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, data) => {
        if (err)
          throw createError.Unauthorized(
            "ref token from failed verification"
          );

        res
          .clearCookie("authToken")
          .json({ success: true, message: "Logged out successfully" });
      }
    );
  } catch (error) {
    next(error);
  }
};
