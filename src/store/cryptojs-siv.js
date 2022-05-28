// const CryptoJS = require('crypto-js');

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
    r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
            32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
            2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
    q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
            a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
        e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
    l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
    _doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
        f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
            m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
            E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
        4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
    l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
    finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
    c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
        e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
        this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
        1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
    decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
        b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
    16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
    8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
        d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * Counter block mode.
 */
CryptoJS.mode.CTR = (function () {
    var CTR = CryptoJS.lib.BlockCipherMode.extend();

    var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;

            // Generate keystream
            if (iv) {
                counter = this._counter = iv.slice(0);

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);

            // Increment counter
            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
            }
        }
    });

    CTR.Decryptor = Encryptor;

    return CTR;
}());

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 artjomb
 */
(function(C){
    // put on ext property in CryptoJS
    var ext;
    if (!C.hasOwnProperty("ext")) {
        ext = C.ext = {};
    } else {
        ext = C.ext;
    }

    /**
     * Shifts the array by n bits to the left. Zero bits are added as the
     * least significant bits. This operation modifies the current array.
     *
     * @param {WordArray} wordArray WordArray to work on
     * @param {int} n Bits to shift by
     *
     * @returns the WordArray that was passed in
     */
    ext.bitshift = function(wordArray, n){
        var carry = 0,
            words = wordArray.words,
            wres,
            skipped = 0,
            carryMask;
        if (n > 0) {
            while(n > 31) {
                // delete first element:
                words.splice(0, 1);

                // add `0` word to the back
                words.push(0);

                n -= 32;
                skipped++;
            }
            if (n == 0) {
                // 1. nothing to shift if the shift amount is on a word boundary
                // 2. This has to be done, because the following algorithm computes
                // wrong values only for n==0
                return carry;
            }
            for(var i = words.length - skipped - 1; i >= 0; i--) {
                wres = words[i];
                words[i] <<= n;
                words[i] |= carry;
                carry = wres >>> (32 - n);
            }
        } else if (n < 0) {
            while(n < -31) {
                // insert `0` word to the front:
                words.splice(0, 0, 0);

                // remove last element:
                words.length--;

                n += 32;
                skipped++;
            }
            if (n == 0) {
                // nothing to shift if the shift amount is on a word boundary
                return carry;
            }
            n = -n;
            carryMask = (1 << n) - 1;
            for(var i = skipped; i < words.length; i++) {
                wres = words[i] & carryMask;
                words[i] >>>= n;
                words[i] |= carry;
                carry = wres << (32 - n);
            }
        }
        return carry;
    };

    /**
     * Negates all bits in the WordArray. This manipulates the given array.
     *
     * @param {WordArray} wordArray WordArray to work on
     *
     * @returns the WordArray that was passed in
     */
    ext.neg = function(wordArray){
        var words = wordArray.words;
        for(var i = 0; i < words.length; i++) {
            words[i] = ~words[i];
        }
        return wordArray;
    };

    /**
     * Applies XOR on both given word arrays and returns a third resulting
     * WordArray. The initial word arrays must have the same length
     * (significant bytes).
     *
     * @param {WordArray} wordArray1 WordArray
     * @param {WordArray} wordArray2 WordArray
     *
     * @returns first passed WordArray (modified)
     */
    ext.xor = function(wordArray1, wordArray2){
        for(var i = 0; i < wordArray1.words.length; i++) {
            wordArray1.words[i] ^= wordArray2.words[i];
        }
        return wordArray1;
    };

    /**
     * Logical AND between the two passed arrays. Both arrays must have the
     * same length.
     *
     * @param {WordArray} arr1 Array 1
     * @param {WordArray} arr2 Array 2
     *
     * @returns new WordArray
     */
    ext.bitand = function(arr1, arr2){
        var newArr = arr1.clone(),
            tw = newArr.words,
            ow = arr2.words;
        for(var i = 0; i < tw.length; i++) {
            tw[i] &= ow[i];
        }
        return newArr;
    };
})(CryptoJS);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 artjomb
 */
