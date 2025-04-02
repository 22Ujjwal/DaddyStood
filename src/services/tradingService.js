import { firestore } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { fetchStockData } from './marketData';

export const executeOrder = async (userId, order) => {
  try {
    // Get user's current portfolio
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    // Get current market price
    const stockData = await fetchStockData(order.symbol);
    const currentPrice = stockData.price;
    
    const orderCost = currentPrice * order.quantity;
    const currentBalance = userData.balance || 0;
    const currentHoldings = userData.holdings || {};
    
    // Validate order
    if (order.type === 'buy') {
      if (orderCost > currentBalance) {
        throw new Error('Insufficient funds');
      }
    } else if (order.type === 'sell') {
      const currentQuantity = currentHoldings[order.symbol]?.quantity || 0;
      if (order.quantity > currentQuantity) {
        throw new Error('Insufficient shares');
      }
    }
    
    // Execute order
    const newBalance = order.type === 'buy' 
      ? currentBalance - orderCost 
      : currentBalance + orderCost;
    
    // Update holdings
    const currentPosition = currentHoldings[order.symbol] || { quantity: 0, averagePrice: 0 };
    let newHoldings = { ...currentHoldings };
    
    if (order.type === 'buy') {
      const totalCost = (currentPosition.quantity * currentPosition.averagePrice) + orderCost;
      const totalQuantity = currentPosition.quantity + order.quantity;
      newHoldings[order.symbol] = {
        quantity: totalQuantity,
        averagePrice: totalCost / totalQuantity,
      };
    } else {
      const remainingQuantity = currentPosition.quantity - order.quantity;
      if (remainingQuantity > 0) {
        newHoldings[order.symbol] = {
          quantity: remainingQuantity,
          averagePrice: currentPosition.averagePrice,
        };
      } else {
        delete newHoldings[order.symbol];
      }
    }
    
    // Record transaction
    const transaction = {
      userId,
      symbol: order.symbol,
      type: order.type,
      quantity: order.quantity,
      price: currentPrice,
      total: orderCost,
      timestamp: Date.now(),
    };
    
    await addDoc(collection(firestore, 'transactions'), transaction);
    
    // Update user portfolio
    await updateDoc(userRef, {
      balance: newBalance,
      holdings: newHoldings,
    });
    
    return {
      success: true,
      transaction,
      newBalance,
      newHoldings,
    };
  } catch (error) {
    console.error('Order execution failed:', error);
    throw error;
  }
};

export const getPortfolioValue = async (holdings) => {
  try {
    let totalValue = 0;
    for (const [symbol, position] of Object.entries(holdings)) {
      const stockData = await fetchStockData(symbol);
      totalValue += stockData.price * position.quantity;
    }
    return totalValue;
  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    throw error;
  }
};

export const getPortfolioPerformance = async (userId) => {
  try {
    const transactionsRef = collection(firestore, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    let performance = {
      totalInvested: 0,
      totalReturned: 0,
      realizedGains: 0,
      unrealizedGains: 0,
    };
    
    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      if (transaction.type === 'buy') {
        performance.totalInvested += transaction.total;
      } else {
        performance.totalReturned += transaction.total;
      }
    });
    
    performance.realizedGains = performance.totalReturned - performance.totalInvested;
    
    return performance;
  } catch (error) {
    console.error('Error calculating performance:', error);
    throw error;
  }
}; 