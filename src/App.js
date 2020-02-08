import React from 'react';
import ReactDOM from "react-dom";
import posed from "react-pose";
import logo from './bento.svg';
import { Button, Tag, InputGroup, ControlGroup } from '@blueprintjs/core';
import './App.css';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
const axios = require('axios');

const Question = posed.div({
  loaded: {opacity: 0 },
  initial: {opacity: 1 }
});

const SearchBar = posed.div({
  loaded: {y: -200 , x: -310, scaleY: 0.6, scaleX:0.6},
  initial: {y: 0, x: 0, scaleY: 1, scaleX: 1}
});

const Tags = posed.div({
  loaded: {y: -220 , x: -110, staggerChildren: 200, delayChildren: 50},
  initial: {y: 0, x: 0, staggerChildren: 200, delayChildren: 50}
});

const GoButton = posed.div({
  loaded: {y: -345 , x: -230},
  initial: {y: 0, x: 0}
});


function App() {
  const [ingredients, setIngredients] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [animationState, setAnimationState] = React.useState('initial');
  console.log(ingredients);
  return (
    <div className="App">
      <header style={{height: '10vh', textAlign: 'left', padding: '25px'}}>
        <a href='/'><img src={logo} style={{height: '30px'}}/></a>
      </header>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh'}}>
        <div style={{alignContent: 'center', width: '80vw'}}>
          <Question pose={animationState}>
            <div style={{color: '#a1b7b7', fontSize: '50px', fontWeight: 'bold', letterSpacing: '2px', textAlign: 'left'}}>
              what's in your fridge?
            </div>
          </Question>
          <SearchBar pose={animationState}>
            <div style={{ margin: "20px 0px"}}>
              <form>
                <ControlGroup>
                  <InputGroup rightElement={<Button type='submit' style={{fill: '#ffffff', height: '50px', margin: '0px'}} disabled={input.length <= 0} minimal fill icon='plus' onClick={() => {
                    setIngredients([...ingredients, input]);
                    setInput('');
                  }}/>} fill style={{height: '50px', fontSize: '35px', fontWeight: 'bold', boxShadow: 'unset', backgroundColor: '#a1b7b7', color: '#ffffff'}} onChange={(event) => setInput(event.target.value)} value={input}/>
                </ControlGroup>
              </form>
            </div>
            </SearchBar>
            <div style={{textAlign: 'left'}}>
            <Tags pose={animationState}>
                {ingredients.map((x) => <Tag large style={{backgroundColor: '#a1b7b7', margin: '5px', fontWeight: 'bold'}} onRemove={(e) => console.log(e)}>{x}</Tag>)}
            </Tags>
            </div>
          </div>
      </div>
      <GoButton pose={animationState}>
        <footer style={{position: 'absolute', bottom: '10vh', right: '10vw', textAlign: 'right'}}>
          <Button onClick={async () => {
            getRecipes(ingredients);
            setAnimationState('loaded')
          }} large minimal disabled={ingredients.length <= 0} style={{backgroundColor: '#e34234', color: '#fff', fontWeight: 'bold', letterSpacing: '1.5px', outline: 'none'}}>GO</Button>
        </footer>
      </GoButton>
    </div>
  );
}

async function getRecipes(ingredients) {
  const url = "http://localhost:5000/recipe";
  try {
    const res = await axios.post(url, {keywords: ingredients});
    console.log(res);
  } catch {

  }
}

export default App;
