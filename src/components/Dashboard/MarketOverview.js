import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { fetchAllTopStocks, fetchTopCryptos } from '../../services/marketData';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  marketCard: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

function MarketOverview() {
  const classes = useStyles();
  const [marketData, setMarketData] = useState({ stocks: [], crypto: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stocks, crypto] = await Promise.all([
          fetchAllTopStocks(),
          fetchTopCryptos()
        ]);
        setMarketData({ stocks, crypto });
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Paper className={classes.paper}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" gutterBottom>Market Overview</Typography>
      <Grid container spacing={3}>
        {marketData.stocks.slice(0, 4).map((stock) => (
          <Grid item xs={12} sm={6} md={3} key={stock.symbol}>
            <Paper className={classes.marketCard} variant="outlined">
              <Typography variant="h6">{stock.symbol}</Typography>
              <Typography variant="h5">${stock.price.toFixed(2)}</Typography>
              <Box className={stock.change >= 0 ? 'price-up' : 'price-down'}>
                {stock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                <Typography>
                  {stock.changePercent.toFixed(2)}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default MarketOverview; 