export function getHeaderState(user: any, currentPage: string) {
  const isAuthenticated = user !== null;
  const isHomePage = currentPage === '/';
  const isPublicPage = !isAuthenticated && !isHomePage;

  return {
    isAuthenticated,
    isHomePage,
    isPublicPage,
  };
}
