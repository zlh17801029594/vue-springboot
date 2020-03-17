
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },
  {
    url: '/user/menus',
    type: 'get',
    response: _ =>{
      return{
        code: 20000,
        data: '[{"path": "/AIMS","component": "Layout","name": "AIMS", "meta": {"title": "AIMS", "icon": "icon"},"alwaysShow": true,"children": [{"path": "AIMS_ZUUL","component": "leaf","name": "AIMS_ZUUL", "meta": {"title": "AIMS ZUUL", "icon": ""},"destination": "zuul", "type": "table"},{"path": "AIMS_ZBTJ","component": "leaf","name": "AIMS_ZBTJ", "meta": {"title": "AIMS ZBTJ", "icon": ""},"destination": "zbtj", "type": "table"},{"path": "AIMS_ZBBB","component": "leaf","name": "AIMS_ZBBB", "meta": {"title": "AIMS ZBBB", "icon": ""},"destination": "zbbb", "type": "text"}]},{"path": "/FDM","component": "Layout","name": "FDM", "meta": {"title": "FDM", "icon": "icon"},"alwaysShow": true,"children": [{"path": "FDM_PLAN","component": "noleaf","name": "FDM_PLAN", "meta": {"title": "FDM PLAN", "icon": ""},"alwaysShow": true,"children": [{"path": "FDM_PLAN_A","component": "leaf","name": "FDM_PLAN_A", "meta": {"title": "FDM PLAN A", "icon": ""},"destination": "plana", "type": "table"}]}]},{"path": "/XYZ","component": "Layout","children": [{"path": "index", "component": "leaf", "name": "XYZ","meta": {"title": "XYZ", "icon": "icon"},"destination": "xyz", "type": "table"}]}]'
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
