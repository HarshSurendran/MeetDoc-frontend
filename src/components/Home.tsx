// src/components/Home.tsx

import React from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Header from './users/Header';

const Home: React.FC = () => {
  return (
      <Container maxWidth="lg">
          <Header/>
      {/* Hero Section */}
      {/* <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Save You time and <br />
          <Typography variant="h3" component="span" color="primary">
            Find doctor Online
          </Typography>
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }}>
          Connect Now
              </Button>
              
      </Box> */}
          <Box sx={{ py: 10 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side - Text */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Save You time and <br />
              <Typography variant="h3" component="span" color="primary">
                Find doctor Online
              </Typography>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4 }}
            >
              Connect Now
            </Button>
          </Box>
        </Grid>

        {/* Right Side - Image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src="src/assets/heroimage.jpg"
              alt="Doctor Consultation Illustration"
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>

      {/* Specialities Section */}
      {/* <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          25+ Specialities
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mb: 4 }}>
          See all Specialties
        </Button>
        <Grid container spacing={4} justifyContent="center">
          
          {['General Physician', 'Gynecology', 'Dermatology', 'Psychiatry'].map((specialty, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardMedia
                  component="img"
                  alt={specialty}
                  height="140"
                  image={`path/to/your/image${index}.jpg`}
                />
                <CardContent>
                  <Typography variant="h6">{specialty}</Typography>
                  <Button variant="text" color="primary">
                    Consult now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box> */}

<Box sx={{ py: 5 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        {/* Left: Typography */}
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            25+ Specialities
          </Typography>
        </Grid>
        {/* Right: Button */}
        <Grid item>
          <Button variant="outlined" color="primary">
            See all Specialties
          </Button>
        </Grid>
      </Grid>

      {/* Grid Section with Margin Top */}
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 0 }}>
        {['General Physician', 'Gynecology', 'Dermatology', 'Psychiatry'].map((specialty, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                alt={specialty}
                height="140"
                image={`path/to/your/image${index}.jpg`}
              />
              <CardContent>
                <Typography variant="h6">{specialty}</Typography>
                <Button variant="text" color="primary">
                  Consult now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>













      {/* Doctors Section */}
      <Box sx={{ py: 5 }}>
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
          Our Doctors
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 0 }}>
          {/* Replace with your actual doctor information */}
          {['Dr. Morgan', 'Dr. Austen', 'Dr. James'].map((doctor, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ textAlign: 'center' }}>
                <CardMedia
                  component="img"
                  alt={doctor}
                  height="140"
                  image={`path/to/doctor/image${index}.jpg`}
                />
                <CardContent>
                  <Typography variant="h6">{doctor}</Typography>
                  <Typography variant="body2">Specialty here</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          How it works
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 0 }}>
          {['Step 1', 'Step 2', 'Step 3'].map((step, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{step}</Typography>
                  <Typography variant="body2">Description of the step</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Section */}
      <Box sx={{ backgroundColor: 'primary.dark', color: 'white', py: 5 }}>
        <Grid container spacing={4} justifyContent="center">
          {['MeetDoc', 'For Patients', 'For Doctors', 'More'].map((footerTitle, index) => (
            <Grid item key={index} xs={12} sm={3}>
              <Typography variant="h6" gutterBottom>
                {footerTitle}
              </Typography>
              <Typography variant="body2">Links here</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
