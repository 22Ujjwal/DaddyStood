import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  ButtonGroup,
  CircularProgress,
  Snackbar,
  makeStyles 
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useAuth } from '../../contexts/AuthContext';
import { executeOrder } from '../../services/tradingService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  orderButton: {
    marginTop: theme.spacing(2),
  },
  priceInfo: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

function TradingPanel({ symbol, currentPrice }) {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const order = {
        type: orderType,
        symbol,
        quantity: parseFloat(quantity),
      };

      const result = await executeOrder(currentUser.uid, order);
      setSuccess(`Order executed successfully! New balance: $${result.newBalance.toFixed(2)}`);
      setQuantity('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const estimatedCost = quantity ? (currentPrice * parseFloat(quantity)).toFixed(2) : '0.00';

  return (
    <Paper className={classes.root}>
      <ButtonGroup fullWidth variant="outlined">
        <Button
          color={orderType === 'buy' ? 'primary' : 'default'}
          variant={orderType === 'buy' ? 'contained' : 'outlined'}
          onClick={() => setOrderType('buy')}
        >
          Buy
        </Button>
        <Button
          color={orderType === 'sell' ? 'primary' : 'default'}
          variant={orderType === 'sell' ? 'contained' : 'outlined'}
          onClick={() => setOrderType('sell')}
        >
          Sell
        </Button>
      </ButtonGroup>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="normal"
          required
          inputProps={{ min: 0, step: 0.01 }}
        />

        <div className={classes.priceInfo}>
          <Typography variant="body2" color="textSecondary">
            Market Price: ${currentPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Estimated {orderType === 'buy' ? 'Cost' : 'Credit'}: ${estimatedCost}
          </Typography>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={classes.orderButton}
          disabled={loading || !quantity}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            `${orderType === 'buy' ? 'Buy' : 'Sell'} ${symbol}`
          )}
        </Button>
      </form>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default TradingPanel; 