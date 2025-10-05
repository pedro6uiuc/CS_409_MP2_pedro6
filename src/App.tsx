import React from 'react';
import logo from './icono.png';
import './App.css';
import {useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";
import axios from 'axios';
//Personalized instance of axios, with base url and throttle to avoid API rate limits.


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
            <Route path='/'></Route>
            <Route path= "/search" element = {<Search/>}/>
            <Route path='/galery' element = {<Galery/>}/>
          </Routes>
    </BrowserRouter>
    </div>
    </div>

  );
}


function Search ({listOfMonsters}:any){
  const [monsterList, setMonsterList]:any = useState([]);
  const [nextPage, setNextPage]:any = useState("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
  const [displayList, setDisplayList]:any = useState(<h1>Loading...</h1>);
  
  useEffect(() => {
    if (nextPage){
          axios
    .get(nextPage)
    .then((page) => {

      const monsters = monsterList.concat(page.data.results);
      setMonsterList(monsters);
      setNextPage(page.data.next);
    })
    .catch(error => console.log(error))
    }else{
    const renderedList = monsterList.map((monster:any) => {
          return <li key={monster.slug}>{monster.name} Cr:{monster.cr}</li>;});
      setDisplayList(<ul>
      {renderedList}
    </ul>);
    }
  //Adding the disable-next-line because it doesn't need to run when monsterList is changed, this could affect the rendering of the list.

  // eslint-disable-next-line
  }, [nextPage]);


    return (<>
    <h1>SEARCH</h1>
      {displayList}
    </>
    )
}


function Galery (){
    const [monsterList, setMonsterList]:any = useState([]);
  const [nextPage, setNextPage]:any = useState("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
  const [displayList, setDisplayList]:any = useState(<h1>Loading...</h1>);
  
  useEffect(() => {
    if (nextPage){
          axios
    .get(nextPage)
    .then((page) => {
      const monsters = monsterList.concat(page.data.results);
      console.log(monsterList);
      console.log(page.data.results);
      setMonsterList(monsters);
      setNextPage(page.data.next);
    })
    .catch(error => console.log(error))
    }else{
    console.log("End");
    console.log(monsterList);
    const renderedList = monsterList.map((monster:any) => {
          return <img src ={monster.img_main} alt = {monster.name}/>;});
      setDisplayList(renderedList);
    }
  //Adding the disable-next-line because it doesn't need to run when monsterList is changed, this could affect the rendering of the list.

  // eslint-disable-next-line
  }, [nextPage]);
  return (<>
  <h1>GALERY</h1>
  <div>
    {displayList}
  </div>
  </>)
  
}
export default App;
