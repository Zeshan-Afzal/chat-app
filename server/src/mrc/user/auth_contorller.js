import auth_service from "./auth_service.js";

export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const result = await auth_service.register({ email, name, password });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth_service.login({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const currentUser = async (req, res) => {
  try {
    const result = await auth_service.getCurrentUser(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    console.log("request");
    
    const users = await auth_service.listUsersExcluding(req.user.id);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
