'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Users',[
      {
        firstName:"John",
        lastName:"Doe",
        email:"john@gmail.com",
        password:bcrypt.hashSync("johndoe",15),
        gender:"male",
      },
      {
        firstName:"Harvey",
        lastName:"Dent",
        email:"hd@gmail.com",
        password:bcrypt.hashSync("harveydent",15),
        gender:"male",
      },
      {
        firstName:"Emma",
        lastName:"Scale",
        email:"es@gmail.com",
        password:bcrypt.hashSync("emmascale",15),
        gender:"female",
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users',null,{})
  }
};
