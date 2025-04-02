import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { 
  Box, 
  ButtonGroup, 
  Button, 
  Typography,
  CircularProgress,
  makeStyles 
} from '@material-ui/core';
import { API_CONFIG } from '../../utils/api-config';
import { fetchHistoricalData } from '../../services/marketData';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
  },
  chartContainer: {
    height: '400px',
    position: 'relative',
  },
  timeButtons: {
    marginBottom: theme.spacing(2),
    '& .MuiButton-root': {
      minWidth: '60px',
      fontWeight: 500,
    },
  },
  priceInfo: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 2,
  }
}));

const TIME_INTERVALS = {
  '1H': { function: 'TIME_SERIES_INTRADAY', interval: '1min' },
  '1D': { function: 'TIME_SERIES_INTRADAY', interval: '5min' },
  '1W': { function: 'TIME_SERIES_DAILY', interval: 'Daily' },
  '1M': { function: 'TIME_SERIES_DAILY', interval: 'Daily' },
  '1Y': { function: 'TIME_SERIES_WEEKLY', interval: 'Weekly' }
};

function StockChart({ symbol, type = 'stock' }) {
  const classes = useStyles();
  const chartContainerRef = useRef();
  const [timeFrame, setTimeFrame] = useState('1D');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState({ current: 0, change: 0, changePercent: 0 });

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const interval = TIME_INTERVALS[timeFrame];
      const data = await fetchHistoricalData(symbol, timeFrame);
      
      if (data.length > 0) {
        setPriceData({
          current: data[data.length - 1].value,
          change: data[data.length - 1].value - data[data.length - 2].value,
          changePercent: ((data[data.length - 1].value - data[data.length - 2].value) / data[data.length - 2].value) * 100,
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const initChart = async () => {
      try {
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { color: '#ffffff' },
            textColor: '#333333',
          },
          grid: {
            vertLines: { color: '#f0f3fa' },
            horzLines: { color: '#f0f3fa' },
          },
          width: chartContainerRef.current.clientWidth,
          height: 400,
        });

        const areaSeries = chart.addAreaSeries({
          lineColor: '#00C805',
          topColor: 'rgba(0, 200, 5, 0.2)',
          bottomColor: 'rgba(0, 200, 5, 0.0)',
          lineWidth: 2,
        });

        const data = await fetchStockData();
        if (data.length > 0) {
          areaSeries.setData(data);
        }

        chart.timeScale().fitContent();

        const handleResize = () => {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        };

        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
        };
      } catch (err) {
        console.error('Error initializing chart:', err);
        setError(err.message);
      }
    };

    initChart();
  }, [symbol, timeFrame]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <ButtonGroup className={classes.timeButtons} variant="outlined">
        {Object.keys(TIME_INTERVALS).map((interval) => (
          <Button
            key={interval}
            onClick={() => setTimeFrame(interval)}
            variant={timeFrame === interval ? 'contained' : 'outlined'}
            color={timeFrame === interval ? 'primary' : 'default'}
          >
            {interval}
          </Button>
        ))}
      </ButtonGroup>

      <div className={classes.chartContainer}>
        {priceData.current > 0 && (
          <div className={classes.priceInfo}>
            <Typography variant="h4">
              ${priceData.current.toFixed(2)}
            </Typography>
            <Typography 
              className={priceData.change >= 0 ? 'price-up' : 'price-down'}
            >
              {priceData.change >= 0 ? '+' : ''}{priceData.change.toFixed(2)} 
              ({priceData.change >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%)
            </Typography>
          </div>
        )}
        <div ref={chartContainerRef} />
      </div>
    </div>
  );
}

export default StockChart; 