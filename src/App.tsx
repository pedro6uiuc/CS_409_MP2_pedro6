import React from 'react';
import logo from './icono.png';
import './App.css';
import {useEffect, useState, useRef } from 'react';
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

//Search Component
function Search (){
  const [monsterList, setMonsterList] = useState([]);
  const [nextPage, setNextPage] = useState("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
  const [displayList, setDisplayList] = useState(<h1>Loading...</h1>);
  const [filterText, setFilterText] = useState('');
  const [order, setOrder] = useState(true); //if order === true ascending else descending.
  const [sort, setSort] = useState(true); //if sort === true use names, else use Challenge Rating.
  const first_render = useRef(true);
  //Chaching the API 
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
    }
  //Adding the disable-next-line because it doesn't need to run when monsterList is changed, this could affect the rendering of the list.

  // eslint-disable-next-line
  }, [nextPage]);
  //Rendering the list 
  useEffect(() =>{
    if (first_render.current === true){
      first_render.current = false;
    }else{
       setDisplayList(<SearchTable monsters = {monsterList} filterText= {filterText} order = {order} sort = {sort}/>);
    }
       
  },[monsterList,filterText, order, sort] )

    return (<>
    <h1>SEARCH</h1>
    <SearchBar filterText = {filterText} onFilterTextChange = {setFilterText} 
    order = {order} onOrderChange = {setOrder}
    onSortChange ={setSort}/>
    <div className='SearchTable'>
    {displayList}
    </div>
    </>
    )
}
function SearchTable({monsters, filterText, order, sort}:any){
  const [filteredMonsters, setFilterMonsters] = useState([]);
  useEffect(()=>{
    const sortedMonsters = monsters;
    if (sort === true){
      if (order === true){
        sortedMonsters.sort((a:any, b:any) => a.slug.localeCompare(b.slug));
    }else{
        sortedMonsters.sort((a:any, b:any) => -a.slug.localeCompare(b.slug));
    }
    }else{if (order === true){
        sortedMonsters.sort((a:any, b:any) =>a.cr - b.cr);
      }else{
        sortedMonsters.sort((a:any, b:any) =>b.cr - a.cr);
      }
    }
    

    const temp:any = [];
    sortedMonsters.forEach((monster:any) => {
    if (monster.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1){
        return;
      }
    else{
        temp.push(<SearchRow slug = {monster.slug} name = {monster.name} challenge_rating = {monster.cr}/>);
    }
  });
  setFilterMonsters(temp);
  }, [filterText, monsters, order, sort]);
  return(
    <ul>
      {filteredMonsters}
    </ul>
  )
}


function SearchBar({filterText,onFilterTextChange, order, onOrderChange, onSortChange}:any){
  const [openSelector, setOpenSelector] = useState(false);
  return(<>
    <form className='searchBar'>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
        <div className='orderSearchBar'>
          <label htmlFor='ascending'>Ascending</label>
          <input type='radio' id="ascending" name="order" value="ascending" checked = {true === order} onChange={() => onOrderChange(true)}/>
          <label htmlFor='descending'>Descending</label>
          <input type='radio' id="descending" name="order" value="descending"checked = {false === order} onChange={() => onOrderChange(false)}/>
        </div>
    </form> 
    <div className="dropdown">
      <button onClick={() => setOpenSelector(true)}>Sort by</button>
            {openSelector ? (
        <ul className="menu">
          <li className="menu-item">
            <button onClick={() => {setOpenSelector(false);
                                    onSortChange(true)
            }
            }>Names</button>
          </li>
          <li className="menu-item">
            <button onClick={() => {setOpenSelector(false);
                                    onSortChange(false);
            }
            }>Challenge rating</button>
          </li>
        </ul>
      ) : null}
    </div>
    </>
  );
}
function SearchRow({slug, name, challenge_rating}:any){
  return <li key={slug} className='searchRow'><p>{name}</p> <p>Cr:{challenge_rating}</p></li>;

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
