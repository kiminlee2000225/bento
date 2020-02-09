import React from 'react';
import {Drawer} from '@blueprintjs/core'; 
import posed, {PoseGroup} from 'react-pose';

const rowSize = 4;

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



function RecipeGrid({recipes, setDrawer}) {
    const grid = formatGrid(recipes);
    console.log(grid);
    const [isVisible, setIsVisible] = React.useState(false);
    React.useEffect(() => recipes.length > 0 ? setIsVisible(true) : setIsVisible(false), [recipes, setIsVisible]);

    return (
        <div style={{position: 'absolute', width: '100%', top: '25vh', height: '75vh', overflow: 'scroll'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <PoseGroup>
                    {grid.map((row, i) => 
                        <div style={{display: 'flex', flexDirection: 'row'}} key={i}>
                            <PoseGroup>
                                {isVisible && row.map((recipe, j) => <TileContainer i={i * rowSize + j} key={j}><Tile recipe={recipe} setDrawer={setDrawer} /></TileContainer>)}
                            </PoseGroup>
                        </div>)}
                    </PoseGroup>
                </div>
            </div>
        </div>
        )
}

function formatGrid(recipes) {
    const res = [];
    let row = [];
    for (let i = 0; i < recipes.length; i++) {
        row.push(recipes[i]);
        if ((i + 1) % rowSize === 0) {
            res.push(row);
            row = [];
        }
    }
    if (row.length > 0) {
        res.push(row);
    }
    return res;
}

const TileContainer = posed.div({
    enter: {
        y: 0,
        opacity: 1,
        delay: ({ i }) => {
            console.log(i);
            return 300 + (i * 200);
        },
        transition: {
        y: { type: 'spring', stiffness: 1000, damping: 15 },
        default: { duration: 300 }
        } 
    },
    exit: {
        y: 20,
        opacity: 0,
    },
});

function Tile({recipe, setDrawer}) {
    return(
        <div className='tile'>
        <div style={{height:'300px', width:'300px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor:'#ffffff', cursor: 'pointer'}} onClick={() => setDrawer(recipe)}>
            <div style={{height:'150px', width:'150px',borderRadius: '50%', backgroundImage: `url(${recipe.image})`, backgroundSize: 'cover', backgroundPosition: 'center', margin: '13px'}}/>
            <div style={{fontWeight: 'bold', fontSize: '20px', margin: '10px', color:'#9b9b9b'}}>{recipe.name}</div>
            <div style={{ fontSize: '20px', margin: '10px', fontSize: '15px', bottom:'0', color:'#848484'}}>Prep: {recipe.times[0]} {minHourPrep(recipe)} | Cook: {recipe.times[1]} {minHourCook(recipe)}</div>
        </div>
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