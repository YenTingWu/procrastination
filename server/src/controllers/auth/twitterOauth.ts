import passport from 'passport';

export const getTwitterOAuth = passport.authenticate('twitter');
export const getTwitterOAuthCallback = passport.authenticate('twitter', {
  session: false,
  failureRedirect: '/login',
});