(function(C){
    // put on ext property in CryptoJS
    var ext;
    if (!C.hasOwnProperty("ext")) {
        ext = C.ext = {};
    } else {
        ext = C.ext;
    }

    // Shortcuts
    var Base = C.lib.Base;
    var WordArray = C.lib.WordArray;
    var AES = C.algo.AES;

    // Constants
    ext.const_Zero = WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
    ext.const_One = WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000001]);
    ext.const_Rb = WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000087]); // 00..0010000111
    ext.const_Rb_Shifted = WordArray.create([0x80000000, 0x00000000, 0x00000000, 0x00000043]); // 100..001000011
    ext.const_nonMSB = WordArray.create([0xFFFFFFFF, 0xFFFFFFFF, 0x7FFFFFFF, 0x7FFFFFFF]); // 1^64 || 0^1 || 1^31 || 0^1 || 1^31

    /**
     * Looks into the object to see if it is a WordArray.
     *
     * @param obj Some object
     *
     * @returns {boolean}

     */
    ext.isWordArray = function(obj) {
        return obj && typeof obj.clamp === "function" && typeof obj.concat === "function" && typeof obj.words === "array";
    }

    /**
     * This padding is a 1 bit followed by as many 0 bits as needed to fill
     * up the block. This implementation doesn't work on bits directly,
     * but on bytes. Therefore the granularity is much bigger.
     */
    C.pad.OneZeroPadding = {
        pad: function (data, blocksize) {
            // Shortcut
            var blockSizeBytes = blocksize * 4;

            // Count padding bytes
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                var paddingWord = 0x00000000;
                if (i === 0) {
                    paddingWord = 0x80000000;
                }
                paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },
        unpad: function () {
            // TODO: implement
        }
    };

    /**
     * No padding is applied. This is necessary for streaming cipher modes
     * like CTR.
     */
    C.pad.NoPadding = {
        pad: function () {},
        unpad: function () {}
    };

    /**
     * Returns the n leftmost bytes of the WordArray.
     *
     * @param {WordArray} wordArray WordArray to work on
     * @param {int} n Bytes to retrieve
     *
     * @returns new WordArray
     */
    ext.leftmostBytes = function(wordArray, n){
        var lmArray = wordArray.clone();
        lmArray.sigBytes = n;
        lmArray.clamp();
        return lmArray;
    };

    /**
     * Returns the n rightmost bytes of the WordArray.
     *
     * @param {WordArray} wordArray WordArray to work on
     * @param {int} n Bytes to retrieve (must be positive)
     *
     * @returns new WordArray
     */
    ext.rightmostBytes = function(wordArray, n){
        wordArray.clamp();
        var wordSize = 32;
        var rmArray = wordArray.clone();
        var bitsToShift = (rmArray.sigBytes - n) * 8;
        if (bitsToShift >= wordSize) {
            var popCount = Math.floor(bitsToShift/wordSize);
            bitsToShift -= popCount * wordSize;
            rmArray.words.splice(0, popCount);
            rmArray.sigBytes -= popCount * wordSize / 8;
        }
        if (bitsToShift > 0) {
            ext.bitshift(rmArray, bitsToShift);
            rmArray.sigBytes -= bitsToShift / 8;
        }
        return rmArray;
    };

    /**
     * Returns the n rightmost words of the WordArray. It assumes
     * that the current WordArray has at least n words.
     *
     * @param {WordArray} wordArray WordArray to work on
     * @param {int} n Words to retrieve (must be positive)
     *
     * @returns popped words as new WordArray
     */
    ext.popWords = function(wordArray, n){
        var left = ext.leftmostBytes(wordArray, n * 4);
        wordArray.words = wordArray.words.slice(n);
        wordArray.sigBytes -= n * 4;
        return left;
    };

    /**
     * Shifts the array to the left and returns the shifted dropped elements
     * as WordArray. The initial WordArray must contain at least n bytes and
     * they have to be significant.
     *
     * @param {WordArray} wordArray WordArray to work on (is modified)
     * @param {int} n Bytes to shift (must be positive, default 16)
     *
     * @returns new WordArray
     */
    ext.shiftBytes = function(wordArray, n){
        n = n || 16;
        var r = n % 4;
        n -= r;

        var shiftedArray = WordArray.create();
        for(var i = 0; i < n; i += 4) {
            shiftedArray.words.push(wordArray.words.shift());
            wordArray.sigBytes -= 4;
            shiftedArray.sigBytes += 4;
        }
        if (r > 0) {
            shiftedArray.words.push(wordArray.words[0]);
            shiftedArray.sigBytes += r;

            ext.bitshift(wordArray, r * 8);
            wordArray.sigBytes -= r;
        }
        return shiftedArray;
    };

    /**
     * XORs arr2 to the end of arr1 array. This doesn't modify the current
     * array aside from clamping.
     *
     * @param {WordArray} arr1 Bigger array
     * @param {WordArray} arr2 Smaller array to be XORed to the end
     *
     * @returns new WordArray
     */
    ext.xorendBytes = function(arr1, arr2){
        // TODO: more efficient
        return ext.leftmostBytes(arr1, arr1.sigBytes-arr2.sigBytes)
            .concat(ext.xor(ext.rightmostBytes(arr1, arr2.sigBytes), arr2));
    };

    /**
     * Doubling operation on a 128-bit value. This operation modifies the
     * passed array.
     *
     * @param {WordArray} wordArray WordArray to work on
     *
     * @returns passed WordArray
     */
    ext.dbl = function(wordArray){
        var carry = ext.msb(wordArray);
        ext.bitshift(wordArray, 1);
        ext.xor(wordArray, carry === 1 ? ext.const_Rb : ext.const_Zero);
        return wordArray;
    };

    /**
     * Inverse operation on a 128-bit value. This operation modifies the
     * passed array.
     *
     * @param {WordArray} wordArray WordArray to work on
     *
     * @returns passed WordArray
     */
    ext.inv = function(wordArray){
        var carry = wordArray.words[4] & 1;
        ext.bitshift(wordArray, -1);
        ext.xor(wordArray, carry === 1 ? ext.const_Rb_Shifted : ext.const_Zero);
        return wordArray;
    };

    /**
     * Check whether the word arrays are equal.
     *
     * @param {WordArray} arr1 Array 1
     * @param {WordArray} arr2 Array 2
     *
     * @returns boolean
     */
    ext.equals = function(arr1, arr2){
        if (!arr2 || !arr2.words || arr1.sigBytes !== arr2.sigBytes) {
            return false;
        }
        arr1.clamp();
        arr2.clamp();
        var equal = 0;
        for(var i = 0; i < arr1.words.length; i++) {
            equal |= arr1.words[i] ^ arr2.words[i];
        }
        return equal === 0;
    };

    /**
     * Retrieves the most significant bit of the WordArray as an Integer.
     *
     * @param {WordArray} arr
     *
     * @returns Integer
     */
    ext.msb = function(arr) {
        return arr.words[0] >>> 31;
    }
})(CryptoJS);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 artjomb
 */
