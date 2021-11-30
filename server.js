const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 3000

app.use(express.json())

let data = fs.readFileSync(path.resolve(__dirname, 'data.json'))
let parsedData = JSON.parse(data)
let recipes = parsedData.recipes

app.get('/recipes', (request, response) => {
    response.status(200).json(recipes.map(recipe => recipe.name))
})

app.get('/recipes/details/:name', (request, response) => {
    const name = request.params.name
    const recipe = recipes.filter(recipe => recipe.name === name)
    
    if(recipe.length === 0)
        response.status(200).json({})
    else {
        const resultRecipe = {
            details: {
                ingredients: recipe[0].ingredients,
                numSteps: recipe[0].instructions.length
            }
        }
        response.status(200).json(resultRecipe)
    }
})

app.post('/recipes', (request, response) => { 
    const newRecipe = request.body 
    const recipe = recipes.filter(recipe => recipe.name === newRecipe.name)
    
    if(recipe.length !== 0)
        response.status(400).send({
            error: "Recipe already exists"
        })
    else {
        parsedData.recipes.push(newRecipe)
        fs.writeFileSync('data.json', JSON.stringify(parsedData, null, 2))
        response.status(201).send()
    }
})

app.put('/recipes', (request, response) => { 
    const updatedRecipe = request.body 
    const recipe = recipes.filter(recipe => recipe.name === updatedRecipe.name)
    
    if(recipe.length === 0)
        response.status(404).send({
            error: "Recipe does not exist"
        })
    else {
        parsedData.recipes = recipes.map(recipe => 
            recipe.name === updatedRecipe.name 
            ? updatedRecipe 
            : recipe)
        fs.writeFileSync('data.json', JSON.stringify(parsedData, null, 2))
        response.status(204).send()
    }
})  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})