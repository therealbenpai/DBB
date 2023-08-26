class CustomMath {
    static devideWithRemainder = (a, b) => [Math.floor(a / b), a % b];
    static collatz = (startingNumber = 5, maxIterations = 100) => {
        if (startingNumber <= 0) throw new SyntaxError('Starting Number must be greater than 0');
        let iterations = 0,
            finished = false,
            maxNumberIndex = 0,
            maxNumber = startingNumber,
            currentNumber = startingNumber;
        while (iterations < maxIterations) {
            currentNumber = (currentNumber % 2 == 1) ? (currentNumber * 3) + 1 : currentNumber / 2;
            if (currentNumber > maxNumber) {
                maxNumber = Math.max(maxNumber, currentNumber);
                maxNumberIndex = iterations;
            }
            iterations++;
            if (currentNumber == 4) { finished = true; break }
        }
        return { iterations, finished, maxNumberIndex, maxNumber, currentNumber };
    }
}

class Timer {
    static #timesettings = {
        locale: 'en-US',
        options: {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            weekday: "long",
            timeZone: "Australia/Darwin",
            timeZoneName: "longGeneric",
        }
    }
    static timestamp = v => new Intl.DateTimeFormat(this.#timesettings.locale, this.#timesettings.options).format(v)
    static elapsedTime = (timestamp) => isNaN(timestamp) ? TypeError("Timestamp must be a number") : Object.entries({ year: Math.floor(Math.floor(timestamp) / 60 / 60 / 24 / 30 / 12), month: Math.floor(Math.floor(timestamp) / 60 / 60 / 24 / 30) % 12, day: Math.floor(Math.floor(timestamp) / 60 / 60 / 24) % 30, hour: Math.floor(Math.floor(timestamp) / 60 / 60) % 24, minute: Math.floor(Math.floor(timestamp) / 60) % 60, second: Math.floor(timestamp) % 60 }).map(([key, value]) => value !== 0 ? `${value} ${key}${value == 1 ? '' : 's'}` : null).filter(value => value !== null).join(', ')
    static stringToMilliseconds = (timeString) => typeof timeString !== 'string' ? TypeError("Time String must be a string") : timeString.split(' ').map(value => { switch (value.slice(-1)) { case 'w': return value.slice(0, -1) * 604800000; case 'd': return value.slice(0, -1) * 86400000; case 'h': return value.slice(0, -1) * 3600000; case 'm': return value.slice(0, -1) * 60000; case 's': return value.slice(0, -1) * 1000; } }).reduce((a, b) => a + b, 0);
    static stringToSeconds = (timeString) => this.stringToMilliseconds(timeString) / 1000;
    static unixTime = (date) => (!(date instanceof Date) || !(typeof date == 'number')) ? TypeError("Date must be a Date object") : Math.round(date.getTime() / 1000)
}

class Converter {
    static stringToBinary = (string) => string.split('').map(char => String(char).charCodeAt(0).toString(2)).join(' ')
    static binaryToString = (binary) => binary.split(' ').map(char => String.fromCharCode(parseInt(char, 2).toString(10))).join('')
    static stringToHex = (string) => string.split('').map(char => String(char).charCodeAt(0).toString(16)).join(' ')
    static hexToString = (hex) => hex.split(' ').map(char => String.fromCharCode(parseInt(char, 16).toString(10))).join('')
    static stringToBase32 = (string) => string.split('').map(char => String(char).charCodeAt(0).toString(32)).join(' ')
    static base32ToString = (base32) => base32.split(' ').map(char => String.fromCharCode(parseInt(char, 32).toString(10))).join('')
}

class RandomGenerators {
    static ranNum = (max = 10) => Math.round(Math.random() * Math.max(max, 1))
    static bRanNum = (amount = 1, max = 10) => new Array(Math.max(amount, 1)).map(() => this.ranNum(max))
    static randHex = (prefix = '') => `${prefix}${Math.floor(Math.random() * Math.pow(16, 6)).toString(16)}`
    static bRandHex = (amount = 1, prefix = '') => new Array(Math.max(amount, 1)).map(() => this.randHex(prefix))
    static customNumberGenerator = (min = 0, max = 100) => {
        if (max <= 0 || min <= 0) throw new RangeError("Both min and max need to be above 0");
        if (!(min < max)) throw new RangeError("min must be less than max");
        if (max > Math.pow(10, 6)) throw new RangeError(`max must be less than ${Intl.NumberFormat('en-US').format(Math.pow(10, 6))}`);
        return Math.round(Math.random() * Number(max) - Number(min)) + Number(min)
    }
    static UUID = _ => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
    static randomString = (length = 10) => Array(length).map(_ => (Math.random() * 36 | 0).toString(36)).join('')
}

