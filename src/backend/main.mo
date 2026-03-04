import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";



actor {
  // Types
  type Movie = {
    id : Nat;
    title : Text;
    posterUrl : Text;
    videoUrl : Text;
    createdAt : Int;
  };

  type ExpiryType = { #twentyMinutes; #thirtyDays; #ninetyDays; #unlimited };

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

  // Admin credentials
  var adminUsername : Text = "admin";
  var adminPassword : Text = "Drama2024!";
  var adminSessionToken : Text = "";

  // Movies management
  var movies : [Movie] = [];
  var nextMovieId : Nat = 1;

  // PIN codes management
  var pinCodes : [PinCode] = [];
  var deviceTokens : [DeviceToken] = [];

  // Helper functions
  func natToChar(n : Nat) : Char {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let arr = chars.toArray();
    let idx = n % arr.size();
    arr[idx];
  };

  func generateCode(seed : Int) : Text {
    var s = Int.abs(seed);
    var code = "";
    var i = 0;
    while (i < 6) {
      code := code # Text.fromChar(natToChar(s % 32));
      s := s / 7 + s * 3 + i * 13 + 97;
      i += 1;
    };
    code;
  };

  func generateToken(seed : Int) : Text {
    var s = Int.abs(seed);
    var tok = "";
    var i = 0;
    while (i < 32) {
      tok := tok # Text.fromChar(natToChar(s % 32));
      s := s / 11 + s * 5 + i * 17 + 53;
      i += 1;
    };
    tok;
  };

  func expiryDuration(e : ExpiryType) : Int {
    switch (e) {
      case (#twentyMinutes) { 20 * 60 * 1_000_000_000 };
      case (#thirtyDays) { 30 * 24 * 60 * 60 * 1_000_000_000 };
      case (#ninetyDays) { 90 * 24 * 60 * 60 * 1_000_000_000 };
      case (#unlimited) { -1 };
    };
  };

  func isPinExpired(pin : PinCode) : Bool {
    if (pin.expiresAt == -1) { false } else {
      Time.now() > pin.expiresAt;
    };
  };

  func push<T>(arr : [T], item : T) : [T] {
    arr.concat([item]);
  };

  func markExpiredPins() {
    pinCodes := pinCodes.map(func(p : PinCode) : PinCode {
      if (p.isActive and isPinExpired(p)) {
        { p with isActive = false };
      } else { p };
    });
  };

  // Admin Auth
  public query ({ caller }) func getInitialCredentials() : async { username : Text; password : Text } {
    { username = adminUsername; password = adminPassword };
  };

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async { ok : Bool; token : Text } {
    if (username == adminUsername and password == adminPassword) {
      let tok = generateToken(Time.now() + 9999);
      adminSessionToken := tok;
      { ok = true; token = tok };
    } else {
      { ok = false; token = "" };
    };
  };

  public shared ({ caller }) func adminLogout(token : Text) : async Bool {
    if (token == adminSessionToken) {
      adminSessionToken := "";
      true;
    } else { false };
  };

  public query ({ caller }) func validateAdminToken(token : Text) : async Bool {
    token != "" and token == adminSessionToken;
  };

  public shared ({ caller }) func updateAdminCredentials(token : Text, newUsername : Text, newPassword : Text) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    adminUsername := newUsername;
    adminPassword := newPassword;
    true;
  };

  // Movie CRUD
  public shared ({ caller }) func addMovie(token : Text, title : Text, posterUrl : Text, videoUrl : Text) : async { ok : Bool; id : Nat } {
    if (token != adminSessionToken or token == "") { return { ok = false; id = 0 } };
    let id = nextMovieId;
    nextMovieId += 1;
    let movie : Movie = { id; title; posterUrl; videoUrl; createdAt = Time.now() };
    movies := push(movies, movie);
    { ok = true; id };
  };

  public shared ({ caller }) func updateMovie(token : Text, id : Nat, title : Text, posterUrl : Text, videoUrl : Text) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    var found = false;
    movies := movies.map(func(m : Movie) : Movie {
      if (m.id == id) {
        found := true;
        { m with title; posterUrl; videoUrl };
      } else { m };
    });
    found;
  };

  public shared ({ caller }) func deleteMovie(token : Text, id : Nat) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    let before = movies.size();
    movies := movies.filter(func(m : Movie) : Bool { m.id != id });
    movies.size() < before;
  };

  public query ({ caller }) func getMovies(page : Nat, pageSize : Nat) : async { movies : [Movie]; total : Nat } {
    let total = movies.size();
    let start = page * pageSize;
    if (start >= total) {
      return { movies = []; total };
    };
    let end = Nat.min(start + pageSize, total);
    let slice = movies.sliceToArray(start, end);
    { movies = slice; total };
  };

  public query ({ caller }) func getMovie(id : Nat) : async ?Movie {
    movies.find(func(m : Movie) : Bool { m.id == id });
  };

  // PIN Code Management
  public shared ({ caller }) func createPinCode(token : Text, expiryType : ExpiryType) : async { ok : Bool; code : Text } {
    if (token != adminSessionToken or token == "") { return { ok = false; code = "" } };
    markExpiredPins();
    let now = Time.now();
    let code = generateCode(now + pinCodes.size());
    let expiresAt = if (expiryType == #unlimited) { -1 } else {
      now + expiryDuration(expiryType);
    };
    let pin : PinCode = {
      code;
      expiryType;
      createdAt = now;
      expiresAt;
      isActive = true;
    };
    pinCodes := push(pinCodes, pin);
    { ok = true; code };
  };

  public query ({ caller }) func listPinCodes(token : Text) : async { ok : Bool; pins : [PinCode] } {
    if (token != adminSessionToken or token == "") { return { ok = false; pins = [] } };
    { ok = true; pins = pinCodes };
  };

  public shared ({ caller }) func revokePinCode(token : Text, code : Text) : async Bool {
    if (token != adminSessionToken or token == "") { return false };
    var found = false;
    pinCodes := pinCodes.map(func(p : PinCode) : PinCode {
      if (p.code == code) {
        found := true;
        { p with isActive = false };
      } else { p };
    });
    found;
  };

  public shared ({ caller }) func validatePinCode(code : Text) : async { ok : Bool; deviceToken : Text } {
    markExpiredPins();
    switch (pinCodes.find(func(p : PinCode) : Bool { p.code == code })) {
      case (null) { { ok = false; deviceToken = "" } };
      case (?pin) {
        if (not pin.isActive or isPinExpired(pin)) {
          { ok = false; deviceToken = "" };
        } else {
          let tok = generateToken(Time.now() + code.size());
          let dt : DeviceToken = { token = tok; pinCode = code; createdAt = Time.now() };
          deviceTokens := push(deviceTokens, dt);
          { ok = true; deviceToken = tok };
        };
      };
    };
  };

  public shared ({ caller }) func checkDeviceToken(deviceToken : Text) : async Bool {
    markExpiredPins();
    switch (deviceTokens.find(func(dt : DeviceToken) : Bool { dt.token == deviceToken })) {
      case (null) { false };
      case (?dt) {
        switch (pinCodes.find(func(p : PinCode) : Bool { p.code == dt.pinCode })) {
          case (null) { false };
          case (?pin) { pin.isActive and not isPinExpired(pin) };
        };
      };
    };
  };
};
