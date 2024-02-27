const DetailComment = require('../../Domains/comments/entities/DetailComment')

class GetThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async getThread (useCasePayload) {
    const { threadId } = useCasePayload
    await this._threadRepository.checkAvailabilityThread(threadId)
    const threadResult = await this._threadRepository. getDetailThread(threadId)
    const commentResult = await this._commentRepository.getCommentThread(threadId)
    // console.log(threadResult.comments)

    threadResult.comments = commentResult.map((comment) => {
      return new DetailComment(comment)
    })

    return { thread: threadResult }
  }
}

module.exports = GetThreadUseCase
