import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor Main {

  // ─── Types ────────────────────────────────────────────────────────────────

  type Movie = {
    id : Nat;
    title : Text;
    posterUrl : Text;
    videoUrl : Text;
    createdAt : Int;
  };

  type ExpiryType = { #twentyMinutes; #thirtyDays; #ninetyDays };

  type PinCode = {
    code : Text;
    expiryType : ExpiryType;
    createdAt : Int;
    expiresAt : Int;
    isActive : Bool;
  };

  type DeviceToken = {
    token : Text;
    pinCode : Text;
    createdAt : Int;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  var adminUsername : Text = "admin";
  var adminPassword : Text = "Drama2024!";
  var adminSessionToken : Text = "";

  var movies : [Movie] = [];
  var nextMovieId : Nat = 1;

  var pinCodes : [PinCode] = [];
  var deviceTokens : [DeviceToken] = [];

  // ─── Helpers ─────────────────────────────────────────────────────────────

  func natToChar(n : Nat) : Char {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let arr = chars.toArray();
    let idx = n % arr.size();
    arr[idx]
  };

  func generateCode(seed : Int) : Text {
    var s = Int.abs(seed);
    var code = "";
    var i = 0;
    while (i < 6) {
      code := code # Text.fromChar(natToChar(s % 58));
      s := s / 7 + s * 3 + i * 13 + 97;
      i += 1;
    };
    code
  };

  func generateToken(seed : Int) : Text {
    var s = Int.abs(seed);
    var tok = "";
    var i = 0;
    while (i < 32) {
      tok := tok # Text.fromChar(natToChar(s % 58));
      s := s / 11 + s * 5 + i * 17 + 53;
      i += 1;
    };
    tok
  };

  func expiryDuration(e : ExpiryType) : Int {
    switch e {
      case (#twentyMinutes) { 20 * 60 * 1_000_000_000 };
      case (#thirtyDays) { 30 * 24 * 60 * 60 * 1_000_000_000 };
      case (#ninetyDays) { 90 * 24 * 60 * 60 * 1_000_000_000 };
    }
  };

  func isPinExpired(pin : PinCode) : Bool {
    Time.now() > pin.expiresAt
  };

  func push<T>(arr : [T], item : T) : [T] {
    arr.concat([item])
  };

  func markExpiredPins() {
    pinCodes := pinCodes.map(func(p : PinCode) : PinCode {
      if (p.isActive and isPinExpired(p)) {
        { p with isActive = false }
      } else { p }
    });
  };

  // ─── Admin Auth ───────────────────────────────────────────────────────────

  public query func getInitialCredentials() : async { username : Text; password : Text } {
    { username = adminUsername; password = adminPassword }
  };

  public func adminLogin(username : Text, password : Text) : async { ok : Bool; token : Text } {
    if (username == adminUsername and password == adminPassword) {
      let tok = generateToken(Time.now() + 9999);
      adminSessionToken := tok;
      { ok = true; token = tok }
    } else {
      { ok = false; token = "" }
    }
  };

  public func adminLogout(token : Text) : async Bool {
    if (token == adminSessionToken) {
      adminSessionToken := "";
      true
    } else { false }
  };

  public query func validateAdminToken(token : Text) : async Bool {
    token != "" and token == adminSessionToken
  };

  public func updateAdminCredentials(token : Text, newUsername : Text, newPassword : Text) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    adminUsername := newUsername;
    adminPassword := newPassword;
    true
  };

  // ─── Movie CRUD ───────────────────────────────────────────────────────────

  public func addMovie(token : Text, title : Text, posterUrl : Text, videoUrl : Text) : async { ok : Bool; id : Nat } {
    if (token != adminSessionToken or token == "") { return { ok = false; id = 0 } };
    let id = nextMovieId;
    nextMovieId += 1;
    let movie : Movie = { id; title; posterUrl; videoUrl; createdAt = Time.now() };
    movies := push(movies, movie);
    { ok = true; id }
  };

  public func updateMovie(token : Text, id : Nat, title : Text, posterUrl : Text, videoUrl : Text) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    var found = false;
    movies := movies.map(func(m : Movie) : Movie {
      if (m.id == id) {
        found := true;
        { m with title; posterUrl; videoUrl }
      } else { m }
    });
    found
  };

  public func deleteMovie(token : Text, id : Nat) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    let before = movies.size();
    movies := movies.filter(func(m : Movie) : Bool { m.id != id });
    movies.size() < before
  };

  public query func getMovies(page : Nat, pageSize : Nat) : async { movies : [Movie]; total : Nat } {
    let total = movies.size();
    let start = page * pageSize;
    if (start >= total) {
      return { movies = []; total }
    };
    let end = Nat.min(start + pageSize, total);
    let slice = Array.tabulate(end - start, func(i : Nat) : Movie { movies[start + i] });
    { movies = slice; total }
  };

  public query func getMovie(id : Nat) : async ?Movie {
    movies.find(func(m : Movie) : Bool { m.id == id })
  };

  // ─── PIN Code Management ──────────────────────────────────────────────────

  public func createPinCode(token : Text, expiryType : ExpiryType) : async { ok : Bool; code : Text } {
    if (token != adminSessionToken or token == "") { return { ok = false; code = "" } };
    markExpiredPins();
    let now = Time.now();
    let code = generateCode(now + pinCodes.size());
    let pin : PinCode = {
      code;
      expiryType;
      createdAt = now;
      expiresAt = now + expiryDuration(expiryType);
      isActive = true;
    };
    pinCodes := push(pinCodes, pin);
    { ok = true; code }
  };

  public query func listPinCodes(token : Text) : async { ok : Bool; pins : [PinCode] } {
    if (token != adminSessionToken or token == "") { return { ok = false; pins = [] } };
    { ok = true; pins = pinCodes }
  };

  public func revokePinCode(token : Text, code : Text) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    var found = false;
    pinCodes := pinCodes.map(func(p : PinCode) : PinCode {
      if (p.code == code) {
        found := true;
        { p with isActive = false }
      } else { p }
    });
    found
  };

  public func validatePinCode(code : Text) : async { ok : Bool; deviceToken : Text } {
    markExpiredPins();
    switch (pinCodes.find(func(p : PinCode) : Bool { p.code == code })) {
      case null { { ok = false; deviceToken = "" } };
      case (?pin) {
        if (not pin.isActive or isPinExpired(pin)) {
          { ok = false; deviceToken = "" }
        } else {
          let tok = generateToken(Time.now() + code.size());
          let dt : DeviceToken = { token = tok; pinCode = code; createdAt = Time.now() };
          deviceTokens := push(deviceTokens, dt);
          { ok = true; deviceToken = tok }
        }
      };
    }
  };

  public func checkDeviceToken(deviceToken : Text) : async Bool {
    markExpiredPins();
    switch (deviceTokens.find(func(dt : DeviceToken) : Bool { dt.token == deviceToken })) {
      case null { false };
      case (?dt) {
        switch (pinCodes.find(func(p : PinCode) : Bool { p.code == dt.pinCode })) {
          case null { false };
          case (?pin) { pin.isActive and not isPinExpired(pin) };
        }
      };
    }
  };

}
