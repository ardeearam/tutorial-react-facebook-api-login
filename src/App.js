import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import { authenticate } from './FacebookSDK';

const App = () => { 
  const [fbId, setFbId]= useState();
  const [displayName, setDisplayName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  
  const processAuthResponse = async (authResponse) => {
      const { accessToken } = authResponse;
      const authenticateResponse = await authenticate(accessToken);
      const { data } = authenticateResponse;
      const { name, id, picture } = data;
     
      setFbId(id);
      setDisplayName(name);
      setImageUrl(picture.data.url);
      setLoggedIn(true);
    
  }
  
  const fbLogin = () => {
    (async () => {
      const { authResponse } = await new Promise(window.FB.login);
      await processAuthResponse(authResponse);
    })();
  };
  
  const fbLogout = () => {
    (async () => {
      await window.FB.logout();
      setLoggedIn(false);
    })();
  }
  
  useEffect(() => {
      // auto authenticate with the api if already logged in with facebook
      window.FB.getLoginStatus(({ authResponse }) => {
        (async () => {
            if (authResponse) {
                await processAuthResponse(authResponse);
            } else {
                setLoggedIn(false);
            }
            
        })();
      });
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        { loggedIn &&
          <div>
            <div className='fb-login-form'>
              <img className='fb-image' src={imageUrl} />
              <div>ID: {fbId || '-'} </div>
              <div>Display Name: {displayName || '-'} </div>
            </div>
            <button className="btn-facebook" onClick={fbLogout}>Logout</button>
          </div>
        }
        
        {!loggedIn &&
          <div>
            <button className="btn-facebook" onClick={fbLogin}>Login with Facebook</button>
          </div>
        }
        
      </header>
    </div>
  );
}

export default App;
