const Sequelize = require("sequelize");
const connection = require("./database");


const Game = connection.define('Games', {
    
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Game.sync({force: true});
module.exports = Game;