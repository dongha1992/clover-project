import cookie from 'cookie';

// export const setRefreshToken = async (context: any, store: any) => {
//   const parsedCookies = context.req
//     ? cookie.parse(context.req.headers.cookie || '')
//     : '';

//   const userTokenObj = JSON.stringify(parsedCookies);
//   const { accessToken } = store.getState().user;

//   console.log(userTokenObj);

//   if (accessToken) {
//     store.dispatch({ type: 'user/SET_USER_AUTH' });
//   } else {
//   }
//   console.log('@@@@', accessToken, '@@@@');
// };

// export const setRefreshToken = async (refreshToken: string) => {};
