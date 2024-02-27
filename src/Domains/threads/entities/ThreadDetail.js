class ThreadDetail {
    constructor (payload) {
      this._verifyPayload(payload)
  
      this.id = payload.id
    }
  
    _verifyPayload (payload) {
      const { id } = payload
  
      if (!id) {
        throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
      }
  
      if (typeof id !== 'string') {
        throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    }
  }
  
  module.exports = ThreadDetail