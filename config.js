const API_BASE_URL = 'http://localhost:5000/api';

// Cache utility
const cacheData = (key, data, ttlMinutes = 5) => {
    const now = new Date();
    const item = {
        data: data,
        expiry: now.getTime() + (ttlMinutes * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
};

const getCachedData = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.data;
};

// Fetch wrapper with cache support
const fetchWithCache = async (endpoint, options = {}, useCache = false, cacheKey = '', ttlMinutes = 5) => {
    if (useCache && cacheKey) {
        const cached = getCachedData(cacheKey);
        if (cached) return cached;
    }

    // Ensure cookies are sent with requests
    options.credentials = 'include';
    
    const cacheBuster = endpoint.includes('?') ? `&_t=${new Date().getTime()}` : `?_t=${new Date().getTime()}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}${cacheBuster}`, options);
    const data = await res.json();

    if (useCache && cacheKey && data.success) {
        cacheData(cacheKey, data, ttlMinutes);
    }
    return data;
};

const formatPrice = (priceStr) => {
    if (!priceStr) return 'Price on Request';
    
    // If it already has text like 'Cr', 'L', 'Lakh', etc., return it as is
    if (/[a-zA-Z]/.test(priceStr)) {
        // Just add ₹ symbol if it doesn't have it
        return priceStr.includes('₹') ? priceStr : '₹ ' + priceStr;
    }

    let val = parseFloat(priceStr);
    if (isNaN(val)) return priceStr;

    if (val >= 10000000) {
        return '₹ ' + (val / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
    } else if (val >= 100000) {
        return '₹ ' + (val / 100000).toFixed(2).replace(/\.00$/, '') + ' L';
    } else {
        return '₹ ' + val.toLocaleString('en-IN');
    }
};

window.api = {
    API_BASE_URL,
    fetchWithCache,
    cacheData,
    getCachedData,
    formatPrice
};
