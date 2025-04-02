import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'white',
    color: 'black',
    boxShadow: 'none',
    borderBottom: '1px solid var(--robinhood-border)',
  },
  toolbar: {
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
  },
  logo: {
    fontWeight: 700,
    color: 'black',
    textDecoration: 'none',
    '&:hover': {
      color: 'var(--robinhood-green)',
    },
  },
  navButton: {
    textTransform: 'none',
    marginRight: theme.spacing(3),
    fontWeight: 500,
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'var(--robinhood-green)',
    },
  },
  grow: {
    flexGrow: 1,
  },
  iconButton: {
    marginLeft: theme.spacing(2),
  },
  authButton: {
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 20,
    padding: '6px 24px',
  },
}));

function Navbar() {
  const classes = useStyles();
  const { currentUser, logout } = useAuth();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          className={classes.logo}
        >
          DaddyStood
        </Typography>
        
        {currentUser && (
          <Box ml={4}>
            <Button className={classes.navButton} component={Link} to="/">
              Investing
            </Button>
            <Button className={classes.navButton} component={Link} to="/portfolio">
              Portfolio
            </Button>
            <Button className={classes.navButton}>
              Cash
            </Button>
            <Button className={classes.navButton}>
              Messages
            </Button>
          </Box>
        )}
        
        <div className={classes.grow} />
        
        {currentUser ? (
          <>
            <IconButton className={classes.iconButton}>
              <SearchIcon />
            </IconButton>
            <IconButton className={classes.iconButton} onClick={logout}>
              <AccountCircleIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button 
              className={classes.authButton}
              component={Link} 
              to="/login"
            >
              Log In
            </Button>
            <Button 
              variant="contained"
              color="primary"
              className={classes.authButton}
              component={Link} 
              to="/register"
              style={{ marginLeft: 16 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 