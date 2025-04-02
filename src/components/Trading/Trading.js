import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Paper, 
  Grid, 
  Typography, 
  Button, 
  TextField,
  ButtonGroup 
} from '@material-ui/core';
import StockChart from './StockChart';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  tradingPanel: {
    padding: theme.spacing(3),
    position: 'sticky',
    top: theme.spacing(2),
  },
  orderButton: {
    width: '100%',
    height: '48px',
    marginTop: theme.spacing(2),
    backgroundColor: '#00C805',
    '&:hover': {
      backgroundColor: '#00B805',
    },
  },
  timeButtons: {
    marginBottom: theme.spacing(2),
  }
}));

function Trading() {
  const classes = useStyles();
  const [timeFrame, setTimeFrame] = useState('1D');
  const [orderType, setOrderType] = useState('buy');
  const [shares, setShares] = useState('');

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4">AAPL</Typography>
          <Typography variant="h3">$150.23</Typography>
          <Typography variant="subtitle1" className="price-up">
            +$2.34 (1.58%) Today
          </Typography>
          
          <ButtonGroup className={classes.timeButtons}>
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((time) => (
              <Button 
                key={time}
                onClick={() => setTimeFrame(time)}
                variant={timeFrame === time ? 'contained' : 'outlined'}
              >
                {time}
              </Button>
            ))}
          </ButtonGroup>
          
          <StockChart isPositive={true} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className={classes.tradingPanel}>
            <ButtonGroup fullWidth>
              <Button 
                variant={orderType === 'buy' ? 'contained' : 'outlined'}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </Button>
              <Button 
                variant={orderType === 'sell' ? 'contained' : 'outlined'}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </Button>
            </ButtonGroup>
            
            <TextField
              fullWidth
              label="Shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              margin="normal"
            />
            
            <Typography variant="body2">
              Market Price: $150.23
            </Typography>
            <Typography variant="body2">
              Estimated Cost: ${(shares * 150.23).toFixed(2)}
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              className={classes.orderButton}
            >
              {orderType === 'buy' ? 'Buy' : 'Sell'} AAPL
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Trading; 