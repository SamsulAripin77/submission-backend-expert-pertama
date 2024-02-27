
const ThreadDetail = require('../ThreadDetail')

describe('a DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
      // Arrange
      const payload = {}
  
      // Action and Assert
      expect(() => new ThreadDetail(payload)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    })
  
    it('should throw error when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 123
      }
  
      // Action and Assert
      expect(() => new ThreadDetail(payload)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })
  
    it('should create PostedThread object correctly', () => {
      // Arrange
      const payload = {
        id: 'thread-123'
      }
  
      // Action
      const thread = new ThreadDetail(payload)
  
      // Assert
      expect(thread).toBeInstanceOf(ThreadDetail)
      expect(thread.id).toEqual(payload.id)
    })
  })
  