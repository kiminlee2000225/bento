import React from 'react';
import ReactDOM from "react-dom";
import posed, {PoseGroup} from "react-pose";
import logo from './bento.svg';
import { Button, Tag, InputGroup, ControlGroup } from '@blueprintjs/core';
import './App.css';
import Recipe from './Recipe';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
const axios = require('axios');

const Question = posed.div({
  loaded: {opacity: 0, transition: {duration: 50}},
  initial: {opacity: 1 }
});

const SearchBar = posed.div({
  loaded: {y: '-31vh', x: '-24vw', scaleY: 0.6, scaleX:0.6, transition: { type: 'spring', damping: 15}},
  initial: {y: 0, x: 0, scaleY: 1, scaleX: 1}
});

const TagsWrapper = posed.div({
  loaded: {staggerChildren: 30, delay: 15},
  initial: {}
});

const TagWrapper = posed.li({
  loaded: {y: '-32vh', x: '-8vw', transition: {type: "spring", damping: 13}},
  initial: {y: 0, x: 0}
});

const GoButton = posed.div({
  loaded: {y: '-77.7vh', x: '-35.5vw', scaleX: 0.75, scaleY: 0.75, transition: { type: 'spring', damping: 17}},
  initial: {y: 0, x: 0, scaleY: 1, scaleX: 1}
});

function App() {
  const [ingredients, setIngredients] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [animationState, setAnimationState] = React.useState('initial');
  const [recipes, setRecipes] = React.useState([]);
  console.log(ingredients);
  return (
    <div className="App">
      <header style={{height: '10vh', textAlign: 'left', padding: '25px'}}>
        <a href='/'><img src={logo} style={{height: '30px'}}/></a>
      </header>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh'}}>
        <div style={{alignContent: 'center', width: '80vw', textAlign: 'left'}}>
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
                    setIngredients(ingredients.concat(input.split(',').map((s) => s.trim()).filter((s) => s.length > 0)));
                    setInput('');
                  }}/>} fill style={{height: '50px', fontSize: '35px', fontWeight: 'bold', boxShadow: 'unset', backgroundColor: '#a1b7b7', color: '#ffffff'}} onChange={(event) => setInput(event.target.value)} value={input}/>
                </ControlGroup>
              </form>
            </div>
          </SearchBar>
          {/* <TagsWrapper pose={animationState} style={animationState === 'initial' ? {} : {whiteSpace: 'nowrap', overflowX: 'auto', width: '100%'}}> */}
          <TagsWrapper pose={animationState}>
              {ingredients.map((x, i) => <TagWrapper key={i} style={{display: 'inline-block'}}><Tag large style={{backgroundColor: '#a1b7b7', margin: '5px', fontWeight: 'bold'}} onRemove={() => setIngredients(ingredients.filter((_x, i2) => i2 !== i))}>{x}</Tag></TagWrapper>)}
          </TagsWrapper>
          <GoButton pose={animationState} style={{position: 'absolute', bottom: '10vh', right: '10vw'}}>
            <Button onClick={async () => {
              setRecipes([]);
              setRecipes(await getRecipes(ingredients));
              setAnimationState('loaded');
            }} large minimal disabled={ingredients.length <= 0} style={{backgroundColor: '#e34234', color: '#fff', fontWeight: 'bold', letterSpacing: '1.5px', outline: 'none'}}>GO</Button>
          </GoButton>
        </div>
      </div>
          {animationState==='loaded' ? <Recipe recipes={recipes}/>:<></>}
    </div>
  );
}

async function getRecipes(ingredients) {
  const url = "http://localhost:5000/recipe";
  try {
    const res = await axios.post(url, {keywords: ingredients});
    return res.data.recipes;
  } catch {

  }
}

export default App;
