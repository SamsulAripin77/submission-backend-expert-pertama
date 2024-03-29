const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCreated = require('../../Domains/threads/entities/ThreadCreated');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(threadCreate) {
    const { title, body, owner } = threadCreate;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new ThreadCreated({ ...result.rows[0] });
  }


  async  getDetailThread(threadId) {
    const query = {
      text: 'SELECT A.body, A.owner, A.date, A.title, A.id, B.username FROM threads A LEFT JOIN users B ON A.owner = B.id WHERE A.id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const thread = result.rows[0];
    // console.log(thread);
    return thread;
  }

  async checkAvailabilityThread (threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }
}

module.exports = ThreadRepositoryPostgres;
