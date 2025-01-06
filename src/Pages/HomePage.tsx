import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import UserHeaderPreLogin from '../components/users/UserHeaderPreLogin';
import UserHeader from '../components/users/UserHeader';
import RoundCategories from '../components/RoundCategories';
import FaqSection from '../components/users/FaqSection';
import DoctorCard from '../components/DoctorCard';
import Header from '../components/users/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/appStore';

const HomePage: React.FC = () => {
  const data = [
    {
      image: 'src/assets/heroimage2.avif',
      title: 'Endodontics',
      linkText: 'Consult docs',
    },
    {
      image: 'src/assets/heroimage2.avif',
      title: 'Endodontics',
      linkText: 'Consult docs',
    },
    {
      image: 'src/assets/heroimage2.avif',
      title: 'Endodontics',
      linkText: 'Consult docs',
    },
    {
      image: 'src/assets/heroimage2.avif',
      title: 'Endodontics',
      linkText: 'Consult docs',
    },
  ];

  const questions = [
    'How many doctors in banglore?',
    'Duration of the call?',
    'How many doctors in banglore?',
    'Duration of the call?',
    'How many doctors in banglore?',
    'Duration of the call?',
    'How many doctors in banglore?',
    'Duration of the call?',
  ];

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
      }}
    >
      <UserHeaderPreLogin />
      {/* <Header/> */}
      {/* Hero Image */}
      <Box sx={{ py: 10, mx: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'center' } }}>
              <Typography variant="h3" component="h1" gutterBottom>
                Save You time and <br />
                <Typography variant="h3" component="span" color="secondary">
                  Find doctor Online
                </Typography>
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 4 }}
              >
                Connect Now
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src="src/assets/heroimage.jpg"
                alt="Doctor Consultation Illustration"
                style={{ width: '100%', maxWidth: '600px' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* specificaition */}

      <Box mx={2}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" component="h2" gutterBottom>
              25+ Specialities
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary">
              See all Specialties
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          {data.map((body, index) => {
            return (
              <Grid
                item
                xs={6}
                sm={6}
                md={3}
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <RoundCategories props={body} />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Doctor list */}

      <Box mx={2} my={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" component="h2" gutterBottom>
              Our Doctors
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary">
              See all
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          {data.map((body, index) => {
            return (
              <Grid
                item
                xs={6}
                sm={6}
                md={3}
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <DoctorCard props={body} />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* FAQ section */}
      {questions.map((que, index) => {
        return <FaqSection key={index} prop={que} />;
      })}
    </Box>
  );
};

export default HomePage;
