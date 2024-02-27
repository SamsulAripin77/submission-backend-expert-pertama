const ThreadCreated = require('../../../threads/entities/ThreadCreated');

describe('a ThreadCreated entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread title'
    }
    // Action and Assert
    expect(() => new ThreadCreated(payload)).toThrowError('THREAD_CREATED.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      title: [],
      body: [],
      owner: []
    }

    // Action and Assert
    expect(() => new ThreadCreated(payload)).toThrowError('THREAD_CREATED.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should create ThreadCreated object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: 'user-123'
    };

    // Action
    const threadCreated = new ThreadCreated(payload);

    // Assert
    expect(threadCreated.id).toEqual(payload.id);
    expect(threadCreated.title).toEqual(payload.title);
    expect(threadCreated.body).toEqual(payload.body);
    expect(threadCreated.owner).toEqual(payload.owner);
  });
});
