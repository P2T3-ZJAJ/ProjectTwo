class AuthService {
  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  loggedIn(): boolean {
    const token = this.getToken();
    // simple check for token existence - could be enhanced with JWT validation
    return token.length > 0;
  }

  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/recipes');
  }

  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();