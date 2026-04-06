type CookieOptions = {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
};

const cookiesNames = ["authToken", "userData", "better-auth.session_token"] as const

type CookieName = typeof cookiesNames[number]

// get cookie
export function getCookie(name: CookieName): string | null {
  const cookies = document.cookie.split("; ");
  
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      const decoded = decodeURIComponent(value);

      try {
        return JSON.parse(decoded); // if it's JSON
      } catch {
        return decoded; // fallback to string
      }
    }
  }

  return null;
}

// set cookie
export function setCookie(
  name: CookieName,
  value: string,
  options: CookieOptions = {}
): void {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookie += `; expires=${date.toUTCString()}`;
  }

  cookie += `; path=${options.path ?? "/"}`;

  if (options.secure) cookie += "; secure";
  if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

  document.cookie = cookie;
}

// delete cookie
export function deleteCookie(name: CookieName, path: string = "/"): void {
  document.cookie = `${name}=; Max-Age=0; path=${path}`;
}

// get all cookies
export function getAllCookies(): Record<string, string> {
  if (!document.cookie) return {};

  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);
}