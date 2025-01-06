import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
} from '@mui/material';

const RoundCategories = (body: any) => {
  console.log(body.props.image);
  return (
    // <Card>
    //   <CardMedia
    //     component="img"
    //     image="src/assets/heroimage2.avif"
    //     alt="Category Image"
    //     sx={{ width: 150, height: 150, borderRadius: "50%", margin: "0 auto" }}
    //   ></CardMedia>
    //   <CardContent>
    //     <Typography gutterBottom variant="h5" component="div">
    //       {" "}
    //       Endodontics
    //     </Typography>
    //   </CardContent>
    //   <CardActions>
    //     <Button variant="outlined" size="small" color="secondary">
    //       Consult now
    //     </Button>
    //   </CardActions>
    // </Card>

    <Card sx={{ maxWidth: 200, textAlign: 'center', boxShadow: 'none', my: 2 }}>
      <CardMedia
        component="img"
        image={body.props.image}
        alt={body.props.title}
        sx={{ width: 150, height: 150, borderRadius: '50%', margin: '0 auto' }}
      />
      <CardContent sx={{ padding: '5px 0 0 0' }}>
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
    </Card>
  );
};

export default RoundCategories;