class Formatter {
    static formatNumber = (v) => new Intl.NumberFormat('en-US').format(v)
    static relativeTime = (v = new Date()) => new Intl.RelativeTimeFormat('en-US', { style: 'long' }).format(v)
    static formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
    static list = (v) => new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(v)
    static sort = (a, b) => Intl.Collator('en-US', { caseFirst: 'upper', numeric: true }).compare(a, b)
}

class ArrayAndJSON {
    static combineArrays = (array1, array2) => [...array1, ...array2]
    static combineJSON = (json1, json2) => ({ ...json1, ...json2 })
    static arrayToJSON = (array) => {
        let json = {};
        array.forEach((v, i) => {
            json[i] = v;
        });
        return json;
    }
    static JSONToArray = (json, keys = false) => (keys) ? Object.entries(json) : Object.values(json)
    static arrayToSet = (array) => new Set(array)
    static setToArray = (set) => [...set]
    static arrayToMap = (array) => new Map(array)
    static mapToArray = (map) => [...map]
    static #privateArrayRandomizer = (array) => array.sort(() => Math.random() > 0.5 ? 1 : -1)
    static arrayRandomizer = (array, iterations = 25) => {
        let newArray = array,
            i = 0;
        while (i < iterations) newArray = this.#privateArrayRandomizer(newArray); i++;
        return newArray;
    }
}

