import React, { useState } from 'react';
import * as firebase from 'firebase';
import { useEffect } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyBJsFr2HwilL6gTU5cGjy05HapRqJFEfmw",
  authDomain: "menowebapp-a3641.firebaseapp.com",
  databaseURL: "https://menowebapp-a3641.firebaseio.com",
  projectId: "menowebapp-a3641",
  storageBucket: "menowebapp-a3641.appspot.com",
  messagingSenderId: "270656766987",
  appId: "1:270656766987:web:ccf4c64a54b700308a730e",
  measurementId: "G-JY8R9HMHZ8",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const MainPage = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [memo, setMemo] = useState('');
  
  useEffect(() => {
    const database = firebase.database();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        database.ref('users/' + user.uid + '/info/').set({
          username: user.displayName,
          email: user.email,
        });
        database.ref('users/' + user.uid + '/info/').once('value').then(function(snapshot) {
          const displayName = (snapshot.val() && snapshot.val().username) || '??';
          setDisplayName(displayName);
        });
        database.ref('users/' + user.uid).once('value').then(function(snapshot) {
          const dbMemo = (snapshot.val() && snapshot.val().memo) || '';
          setMemo(dbMemo);
        });
      } else {
        setDisplayName('');
        setMemo('');
      }
    });
  }, []);
  

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

  const memoChange = e => {
    setMemo(e.target.value);
  }

  const saveMenoClick = () => {
    const database = firebase.database();
    database.ref('users/' + user.uid).update({
      memo: memo,
    });
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
      <div>
        사용자 이름 : {displayName}
      </div>
      <div>
        사용자 메일 : {user && user.email}
      </div>
      <div style={{ display: 'flex'}}>
        <input type='text' value={memo} onChange={memoChange} placeholder='메모 입력' />
        <button onClick={saveMenoClick} disabled={user == null}>
          save
        </button>
        <div style={{ color: 'red' }}>{'<--- 여긴 DB 연동'}</div>
      </div>
    </div>
  )
};
