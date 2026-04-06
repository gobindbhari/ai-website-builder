

export const isMarkdown = (text: string) => {
  return /[#_*`\-\n]/.test(text);
};