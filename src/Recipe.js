import React from 'react';
import {Drawer} from '@blueprintjs/core'; 

export default function Recipes({recipes}) {
    const [drawer, setDrawer] = React.useState(null);
    return (
        <>
            <RecipeGrid recipes={recipes} setDrawer={setDrawer}/>
            <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} size='500px'>
                {drawer ? (
                    <RecipeDrawer recipe={drawer} />
                ) : <></>}
            </Drawer>
        </>
    )
}

function RecipeDrawer({recipe}) {
    return (
        <div style={{position: 'absolute', height: '99vh', overflow: 'scroll'}}>
            <div style={{height: '300px', width:'420px', backgroundImage: `url(${recipe.image})`, 
            backgroundSize: 'cover', backgroundPosition: 'center', margin: '30px', marginLeft: '40px', justifyContent: 'center', alignItems: 'center'}}>
            </div>
            <div>
                <div style={{marginLeft:'40px', marginTop: '15px', fontSize:'30px', fontWeight:'bold', color:'#9b9b9b'}}>{recipe.name}</div>
                <div style={{marginLeft:'40px', marginTop: '8px', fontSize:'15px', color:'#9b9b9b'}}>Prep: {recipe.times[0]} {minHourPrep(recipe)} | Cook: {recipe.times[1]} {minHourCook(recipe)}</div>
                <div style={{marginLeft:'40px', marginTop: '20px', fontSize:'15px', letterSpacing:'0.8px', color:'#9b9b9b', fontWeight:'bold'}}>INGREDIENTS</div>
                <div style={{color:'#9b9b9b', marginRight:'40px', marginLeft:'40px', marginTop:'8px'}}>
                    {recipe.ingredients.map((ingredients, j) => <li ingredients={recipe.ingredients} key={j}>{ingredients}</li>)}
                </div>
                <div style={{marginLeft:'40px', marginTop: '20px', fontSize:'15px', letterSpacing:'0.8px', color:'#9b9b9b', fontWeight:'bold'}}>DIRECTIONS</div>
                <ol style={{color:'#9b9b9b', marginRight:'40px', marginLeft:'15px', marginTop:'8px'}}>
                    {recipe.directions.map((directions, j) => <li directions={recipe.directions} key={j}>{directions}</li>)}
                </ol>
            </div>
        </div>
    )
}

function printIngredients({ingredients}) {
    for (let i = 0; i < ingredients.length; ++i) {
        
    }
}

function RecipeGrid({recipes, setDrawer}) {
    const grid = formatGrid(recipes);
    console.log(grid);
    return (
        <div style={{position: 'absolute', top: '25vh', height: '75vh', overflow: 'scroll'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    {grid.map((row, i) => 
                        <div style={{display: 'flex', flexDirection: 'row'}} key={i}>
                            {row.map((recipe, j) => <Tile recipe={recipe} key={j} setDrawer={setDrawer} />)}
                        </div>)}
                </div>
            </div>
        </div>
        )
}

function formatGrid(recipes) {
    const res = [];
    const limit = 4;
    let row = [];
    for (let i = 0; i < recipes.length; i++) {
        row.push(recipes[i]);
        if ((i + 1) % limit === 0) {
            res.push(row);
            row = [];
        }
    }
    if (row.length > 0) {
        res.push(row);
    }
    return res;
}

function Tile({recipe, setDrawer}) {
    return(
        <div style={{height:'300px', width:'300px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor:'#ffffff'}} onClick={() => setDrawer(recipe)}>
            <div style={{height:'150px', width:'150px',borderRadius: '50%', backgroundImage: `url(${recipe.image})`, backgroundSize: 'cover', backgroundPosition: 'center', margin: '13px'}}/>
            <div style={{fontWeight: 'bold', fontSize: '20px', margin: '10px', color:'#9b9b9b'}}>{recipe.name}</div>
            <div style={{ fontSize: '20px', margin: '10px', fontSize: '15px', bottom:'0', color:'#848484'}}>Prep: {recipe.times[0]} {minHourPrep(recipe)} | Cook: {recipe.times[1]} {minHourCook(recipe)}</div>
        </div>
    )
}

function minHourPrep({times}) {
    if (times[0] < 5) {
        return "hr";
    } else {
        return "min"
    }
}

function minHourCook({times}) {
    if (times[1] < 5) {
        return "hr";
    } else {
        return "min"
    }
}