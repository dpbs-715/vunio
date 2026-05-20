/**
 * 将字符串的首字母转换为大写
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 将驼峰命名转换为短横线命名或其他
 */
export const camelToKebab = (str: string, separator = '-'): string => {
  return str
    .replace(/(?<!^)([A-Z])/g, (_, p1) => {
      return separator + p1.toLowerCase();
    })
    .toLowerCase();
};
