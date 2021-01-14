import axios from 'axios';
const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

export const initializeFacebookSDK = () => {
    return new Promise(resolve => {
      
        // wait for facebook sdk to initialize before starting the react app
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v8.0'
            });
            console.log("Successfully initialized Facebook SDK.");

            // let the app handle what happens after login
            // the app will hang if this is not resolved properly.
            window.FB.getLoginStatus(({ authResponse }) =>  resolve(authResponse));
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));    
    });
}

export const authenticate = async (accessToken) => {
    
    const response = await axios.get(`https://graph.facebook.com/v8.0/me?access_token=${accessToken}&fields=id,name,email,picture.width(640).height(640)`);
    return response;
    
}

