// Handlers
const getAllUsers = (req, res) => {
  res
    .status(500)
    .send({ message: 'This route is not define yet (getAllUsers)' });
};
const postAUser = (req, res) => {
  res.status(500).send({ message: 'This route is not define yet (postAUser)' });
};
const getAUser = (req, res) => {
  const { id } = req.params;
  res.status(500).send({ message: 'This route is not define yet (getAUser)' });
};
const deleteAUser = (req, res) => {
  const { id } = req.params;
  res
    .status(500)
    .send({ message: 'This route is not define yet (deleteAUser)' });
};
const updateAUser = (req, res) => {
  const { id } = req.params;
  res
    .status(500)
    .send({ message: 'This route is not define yet (updateAUser)' });
};

module.exports = { getAllUsers, postAUser, getAUser, deleteAUser, updateAUser };
