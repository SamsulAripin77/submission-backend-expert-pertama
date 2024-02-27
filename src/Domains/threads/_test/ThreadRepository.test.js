const ThreadRepository = require('../../threads/ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.checkAvailabilityThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')


    await expect(threadRepository. getDetailThread('')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
