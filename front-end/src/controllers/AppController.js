// Controller for handling logic
export const AppController = {
  getIframeSource: () => {
    const hash = window.location.hash.substring(1); // remove the '#'
    switch (hash) {
      case 'log':
        return '/html/log.html';
      case 'sohoc':
        return '/html/Sohoc.html';
      case 'pt':
        return '/html/Pt.html';
      case 'dethi':
        return '/html/Dethi.html';
      case 'profile':
        return '/html/profile.html';
      case 'sign_up':
        return '/html/sign_up.html';
      default:
        return '/html/web.html';
    }
  },
};