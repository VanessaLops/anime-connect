type VipLevel = 1 | 2 | 3 | 4 | 5;

interface Emoji {
    code: string;
    src: string;
}

export const emojisByVip: Record<VipLevel | 'default', Emoji[]> = {
    1: [
        { code: '(happy)', src: 'https://www.free-smileys.com/files/happy-smileys/572.gif' },
        { code: '(wink)', src: 'https://www.free-smileys.com/files/happy-smileys/573.gif' },
        { code: '(cool)', src: 'https://www.free-smileys.com/files/happy-smileys/576.gif' },
    ],
    2: [
        { code: '(laugh)', src: 'https://www.free-smileys.com/files/happy-smileys/574.gif' },
        { code: '(sad)', src: 'https://www.free-smileys.com/files/happy-smileys/579.gif' },
        { code: '(surprised)', src: 'https://www.free-smileys.com/files/happy-smileys/581.gif' },
    ],
    3: [],
    4: [],
    5: [],
    default: [
        { code: '😀', src: '' },
        { code: '😃', src: '' },
        { code: '😄', src: '' },
        { code: '😂', src: '' },
        { code: '😢', src: '' },
        { code: '💔', src: '' },
        { code: '😎', src: '' },
    ],
};

export function getEmojisByVip(level: number): Emoji[] {
    if (![1, 2, 3, 4, 5].includes(level)) {
        return emojisByVip.default;
    }
    return emojisByVip[level as VipLevel];
}
