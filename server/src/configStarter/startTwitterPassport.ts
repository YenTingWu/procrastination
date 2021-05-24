import { Strategy } from 'passport-twitter';
import { PassportStatic } from 'passport';
import { Connection } from 'typeorm';
import {
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
  TWITTER_CALLBACK,
} from '../config';
import { User } from '../entity/User';
import { getValidName } from '../lib/getValidName';

/**
 * ## startTwitterPassport
 * start the passport-twitter configuration
 * @param connection
 * @param passport
 * @returns passport.use
 */

export default function startTwitterPassport(
  connection: Connection,
  passport: PassportStatic
) {
  return passport.use(
    new Strategy(
      {
        consumerKey: TWITTER_API_KEY as string,
        consumerSecret: TWITTER_API_SECRET as string,
        callbackURL: TWITTER_CALLBACK as string,
        includeEmail: true,
      },
      async function (_, __, profile, done) {
        const { id, emails, displayName, photos } = profile;

        const query = await connection
          .getRepository(User)
          .createQueryBuilder('user')
          .where('user.twitterId = :id', { id });

        let email: string | null = null;

        if (emails && emails.length) {
          email = emails[0].value;
          query.orWhere('user.email = :email', { email });
        }

        let user: User = await query.getOne();

        const validName = await getValidName(displayName);

        if (!user) {
          user = await User.create({
            email,
            twitterId: id,
            displayName: validName,
            avatar: photos[0].value || null,
            insensitiveName: validName.toLowerCase(),
            isVerifiedEmail: true,
          }).save();
        } else if (!user.twitterId) {
          user.twitterId = id;
          await user.save();
        } else {
          // User exist and do have twitterId
        }

        return done(null, { _user: user });
      }
    )
  );
}
