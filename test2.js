const _ = require('lodash');
const bluebird = require('bluebird');
var AV = require('leanengine');

AV.init({
  appId: 'KdWpMykVkn0r1GQKf4Qru9sV-gzGzoHsz',
  appKey: 'I3LqmAlw4urxBlWjzRlI5jak',
  masterKey: 'lkioykmulhbWrGBhyMifY9mz'
});

const ids = _.range(5);
console.log(ids);

bluebird.map(ids, (id) => {
  return AV.User.signUp(`test${id}`,`test${id}`);
}).then((users) => {
  // console.log('>>>',users);
    return bluebird.map(users, (user) => {
      const ids2 = _.range(5);

      return bluebird.map(ids2, (id) =>  {
        return new AV.Object('Todo', {
          status: 0,
          author: user,
          content: user.get('username') + '的待办事项' + id
        }).save();
      },{concurrency: 2}).then((todos) => {
        console.log(`user ${user.get('username')} todos done`);
        const contents = todos.map((todo) => {
          return todo.get('content');
        })
        const result = {username: user.get('username'), todos:contents};
        return result;
    }); 
  }).then((result) => {
    console.log('>>>>',result);
  });
}).catch((err11) => {
  console.log('!!', err11)
})
   