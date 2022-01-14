const storage = (function () {
  var _service;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service
    }
    return _service
  }
  function _setToken(tokenKey, token) {
    window.localStorage.setItem(tokenKey, token);
  }
  function _getToken(tokenKey) {
    return window.localStorage.getItem(tokenKey);
  }
  function _removeToken(tokenKey) {
    window.localStorage.removeItem(tokenKey);
  }
  return {
    getService: _getService,
    setToken: (token) => _setToken('access_token', token),
    getToken: () => _getToken('access_token'),
    removeToken: () => _removeToken('access_token'),
  }
})();

export default storage;