import './App.css';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import { Switch,Route } from 'react-router-dom';
import Error from './components/Error';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Cookies from "universal-cookie";

function App() {
  const [userData, setUserData] = useState('');
  const cookie = new Cookies();

  const logoutUser = ()=>{
    localStorage.clear();
    cookie.remove('token');
    setUserData('');
  }



  return (
    <>
      <Navbar userData= {userData} logoutUser= {logoutUser}/>
      <Switch>
        <Route exact path='/'>
          <Home userData= {userData} />
        </Route>

        <Route path='/login'>
          <Login setUserData= {setUserData}/>
        </Route>

        <Route path='/signUp'>
          <SignUp />
        </Route>

        <Route path='/about'>
          <About />
        </Route>

        <Route >
          <Error />
        </Route>
      </Switch>
      <ToastContainer />
    </>
  );
}

export default App;
