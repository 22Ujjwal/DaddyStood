import React, { useState } from 'react';
import { 
  Paper, 
  Grid, 
  Typography, 
  ButtonGroup, 
  Button, 
  TextField,
  Box,
  Tabs,
  Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StockChart from './StockChart';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  price: {
    fontSize: '32px',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  change: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  orderCard: {
    padding: theme.spacing(3),
    position: 'sticky',
    top: theme.spacing(2),
  },
  tabs: {
    marginBottom: theme.spacing(3),
  },
  statsGrid: {
    '& > div': {
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
}));

function AssetDetail({ symbol = 'AAPL', type = 'stock' }) {
  const classes = useStyles();
  const [timeFrame, setTimeFrame] = useState('1D');
  const [orderType, setOrderType] = useState('buy');
  const [shares, setShares] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const isPositive = true; // This would come from your data
  const currentPrice = 150.23;
  const priceChange = '+2.34';
  const percentChange = '+1.58%';

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <div className={classes.header}>
            <Typography variant="h5">{symbol}</Typography>
            <Typography className={classes.price}>
              ${currentPrice.toFixed(2)}
            </Typography>
            <div className={`${classes.change} ${isPositive ? 'price-up' : 'price-down'}`}>
              {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              <Typography>
                {priceChange} ({percentChange})
              </Typography>
            </div>
          </div>

          <StockChart symbol={symbol} type={type} />

          <Box mt={4}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              className={classes.tabs}
            >
              <Tab label="About" />
              <Tab label="News" />
              <Tab label="Statistics" />
            </Tabs>

            {tabValue === 0 && (
              <Typography color="textSecondary">
                Apple Inc. designs, manufactures, and markets smartphones, personal computers,
                tablets, wearables, and accessories worldwide.
              </Typography>
            )}

            {tabValue === 2 && (
              <Grid container className={classes.statsGrid}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Market Cap</Typography>
                  <Typography>$2.53T</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">P/E Ratio</Typography>
                  <Typography>28.93</Typography>
                </Grid>
                {/* Add more statistics */}
              </Grid>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.orderCard}>
            <ButtonGroup fullWidth variant="outlined" style={{ marginBottom: 16 }}>
              <Button
                onClick={() => setOrderType('buy')}
                variant={orderType === 'buy' ? 'contained' : 'outlined'}
                color={orderType === 'buy' ? 'primary' : 'default'}
              >
                Buy
              </Button>
              <Button
                onClick={() => setOrderType('sell')}
                variant={orderType === 'sell' ? 'contained' : 'outlined'}
                color={orderType === 'sell' ? 'primary' : 'default'}
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

            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Market Price: ${currentPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Estimated Cost: ${(shares * currentPrice).toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 24 }}
            >
              {orderType === 'buy' ? 'Buy' : 'Sell'} {symbol}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default AssetDetail; 