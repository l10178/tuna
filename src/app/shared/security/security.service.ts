import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {Time} from '@angular/common';
import {Data} from '@angular/router';

@Injectable()
export class SecurityService {
    constructor() {
    }

    public encrypt(data: Object): string {
        if (data === null) {
            return null;
        }
        // // Encrypt
        const ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            this.getSecurityKey()
        );
        return ciphertext.toString();
    }

    public decrypt(ciphertext: Object): any {
        if (ciphertext === null) {
            return null;
        }
        // // Decrypt
        const bytes = CryptoJS.AES.decrypt(
            ciphertext.toString(),
            this.getSecurityKey()
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }

    getSecurityKey(): string {
        return 'this is just a test key.';
    }
}