(function(C){
    // Shortcuts
    var Base = C.lib.Base;
    var WordArray = C.lib.WordArray;
    var AES = C.algo.AES;
    var ext = C.ext;
    var OneZeroPadding = C.pad.OneZeroPadding;

    function aesBlock(key, data){
        var aes128 = AES.createEncryptor(key, { iv: WordArray.create(), padding: C.pad.NoPadding });
        var arr = aes128.finalize(data);
        return arr;
    }

    var CMAC = C.algo.CMAC = Base.extend({
        /**
         * Initializes a newly created CMAC
         *
         * @param {WordArray} key The secret key
         *
         * @example
         *
         *     var cmacer = CryptoJS.algo.CMAC.create(key);
         */
        init: function(key){
            // generate sub keys...

            // Step 1
            var L = aesBlock(key, ext.const_Zero);

            // Step 2
            var K1 = L.clone();
            ext.dbl(K1);

            // Step 3
            if (!this._isTwo) {
                var K2 = K1.clone();
                ext.dbl(K2);
            } else {
                var K2 = L.clone();
                ext.inv(K2);
            }

            this._K1 = K1;
            this._K2 = K2;
            this._K = key;

            this._const_Bsize = 16;

            this.reset();
        },

        reset: function () {
            this._x = ext.const_Zero.clone();
            this._counter = 0;
            this._buffer = WordArray.create();
        },

        update: function (messageUpdate) {
            if (!messageUpdate) {
                return this;
            }

            // Shortcuts
            var buffer = this._buffer;
            var bsize = this._const_Bsize;

            if (typeof messageUpdate === "string") {
                messageUpdate = C.enc.Utf8.parse(messageUpdate);
            }

            buffer.concat(messageUpdate);

            while(buffer.sigBytes > bsize){
                var M_i = ext.shiftBytes(buffer, bsize);
                ext.xor(this._x, M_i);
                this._x.clamp();
                this._x = aesBlock(this._K, this._x);
                this._counter++;
            }

            // Chainable
            return this;
        },

        finalize: function (messageUpdate) {
            this.update(messageUpdate);

            // Shortcuts
            var buffer = this._buffer;
            var bsize = this._const_Bsize;

            var M_last = buffer.clone();
            if (buffer.sigBytes === bsize) {
                ext.xor(M_last, this._K1);
            } else {
                OneZeroPadding.pad(M_last, bsize/4);
                ext.xor(M_last, this._K2);
            }

            ext.xor(M_last, this._x);

            this.reset(); // Can be used immediately afterwards

            return aesBlock(this._K, M_last);
        },

        _isTwo: false
    });

    /**
     * Directly invokes the CMAC and returns the calculated MAC.
     *
     * @param {WordArray} key The key to be used for CMAC
     * @param {WordArray|string} message The data to be MAC'ed (either WordArray or UTF-8 encoded string)
     *
     * @returns {WordArray} MAC
     */
    C.CMAC = function(key, message){
        return CMAC.create(key).finalize(message);
    };

    C.algo.OMAC1 = CMAC;
    C.algo.OMAC2 = CMAC.extend({
        _isTwo: true
    });
})(CryptoJS);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 artjomb
 */
