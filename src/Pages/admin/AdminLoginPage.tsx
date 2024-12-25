import { Box, Button, Grid, TextField, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/userValidator/uservalidator";
import { login } from "../../services/admin/adminAuth";
import toast from "react-hot-toast";
import { addAdmin } from "../../redux/slices/adminSlice";
import errorHandler from "../../utils/errorHandler";


const AdminLoginPage: React.FC = () => {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onLogin = async (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {    
    try {
      setError("");
      event.preventDefault();
  
      const emailError = validateEmail(admin.email);
      if (emailError) {
        setError(emailError);
        return;
      }
      const passError = validatePassword(admin.password);
      if (passError) {
        setError(passError);
        return;
      }
  
      const response = await login(admin);      
  
      if (response?.status == 201) {
        toast.success("logged in successfully");        
        dispatch(
          addAdmin({
            _id: response?.data.admin._id,
            email: response?.data.admin.email,
            name: response?.data.admin.name,
          })
        );        
        localStorage.setItem("adminAccessToken", response.data.adminAccessToken);
        navigate("/admin");
      }
    } catch (error) {
      errorHandler(error);
    }

  };

  return (
    <Box
      sx={{
        my: 5,
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "100%",
          md: "900px",
          lg: "1160px",
          xl: "1140px",
        },
        mx: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: { xs: "100%", sm: "80%", md: "50%" } }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Admin Login
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
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
              onClick={(e) => onLogin(e) }
            >
              Login
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Button color="primary" variant="text" size="small">
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLoginPage;
