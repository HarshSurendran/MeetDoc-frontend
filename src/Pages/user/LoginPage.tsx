import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
import React, { useState } from 'react';
import {
  validateEmail,
  validatePassword,
} from '../../utils/userValidator/uservalidator';
import { login } from '../../services/user/userAuth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/slices/userSlice';
import errorHandler from '../../utils/errorHandler';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const onLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      setError('');
      event.preventDefault();

      const emailError = validateEmail(user.email);
      if (emailError) {
        setError(emailError);
        return;
      }
      const passError = validatePassword(user.password);
      if (passError) {
        setError(passError);
        return;
      }

      const response = await login(user);
      console.log('This is the response from axios -', response);

      if (response?.status == 201) {
        toast.success('logged in successfully');
        dispatch(
          addUser({
            _id: response?.data.user._id,
            email: response?.data.user.email,
            name: response?.data.user.name,
          })
        );
        localStorage.setItem('userAccessToken', response.data.accessToken);
        navigate('/');
      }
    } catch (error) {
      console.log(error, 'Error from login page');
      errorHandler(error);
    }
  };

  return (
    <Box
      sx={{
        my: 5,
        width: '100%',
        maxWidth: {
          xs: '100%',
          sm: '100%',
          md: '900px',
          lg: '1160px',
          xl: '1140px',
        },
        mx: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: { xs: '100%', sm: '80%', md: '50%' } }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          Login
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            {error && <p className="text-red-700"> {error}</p>}
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 2 }}
              onClick={(e) => onLogin(e)}
            >
              Login
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button
              onClick={() => navigate('/signup')}
              color="inherit"
              variant="text"
              size="small"
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
