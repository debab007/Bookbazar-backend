import{ signup, login } from '../services/authService.js';

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await signup(name, email, password);
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export { signupUser, loginUser };
