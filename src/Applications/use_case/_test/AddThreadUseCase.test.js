const ThreadCreate = require('../../../Domains/threads/entities/ThreadCreate');
const ThreadCreated = require('../../../Domains/threads/entities/ThreadCreated');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: 'user-123'
    };

    const mockThreadCreated = new ThreadCreated({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123'
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadCreated));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    });

    // Action
    const createdThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(new ThreadCreated({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new ThreadCreate({
      id: useCasePayload.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner
    }));
  }); 
});
