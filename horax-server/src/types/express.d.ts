import { IUser } from '../models/User'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Extend Request with a user property
    }
  }
}
