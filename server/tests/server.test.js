const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todo')
            .send({text})
            .expect(201)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todo')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todo', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todo')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todo/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todo/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('Todo not found');
            })
            .end(done);
    });

    it('should return 400 if id is invalid', (done) => {
        request(app)
            .get('/todo/123abc')
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe('ID not valid');
            })
            .end(done);
    });
});

describe('DELETE /todo/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todo/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.deletedTodo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .delete(`/todo/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect((res) => {
            expect(res.body.error).toBe('Todo not found');
        })
        .end(done);
    });

    it('should return 400 if id is invalid', (done) => {
        request(app)
        .delete('/todo/123abc')
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toBe('ID not valid');
        })
        .end(done);
    });
});

describe('PATCH /todo/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
            .patch(`/todo/${id}`)
            .send({text: 'Updated from test', completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('Updated from test');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .patch(`/todo/${id}`)
            .send({text: 'Updated from test -2', completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('Updated from test -2');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.completedAt).toNotExist();
            })
            .end(done);
    });
});
