const ThreadCreated = require('../../../threads/entities/ThreadCreated');

describe('a ThreadCreated entities', () => {
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
