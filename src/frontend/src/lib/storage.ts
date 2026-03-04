// ─── Types ────────────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  videoUrl: string;
  createdAt: number;
}

export type ExpiryType = "twentyMinutes" | "thirtyDays" | "ninetyDays";

export interface PinCode {
  code: string;
  expiryType: ExpiryType;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
}

export interface DeviceTokenRecord {
  token: string;
  pinCode: string;
  expiresAt: number;
}

export interface AdminCreds {
  username: string;
  password: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  MOVIES: "drama_movies",
  PINS: "drama_pins",
  ADMIN_CREDS: "drama_admin_creds",
  DEVICE_TOKEN: "drama_device_token",
  TOKENS_DB: "drama_tokens_db",
} as const;

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_MOVIES: Movie[] = [
  {
    id: 1,
    title: "용이 뜨는 전설 (Dragon Rising)",
    posterUrl: "https://picsum.photos/seed/drama1/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama1.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 2,
    title: "황후의 귀환 (Empress Returns)",
    posterUrl: "https://picsum.photos/seed/drama2/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama2.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 28,
  },
  {
    id: 3,
    title: "검의 맹세 (Oath of the Sword)",
    posterUrl: "https://picsum.photos/seed/drama3/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama3.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 4,
    title: "봄꽃의 눈물 (Tears of Spring Blossom)",
    posterUrl: "https://picsum.photos/seed/drama4/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama4.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 22,
  },
  {
    id: 5,
    title: "천하제일 무림 (Supreme Wulin)",
    posterUrl: "https://picsum.photos/seed/drama5/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama5.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 6,
    title: "달빛 아래서 (Under Moonlight)",
    posterUrl: "https://picsum.photos/seed/drama6/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama6.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    id: 7,
    title: "불꽃 왕조 (Dynasty of Flames)",
    posterUrl: "https://picsum.photos/seed/drama7/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama7.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 17,
  },
  {
    id: 8,
    title: "옥루의 비밀 (Secret of Jade Tower)",
    posterUrl: "https://picsum.photos/seed/drama8/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama8.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 9,
    title: "하늘의 전쟁 (War of Heavens)",
    posterUrl: "https://picsum.photos/seed/drama9/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama9.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: 10,
    title: "천년의 사랑 (Love of a Thousand Years)",
    posterUrl: "https://picsum.photos/seed/drama10/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama10.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 11,
    title: "황금 봉황 (Golden Phoenix)",
    posterUrl: "https://picsum.photos/seed/drama11/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama11.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 11,
  },
  {
    id: 12,
    title: "설원의 기사 (Knight of Snow Plains)",
    posterUrl: "https://picsum.photos/seed/drama12/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama12.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 13,
    title: "잊혀진 궁전 (Forgotten Palace)",
    posterUrl: "https://picsum.photos/seed/drama13/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama13.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 9,
  },
  {
    id: 14,
    title: "붉은 실의 인연 (Red Thread of Fate)",
    posterUrl: "https://picsum.photos/seed/drama14/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama14.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 15,
    title: "제왕의 심장 (Heart of the Emperor)",
    posterUrl: "https://picsum.photos/seed/drama15/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama15.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 16,
    title: "매화의 향기 (Plum Blossom Fragrance)",
    posterUrl: "https://picsum.photos/seed/drama16/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama16.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 17,
    title: "신선의 길 (Path of Immortals)",
    posterUrl: "https://picsum.photos/seed/drama17/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama17.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 18,
    title: "별빛 전쟁 (Star Wars of Dynasties)",
    posterUrl: "https://picsum.photos/seed/drama18/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama18.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 19,
    title: "청룡의 검 (Sword of Blue Dragon)",
    posterUrl: "https://picsum.photos/seed/drama19/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama19.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 20,
    title: "운명의 황태자 (Crown Prince of Destiny)",
    posterUrl: "https://picsum.photos/seed/drama20/300/420",
    videoUrl: "https://www.dropbox.com/s/example/drama20.mp4?raw=1",
    createdAt: Date.now() - 86400000 * 2,
  },
];

const SEED_PINS: PinCode[] = [
  {
    code: "DEMO01",
    expiryType: "ninetyDays",
    createdAt: Date.now(),
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
    isActive: true,
  },
];

const SEED_ADMIN: AdminCreds = {
  username: "admin",
  password: "Drama2024!",
};

// ─── Generic helpers ──────────────────────────────────────────────────────────

function getLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLS<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Initialize / seed ────────────────────────────────────────────────────────

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.MOVIES)) {
    setLS(KEYS.MOVIES, SEED_MOVIES);
  }
  if (!localStorage.getItem(KEYS.PINS)) {
    setLS(KEYS.PINS, SEED_PINS);
  }
  if (!localStorage.getItem(KEYS.ADMIN_CREDS)) {
    setLS(KEYS.ADMIN_CREDS, SEED_ADMIN);
  }
  if (!localStorage.getItem(KEYS.TOKENS_DB)) {
    setLS<DeviceTokenRecord[]>(KEYS.TOKENS_DB, []);
  }
}

