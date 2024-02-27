const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadCreate = require('../../../Domains/threads/entities/ThreadCreate');
const ThreadCreated = require('../../../Domains/threads/entities/ThreadCreated');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const { nanoid } = require('nanoid');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist register thread and return registered thread correctly', async () => {
      // Arrange
      const randomString = 'userandomstring1';
      const registerUser = new RegisterUser({
        username: randomString, 
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGeneratorUser = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGeneratorUser);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      const threadCreate = new ThreadCreate({
        id: 'thread-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: registeredUser.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(threadCreate);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      // expect(threads.id).toEqual('thread-123');
      // expect(threads.owner).toEqual(registeredUser.id);
    });

  });

  describe(' getDetailThread', () => {
    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres. getDetailThread('thread-111'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return thread id correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ title: 'thread-123', body: 'dicoding' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres. getDetailThread('thread-123');

      // Assert
      expect(thread.title).toEqual('thread-123');
    });
  });

});
