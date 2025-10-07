import React from 'react';
import './App.css';
import {useEffect, useState, useRef } from 'react';
import {
  Routes,
  Route,
  Link,
  BrowserRouter,
  useParams
} from "react-router-dom";
import axios from 'axios';
//Images used in the app
import logo from './icono.png';
import aberration from './aberration.svg';
import beast from './beast.svg';
import celestial from './celestial.svg';
import construct from './construct.svg';
import dragon from './dragon.svg';
import elemental from './elemental.svg';
import fae from './fae.svg';
import fiend from './fiend.svg';
import giant from './giant.svg';
import humanoid from './humanoid.svg';
import monstrosity from './monstrosity.svg';
import ooze from './ooze.svg';
import plant from './plant.svg';
import undead from './undead.svg';

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
            <Route path='/:monsterName' element = {<DetailedMonster/>}/>
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
  const [filter,setFilter] = useState("all");

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
  useEffect (()=>{
    const monsterTypes = [
        {"type": "aberration", "file": aberration},
        {"type": "beast", "file": beast},
        {"type": "celestial", "file": celestial},
        {"type": "construct", "file": construct},
        {"type": "dragon", "file": dragon},
        {"type": "elemental", "file": elemental},
        {"type": "fae", "file":fae},
        {"type": "fiend", "file":fiend},
        {"type": "giant", "file": giant},
        {"type": "humanoid", "file": humanoid},
        {"type": "monstrosity", "file": monstrosity},
        {"type": "plant", "file": plant},
        {"type": "ooze", "file": ooze},
        {"type":"undead", "file":undead}
      ];
    // eslint-disable-next-line
    const renderedList = monsterList.map((monster:any) => {
      if (filter === "all"){
        if (monster.img_main === null){
        const lowerCaseMonsterType = monster.type.toLowerCase();
      //Not using for each to end execution when desired result is achived
      for (let i = 0; i < monsterTypes.length; i++){
        if (monsterTypes[i].type === lowerCaseMonsterType){
          console.log("Hey");
          return (<div className='monsterImagediv'>
                <img className='monsterImageimg' src ={monsterTypes[i].file} alt={monster.name}/>
                <p>{monster.name}</p>
              </div>)
        }
      }
      }else{
      return (<div className='monsterImagediv'>
            <img className='monsterImageimg' src ={monster.img_main} alt = {monster.name}/>
          </div>)
      }
      }else{
        if (monster.type.toLowerCase() === filter){
          if (monster.img_main === null){
            const lowerCaseMonsterType = monster.type.toLowerCase();
      //Not using for each to end execution when desired result is achived
            for (let i = 0; i < monsterTypes.length; i++){
              if (monsterTypes[i].type === lowerCaseMonsterType){
                console.log("Hey");
                return (<div className='monsterImagediv'>
                      <img className='monsterImageimg' src ={monsterTypes[i].file} alt={monster.name}/>
                      <p>{monster.name}</p>
                    </div>)
              }
            }
            }else{
            return (<div className='monsterImagediv'>
                  <img className='monsterImageimg' src ={monster.img_main} alt={monster.name}/>
                </div>)
            }
        }
      }
          });
      setDisplayList(renderedList);
  }, [filter,monsterList]);
  return (<div className='Galery'>
  <h1>GALERY</h1>
  <GaleryFilter filter = {filter} onChangeFilter = {setFilter}/>
  <div className='galeryDisplay'>
    {displayList}
  </div>
  </div>)
  
}

function GaleryFilter({filter, onChangeFilter}:any){
  return(<div className='galeryFilter'>
    <form>
    <input type= "radio" id = "all" name= "filter" value= "all" checked = {filter === "all"} onChange={() => onChangeFilter("all")}/>
    <label htmlFor = "all">All</label>
    <input type= "radio" id = "aberration" name= "filter" value= "aberration"checked = {filter === "aberration"} onChange={() => onChangeFilter("aberration")}/>
    <label htmlFor = "aberration">Aberration</label>
    <input type= "radio" id = "beast" name= "filter" value= "beast"checked = {filter === "beast"} onChange={() => onChangeFilter("beast")}/>
    <label htmlFor = "beast">Beast</label>
    <input type= "radio" id = "celestial" name= "filter" value= "celestial" checked = {filter === "celestial"} onChange={() => onChangeFilter("celestial")}/>
    <label htmlFor = "celestial">Celestial</label>
    <input type= "radio" id = "construct" name= "filter" value= "construct" checked = {filter === "construct"} onChange={() => onChangeFilter("construct")}/>
    <label htmlFor = "construct">Construct</label>
    <input type= "radio" id = "dragon" name= "filter" value= "dragon"checked = {filter === "dragon"} onChange={() => onChangeFilter("dragon")}/>
    <label htmlFor = "dragon">Dragon</label>
    <input type= "radio" id = "elemental" name= "filter" value= "elemental"checked = {filter === "elemental"} onChange={() => onChangeFilter("elemental")}/>
    <label htmlFor = "elemental">Elemental</label>
    <input type= "radio" id = "fae" name= "filter" value= "fae" checked = {filter === "fae"} onChange={() => onChangeFilter("fae")}/>
    <label htmlFor = "fae">Fae</label>
    <input type= "radio" id = "fiend" name= "filter" value= "fiend" checked = {filter === "fiend"} onChange={() => onChangeFilter("fiend")}/>
    <label htmlFor = "fiend">Fiend</label>
    <input type= "radio" id = "giant" name= "filter" value= "giant" checked = {filter === "giant"} onChange={() => onChangeFilter("giant")}/>
    <label htmlFor = "giant">Giant</label>
    <input type= "radio" id = "humanoid" name= "filter" value= "humanoid" checked = {filter === "humanoid"} onChange={() => onChangeFilter("humanoid")}/>
    <label htmlFor = "humanoid">Humanoid</label>
    <input type= "radio" id = "monstrosity" name= "filter" value= "monstrosity" checked = {filter === "monstrosity"} onChange={() => onChangeFilter("monstrosity")}/>
    <label htmlFor = "monstrosity">Monstrosity</label>
    <input type= "radio" id = "ooze" name= "filter" value= "ooze" checked = {filter === "ooze"} onChange={() => onChangeFilter("ooze")}/>
    <label htmlFor = "ooze">Ooze</label>
    <input type= "radio" id = "plant" name= "filter" value= "plant" checked = {filter === "plant"} onChange={() => onChangeFilter("plant")}/>
    <label htmlFor = "plant">Plant</label>
    <input type= "radio" id = "undead" name= "filter" value= "undead" checked = {filter === "undead"} onChange={() => onChangeFilter("undead")}/>
    <label htmlFor = "undead">Undead</label>

  </form>
  </div>)
}

function DetailedMonster(){
    const {monsterName} = useParams();
    return <h1>{monsterName}</h1>
}
export default App;
