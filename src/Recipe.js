import React from 'react';

export default function Recipe({recipes}) {
    const grid = formatGrid(recipes);
    console.log(grid);
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            {grid.map((row, i) => 
                <div style={{display: 'flex', flexDirection: 'row'}} key={i}>
                    {row.map((recipe, j) => <Tile recipe={recipe} key={j} />)}
                </div>)}
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

function Tile({recipe}) {
    return(
        <div style={{height:'300px', width:'300px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor:'#ffffff'}}>
            <div style={{height:'150px', width:'150px',borderRadius: '50%', backgroundImage: `url(${recipe.image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}/>
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