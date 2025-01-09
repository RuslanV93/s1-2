export const newTestBlog = {
  name: 'BlogName',
  description: 'Blog desc',
  websiteUrl: 'https://gFBG5yy0Pb59.com',
};
export const newTestPost = {
  title: 'Hello',
  shortDescription: 'Short desc',
  content: 'content',
};

export const newTestUserForAdminRegistration = {
  login: 'user1',
  email: 'user@gmail.com',
  password: 'qwerty1',
};
export const newTestUserForSelfRegistration = {
  login: 'RuslanV',
  email: 'ruslan-vak93@mail.ru',
  password: 'qwerty1',
};

export const testRequestValidData = {
  query: {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchNameTerm: 'name',
  },
};

export const getTestUserData = (user: number) => {
  if (user === 1) {
    return {
      login: 'petya',
      email: 'aa@aaa.aa',
      password: 'qwerty1',
    };
  }
  if (user === 2) {
    return {
      login: 'masha',
      email: 'ab@aaa.aa',
      password: 'qwerty1',
    };
  } else {
    return {
      login: 'alex',
      email: 'bb@aaa.aa',
      password: 'qwerty1',
    };
  }
};

export const userAgentData = {
  device1:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
  device2:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
  device3:
    'Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
};


