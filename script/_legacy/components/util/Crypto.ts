import CryptoJS from "crypto-js";

const secretKey = "abdaswdfdsfegrgsdggsdffdfs23efdf"; //32 word

// encrypt By AES56
export const encrypt = (data: string | object) => CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);

// decrypt By AES56
export const decrypt = (data: string) => JSON.parse(CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8));
