const ThreadCreate = require('../../Domains/threads/entities/ThreadCreate');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const threadCreate = new ThreadCreate(useCasePayload);
    return this._threadRepository.addThread(threadCreate);
  }
}

module.exports = AddThreadUseCase;
