'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
  
    static associate(models) {
      // define association here
    }
  }

//setting up the book model

  Book.init({//initialize the book model with the following properties 
    title:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Add a value for "title"',
        },
        notEmpty: {
          msg: 'Add a value for "title"',
        }
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Add a value for "author"',
        },
        notEmpty: {
          msg: 'Add a value for "author"',
        }
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};