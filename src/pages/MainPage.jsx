import React, { useState } from 'react';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBJsFr2HwilL6gTU5cGjy05HapRqJFEfmw",
  authDomain: "menowebapp-a3641.firebaseapp.com",
  databaseURL: "https://menowebapp-a3641.firebaseio.com",
  projectId: "menowebapp-a3641",
  storageBucket: "menowebapp-a3641.appspot.com",
  messagingSenderId: "270656766987",
  appId: "1:270656766987:web:ccf4c64a54b700308a730e",
  measurementId: "G-JY8R9HMHZ8"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const MainPage = () => {
  const [user, setUser] = useState(null);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setUser(user);
    }
  });

  const authenticationClick = () => {
    if (user) {
      firebase.auth().signOut().then(function() {
        setUser(null);
      }).catch(function(error) {
        console.error(error);
      });
    } else {
      const authProvider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(authProvider);
    }
  }

  return (
    <div>
      {user == null ? (
        <p>Please log in.</p>
      ) : (
        <p>Hello! <span style={{ color: 'pink'}}>{user.displayName}</span>!!!~</p>
      )}
      <button onClick={authenticationClick}>
        {user == null ? ('login') : ('logout')}
      </button>
    </div>
  )
};
