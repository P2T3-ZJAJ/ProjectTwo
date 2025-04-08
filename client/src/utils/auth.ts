class AuthService {
  getToken(): string {
    return localStorage.getItem("id_token") || "";
  }

  loggedIn(): boolean {
    const token = this.getToken();
    // simple check for token existence - could be enhanced with JWT validation
    return token.length > 0;
  }

  login(idToken: string): void {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/recipes");
  }

  logout(): void {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // check if token is expired
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = decoded.exp * 1000; // converts to milliseconds
      return Date.now() < expiryTime;
    } catch (e) {
      return false;
    }
  }
}

export default new AuthService();
