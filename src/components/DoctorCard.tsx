import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

const DoctorCard = (body: any) => {
  return (
    <Card sx={{ maxWidth: 300, textAlign: 'center', my: 2, mx: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1,
        }}
      >
        <CardMedia
          component="img"
          image={body.props.image}
          alt={body.props.title}
          sx={{
            width: 125,
            height: 125,
            borderRadius: '50%',
            margin: '0 auto',
            padding: 1,
          }}
        />
        <CardContent sx={{ padding: '5px 2px 2px 0' }}>
          <Typography variant="subtitle1" component="div" color="secondary">
            {body.props.title}
          </Typography>
          <Button
            variant="text"
            color="secondary"
            size="small"
            sx={{ fontSize: '12px' }}
          >
            {body.props.linkText}
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default DoctorCard;
