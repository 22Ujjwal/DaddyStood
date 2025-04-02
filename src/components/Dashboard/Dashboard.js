import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MarketOverview from './MarketOverview';
import WatchList from './WatchList';
import Portfolio from './Portfolio';
import StockChart from '../Trading/StockChart';
import PortfolioChart from './PortfolioChart';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
  },
  balance: {
    fontSize: '32px',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  timeButtons: {
    marginBottom: theme.spacing(3),
    '& .MuiButton-root': {
      textTransform: 'none',
      padding: '6px 16px',
    },
  },
}));

function Dashboard() {
  const classes = useStyles();
  const [balance] = useState(10000);
  const [timeFrame, setTimeFrame] = useState('1D');

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography className={classes.balance}>
              ${balance.toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" className="price-up">
              +$234.23 (+2.34%) Today
            </Typography>
            
            <Box mt={3}>
              <ButtonGroup className={classes.timeButtons}>
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((time) => (
                  <Button
                    key={time}
                    onClick={() => setTimeFrame(time)}
                    variant={timeFrame === time ? 'contained' : 'outlined'}
                    color={timeFrame === time ? 'primary' : 'default'}
                  >
                    {time}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
            
            <StockChart isPositive={true} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <WatchList />
        </Grid>
        
        <Grid item xs={12}>
          <PortfolioChart />
        </Grid>
        
        <Grid item xs={12}>
          <MarketOverview />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard; 