(function(C){
    // Shortcuts
    var Base = C.lib.Base;
    var WordArray = C.lib.WordArray;
    var AES = C.algo.AES;
    var ext = C.ext;
    var OneZeroPadding = C.pad.OneZeroPadding;
    var CMAC = C.algo.CMAC;

    /**
     * updateAAD must be used before update, because the additional data is
     * expected to be authenticated before the plaintext stream starts.
     */
    var S2V = C.algo.S2V = Base.extend({
        init: function(key){
            this._blockSize = 16;
            this._cmacAD = CMAC.create(key);
            this._cmacPT = CMAC.create(key);
            this.reset();
        },
        reset: function(){
            this._buffer = WordArray.create();
            this._cmacAD.reset();
            this._cmacPT.reset();
            this._d = this._cmacAD.finalize(ext.const_Zero);
            this._empty = true;
            this._ptStarted = false;
        },
        updateAAD: function(msgUpdate){
            if (this._ptStarted) {
                // It's not possible to authenticate any more additional data when the plaintext stream starts
                return this;
            }

            if (!msgUpdate) {
                return this;
            }

            if (typeof msgUpdate === "string") {
                msgUpdate = C.enc.Utf8.parse(msgUpdate);
            }

            this._d = ext.xor(ext.dbl(this._d), this._cmacAD.finalize(msgUpdate));
            this._empty = false;

            // Chainable
            return this;
        },
        update: function(msgUpdate){
            if (!msgUpdate) {
                return this;
            }

            this._ptStarted = true;
            var buffer = this._buffer;
            var bsize = this._blockSize;
            var wsize = bsize / 4;
            var cmac = this._cmacPT;
            if (typeof msgUpdate === "string") {
                msgUpdate = C.enc.Utf8.parse(msgUpdate);
            }

            buffer.concat(msgUpdate);

            while(buffer.sigBytes >= 2 * bsize){
                this._empty = false;
                var s_i = ext.popWords(buffer, wsize);
                cmac.update(s_i);
            }

            // Chainable
            return this;
        },
        finalize: function(msgUpdate){
            this.update(msgUpdate);

            var bsize = this._blockSize;
            var s_n = this._buffer;

            if (this._empty && s_n.sigBytes === 0) {
                return this._cmacAD.finalize(ext.const_One);
            }

            var t;
            if (s_n.sigBytes >= bsize) {
                t = ext.xorendBytes(s_n, this._d);
            } else {
                OneZeroPadding.pad(s_n, bsize);
                t = ext.xor(ext.dbl(this._d), s_n);
            }

            return this._cmacPT.finalize(t);
        }
    });

    var SIV = C.SIV = Base.extend({
        init: function(key){
            var len = key.sigBytes / 2;
            this._s2vKey = ext.shiftBytes(key, len);
            this._ctrKey = key;
        },
        encrypt: function(adArray, plaintext){
            if (!plaintext && adArray) {
                plaintext = adArray;
                adArray = [];
            }

            var s2v = S2V.create(this._s2vKey);
            Array.prototype.forEach.call(adArray, function(ad){
                s2v.updateAAD(ad);
            });
            var tag = s2v.finalize(plaintext);
            var filteredTag = ext.bitand(tag, ext.const_nonMSB);

            var ciphertext = C.AES.encrypt(plaintext, this._ctrKey, {
                iv: filteredTag,
                mode: C.mode.CTR,
                padding: C.pad.NoPadding
            });

            return tag.concat(ciphertext.ciphertext);
        },
        decrypt: function(adArray, ciphertext){
            if (!ciphertext && adArray) {
                ciphertext = adArray;
                adArray = [];
            }

            var tag = ext.shiftBytes(ciphertext, 16);
            var filteredTag = ext.bitand(tag, ext.const_nonMSB);

            var plaintext = C.AES.decrypt({ciphertext:ciphertext}, this._ctrKey, {
                iv: filteredTag,
                mode: C.mode.CTR,
                padding: C.pad.NoPadding
            });

            var s2v = S2V.create(this._s2vKey);
            Array.prototype.forEach.call(adArray, function(ad){
                s2v.updateAAD(ad);
            });
            var recoveredTag = s2v.finalize(plaintext);

            if (ext.equals(tag, recoveredTag)) {
                return plaintext;
            } else {
                return false;
            }
        }
    });
})(CryptoJS);

// module.exports = CryptoJS;
export default CryptoJS;