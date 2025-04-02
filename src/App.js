import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Trading from './components/Trading/Trading';
import Portfolio from './components/Dashboard/Portfolio';
import Navbar from './components/Common/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/trading/:symbol" component={Trading} />
            <PrivateRoute exact path="/portfolio" component={Portfolio} />
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 