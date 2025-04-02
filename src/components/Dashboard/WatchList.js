import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Box,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { fetchAllTopStocks, fetchTopCryptos } from '../../services/marketData';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  symbol: {
    fontWeight: 500,
  },
  price: {
    textAlign: 'right',
  },
  change: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

function WatchList() {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  let isMounted = true;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = tab === 0 
          ? await fetchAllTopStocks()
          : await fetchTopCryptos();
        if (isMounted) {
          setAssets(data);
        }
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [tab]);

  return (
    <Paper className={classes.root}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Stocks" />
        <Tab label="Crypto" />
      </Tabs>

      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <List>
          {assets.map((asset) => (
            <ListItem 
              key={asset.symbol} 
              className={classes.listItem}
              button
              component={Link}
              to={`/trading/${asset.symbol}`}
            >
              <ListItemText
                primary={
                  <Typography className={classes.symbol}>
                    {asset.symbol}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <Box className={classes.price}>
                  <Typography>
                    ${asset.price.toFixed(2)}
                  </Typography>
                  <Typography 
                    className={`${classes.change} ${asset.change >= 0 ? 'price-up' : 'price-down'}`}
                    variant="body2"
                  >
                    {asset.change >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                    {asset.changePercent.toFixed(2)}%
                  </Typography>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default WatchList; 