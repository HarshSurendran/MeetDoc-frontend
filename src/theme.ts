import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const primaryColor = '#FFFFFF';
const secondaryColor = '#004ba0';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: grey[50],
      paper: '#FFFFFF',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: grey[900],
      paper: grey[800],
    },
    text: {
      primary: '#ffffff',
      secondary: grey[500],
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#ffffff',
    },
  },
});

export { lightTheme, darkTheme };
