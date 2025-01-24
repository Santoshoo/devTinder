const adminAuth = (req, res) => {
  const token = "xyz";
  const isAdminAutho = token === "xyz";
  if (!isAdminAutho) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};
const userAuth = (req, res) => {
  const token = "xyz";
  const isAdminAutho = token === "xyz";
  if (!isUserAutho) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};
module.exports={
    adminAuth,userAuth
}