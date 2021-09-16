export const musicUtil = {
  /**
   *
   * @param duration 毫秒
   * @returns
   */
  duration2TimeStr(duration: number | undefined) {
    duration = Math.ceil((duration || 0) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60;
    return `${this.padLeft(minutes, '0', 2)}:${this.padLeft(seconds, '0', 2)}`;
  },
  /**
   * 左侧补充特定字符串
   * @param str
   * @param padChar
   * @param len
   * @returns
   */
  padLeft(str: string | number, padChar: string, len: number) {
    const tmpStr = `${new Array(len).fill(padChar).join('')}${str}`;
    return tmpStr.slice(tmpStr.length - len);
  },
};
