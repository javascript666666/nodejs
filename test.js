const _ = require('lodash');
var AV = require('leanengine');

AV.init({
  appId: 'KdWpMykVkn0r1GQKf4Qru9sV-gzGzoHsz',
  appKey: 'I3LqmAlw4urxBlWjzRlI5jak',
  masterKey: 'lkioykmulhbWrGBhyMifY9mz'
});

const ids = _.range(5);
console.log(ids);

const promises = ids.map((id) => {
  return AV.User.signUp(`test${id}`,`test${id}`);
})

Promise.all(promises).then((users) => {
  // console.log('>>>',users);
    const usersPromises = users.map((user) => {
      const ids2 = _.range(5);
      const todosPromises = ids2.map((id) => {
        return new AV.Object('Todo', {
          status: 0,
          author: user,
          content: user.get('username') + '的待办事项' + id
        }).save(); 
      });
      return Promise.all(todosPromises).then((todos) => {
        console.log(`user ${user.get('username')} todos done`);
        const contents = todos.map((todo) => {
          return todo.get('content');
        })
        const result = {username: user.get('username'), todos:contents};
        return result;
    }); 
  });
  return Promise.all(usersPromises).then((result) => {
    console.log('>>>>',result);
  });
}).catch((err11) => {
  console.log('!!', err11)
})
   