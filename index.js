const express = require('express')
const app = express()
const exphds = require('express-handlebars')
const { get } = require('http')
const PORT = process.env.PORT || 3001
const path = require('path')
const fetch = require("node-fetch")
var helpers = require('handlebars-helpers')(["string"])
const bodyParser = require('body-parser')

app.use(express.static(path.resolve(__dirname,"./public")))

app.use(bodyParser.urlencoded({ extended : false}))

app.engine(".hbs",exphds({extname :".hbs"}))
app.set("view engine", ".hbs")

// catch errors 
const catchErrors = asyncFunc => (...args) => asyncFunc(...args).catch(console.error)

// get all pokemons 
const getAllPokemons = catchErrors(async() => {
    const pokemons = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const json = await pokemons.json()
    console.table(json.results)
    return json
})

//get pokemon 
const getPokemon = catchErrors(async(name) => {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    const json = await pokemon.json()
    console.log(json)
    return json
})

// home page root 
app.get("/", catchErrors(async(_,res) => {
    const pokemons = await getAllPokemons()
    res.render("home",{ pokemons })
})
)
// pokemon/notFound root 
app.get("/:pokemon", catchErrors(async(req,res) => {
    const search = req.params.pokemon
    console.log("search",search)
    const pokemon = await getPokemon(search)
    if (pokemon) {
        res.render("pokemon", { pokemon })
    }
    else {
        res.render("notFound")
    }
})
)

// search root 
app.post('/search', (req,res) => {
    const search = req.body.search
    res.redirect(`/${search}`)
})

app.listen(PORT, () => console.log(`app launched on ${PORT}`))