const { Pool } = require('pg')

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false
  }
}

const devConfig = {
  user: 'postgres',
  host: '127.0.0.1',
  database: 'nuggetnova-db',
  password: '123',
  port: '5432'
}


function getConnectionPool() {
  if (process.env.ENVIRONMENT === 'production') {
    return new Pool(prodConfig);
  } else {
    return new Pool(devConfig);
  }
}


module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    const res = await getConnectionPool().query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  }
}
