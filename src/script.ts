const digits = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const smallUnits = ["", "십", "백", "천"];
const largeUnits = ["", "만", "억", "조", "경", "해", "자", "양", "구", "간", "정", "재", "극", "항하사", "아승기", "나유타", "불가사의", "무량대수"];

function formatKrNumber(num: string, omitOne: boolean = true): string {
    num = num.trimStart();
    let decimalPos;

    for (let i = 0; i < num.length; i++) {
        if (num[i] === '.' && decimalPos === undefined) {
            decimalPos = i;
        } else {
            const code = num.charCodeAt(i);
            if (code < 0x30 || code > 0x39) {
                if (i === 0) return "";
                num = num.slice(0, i);
                break;
            }
        }
    }

    let s = "";

    const length = decimalPos ?? num.length;
    const numChunks = Math.ceil(length / 4);
    for (let i = 0, o = length - 4; i < numChunks; i++, o -= 4) {
        if (i > 0) s = " " + s;
        s = largeUnits[i] + s;
        for (let j = 0; j < 4; j++) {
            let c = num.charCodeAt(o + 3 - j) - 0x30;
            if (!(c > 0)) continue;
            s = smallUnits[j] + s;
            if (!omitOne || c !== 1 || (i !== 1 && j === 0)) {
                s = digits[c] + s;
            }
        }
    }

    if (decimalPos < num.length - 1) {
        s += " 점 ";
        for (let i = decimalPos + 1; i < num.length; i++) {
            const digit = num.charCodeAt(i) - 0x30;
            s += digits[digit];
        }
    }

    return s;
}