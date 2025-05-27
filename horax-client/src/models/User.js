// Simple user model for client-side use

export class User {
  constructor(userData) {
    this._id = userData._id || '';
    this.fullName = userData.fullName || '';
    this.email = userData.email || '';
    this.role = userData.role || 'user';
    this.isVerified = userData.isVerified || false;
    this.profileImg = userData.profileImg || '';
    this.phone = userData.phone || '';
  }

  isAdmin() {
    return this.role === 'admin';
  }
}

export default User;
