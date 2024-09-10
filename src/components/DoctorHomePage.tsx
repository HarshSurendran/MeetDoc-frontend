import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Tabs, Tab } from '@mui/material';
import { AccessTime, CalendarToday, Star } from '@mui/icons-material';

const DoctorHomePage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '240px', backgroundColor: '#AECBEF', py: 4, px: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
        <Typography sx={{ mb: 2 }}>Bookings</Typography>
        <Typography sx={{ mb: 2 }}>Revenue</Typography>
        <Typography sx={{ mb: 2 }}>Profile</Typography>
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <Typography>Settings</Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, backgroundColor: '#E0F2FF', px: 4, py: 2 }}>
        {/* Top Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
              Home
            </Typography>
            <Typography>Doctors</Typography>
            <Typography sx={{ mx: 2 }}>About</Typography>
            <Typography>Contact</Typography>
          </Box>
          <Typography>Welcome, Dr. Amritha K A</Typography>
        </Box>

        {/* Info Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1969C4', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6">Total Income</Typography>
                <Typography variant="h4">₹ 23,900</Typography>
                <AccessTime sx={{ fontSize: 40 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1C74DE', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6">Appointments</Typography>
                <Typography variant="h4">12</Typography>
                <CalendarToday sx={{ fontSize: 40 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1F87FF', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6">Rating</Typography>
                <Typography variant="h4">4</Typography>
                <Star sx={{ fontSize: 40 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointments Section */}
        <Card sx={{ backgroundColor: '#E0F7FF', p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Appointments
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left Arrow */}
            <Button variant="outlined">{"<"}</Button>

            {/* Tabs for Days */}
            <Tabs value={0} indicatorColor="primary" textColor="primary">
              <Tab label="Today" />
              <Tab label="Tomorrow" />
              <Tab label="Thu, 8 Aug" />
            </Tabs>

            {/* Right Arrow */}
            <Button variant="outlined">{">"}</Button>
          </Box>

          {/* Time Slots */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {['04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map((time, index) => (
              <Grid item key={index} xs={6} sm={3}>
                <Button variant="outlined" color={index % 2 === 0 ? "success" : "error"} sx={{ width: '100%' }}>
                  {time}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {['08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'].map((time, index) => (
              <Grid item key={index} xs={6} sm={3}>
                <Button variant="outlined" color={index % 2 === 0 ? "success" : "error"} sx={{ width: '100%' }}>
                  {time}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default DoctorHomePage;
