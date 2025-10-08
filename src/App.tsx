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
            <Route path='/:monsterName' element = {<DetailedMonster/>}/>
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
  const [fetchMonsters, setFetchMonsters] = useState([])
  const [nextPage, setNextPage] = useState("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
  const [displayList, setDisplayList] = useState(<h1>Loading...</h1>);
  const [filterText, setFilterText] = useState('');
  const [order, setOrder] = useState(true); //if order === true ascending else descending.
  const [sort, setSort] = useState(true); //if sort === true use names, else use Challenge Rating.
  const first_render = useRef(true);
  //Chaching the API 
  useEffect(() => {
    //Used to improve the efficiency of the page once the data from the API has been fetched, it is updated every time is rendered.
    const localMonsters = sessionStorage.getItem("localMonsters");
    if (localMonsters != null){
      setMonsterList(JSON.parse(localMonsters));
    }
    if (nextPage){
          axios
    .get(nextPage)
    .then((page) => {
      const monsters = fetchMonsters.concat(page.data.results);
      setFetchMonsters(monsters);
      setNextPage(page.data.next);
    })
    .catch(error => console.log(error))
    }else{
      sessionStorage.setItem("localMonsters", JSON.stringify(fetchMonsters));
    }
  //Adding the disable-next-line because it doesn't need to run when monsterList is changed, this could affect the rendering of the list.

  // eslint-disable-next-line
  }, [nextPage]);
  //Rendering the list 
  useEffect(() =>{
    if (first_render.current === true){
      first_render.current = false;
    }else{
      if (fetchMonsters.length > monsterList.length){
        console.log("Hey");
        setMonsterList(fetchMonsters);
      }
       setDisplayList(<SearchTable monsters = {monsterList} filterText= {filterText} order = {order} sort = {sort}/>);
    }
       
  },[monsterList,filterText, order, sort, fetchMonsters] )

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
      <nav>
        <ul>
          {filteredMonsters}
        </ul>
      </nav>
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
  return <li key={slug} className='searchRow'><Link className='navbutton' to = {"/"+name}><p>{name}</p> <p>Cr:{challenge_rating}</p></Link></li>;

}
function Galery (){
  const [monsterList, setMonsterList]:any = useState([]);
  const [fetchMonsters, setFetchMonsters] = useState([]);
  const [nextPage, setNextPage]:any = useState("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
  const [displayList, setDisplayList]:any = useState(<h1>Loading...</h1>);
  const [filter,setFilter] = useState("all");


  useEffect(() => {
    const localMonsters = sessionStorage.getItem("localMonsters");
    if (localMonsters != null){
      setMonsterList(JSON.parse(localMonsters));
    }
    if (nextPage){
          axios
    .get(nextPage)
    .then((page) => {
      const monsters = fetchMonsters.concat(page.data.results);
      setFetchMonsters(monsters);
      setNextPage(page.data.next);
    })
    .catch(error => console.log(error))
    }else{
      sessionStorage.setItem("localMonsters", JSON.stringify(fetchMonsters));
    }

  //Adding the disable-next-line because it doesn't need to run when monsterList is changed, this could affect the rendering of the list.

  // eslint-disable-next-line
  }, [nextPage]);
  useEffect (()=>{

    if (fetchMonsters.length >monsterList.length){
      setMonsterList(fetchMonsters);
    }
    // eslint-disable-next-line
    const renderedList = monsterList.map((monster:any) => {
      if (filter === "all"){
        return <GaleryImage monster= {monster}/>;
      }else{
        if (monster.type.toLowerCase() === filter){
          return <GaleryImage monster = {monster}/>;
        }
      }
          });
      setDisplayList(renderedList);
  }, [filter,monsterList, fetchMonsters]);
  return (<div className='Galery'>
  <h1>GALERY</h1>
  <GaleryFilter filter = {filter} onChangeFilter = {setFilter}/>
  <div className='galeryDisplay'>
    {displayList}
  </div>
  </div>)
  
}

function GaleryImage ({monster}:any){
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
  if (monster.img_main === null){
      const lowerCaseMonsterType = monster.type.toLowerCase();
      //Not using for each to end execution when desired result is achived
      for (let i = 0; i < monsterTypes.length; i++){
        if (monsterTypes[i].type === lowerCaseMonsterType){
          console.log("Hey");
          return (<Link to = {"/" + monster.name} className='galeryNavbutton'>
                <div className='monsterImagediv'>
                  <img className='monsterImageimg' src ={monsterTypes[i].file} alt={monster.name}/>
                  <p>{monster.name}</p>
                </div>
              </Link>
              )
        }
      }
      return <></>;
      }else{
      return (<Link to = {"/" + monster.name} className='galeryNavbutton'>
            <div className='monsterImagediv'>
            <img className='monsterImageimg' src ={monster.img_main} alt = {monster.name}/>
          </div>
          </Link>)
      }

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
    const [monsterList, setMonsterList]:any = useState([]);
    const [monsterDisplay, setMonsterDisplay] = useState(<h1>Loading...</h1>);
    const [found, setFound] = useState(false);
    const [nextPage, setNextPage] = useState("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
    useEffect(() =>{
      if (nextPage){
        console.log("begining");
      axios
    .get(nextPage)
    .then((page) => {
      const monsters = page.data.results;
      var i = 0;
      var tempFound = found;
      setMonsterList(monsterList.concat(page.data.results));
      console.log("beginning while");
      while( tempFound === false&&i<monsters.length){
        if (monsterName) {
          if(tempFound === false){
            console.log(i);

            if (monsters[i].name.toLowerCase() === monsterName.toLowerCase()){
              tempFound = true;
              setMonsterDisplay(<><h1>Loading buttons ...</h1>
              <h1><MonsterStatBlock monster = {monsters[i]}/></h1>
              </>);

            }else{
              i++;
            }
          }
        }

      }
      console.log("endign while");
      setFound(tempFound);
      setNextPage(page.data.next);
    })
    .catch(error => console.log(error))
    }else{
      if (found === false){
          setMonsterDisplay(<h1>Not found</h1>);
      }else{
        var tempFound = false;
        var i = 0;
          while( tempFound === false&&i<monsterList.length){
          if (monsterName) {
            if(tempFound === false){
              console.log(i);
              if (monsterList[i].name.toLowerCase() === monsterName.toLowerCase()){
                tempFound = true;
              }else{
                i++;
              }
            }
          }

          }
        if (i === 0){
      setMonsterDisplay(<>
            <nav className='navbar' >
                  <Link className='navbutton' to ={"/"+ monsterList[monsterList.length -1].name}>Previous</Link>
                  <Link className='navbutton' to ={"/"+ monsterList[i+1].name}>Next</Link>
                </nav>
            <h1><MonsterStatBlock monster = {monsterList[i]}/></h1>
            </>)
        
    }else{
    if (i === monsterList.length -1){
      setMonsterDisplay(<>
            <nav className='navbar' >
                  <Link className='navbutton' to ={"/"+ monsterList[i-1].name}>Previous</Link>
                  <Link className='navbutton' to ={"/"+ monsterList[0].name}>Next</Link>
                </nav>
            <h1><MonsterStatBlock monster = {monsterList[i]}/></h1>
            </>)
      }else{
        setMonsterDisplay(<>
          <nav className='navbar' >
            <Link className='navbutton' to ={"/"+ monsterList[i-1].name}>Previous</Link>
            <Link className='navbutton' to ={"/"+ monsterList[i +1].name}>Next</Link>
          </nav>
          <h1><MonsterStatBlock monster = {monsterList[i]}/></h1>
        </>)
      }
    }
      }
    }
    // eslint-disable-next-line
    }, [nextPage, monsterName])
    useEffect(() =>{
      if (found === true){
        var tempFound = false
        if (nextPage === null){
          var i = 0;
          while( tempFound === false&&i<monsterList.length){
          if (monsterName) {
            if(tempFound === false){
              console.log(i);
              if (monsterList[i].name.toLowerCase() === monsterName.toLowerCase()){
                tempFound = true;
              }else{
                i++;
              }
            }
          }

          }
          if (i === 0){
            setMonsterDisplay(<>
            <nav className='navbar' >
                  <Link className='navbutton' to ={"/"+ monsterList[monsterList.length -1].name}>Previous</Link>
                  <Link className='navbutton' to ={"/"+ monsterList[i+1].name}>Next</Link>
                </nav>
            <h1><MonsterStatBlock monster = {monsterList[i]}/></h1>
            </>)
          }
          else{if (i === monsterList.length -1){
              setMonsterDisplay(<>
            <nav className='navbar' >
                  <Link className='navbutton' to ={"/"+ monsterList[i-1].name}>Previous</Link>
                  <Link className='navbutton' to ={"/"+ monsterList[0].name}>Next</Link>
                </nav>
            <h1><MonsterStatBlock monster = {monsterList[i]}/></h1>
            </>)
          }else{
              setMonsterDisplay(<>
            <nav className='navbar' >
                  <Link className='navbutton' to ={"/"+ monsterList[i-1].name}>Previous</Link>
                   <Link className='navbutton' to ={"/"+ monsterList[i+1].name}>Next</Link>
                </nav>
            <h1><MonsterStatBlock monster = {monsterList[i]}/></h1>
            </>)
          }}
        }else{
          setNextPage("https://api.open5e.com/monsters/?document__slug__iexact=wotc-srd");
        }
      setFound(tempFound)
      }
          // eslint-disable-next-line
    },[monsterName])
    
    return (<div className='detailedMonster'>
      {monsterDisplay}
      </div>)
    ;
}

function MonsterStatBlock({ monster }:any) {
  if (!monster) {
    return <div>No monster data available.</div>;
  }

  // Helper to calculate a stat modifier
  const getModifier = (score:any) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="stat-block-container">
      <div className="monster-header">
        <h2>{monster.name}</h2>
        <p>
          <em>{monster.size} {monster.type}, {monster.alignment}</em>
        </p>
      </div>

      <div className="divider"></div>

      <div className="monster-stats">
        <p><strong>Armor Class</strong> {monster.armor_class} ({monster.armor_desc})</p>
        <p><strong>Hit Points</strong> {monster.hit_points} ({monster.hit_dice})</p>
        <p><strong>Speed</strong> {Object.entries(monster.speed).map(([type, value]) => `${type} ${value}`).join(', ')}</p>
      </div>

      <div className="divider"></div>

      <div className="ability-scores">
        <div><strong>STR</strong><br/>{monster.strength} ({getModifier(monster.strength)})</div>
        <div><strong>DEX</strong><br/>{monster.dexterity} ({getModifier(monster.dexterity)})</div>
        <div><strong>CON</strong><br/>{monster.constitution} ({getModifier(monster.constitution)})</div>
        <div><strong>INT</strong><br/>{monster.intelligence} ({getModifier(monster.intelligence)})</div>
        <div><strong>WIS</strong><br/>{monster.wisdom} ({getModifier(monster.wisdom)})</div>
        <div><strong>CHA</strong><br/>{monster.charisma} ({getModifier(monster.charisma)})</div>
      </div>

      <div className="divider"></div>

      {monster.special_abilities && (
        <div className="special-abilities">
          <h3>Special Abilities</h3>
          {monster.special_abilities.map((ability:any, index:any) => (
            <p key={index}><strong>{ability.name}.</strong> {ability.desc}</p>
          ))}
        </div>
      )}

      {monster.actions && (
        <div className="actions">
          <h3>Actions</h3>
          {monster.actions.map((action:any, index:any) => (
            <p key={index}><strong>{action.name}.</strong> {action.desc}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
