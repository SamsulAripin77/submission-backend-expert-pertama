const ThreadCreate = require('../ThreadCreate');

describe('a thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread title'
    }
    // Action and Assert
    expect(() => new ThreadCreate(payload)).toThrow('THREAD_CREATE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      // id: 300,
      title: {},
      body: 'Dicoding Indonesia',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new ThreadCreate(payload)).toThrow('THREAD_CREATE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

    it('should create thread object correctly', () => {
        // Arrange
        const payload = {
          // id: 'thread-123',
          title: 'dicoding',
          body: 'Dicoding Indonesia',
          owner: 'user-123',
        };
    
        // Action
        const {id, title, body, owner } = new ThreadCreate(payload);
    
        // Assert
        // expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
      });
})