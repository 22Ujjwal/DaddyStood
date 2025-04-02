import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { 
  Box, 
  Typography,
  CircularProgress,
  makeStyles 
} from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import { firestore } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
  },
  chartContainer: {
    height: '300px',
    position: 'relative',
  },
  portfolioInfo: {
    marginBottom: theme.spacing(2),
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: 500,
  }
}));

function PortfolioChart() {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const chartContainerRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState({
    total: 0,
    change: 0,
    changePercent: 0
  });

  const fetchPortfolioHistory = async () => {
    try {
      setLoading(true);
      // Get user's portfolio transactions
      const transactionsRef = collection(firestore, 'transactions');
      const q = query(transactionsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      // Process transactions to create portfolio value history
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ ...doc.data(), id: doc.id });
      });

      // Sort transactions by date
      transactions.sort((a, b) => a.timestamp - b.timestamp);

      // Calculate daily portfolio values
      let portfolioValue = 10000; // Starting balance
      const portfolioHistory = [{
        time: transactions[0]?.timestamp || Date.now(),
        value: portfolioValue
      }];

      transactions.forEach(transaction => {
        if (transaction.type === 'buy') {
          portfolioValue -= transaction.price * transaction.quantity;
        } else {
          portfolioValue += transaction.price * transaction.quantity;
        }
        portfolioHistory.push({
          time: transaction.timestamp,
          value: portfolioValue
        });
      });

      return portfolioHistory;
    } catch (error) {
      console.error('Error fetching portfolio history:', error);
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
          height: 300,
        });

        const areaSeries = chart.addAreaSeries({
          lineColor: '#00C805',
          topColor: 'rgba(0, 200, 5, 0.2)',
          bottomColor: 'rgba(0, 200, 5, 0.0)',
          lineWidth: 2,
        });

        const data = await fetchPortfolioHistory();
        if (data.length > 0) {
          areaSeries.setData(data);
          
          const latest = data[data.length - 1];
          const previous = data[data.length - 2] || { value: 10000 };
          const change = latest.value - previous.value;
          setPortfolioValue({
            total: latest.value,
            change,
            changePercent: (change / previous.value) * 100,
          });
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
  }, [currentUser]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.portfolioInfo}>
        <Typography className={classes.totalValue}>
          Portfolio Value: ${portfolioValue.total.toFixed(2)}
        </Typography>
        <Typography 
          className={portfolioValue.change >= 0 ? 'price-up' : 'price-down'}
        >
          {portfolioValue.change >= 0 ? '+' : ''}{portfolioValue.change.toFixed(2)} 
          ({portfolioValue.change >= 0 ? '+' : ''}{portfolioValue.changePercent.toFixed(2)}%)
        </Typography>
      </div>
      <div className={classes.chartContainer}>
        <div ref={chartContainerRef} />
      </div>
    </div>
  );
}

export default PortfolioChart; 