class Cryptography {
    static Utf8Encode = (string) => string.replace(/\r\n/g, '\n').split('').map((c) => c.charCodeAt(0)).map(char => { if (char < 128) return String.fromCharCode(char); else if ((char > 127) && (char < 2048)) return String.fromCharCode((char >> 6) | 192) + String.fromCharCode((char & 63) | 128); else return String.fromCharCode((char >> 12) | 224) + String.fromCharCode(((char >> 6) & 63) | 128) + String.fromCharCode((char & 63) | 128); }).join('');
    static SHA1 = (msg) => {
        const rotate_left = (n, s) => (n << s) | (n >>> (32 - s))
        const cvt_hex = (val) => {
            let str = '';
            for (let i = 7; i >= 0; i--) str += ((val >>> (i * 4)) & 0x0f).toString(16);
            return str;
        };
        msg = this.Utf8Encode(msg);
        let blockstart,
            i,
            W = new Array(80),
            H0 = 0x67452301,
            H1 = 0xEFCDAB89,
            H2 = 0x98BADCFE,
            H3 = 0x10325476,
            H4 = 0xC3D2E1F0,
            A,
            B,
            C,
            D,
            E,
            temp,
            word_array = new Array();
        for (let i = 0; i < msg.length - 3; i += 4) word_array.push(msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3));
        switch (msg.length % 4) {
            case 0: i = 0x080000000; break
            case 1: i = msg.charCodeAt(msg.length - 1) << 24 | 0x0800000; break
            case 2: i = msg.charCodeAt(msg.length - 2) << 24 | msg.charCodeAt(msg.length - 1) << 16 | 0x08000; break
            case 3: i = msg.charCodeAt(msg.length - 3) << 24 | msg.charCodeAt(msg.length - 2) << 16 | msg.charCodeAt(msg.length - 1) << 8 | 0x80; break
        }
        word_array.push(i);
        while ((word_array.length % 16) != 14) word_array.push(0);
        word_array.push(
            msg.length >>> 29,
            (msg.length << 3) & 0x0ffffffff
        );
        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (let i = 0; i < 80; i++) (i < 16) ? W[i] = word_array[blockstart + i] : W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            [A, B, C, D, E, int] = [H0, H1, H2, H3, H4, 0];
            while (int < 80) {
                if (int < 20) {
                    temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[int] + 0x5A827999) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B, 30);
                    B = A;
                    A = temp;
                } else if (int < 40) {
                    temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[int] + 0x6ED9EBA1) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B, 30);
                    B = A;
                    A = temp;
                } else if (int < 60) {
                    temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[int] + 0x8F1BBCDC) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B, 30);
                    B = A;
                    A = temp;
                } else {
                    temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[int] + 0xCA62C1D6) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B, 30);
                    B = A;
                    A = temp;
                }
                int++;
            }
            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }
        return (cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4)).toLowerCase();
    }
    static SHA256 = (msg) => {
        msg = this.Utf8Encode(msg.toString(16));
        let K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
            0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
            0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        let H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];

        msg += String.fromCharCode(0x80);
        let N = Math.ceil((msg.length / 4 + 2) / 16);
        let M = new Array(N);

        for (let i = 0; i < N; i++) {
            M[i] = new Array(16);
            for (let j = 0; j < 16; j++) {
                M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                    (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
            }
        }
        M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32); M[N - 1][14] = Math.floor(M[N - 1][14]);
        M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;

        let W = new Array(64);
        for (let i = 0; i < N; i++) {

            let t = 0;
            while (t < 64) {
                if (t < 16) W[t] = M[i][t];
                else W[t] = (((W[t - 2] >>> 17) | (W[t - 2] << (32 - 17)) ^ (W[t - 2] >>> 19) | (W[t - 2] << (32 - 19)) ^ (W[t - 2] >>> 10)) + W[t - 7] + ((W[t - 15] >>> 7) | (W[t - 15] << (32 - 7)) ^ (W[t - 15] >>> 18) | (W[t - 15] << (32 - 18)) ^ (W[t - 15] >>> 3)) + W[t - 16]) & 0xffffffff
                t++;
            }

            let [a, b, c, d, e, f, g, h] = H

            for (let x = 0; x < 64; x++) {
                let T1 = h + ((e >>> 6) | (e << (32 - 6)) ^ (e >>> 11) | (e << (32 - 11)) ^ (e >>> 25) | (e << (32 - 25))) + ((e & f) ^ (~e & g)) + K[x] + W[x];
                let T2 = ((a >>> 2) | (a << (32 - 2)) ^ (a >>> 13) | (a << (32 - 13)) ^ (a >>> 22) | (a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c));
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }
            H = [
                (H[0] + a) & 0xffffffff,
                (H[1] + b) & 0xffffffff,
                (H[2] + c) & 0xffffffff,
                (H[3] + d) & 0xffffffff,
                (H[4] + e) & 0xffffffff,
                (H[5] + f) & 0xffffffff,
                (H[6] + g) & 0xffffffff,
                (H[7] + h) & 0xffffffff
            ];
        }

        return H.map(section => { let s = ''; for (let i = 7; i >= 0; i--) s += ((section >>> (i * 4)) & 0xf).toString(16); return s; }).join('')
    };

    static SHA512 = (str) => {
        class int64 {
            constructor(msint_32, lsint_32) {
                this.highOrder = msint_32;
                this.lowOrder = lsint_32;
            }
        }

        let H = [
            new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
            new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
            new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
            new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)
        ];

        let K = [
            new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
            new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
            new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
            new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
            new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
            new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
            new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
            new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
            new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
            new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
            new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
            new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
            new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
            new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
            new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
            new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
            new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
            new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
            new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
            new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
            new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
            new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
            new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
            new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
            new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
            new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
            new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
            new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
            new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
            new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
            new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
            new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
            new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
            new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
            new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
            new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
            new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
            new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
            new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
            new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
        ];

        let W = new Array(64),
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            T1,
            T2;

        const str2binb = (str) => {
            let bin = [];
            for (let i = 0; i < (str.length * 8); i += 8) bin[i >> 5] |= (str.charCodeAt(i / 8) & ((1 << 8) - 1)) << (32 - 8 - (i % 32));
            return bin;
        }

        const binb2hex = (binarray) => {
            let str = ''
            for (let i = 0; i < binarray.length * 4; i++) str += ('0123456789abcdef').charAt(((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) >> 4) & 0xF) + '0123456789abcdef'.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xF);
            return str;
        }

        const safe_add_2 = (x, y) => {
            let lsw, msw, lowOrder, highOrder;

            lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
            msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
            lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
            highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            return new int64(highOrder, lowOrder);
        }

        const safe_add_4 = (a, b, c, d) => {
            let lsw, msw, lowOrder, highOrder;

            lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
            msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
            lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
            highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            return new int64(highOrder, lowOrder);
        }

        const safe_add_5 = (a, b, c, d, e) => {
            let lsw, msw, lowOrder, highOrder;

            lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
            msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
            lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
            highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            return new int64(highOrder, lowOrder);
        }

        const maj = (x, y, z) => new int64((x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder), (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder));

        const ch = (x, y, z) => new int64((x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder), (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder));

        const rotr = (x, n) => (n <= 32) ? new int64((x.highOrder >>> n) | (x.lowOrder << (32 - n)), (x.lowOrder >>> n) | (x.highOrder << (32 - n))) : new int64((x.lowOrder >>> n) | (x.highOrder << (32 - n)), (x.highOrder >>> n) | (x.lowOrder << (32 - n)));

        const sigma0 = (x) => new int64(rotr(x, 28).highOrder ^ rotr(x, 34).highOrder ^ rotr(x, 39).highOrder, rotr(x, 28).lowOrder ^ rotr(x, 34).lowOrder ^ rotr(x, 39).lowOrder);

        const sigma1 = (x) => new int64(rotr(x, 14).highOrder ^ rotr(x, 18).highOrder ^ rotr(x, 41).highOrder, rotr(x, 14).lowOrder ^ rotr(x, 18).lowOrder ^ rotr(x, 41).lowOrder);

        const gamma0 = (x) => new int64(rotr(x, 1).highOrder ^ rotr(x, 8).highOrder ^ shr(x, 7).highOrder, rotr(x, 1).lowOrder ^ rotr(x, 8).lowOrder ^ shr(x, 7).lowOrder);

        const gamma1 = (x) => new int64(rotr(x, 19).highOrder ^ rotr(x, 61).highOrder ^ shr(x, 6).highOrder, rotr(x, 19).lowOrder ^ rotr(x, 61).lowOrder ^ shr(x, 6).lowOrder);

        const shr = (x, n) => (n <= 32) ? new int64(x.highOrder >>> n, x.lowOrder >>> n | (x.highOrder << (32 - n))) : new int64(0, x.highOrder << (32 - n));

        str = str2binb(this.Utf8Encode(str));

        str[(str.length * 8) >> 5] |= 0x80 << (24 - (str.length * 8) % 32);
        str[((((str.length * 8) + 128) >> 10) << 5) + 31] = (str.length * 8);

        for (let i = 0; i < str.length; i += 32) {
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];

            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    W[j] = new int64(str[j * 2 + i], str[j * 2 + i + 1]);
                } else {
                    W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
                }

                T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
                T2 = safe_add_2(sigma0(a), maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add_2(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add_2(T1, T2);
            }

            H = [
                safe_add_2(a, H[0]),
                safe_add_2(b, H[1]),
                safe_add_2(c, H[2]),
                safe_add_2(d, H[3]),
                safe_add_2(e, H[4]),
                safe_add_2(f, H[5]),
                safe_add_2(g, H[6]),
                safe_add_2(h, H[7])
            ]
        }

        let binarray = [];
        H.forEach((h) => binarray.push(h.highOrder, h.lowOrder));
        return binb2hex(binarray);
    }
    static FullHash = (str) => this.SHA1(this.SHA256(this.SHA512(str)))
    static keyGen = (length) => new Array(new Number(length)).map(() => Math.ceil(Math.random() * 9)).join('')
}

module.exports = class Utils {
    static CustomMath = CustomMath
    static Time = Timer
    static Converter = Converter
    static Random = RandomGenerators
    static Formatter = Formatter
    static ArrayAndJSON = ArrayAndJSON
    static Crypto = Cryptography
    get CustomMath() { return CustomMath }
    set CustomMath(_) { throw new ReferenceError('CustomMath is Read-Only') }
    get Time() { return Timer }
    set Time(_) { throw new ReferenceError('Time is Read-Only') }
    get Converter() { return Converter }
    set Converter(_) { throw new ReferenceError('Converter is Read-Only') }
    get Random() { return RandomGenerators }
    set Random(_) { throw new ReferenceError('Random is Read-Only') }
    get Formatter() { return Formatter }
    set Formatter(_) { throw new ReferenceError('Formatter is Read-Only') }
    get ArrayAndJSON() { return ArrayAndJSON }
    set ArrayAndJSON(_) { throw new ReferenceError('ArrayAndJSON is Read-Only') }
    get Crypto() { return Cryptography }
    set Crypto(_) { throw new ReferenceError('Crypto is Read-Only') }
}