import React from 'react';
import logo from './icono.png';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  RouteMatch,
  useParams,
  BrowserRouter
} from "react-router-dom";

function App() {
  return (<div className='App'>
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Dungeons and Dragons monster search tool
        </p>
        
      </header>
    <div className='content'>
    <BrowserRouter>
        
          <nav className='navbar' >
            <Link className='navbutton' to ="/search">Search</Link>
            <Link className='navbutton' to ="/galery">Galery</Link>
          </nav>
          <Routes>
            <Route path= "/search" element = {<Search />}/>
            <Route path='/galery' element = {<Galery/>}/>
          </Routes>
    </BrowserRouter>
    </div>
    </div>

  );
}
function Search (){
  return <h1>SEARCH</h1>;
}
function Galery (){
  return <h1>GALERY</h1>;
}

export default App;
