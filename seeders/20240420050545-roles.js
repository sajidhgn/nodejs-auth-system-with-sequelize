"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example: */
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "Admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "User",
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
     * Example:  */
    await queryInterface.bulkDelete("roles", null, {});
  },
};
