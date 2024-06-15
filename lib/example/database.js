import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.URL_MYSQL, {
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false,
  },
});


(async () => {
 await sequelize.authenticate();
})()

export default sequelize;