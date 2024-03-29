const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCreate = require('../../../Domains/threads/entities/ThreadCreate')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-13', username: 'user11' }) // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-14', username: 'user12' }) // user-comment
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        owner: 'user-13'
      })

      const addComment = new NewComment({
        content: 'sebuah content comment',
        threadId: 'thread-123',
        owner: 'user-14'
      })

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      const addedComment = await commentRepositoryPostgres.addComment(addComment)

      const comment = await CommentsTableTestHelper.findCommentById('comment-123')
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah content comment',
        owner: 'user-14'
      }))
      expect(comment).toHaveLength(1)
    })
  })

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(() => commentRepositoryPostgres.checkAvailabilityComment('comment-123')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user15'}) // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'user16' }) // user-comment
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123'
      })

      await expect(commentRepositoryPostgres.checkAvailabilityComment('comment-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentowner function', () => {
    it('should throw AuthorizationError when comment owner not match', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user17' }) // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'user18' }) // user-comment

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        ownerId: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123'
      })

      const commentId = 'comment-123'
      const owner = 'user-333'

      await expect(commentRepositoryPostgres.verifyCommentowner(commentId, owner))
        .rejects
        .toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when comment owner match', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user19'}) // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'user20' }) // user-comment

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        ownerId: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123'
      })

      await expect(commentRepositoryPostgres.verifyCommentowner('comment-123', 'user-321'))
        .resolves
        .not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user21' }) // user-thread
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'user22'  }) // user-comment

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        ownerId: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: 'thread-123'
      })

      await commentRepositoryPostgres.deleteComment('comment-123')

      const comment = await CommentsTableTestHelper.checkIsDeletedCommentsById('comment-123')
      expect(comment).toEqual(true)
    })
  })

  describe('getCommentsThread function', () => {
    it('should get comments of thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user23'  })
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'user24'  })

      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        ownerId: 'user-123'
      }

      await ThreadsTableTestHelper.addThread(threadPayload)

      const commentPayload = {
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-321',
        threadId: threadPayload.id,
        date: '2023-11-08 14:00'
      }
      await CommentsTableTestHelper.addComment(commentPayload)

      const comment = await commentRepositoryPostgres.getCommentThread(threadPayload.id)

      expect(comment).toStrictEqual([
        {
          id: 'comment-123',
          content: 'dicoding',
          is_delete: false,
          username: 'user24',
          date: '2023-11-08 14:00'
        }
      ])
    })
  })
})
