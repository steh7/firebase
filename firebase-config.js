    const firebaseConfig = {
    apiKey: "AIzaSyBJij1o4RPHu6uCuDWEl2y0cHcC6EV_6qc",
    authDomain: "fir-2tri.firebaseapp.com",
    projectId: "fir-2tri",
    storageBucket: "fir-2tri.appspot.com",
    messagingSenderId: "230974016764",
    appId: "1:230974016764:web:1c1e991d9812486a465b79",
    measurementId: "G-1YLEBRK5YG"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const storage = firebase.storage();
  