// utils/validateUrl.js

// export const normalizeUrl = (url) => {
//     if (!url || typeof url !== 'string') return null;

//     let cleaned = url.trim();

//     if (/^https?:\/\//i.test(cleaned)) {
//         try {
//             return new URL(cleaned).toString();
//         } catch {
//             return null;
//         }
//     }

//     // Must look like domain + have reasonable TLD
//     const looksLikeDomain = 
//         cleaned.includes('.') &&
//         !cleaned.startsWith('.') &&
//         !cleaned.endsWith('.') &&
//         !cleaned.includes(' ') &&
//         /\.[a-zA-Z]{2,6}$/.test(cleaned) &&           // .com .in .org .co etc
//         cleaned.length >= 6 && cleaned.length <= 253;

//     if (!looksLikeDomain) {
//         return null;
//     }

//     try {
//         return `https://${cleaned}`;
//     } catch {
//         return null;
//     }
// };

export const normalizeUrl = (input) => {
    if (!input || typeof input !== 'string') return null;

    const str = input.trim();

    // 1. If it already has protocol → validate as full URL
    if (/^https?:\/\//i.test(str)) {
        try {
            const url = new URL(str);
            return url.href;
        } catch {
            return null;
        }
    }

    // 2. Otherwise treat as domain name — stricter check
    const domainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!domainRegex.test(str)) {
        return null;
    }

    // 3. Optional: require reasonable TLD length (most common practice)
    const lastDot = str.lastIndexOf('.');
    const tld = str.slice(lastDot + 1);
    if (tld.length < 2 || tld.length > 6) {
        return null;
    }

    // 4. Looks good → add https
    try {
        return `https://${str}`;
    } catch {
        return null;
    }
};

export const isValidUrl = (url) => {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};