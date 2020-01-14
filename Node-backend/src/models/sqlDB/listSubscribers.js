import Sequelize from 'sequelize';

'use strict';

module.exports = function (sequelize) {
  const ListSubscribers = sequelize.define('listSubscribers', {
    listId: {
      type: Sequelize.STRING,
      required: true,
    },
    listName: {
      type: Sequelize.STRING,
      required: true,
    },
    subscriberId: {
      type: Sequelize.STRING,
      required: true,
    },
    subscriberName: {
      type: Sequelize.STRING,
      required: true,
    },
  }, {
    // set timestamp true to add attributes (updatedAt, createdAt) to the database
    timestamps: true,
  });

  // force: true will drop the table if it already exists
  ListSubscribers.sync({
    force: false,
  }).then(() => true);
  return ListSubscribers;
};
