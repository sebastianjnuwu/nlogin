import Sequelize from 'sequelize';

const sequelize = new Sequelize('nLogin', 'root', '', {
  dialect: 'mysql',
  host: '0.0.0.0',
  port: 3006,
  logging: false,
  define: {
    timestamps: false,
  },
});

(async () => {
 await sequelize.authenticate();
})()

export default sequelize;