// ─── Movies ───────────────────────────────────────────────────────────────────

export function getMovies(): Movie[] {
  return getLS<Movie[]>(KEYS.MOVIES, []);
}

export function saveMovies(movies: Movie[]): void {
  setLS(KEYS.MOVIES, movies);
}

export function addMovie(movie: Omit<Movie, "id" | "createdAt">): Movie {
  const movies = getMovies();
  const id = movies.length > 0 ? Math.max(...movies.map((m) => m.id)) + 1 : 1;
  const newMovie: Movie = { ...movie, id, createdAt: Date.now() };
  saveMovies([...movies, newMovie]);
  return newMovie;
}

export function updateMovie(
  id: number,
  updates: Partial<Omit<Movie, "id" | "createdAt">>,
): void {
  const movies = getMovies().map((m) =>
    m.id === id ? { ...m, ...updates } : m,
  );
  saveMovies(movies);
}

export function deleteMovie(id: number): void {
  saveMovies(getMovies().filter((m) => m.id !== id));
}

// ─── PIN Codes ────────────────────────────────────────────────────────────────

export function getPins(): PinCode[] {
  return getLS<PinCode[]>(KEYS.PINS, []);
}

function savePins(pins: PinCode[]): void {
  setLS(KEYS.PINS, pins);
}

export function generatePinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

export function expiryDuration(type: ExpiryType): number {
  switch (type) {
    case "twentyMinutes":
      return 20 * 60 * 1000;
    case "thirtyDays":
      return 30 * 24 * 60 * 60 * 1000;
    case "ninetyDays":
      return 90 * 24 * 60 * 60 * 1000;
  }
}

export function createPin(expiryType: ExpiryType): PinCode {
  const pins = getPins();
  const code = generatePinCode();
  const now = Date.now();
  const pin: PinCode = {
    code,
    expiryType,
    createdAt: now,
    expiresAt: now + expiryDuration(expiryType),
    isActive: true,
  };
  savePins([...pins, pin]);
  return pin;
}

export function revokePin(code: string): void {
  savePins(
    getPins().map((p) => (p.code === code ? { ...p, isActive: false } : p)),
  );
}

export function validatePin(code: string): PinCode | null {
  const pins = getPins();
  const pin = pins.find((p) => p.code === code.toUpperCase());
  if (!pin) return null;
  if (!pin.isActive) return null;
  if (Date.now() > pin.expiresAt) {
    // Auto-expire
    revokePin(pin.code);
    return null;
  }
  return pin;
}

// ─── Device tokens ────────────────────────────────────────────────────────────

function getTokensDb(): DeviceTokenRecord[] {
  return getLS<DeviceTokenRecord[]>(KEYS.TOKENS_DB, []);
}

function saveTokensDb(records: DeviceTokenRecord[]): void {
  setLS(KEYS.TOKENS_DB, records);
}

export function generateDeviceToken(): string {
  return `dt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function registerDeviceToken(
  pinCode: string,
  expiresAt: number,
): string {
  const token = generateDeviceToken();
  const db = getTokensDb();
  saveTokensDb([...db, { token, pinCode, expiresAt }]);
  localStorage.setItem(KEYS.DEVICE_TOKEN, token);
  return token;
}

export function isDeviceAuthenticated(): boolean {
  const token = localStorage.getItem(KEYS.DEVICE_TOKEN);
  if (!token) return false;
  const db = getTokensDb();
  const record = db.find((r) => r.token === token);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    // Invalidate
    localStorage.removeItem(KEYS.DEVICE_TOKEN);
    saveTokensDb(db.filter((r) => r.token !== token));
    return false;
  }
  return true;
}

export function clearDeviceAuth(): void {
  localStorage.removeItem(KEYS.DEVICE_TOKEN);
}

// ─── Admin Credentials ────────────────────────────────────────────────────────

export function getAdminCreds(): AdminCreds {
  return getLS<AdminCreds>(KEYS.ADMIN_CREDS, SEED_ADMIN);
}

export function saveAdminCreds(creds: AdminCreds): void {
  setLS(KEYS.ADMIN_CREDS, creds);
}

export function validateAdmin(username: string, password: string): boolean {
  const creds = getAdminCreds();
  return creds.username === username && creds.password === password;
}

// Admin session (sessionStorage)
export function setAdminSession(): void {
  sessionStorage.setItem("drama_admin_token", "active");
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem("drama_admin_token") === "active";
}

export function clearAdminSession(): void {
  sessionStorage.removeItem("drama_admin_token");
}

// ─── Expiry label ─────────────────────────────────────────────────────────────

export function expiryLabel(type: ExpiryType): string {
  switch (type) {
    case "twentyMinutes":
      return "20 минут";
    case "thirtyDays":
      return "30 хоног";
    case "ninetyDays":
      return "90 хоног";
  }
}

export function formatExpiry(ts: number): string {
  return new Date(ts).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
