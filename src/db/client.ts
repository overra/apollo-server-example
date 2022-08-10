
import { PropertyLegacyRow, PropertyModernRow } from './properties';
import { Maybe, MutationCreatePropertyArgs, MutationUpdatePropertyArgs, Scalars } from '../generated/graphql';
import { uuid } from 'uuidv4';


const env = process.env;

const config = {
  pg_db: {
    host: env.PG_DB_HOST || 'candidate-postgres.ceifqgcsy2qu.us-east-1.rds.amazonaws.com',
    port: env.PG_DB_PORT || '5432',
    user: env.PG_DB_USER || 'postgres',
    password: env.PG_DB_PASSWORD || 'Spruce-Test',
    database: env.PG_DB_NAME || 'modern-db',
  },
  my_db: {
    host: env.MY_DB_HOST || 'candidate-mysql.ceifqgcsy2qu.us-east-1.rds.amazonaws.com',
    port: env.MY_DB_PORT || '3306',
    user: env.MY_DB_USER || 'admin',
    password: env.MY_DB_PASSWORD || 'Spruce-Test',
    database: env.MY_DB_NAME || 'legacy-db',
    connectionLimit: env.MY_DB_CONNECTION_LIMIT || 10,
  },
};

const { Pool } = require('pg');
const pgpool = new Pool(config.pg_db);

const mysqldb = require('mysql2');
const mysqlConnection = mysqldb.createPool(config.my_db);
const mysqlPool = mysqlConnection.promise();


export class DbClient {

  getModernProperty(id: number): Promise<any> {
    const query = `SELECT * FROM properties WHERE legacy_id = ${id}`;
    const row = pgpool.query(query)
      .then((res: { rows: PropertyModernRow[]; }) => {
        console.log(res.rows);
        return res.rows[0];
      });
    return row;
  };

  getAllModernProperties(): any[] {
    const query = `SELECT * FROM properties`;
    const rows = pgpool.query(query)
      .then((res: { rows: any[]; }) => res.rows);
    return rows;
  };

  getLegacyProperty(id: number): PropertyLegacyRow {
    const query = 'SELECT * FROM properties WHERE id = ${id}';
    const row = mysqlPool.query(query, { id }, (err: any, res: any) => {
      if (err) throw err;
      return res;
    });
    return row;
  }

  async getAllLegacyProperties(): Promise<any> {
    const query = 'SELECT * FROM properties';
    const rows = await mysqlPool.query(query);
    return rows;
  }

  async createProperty(args: { numberOfUnits?: Maybe<Scalars['Int']> } & { name: NonNullable<MutationCreatePropertyArgs['name']>; isLive: NonNullable<MutationCreatePropertyArgs['isLive']>; goLiveDate: NonNullable<MutationCreatePropertyArgs['goLiveDate']>; address: NonNullable<MutationCreatePropertyArgs['address']>; city: NonNullable<MutationCreatePropertyArgs['city']>; state: NonNullable<MutationCreatePropertyArgs['state']>; zip: NonNullable<MutationCreatePropertyArgs['zip']> }) {

    const { numberOfUnits, name, isLive, goLiveDate, address, city, state, zip } = args;
    const legacyQuery = `INSERT INTO properties (name, address, city, state, zip, created_at) VALUES ('${name}', '${address}', '${city}', '${state}', '${zip}', NOW())`;
    const [legacyResult, err] = await mysqlPool.query(legacyQuery);
    const modernQuery = `INSERT INTO properties (id,legacy_id, name, is_live, go_live_date, numer_of_units) VALUES ('${uuid()}',${legacyResult.insertId}, '${name}', ${isLive}, '${goLiveDate}', ${numberOfUnits})`;
    const modernResult = pgpool.query(modernQuery).then((res: { rows: any[]; }) => {
      console.log(res);
      return res.rows
    });
    await Promise.resolve(modernResult)
    return modernResult;
  }

  async updateProperty(args: { numberOfUnits?: Maybe<Scalars['Int']> } & { legacy_id: NonNullable<MutationUpdatePropertyArgs['legacy_id']>; name: NonNullable<MutationUpdatePropertyArgs['name']>; isLive: NonNullable<MutationUpdatePropertyArgs['isLive']>; goLiveDate: NonNullable<MutationUpdatePropertyArgs['goLiveDate']>; address: NonNullable<MutationUpdatePropertyArgs['address']>; city: NonNullable<MutationUpdatePropertyArgs['city']>; state: NonNullable<MutationUpdatePropertyArgs['state']>; zip: NonNullable<MutationUpdatePropertyArgs['zip']> })
  {
    const { numberOfUnits, legacy_id, name, isLive, goLiveDate, address, city, state, zip } = args;
    const legacyQuery = `UPDATE properties SET name = '${name}', address = '${address}', city = '${city}', state = '${state}', zip = '${zip}', updated_at = NOW() WHERE id = ${legacy_id}`;
    const [legacyResult, err] = await mysqlPool.query(legacyQuery);
    const modernQuery = `UPDATE properties SET name = '${name}', is_live = ${isLive? 'TRUE':'FALSE'}, go_live_date = '${goLiveDate}', numer_of_units = ${numberOfUnits} WHERE legacy_id = '${legacy_id}'`;
    const modernResult = pgpool.query(modernQuery).then((res: { rows: any[]; }) => {
      console.log(res);
      return res.rows
    });
      await Promise.resolve(modernResult)
    return modernResult;
    }
}
