function ECFieldElementFp(t,i){this.x=i,this.q=t}function feFpEquals(t){return t==this||this.q.equals(t.q)&&this.x.equals(t.x)}function feFpToBigInteger(){return this.x}function feFpNegate(){return new ECFieldElementFp(this.q,this.x.negate().mod(this.q))}function feFpAdd(t){return new ECFieldElementFp(this.q,this.x.add(t.toBigInteger()).mod(this.q))}function feFpSubtract(t){return new ECFieldElementFp(this.q,this.x.subtract(t.toBigInteger()).mod(this.q))}function feFpMultiply(t){return new ECFieldElementFp(this.q,this.x.multiply(t.toBigInteger()).mod(this.q))}function feFpSquare(){return new ECFieldElementFp(this.q,this.x.square().mod(this.q))}function feFpDivide(t){return new ECFieldElementFp(this.q,this.x.multiply(t.toBigInteger().modInverse(this.q)).mod(this.q))}function ECPointFp(t,i,e,r){this.curve=t,this.x=i,this.y=e,this.z=null==r?BigInteger.ONE:r,this.zinv=null}function pointFpGetX(){null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q));var t=this.x.toBigInteger().multiply(this.zinv);return this.curve.reduce(t),this.curve.fromBigInteger(t)}function pointFpGetY(){null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q));var t=this.y.toBigInteger().multiply(this.zinv);return this.curve.reduce(t),this.curve.fromBigInteger(t)}function pointFpEquals(t){if(t==this)return!0;if(this.isInfinity())return t.isInfinity();if(t.isInfinity())return this.isInfinity();return!!t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q).equals(BigInteger.ZERO)&&t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q).equals(BigInteger.ZERO)}function pointFpIsInfinity(){return null==this.x&&null==this.y||this.z.equals(BigInteger.ZERO)&&!this.y.toBigInteger().equals(BigInteger.ZERO)}function pointFpNegate(){return new ECPointFp(this.curve,this.x,this.y.negate(),this.z)}function pointFpAdd(t){if(this.isInfinity())return t;if(t.isInfinity())return this;var i=t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q),e=t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q);if(BigInteger.ZERO.equals(e))return BigInteger.ZERO.equals(i)?this.twice():this.curve.getInfinity();var r=new BigInteger("3"),n=this.x.toBigInteger(),o=this.y.toBigInteger(),s=(t.x.toBigInteger(),t.y.toBigInteger(),e.square()),F=s.multiply(e),h=n.multiply(s),u=i.square().multiply(this.z),p=u.subtract(h.shiftLeft(1)).multiply(t.z).subtract(F).multiply(e).mod(this.curve.q),f=h.multiply(r).multiply(i).subtract(o.multiply(F)).subtract(u.multiply(i)).multiply(t.z).add(i.multiply(F)).mod(this.curve.q),g=F.multiply(this.z).multiply(t.z).mod(this.curve.q);return new ECPointFp(this.curve,this.curve.fromBigInteger(p),this.curve.fromBigInteger(f),g)}function pointFpTwice(){if(this.isInfinity())return this;if(0==this.y.toBigInteger().signum())return this.curve.getInfinity();var t=new BigInteger("3"),i=this.x.toBigInteger(),e=this.y.toBigInteger(),r=e.multiply(this.z),n=r.multiply(e).mod(this.curve.q),o=this.curve.a.toBigInteger(),s=i.square().multiply(t);BigInteger.ZERO.equals(o)||(s=s.add(this.z.square().multiply(o)));var F=(s=s.mod(this.curve.q)).square().subtract(i.shiftLeft(3).multiply(n)).shiftLeft(1).multiply(r).mod(this.curve.q),h=s.multiply(t).multiply(i).subtract(n.shiftLeft(1)).shiftLeft(2).multiply(n).subtract(s.square().multiply(s)).mod(this.curve.q),u=r.square().multiply(r).shiftLeft(3).mod(this.curve.q);return new ECPointFp(this.curve,this.curve.fromBigInteger(F),this.curve.fromBigInteger(h),u)}function pointFpMultiply(t){if(this.isInfinity())return this;if(0==t.signum())return this.curve.getInfinity();var i,e=t,r=e.multiply(new BigInteger("3")),n=this.negate(),o=this;for(i=r.bitLength()-2;i>0;--i){o=o.twice();var s=r.testBit(i);s!=e.testBit(i)&&(o=o.add(s?this:n))}return o}function pointFpMultiplyTwo(t,i,e){var r;r=t.bitLength()>e.bitLength()?t.bitLength()-1:e.bitLength()-1;for(var n=this.curve.getInfinity(),o=this.add(i);r>=0;)n=n.twice(),t.testBit(r)?n=e.testBit(r)?n.add(o):n.add(this):e.testBit(r)&&(n=n.add(i)),--r;return n}function ECCurveFp(t,i,e){this.q=t,this.a=this.fromBigInteger(i),this.b=this.fromBigInteger(e),this.infinity=new ECPointFp(this,null,null),this.reducer=new Barrett(this.q)}function curveFpGetQ(){return this.q}function curveFpGetA(){return this.a}function curveFpGetB(){return this.b}function curveFpEquals(t){return t==this||this.q.equals(t.q)&&this.a.equals(t.a)&&this.b.equals(t.b)}function curveFpGetInfinity(){return this.infinity}function curveFpFromBigInteger(t){return new ECFieldElementFp(this.q,t)}function curveReduce(t){this.reducer.reduce(t)}function curveFpDecodePointHex(t){switch(parseInt(t.substr(0,2),16)){case 0:return this.infinity;case 2:case 3:return null;case 4:case 6:case 7:var i=(t.length-2)/2,e=t.substr(2,i),r=t.substr(i+2,i);return new ECPointFp(this,this.fromBigInteger(new BigInteger(e,16)),this.fromBigInteger(new BigInteger(r,16)));default:return null}}function curveFpEncodePointHex(t){if(t.isInfinity())return"00";var i=t.getX().toBigInteger().toString(16),e=t.getY().toBigInteger().toString(16),r=this.getQ().toString(16).length;for(r%2!=0&&r++;i.length<r;)i="0"+i;for(;e.length<r;)e="0"+e;return"04"+i+e}function BigInteger(t,i,e){null!=t&&("number"==typeof t?this.fromNumber(t,i,e):null==i&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,i))}function nbi(){return new BigInteger(null)}function am1(t,i,e,r,n,o){for(;--o>=0;){var s=i*this[t++]+e[r]+n;n=Math.floor(s/67108864),e[r++]=67108863&s}return n}function am2(t,i,e,r,n,o){for(var s=32767&i,F=i>>15;--o>=0;){var h=32767&this[t],u=this[t++]>>15,p=F*h+u*s;n=((h=s*h+((32767&p)<<15)+e[r]+(1073741823&n))>>>30)+(p>>>15)+F*u+(n>>>30),e[r++]=1073741823&h}return n}function am3(t,i,e,r,n,o){for(var s=16383&i,F=i>>14;--o>=0;){var h=16383&this[t],u=this[t++]>>14,p=F*h+u*s;n=((h=s*h+((16383&p)<<14)+e[r]+n)>>28)+(p>>14)+F*u,e[r++]=268435455&h}return n}function int2char(t){return BI_RM.charAt(t)}function intAt(t,i){var e=BI_RC[t.charCodeAt(i)];return null==e?-1:e}function bnpCopyTo(t){for(var i=this.t-1;i>=0;--i)t[i]=this[i];t.t=this.t,t.s=this.s}function bnpFromInt(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0}function nbv(t){var i=nbi();return i.fromInt(t),i}function bnpFromString(t,i){var e;if(16==i)e=4;else if(8==i)e=3;else if(256==i)e=8;else if(2==i)e=1;else if(32==i)e=5;else{if(4!=i)return void this.fromRadix(t,i);e=2}this.t=0,this.s=0;for(var r=t.length,n=!1,o=0;--r>=0;){var s=8==e?255&t[r]:intAt(t,r);s<0?"-"==t.charAt(r)&&(n=!0):(n=!1,0==o?this[this.t++]=s:o+e>this.DB?(this[this.t-1]|=(s&(1<<this.DB-o)-1)<<o,this[this.t++]=s>>this.DB-o):this[this.t-1]|=s<<o,(o+=e)>=this.DB&&(o-=this.DB))}8==e&&0!=(128&t[0])&&(this.s=-1,o>0&&(this[this.t-1]|=(1<<this.DB-o)-1<<o)),this.clamp(),n&&BigInteger.ZERO.subTo(this,this)}function bnpClamp(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t}function bnToString(t){if(this.s<0)return"-"+this.negate().toString(t);var i;if(16==t)i=4;else if(8==t)i=3;else if(2==t)i=1;else if(32==t)i=5;else{if(4!=t)return this.toRadix(t);i=2}var e,r=(1<<i)-1,n=!1,o="",s=this.t,F=this.DB-s*this.DB%i;if(s-- >0)for(F<this.DB&&(e=this[s]>>F)>0&&(n=!0,o=int2char(e));s>=0;)F<i?(e=(this[s]&(1<<F)-1)<<i-F,e|=this[--s]>>(F+=this.DB-i)):(e=this[s]>>(F-=i)&r,F<=0&&(F+=this.DB,--s)),e>0&&(n=!0),n&&(o+=int2char(e));return n?o:"0"}function bnNegate(){var t=nbi();return BigInteger.ZERO.subTo(this,t),t}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(t){var i=this.s-t.s;if(0!=i)return i;var e=this.t;if(0!=(i=e-t.t))return this.s<0?-i:i;for(;--e>=0;)if(0!=(i=this[e]-t[e]))return i;return 0}function nbits(t){var i,e=1;return 0!=(i=t>>>16)&&(t=i,e+=16),0!=(i=t>>8)&&(t=i,e+=8),0!=(i=t>>4)&&(t=i,e+=4),0!=(i=t>>2)&&(t=i,e+=2),0!=(i=t>>1)&&(t=i,e+=1),e}function bnBitLength(){return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(t,i){var e;for(e=this.t-1;e>=0;--e)i[e+t]=this[e];for(e=t-1;e>=0;--e)i[e]=0;i.t=this.t+t,i.s=this.s}function bnpDRShiftTo(t,i){for(var e=t;e<this.t;++e)i[e-t]=this[e];i.t=Math.max(this.t-t,0),i.s=this.s}function bnpLShiftTo(t,i){var e,r=t%this.DB,n=this.DB-r,o=(1<<n)-1,s=Math.floor(t/this.DB),F=this.s<<r&this.DM;for(e=this.t-1;e>=0;--e)i[e+s+1]=this[e]>>n|F,F=(this[e]&o)<<r;for(e=s-1;e>=0;--e)i[e]=0;i[s]=F,i.t=this.t+s+1,i.s=this.s,i.clamp()}function bnpRShiftTo(t,i){i.s=this.s;var e=Math.floor(t/this.DB);if(e>=this.t)i.t=0;else{var r=t%this.DB,n=this.DB-r,o=(1<<r)-1;i[0]=this[e]>>r;for(var s=e+1;s<this.t;++s)i[s-e-1]|=(this[s]&o)<<n,i[s-e]=this[s]>>r;r>0&&(i[this.t-e-1]|=(this.s&o)<<n),i.t=this.t-e,i.clamp()}}function bnpSubTo(t,i){for(var e=0,r=0,n=Math.min(t.t,this.t);e<n;)r+=this[e]-t[e],i[e++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r-=t.s;e<this.t;)r+=this[e],i[e++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;e<t.t;)r-=t[e],i[e++]=r&this.DM,r>>=this.DB;r-=t.s}i.s=r<0?-1:0,r<-1?i[e++]=this.DV+r:r>0&&(i[e++]=r),i.t=e,i.clamp()}function bnpMultiplyTo(t,i){var e=this.abs(),r=t.abs(),n=e.t;for(i.t=n+r.t;--n>=0;)i[n]=0;for(n=0;n<r.t;++n)i[n+e.t]=e.am(0,r[n],i,n,0,e.t);i.s=0,i.clamp(),this.s!=t.s&&BigInteger.ZERO.subTo(i,i)}function bnpSquareTo(t){for(var i=this.abs(),e=t.t=2*i.t;--e>=0;)t[e]=0;for(e=0;e<i.t-1;++e){var r=i.am(e,i[e],t,2*e,0,1);(t[e+i.t]+=i.am(e+1,2*i[e],t,2*e+1,r,i.t-e-1))>=i.DV&&(t[e+i.t]-=i.DV,t[e+i.t+1]=1)}t.t>0&&(t[t.t-1]+=i.am(e,i[e],t,2*e,0,1)),t.s=0,t.clamp()}function bnpDivRemTo(t,i,e){var r=t.abs();if(!(r.t<=0)){var n=this.abs();if(n.t<r.t)return null!=i&&i.fromInt(0),void(null!=e&&this.copyTo(e));null==e&&(e=nbi());var o=nbi(),s=this.s,F=t.s,h=this.DB-nbits(r[r.t-1]);h>0?(r.lShiftTo(h,o),n.lShiftTo(h,e)):(r.copyTo(o),n.copyTo(e));var u=o.t,p=o[u-1];if(0!=p){var f=p*(1<<this.F1)+(u>1?o[u-2]>>this.F2:0),g=this.FV/f,a=(1<<this.F1)/f,l=1<<this.F2,c=e.t,m=c-u,B=null==i?nbi():i;for(o.dlShiftTo(m,B),e.compareTo(B)>=0&&(e[e.t++]=1,e.subTo(B,e)),BigInteger.ONE.dlShiftTo(u,B),B.subTo(o,o);o.t<u;)o[o.t++]=0;for(;--m>=0;){var b=e[--c]==p?this.DM:Math.floor(e[c]*g+(e[c-1]+l)*a);if((e[c]+=o.am(0,b,e,m,0,u))<b)for(o.dlShiftTo(m,B),e.subTo(B,e);e[c]<--b;)e.subTo(B,e)}null!=i&&(e.drShiftTo(u,i),s!=F&&BigInteger.ZERO.subTo(i,i)),e.t=u,e.clamp(),h>0&&e.rShiftTo(h,e),s<0&&BigInteger.ZERO.subTo(e,e)}}}function bnMod(t){var i=nbi();return this.abs().divRemTo(t,null,i),this.s<0&&i.compareTo(BigInteger.ZERO)>0&&t.subTo(i,i),i}function Classic(t){this.m=t}function cConvert(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t}function cRevert(t){return t}function cReduce(t){t.divRemTo(this.m,null,t)}function cMulTo(t,i,e){t.multiplyTo(i,e),this.reduce(e)}function cSqrTo(t,i){t.squareTo(i),this.reduce(i)}function bnpInvDigit(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var i=3&t;return i=i*(2-(15&t)*i)&15,i=i*(2-(255&t)*i)&255,i=i*(2-((65535&t)*i&65535))&65535,i=i*(2-t*i%this.DV)%this.DV,i>0?this.DV-i:-i}function Montgomery(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function montConvert(t){var i=nbi();return t.abs().dlShiftTo(this.m.t,i),i.divRemTo(this.m,null,i),t.s<0&&i.compareTo(BigInteger.ZERO)>0&&this.m.subTo(i,i),i}function montRevert(t){var i=nbi();return t.copyTo(i),this.reduce(i),i}function montReduce(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var i=0;i<this.m.t;++i){var e=32767&t[i],r=e*this.mpl+((e*this.mph+(t[i]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[e=i+this.m.t]+=this.m.am(0,r,t,i,0,this.m.t);t[e]>=t.DV;)t[e]-=t.DV,t[++e]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)}function montSqrTo(t,i){t.squareTo(i),this.reduce(i)}function montMulTo(t,i,e){t.multiplyTo(i,e),this.reduce(e)}function bnpIsEven(){return 0==(this.t>0?1&this[0]:this.s)}function bnpExp(t,i){if(t>4294967295||t<1)return BigInteger.ONE;var e=nbi(),r=nbi(),n=i.convert(this),o=nbits(t)-1;for(n.copyTo(e);--o>=0;)if(i.sqrTo(e,r),(t&1<<o)>0)i.mulTo(r,n,e);else{var s=e;e=r,r=s}return i.revert(e)}function bnModPowInt(t,i){var e;return e=t<256||i.isEven()?new Classic(i):new Montgomery(i),this.exp(t,e)}function bnClone(){var t=nbi();return this.copyTo(t),t}function bnIntValue(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnByteValue(){return 0==this.t?this.s:this[0]<<24>>24}function bnShortValue(){return 0==this.t?this.s:this[0]<<16>>16}function bnpChunkSize(t){return Math.floor(Math.LN2*this.DB/Math.log(t))}function bnSigNum(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1}function bnpToRadix(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0";var i=this.chunkSize(t),e=Math.pow(t,i),r=nbv(e),n=nbi(),o=nbi(),s="";for(this.divRemTo(r,n,o);n.signum()>0;)s=(e+o.intValue()).toString(t).substr(1)+s,n.divRemTo(r,n,o);return o.intValue().toString(t)+s}function bnpFromRadix(t,i){this.fromInt(0),null==i&&(i=10);for(var e=this.chunkSize(i),r=Math.pow(i,e),n=!1,o=0,s=0,F=0;F<t.length;++F){var h=intAt(t,F);h<0?"-"==t.charAt(F)&&0==this.signum()&&(n=!0):(s=i*s+h,++o>=e&&(this.dMultiply(r),this.dAddOffset(s,0),o=0,s=0))}o>0&&(this.dMultiply(Math.pow(i,o)),this.dAddOffset(s,0)),n&&BigInteger.ZERO.subTo(this,this)}function bnpFromNumber(t,i,e){if("number"==typeof i)if(t<2)this.fromInt(1);else for(this.fromNumber(t,e),this.testBit(t-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(t-1),op_or,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(i);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(BigInteger.ONE.shiftLeft(t-1),this);else{var r=new Array,n=7&t;r.length=1+(t>>3),i.nextBytes(r),n>0?r[0]&=(1<<n)-1:r[0]=0,this.fromString(r,256)}}function bnToByteArray(){var t=this.t,i=new Array;i[0]=this.s;var e,r=this.DB-t*this.DB%8,n=0;if(t-- >0)for(r<this.DB&&(e=this[t]>>r)!=(this.s&this.DM)>>r&&(i[n++]=e|this.s<<this.DB-r);t>=0;)r<8?(e=(this[t]&(1<<r)-1)<<8-r,e|=this[--t]>>(r+=this.DB-8)):(e=this[t]>>(r-=8)&255,r<=0&&(r+=this.DB,--t)),0!=(128&e)&&(e|=-256),0==n&&(128&this.s)!=(128&e)&&++n,(n>0||e!=this.s)&&(i[n++]=e);return i}function bnEquals(t){return 0==this.compareTo(t)}function bnMin(t){return this.compareTo(t)<0?this:t}function bnMax(t){return this.compareTo(t)>0?this:t}function bnpBitwiseTo(t,i,e){var r,n,o=Math.min(t.t,this.t);for(r=0;r<o;++r)e[r]=i(this[r],t[r]);if(t.t<this.t){for(n=t.s&this.DM,r=o;r<this.t;++r)e[r]=i(this[r],n);e.t=this.t}else{for(n=this.s&this.DM,r=o;r<t.t;++r)e[r]=i(n,t[r]);e.t=t.t}e.s=i(this.s,t.s),e.clamp()}function op_and(t,i){return t&i}function bnAnd(t){var i=nbi();return this.bitwiseTo(t,op_and,i),i}function op_or(t,i){return t|i}function bnOr(t){var i=nbi();return this.bitwiseTo(t,op_or,i),i}function op_xor(t,i){return t^i}function bnXor(t){var i=nbi();return this.bitwiseTo(t,op_xor,i),i}function op_andnot(t,i){return t&~i}function bnAndNot(t){var i=nbi();return this.bitwiseTo(t,op_andnot,i),i}function bnNot(){for(var t=nbi(),i=0;i<this.t;++i)t[i]=this.DM&~this[i];return t.t=this.t,t.s=~this.s,t}function bnShiftLeft(t){var i=nbi();return t<0?this.rShiftTo(-t,i):this.lShiftTo(t,i),i}function bnShiftRight(t){var i=nbi();return t<0?this.lShiftTo(-t,i):this.rShiftTo(t,i),i}function lbit(t){if(0==t)return-1;var i=0;return 0==(65535&t)&&(t>>=16,i+=16),0==(255&t)&&(t>>=8,i+=8),0==(15&t)&&(t>>=4,i+=4),0==(3&t)&&(t>>=2,i+=2),0==(1&t)&&++i,i}function bnGetLowestSetBit(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+lbit(this[t]);return this.s<0?this.t*this.DB:-1}function cbit(t){for(var i=0;0!=t;)t&=t-1,++i;return i}function bnBitCount(){for(var t=0,i=this.s&this.DM,e=0;e<this.t;++e)t+=cbit(this[e]^i);return t}function bnTestBit(t){var i=Math.floor(t/this.DB);return i>=this.t?0!=this.s:0!=(this[i]&1<<t%this.DB)}function bnpChangeBit(t,i){var e=BigInteger.ONE.shiftLeft(t);return this.bitwiseTo(e,i,e),e}function bnSetBit(t){return this.changeBit(t,op_or)}function bnClearBit(t){return this.changeBit(t,op_andnot)}function bnFlipBit(t){return this.changeBit(t,op_xor)}function bnpAddTo(t,i){for(var e=0,r=0,n=Math.min(t.t,this.t);e<n;)r+=this[e]+t[e],i[e++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r+=t.s;e<this.t;)r+=this[e],i[e++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;e<t.t;)r+=t[e],i[e++]=r&this.DM,r>>=this.DB;r+=t.s}i.s=r<0?-1:0,r>0?i[e++]=r:r<-1&&(i[e++]=this.DV+r),i.t=e,i.clamp()}function bnAdd(t){var i=nbi();return this.addTo(t,i),i}function bnSubtract(t){var i=nbi();return this.subTo(t,i),i}function bnMultiply(t){var i=nbi();return this.multiplyTo(t,i),i}function bnSquare(){var t=nbi();return this.squareTo(t),t}function bnDivide(t){var i=nbi();return this.divRemTo(t,i,null),i}function bnRemainder(t){var i=nbi();return this.divRemTo(t,null,i),i}function bnDivideAndRemainder(t){var i=nbi(),e=nbi();return this.divRemTo(t,i,e),new Array(i,e)}function bnpDMultiply(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()}function bnpDAddOffset(t,i){if(0!=t){for(;this.t<=i;)this[this.t++]=0;for(this[i]+=t;this[i]>=this.DV;)this[i]-=this.DV,++i>=this.t&&(this[this.t++]=0),++this[i]}}function NullExp(){}function nNop(t){return t}function nMulTo(t,i,e){t.multiplyTo(i,e)}function nSqrTo(t,i){t.squareTo(i)}function bnPow(t){return this.exp(t,new NullExp)}function bnpMultiplyLowerTo(t,i,e){var r=Math.min(this.t+t.t,i);for(e.s=0,e.t=r;r>0;)e[--r]=0;var n;for(n=e.t-this.t;r<n;++r)e[r+this.t]=this.am(0,t[r],e,r,0,this.t);for(n=Math.min(t.t,i);r<n;++r)this.am(0,t[r],e,r,0,i-r);e.clamp()}function bnpMultiplyUpperTo(t,i,e){--i;var r=e.t=this.t+t.t-i;for(e.s=0;--r>=0;)e[r]=0;for(r=Math.max(i-this.t,0);r<t.t;++r)e[this.t+r-i]=this.am(i-r,t[r],e,0,0,this.t+r-i);e.clamp(),e.drShiftTo(1,e)}function Barrett(t){this.r2=nbi(),this.q3=nbi(),BigInteger.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}function barrettConvert(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var i=nbi();return t.copyTo(i),this.reduce(i),i}function barrettRevert(t){return t}function barrettReduce(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)}function barrettSqrTo(t,i){t.squareTo(i),this.reduce(i)}function barrettMulTo(t,i,e){t.multiplyTo(i,e),this.reduce(e)}function bnModPow(t,i){var e,r,n=t.bitLength(),o=nbv(1);if(n<=0)return o;e=n<18?1:n<48?3:n<144?4:n<768?5:6,r=n<8?new Classic(i):i.isEven()?new Barrett(i):new Montgomery(i);var s=new Array,F=3,h=e-1,u=(1<<e)-1;if(s[1]=r.convert(this),e>1){var p=nbi();for(r.sqrTo(s[1],p);F<=u;)s[F]=nbi(),r.mulTo(p,s[F-2],s[F]),F+=2}var f,g,a=t.t-1,l=!0,c=nbi();for(n=nbits(t[a])-1;a>=0;){for(n>=h?f=t[a]>>n-h&u:(f=(t[a]&(1<<n+1)-1)<<h-n,a>0&&(f|=t[a-1]>>this.DB+n-h)),F=e;0==(1&f);)f>>=1,--F;if((n-=F)<0&&(n+=this.DB,--a),l)s[f].copyTo(o),l=!1;else{for(;F>1;)r.sqrTo(o,c),r.sqrTo(c,o),F-=2;F>0?r.sqrTo(o,c):(g=o,o=c,c=g),r.mulTo(c,s[f],o)}for(;a>=0&&0==(t[a]&1<<n);)r.sqrTo(o,c),g=o,o=c,c=g,--n<0&&(n=this.DB-1,--a)}return r.revert(o)}function bnGCD(t){var i=this.s<0?this.negate():this.clone(),e=t.s<0?t.negate():t.clone();if(i.compareTo(e)<0){var r=i;i=e,e=r}var n=i.getLowestSetBit(),o=e.getLowestSetBit();if(o<0)return i;for(n<o&&(o=n),o>0&&(i.rShiftTo(o,i),e.rShiftTo(o,e));i.signum()>0;)(n=i.getLowestSetBit())>0&&i.rShiftTo(n,i),(n=e.getLowestSetBit())>0&&e.rShiftTo(n,e),i.compareTo(e)>=0?(i.subTo(e,i),i.rShiftTo(1,i)):(e.subTo(i,e),e.rShiftTo(1,e));return o>0&&e.lShiftTo(o,e),e}function bnpModInt(t){if(t<=0)return 0;var i=this.DV%t,e=this.s<0?t-1:0;if(this.t>0)if(0==i)e=this[0]%t;else for(var r=this.t-1;r>=0;--r)e=(i*e+this[r])%t;return e}function bnModInverse(t){var i=t.isEven();if(this.isEven()&&i||0==t.signum())return BigInteger.ZERO;for(var e=t.clone(),r=this.clone(),n=nbv(1),o=nbv(0),s=nbv(0),F=nbv(1);0!=e.signum();){for(;e.isEven();)e.rShiftTo(1,e),i?(n.isEven()&&o.isEven()||(n.addTo(this,n),o.subTo(t,o)),n.rShiftTo(1,n)):o.isEven()||o.subTo(t,o),o.rShiftTo(1,o);for(;r.isEven();)r.rShiftTo(1,r),i?(s.isEven()&&F.isEven()||(s.addTo(this,s),F.subTo(t,F)),s.rShiftTo(1,s)):F.isEven()||F.subTo(t,F),F.rShiftTo(1,F);e.compareTo(r)>=0?(e.subTo(r,e),i&&n.subTo(s,n),o.subTo(F,o)):(r.subTo(e,r),i&&s.subTo(n,s),F.subTo(o,F))}return 0!=r.compareTo(BigInteger.ONE)?BigInteger.ZERO:F.compareTo(t)>=0?F.subtract(t):F.signum()<0?(F.addTo(t,F),F.signum()<0?F.add(t):F):F}function bnIsProbablePrime(t){var i,e=this.abs();if(1==e.t&&e[0]<=lowprimes[lowprimes.length-1]){for(i=0;i<lowprimes.length;++i)if(e[0]==lowprimes[i])return!0;return!1}if(e.isEven())return!1;for(i=1;i<lowprimes.length;){for(var r=lowprimes[i],n=i+1;n<lowprimes.length&&r<lplim;)r*=lowprimes[n++];for(r=e.modInt(r);i<n;)if(r%lowprimes[i++]==0)return!1}return e.millerRabin(t)}function bnpMillerRabin(t){var i=this.subtract(BigInteger.ONE),e=i.getLowestSetBit();if(e<=0)return!1;var r=i.shiftRight(e);(t=t+1>>1)>lowprimes.length&&(t=lowprimes.length);for(var n=nbi(),o=0;o<t;++o){n.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);var s=n.modPow(r,this);if(0!=s.compareTo(BigInteger.ONE)&&0!=s.compareTo(i)){for(var F=1;F++<e&&0!=s.compareTo(i);)if(0==(s=s.modPowInt(2,this)).compareTo(BigInteger.ONE))return!1;if(0!=s.compareTo(i))return!1}}return!0}function X9ECParameters(t,i,e,r){this.curve=t,this.g=i,this.n=e,this.h=r}function x9getCurve(){return this.curve}function x9getG(){return this.g}function x9getN(){return this.n}function x9getH(){return this.h}function fromHex(t){return new BigInteger(t,16)}function secp128r1(){var t=fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF"),i=fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC"),e=fromHex("E87579C11079F43DD824993C2CEE5ED3"),r=fromHex("FFFFFFFE0000000075A30D1B9038A115"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("04161FF7528B899B2D0C28607CA52C5B86CF5AC8395BAFEB13C02DA292DDED7A83"),r,n)}function secp160k1(){var t=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73"),i=BigInteger.ZERO,e=fromHex("7"),r=fromHex("0100000000000000000001B8FA16DFAB9ACA16B6B3"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("043B4C382CE37AA192A4019E763036F4F5DD4D7EBB938CF935318FDCED6BC28286531733C3F03C4FEE"),r,n)}function secp160r1(){var t=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF"),i=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC"),e=fromHex("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45"),r=fromHex("0100000000000000000001F4C8F927AED3CA752257"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("044A96B5688EF573284664698968C38BB913CBFC8223A628553168947D59DCC912042351377AC5FB32"),r,n)}function secp192k1(){var t=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37"),i=BigInteger.ZERO,e=fromHex("3"),r=fromHex("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("04DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D"),r,n)}function secp192r1(){var t=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF"),i=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC"),e=fromHex("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1"),r=fromHex("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("04188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF101207192B95FFC8DA78631011ED6B24CDD573F977A11E794811"),r,n)}function secp224r1(){var t=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001"),i=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE"),e=fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4"),r=fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("04B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34"),r,n)}function secp256r1(){var t=fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF"),i=fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC"),e=fromHex("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B"),r=fromHex("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551"),n=BigInteger.ONE,o=new ECCurveFp(t,i,e);return new X9ECParameters(o,o.decodePointHex("046B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C2964FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5"),r,n)}function getSECCurveByName(t){return"secp128r1"==t?secp128r1():"secp160k1"==t?secp160k1():"secp160r1"==t?secp160r1():"secp192k1"==t?secp192k1():"secp192r1"==t?secp192r1():"secp224r1"==t?secp224r1():"secp256r1"==t?secp256r1():null}ECFieldElementFp.prototype.equals=feFpEquals,ECFieldElementFp.prototype.toBigInteger=feFpToBigInteger,ECFieldElementFp.prototype.negate=feFpNegate,ECFieldElementFp.prototype.add=feFpAdd,ECFieldElementFp.prototype.subtract=feFpSubtract,ECFieldElementFp.prototype.multiply=feFpMultiply,ECFieldElementFp.prototype.square=feFpSquare,ECFieldElementFp.prototype.divide=feFpDivide,ECPointFp.prototype.getX=pointFpGetX,ECPointFp.prototype.getY=pointFpGetY,ECPointFp.prototype.equals=pointFpEquals,ECPointFp.prototype.isInfinity=pointFpIsInfinity,ECPointFp.prototype.negate=pointFpNegate,ECPointFp.prototype.add=pointFpAdd,ECPointFp.prototype.twice=pointFpTwice,ECPointFp.prototype.multiply=pointFpMultiply,ECPointFp.prototype.multiplyTwo=pointFpMultiplyTwo,ECCurveFp.prototype.getQ=curveFpGetQ,ECCurveFp.prototype.getA=curveFpGetA,ECCurveFp.prototype.getB=curveFpGetB,ECCurveFp.prototype.equals=curveFpEquals,ECCurveFp.prototype.getInfinity=curveFpGetInfinity,ECCurveFp.prototype.fromBigInteger=curveFpFromBigInteger,ECCurveFp.prototype.reduce=curveReduce,ECCurveFp.prototype.decodePointHex=curveFpDecodePointHex,ECCurveFp.prototype.encodePointHex=curveFpEncodePointHex;var dbits,canary=0xdeadbeefcafe,j_lm=15715070==(16777215&canary);j_lm&&"Microsoft Internet Explorer"==navigator.appName?(BigInteger.prototype.am=am2,dbits=30):j_lm&&"Netscape"!=navigator.appName?(BigInteger.prototype.am=am1,dbits=26):(BigInteger.prototype.am=am3,dbits=28),BigInteger.prototype.DB=dbits,BigInteger.prototype.DM=(1<<dbits)-1,BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP),BigInteger.prototype.F1=BI_FP-dbits,BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz",BI_RC=new Array,rr,vv;for(rr="0".charCodeAt(0),vv=0;vv<=9;++vv)BI_RC[rr++]=vv;for(rr="a".charCodeAt(0),vv=10;vv<36;++vv)BI_RC[rr++]=vv;for(rr="A".charCodeAt(0),vv=10;vv<36;++vv)BI_RC[rr++]=vv;Classic.prototype.convert=cConvert,Classic.prototype.revert=cRevert,Classic.prototype.reduce=cReduce,Classic.prototype.mulTo=cMulTo,Classic.prototype.sqrTo=cSqrTo,Montgomery.prototype.convert=montConvert,Montgomery.prototype.revert=montRevert,Montgomery.prototype.reduce=montReduce,Montgomery.prototype.mulTo=montMulTo,Montgomery.prototype.sqrTo=montSqrTo,BigInteger.prototype.copyTo=bnpCopyTo,BigInteger.prototype.fromInt=bnpFromInt,BigInteger.prototype.fromString=bnpFromString,BigInteger.prototype.clamp=bnpClamp,BigInteger.prototype.dlShiftTo=bnpDLShiftTo,BigInteger.prototype.drShiftTo=bnpDRShiftTo,BigInteger.prototype.lShiftTo=bnpLShiftTo,BigInteger.prototype.rShiftTo=bnpRShiftTo,BigInteger.prototype.subTo=bnpSubTo,BigInteger.prototype.multiplyTo=bnpMultiplyTo,BigInteger.prototype.squareTo=bnpSquareTo,BigInteger.prototype.divRemTo=bnpDivRemTo,BigInteger.prototype.invDigit=bnpInvDigit,BigInteger.prototype.isEven=bnpIsEven,BigInteger.prototype.exp=bnpExp,BigInteger.prototype.toString=bnToString,BigInteger.prototype.negate=bnNegate,BigInteger.prototype.abs=bnAbs,BigInteger.prototype.compareTo=bnCompareTo,BigInteger.prototype.bitLength=bnBitLength,BigInteger.prototype.mod=bnMod,BigInteger.prototype.modPowInt=bnModPowInt,BigInteger.ZERO=nbv(0),BigInteger.ONE=nbv(1),NullExp.prototype.convert=nNop,NullExp.prototype.revert=nNop,NullExp.prototype.mulTo=nMulTo,NullExp.prototype.sqrTo=nSqrTo,Barrett.prototype.convert=barrettConvert,Barrett.prototype.revert=barrettRevert,Barrett.prototype.reduce=barrettReduce,Barrett.prototype.mulTo=barrettMulTo,Barrett.prototype.sqrTo=barrettSqrTo;var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],lplim=(1<<26)/lowprimes[lowprimes.length-1];BigInteger.prototype.chunkSize=bnpChunkSize,BigInteger.prototype.toRadix=bnpToRadix,BigInteger.prototype.fromRadix=bnpFromRadix,BigInteger.prototype.fromNumber=bnpFromNumber,BigInteger.prototype.bitwiseTo=bnpBitwiseTo,BigInteger.prototype.changeBit=bnpChangeBit,BigInteger.prototype.addTo=bnpAddTo,BigInteger.prototype.dMultiply=bnpDMultiply,BigInteger.prototype.dAddOffset=bnpDAddOffset,BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo,BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo,BigInteger.prototype.modInt=bnpModInt,BigInteger.prototype.millerRabin=bnpMillerRabin,BigInteger.prototype.clone=bnClone,BigInteger.prototype.intValue=bnIntValue,BigInteger.prototype.byteValue=bnByteValue,BigInteger.prototype.shortValue=bnShortValue,BigInteger.prototype.signum=bnSigNum,BigInteger.prototype.toByteArray=bnToByteArray,BigInteger.prototype.equals=bnEquals,BigInteger.prototype.min=bnMin,BigInteger.prototype.max=bnMax,BigInteger.prototype.and=bnAnd,BigInteger.prototype.or=bnOr,BigInteger.prototype.xor=bnXor,BigInteger.prototype.andNot=bnAndNot,BigInteger.prototype.not=bnNot,BigInteger.prototype.shiftLeft=bnShiftLeft,BigInteger.prototype.shiftRight=bnShiftRight,BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit,BigInteger.prototype.bitCount=bnBitCount,BigInteger.prototype.testBit=bnTestBit,BigInteger.prototype.setBit=bnSetBit,BigInteger.prototype.clearBit=bnClearBit,BigInteger.prototype.flipBit=bnFlipBit,BigInteger.prototype.add=bnAdd,BigInteger.prototype.subtract=bnSubtract,BigInteger.prototype.multiply=bnMultiply,BigInteger.prototype.divide=bnDivide,BigInteger.prototype.remainder=bnRemainder,BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder,BigInteger.prototype.modPow=bnModPow,BigInteger.prototype.modInverse=bnModInverse,BigInteger.prototype.pow=bnPow,BigInteger.prototype.gcd=bnGCD,BigInteger.prototype.isProbablePrime=bnIsProbablePrime,BigInteger.prototype.square=bnSquare,X9ECParameters.prototype.getCurve=x9getCurve,X9ECParameters.prototype.getG=x9getG,X9ECParameters.prototype.getN=x9getN,X9ECParameters.prototype.getH=x9getH;