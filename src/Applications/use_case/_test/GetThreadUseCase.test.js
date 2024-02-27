const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123'
    }

    const useCaseThread = {
      id: useCasePayload.threadId,
      title: 'sebuah title thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      date: '2023-03-02T14:51:45.880Z'
    }

    const useCaseComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-11-14T14:54:45.880Z',
        content: 'sebuah comment content',
        is_delete: false

      },
      {
        id: 'comment-234',
        username: 'dicoding',
        date: '2023-11-14T14:59:45.880Z',
        content: 'sebuah comment content',
        is_delete: true
      }
    ]

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve())
    mockThreadRepository. getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseThread))
    mockCommentRepository.getCommentThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseComment))
 

    const detailThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-11-14T14:54:45.880Z',
        content: 'sebuah comment content',
      },
      {
        id: 'comment-234',
        username: 'dicoding',
        date: '2023-11-14T14:59:45.880Z',
        content: '**komentar telah dihapus**',
      }
    ]

    const detailThread = await detailThreadUseCase.getThread(useCasePayload)

    // console.log(detailThread.thread)
    expect(mockThreadRepository. getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.getCommentThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(detailThread.thread.id).toEqual(useCaseThread.id)
    expect(detailThread.thread.title).toEqual(useCaseThread.title)
    expect(detailThread.thread.body).toEqual(useCaseThread.body)
    expect(detailThread.thread.username).toEqual(useCaseThread.username)
    expect(detailThread.thread.comments).toEqual(expectedComment)
  })
})
