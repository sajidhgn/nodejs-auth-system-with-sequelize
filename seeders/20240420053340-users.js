"use strict";
/** @type {import('sequelize-cli').Migration} */
const userRepository = require("../src/services/userRepository");
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     * Single commad to run // npx sequelize-cli db:seed --seed 20240420053340-users.js
     * Example: */
    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Sajid",
          last_name: "Ali",
          email: "sajidhgn@gmail.com",
          password: await userRepository.hashedPassword("12345678"),
          role_id: 1,
          gender: "male",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: "Sajidhgn",
          last_name: "Ali",
          email: "sajidhgn1@gmail.com",
          password: await userRepository.hashedPassword("12345678"),
          role_id: 1,
          gender: "male",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: "Tester",
          last_name: "Ali",
          email: "vulcantech709@gmail.com",
          password: await userRepository.hashedPassword("12345678"),
          role_id: 2,
          gender: "male",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
