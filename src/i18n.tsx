import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "zh-CN" | "en";
type Dictionary = Record<string, string>;

const zh: Dictionary = {
  "Default": "默认",
  "Midnight": "午夜",
  "Ember": "余烬",
  "Mint": "薄荷",
  "Dusk": "黄昏",
  "Sand": "沙色",
  "Arctic": "极地",
  "Graphite": "石墨",
  "Ink": "墨色",
  "Switch to English": "切换到英文",
  "切换到简体中文": "切换到简体中文",
  "gorgeous editable terminal screenshots": "精美、可编辑的终端截图",
  "About": "关于",
  "Reset": "重置",
  "Copy ANSI": "复制 ANSI",
  "Copy image": "复制图片",
  "Copy link": "复制链接",
  "Copy chalk": "复制 Chalk 代码",
  "Copy text": "复制文本",
  "Copy as ANSI": "复制为 ANSI",
  "Copy as image": "复制为图片",
  "Copy as link": "复制为链接",
  "Copy as chalk": "复制为 Chalk 代码",
  "Copy as text": "复制为文本",
  "Choose what to copy": "选择复制内容",
  "Save PNG": "保存 PNG",
  "Save SVG": "保存 SVG",
  "Save JPEG": "保存 JPEG",
  "Save WebP": "保存 WebP",
  "Save as PNG": "另存为 PNG",
  "Save as SVG": "另存为 SVG",
  "Save as JPEG": "另存为 JPEG",
  "Save as WebP": "另存为 WebP",
  "Choose an image format": "选择图片格式",
  "Drag to set the width in columns": "拖动以调整终端宽度（列数）",
  "Loading font…": "正在加载字体…",
  "Hold": "按住",
  "and drag to select a rectangle": "并拖动以选择矩形区域",
  "Saved {filename}": "已保存 {filename}",
  "Export failed": "导出失败",
  "Image copied": "图片已复制",
  "Clipboard blocked — use Save instead": "剪贴板访问被阻止，请改用“保存”",
  "ANSI copied": "ANSI 已复制",
  "Text copied": "文本已复制",
  "chalk source copied": "Chalk 代码已复制",
  "Clipboard blocked": "剪贴板访问被阻止",
  "Link copied": "链接已复制",
  "Language detected: {language}": "检测到语言：{language}",
  "Opened a shared link": "已打开分享链接",
  "Title bar": "标题栏",
  "Title": "标题",
  "Theme": "主题",
  "Syntax": "语法高亮",
  "Syntax highlighting": "语法高亮",
  "Auto-detect": "自动检测",
  "Custom (ANSI)": "自定义（ANSI）",
  "Language": "语言",
  "Backdrop": "背景",
  "Transparent": "透明",
  "Fill colour": "填充颜色",
  "Fill {fill}": "填充颜色 {fill}",
  "Aspect ratio": "宽高比",
  "fits the content": "适应内容",
  "Free": "自由",
  "Width": "宽度",
  "Corner radius": "圆角",
  "Padding": "内边距",
  "set by the aspect": "由宽高比决定",
  "Shadow": "阴影",
  "Text formatting": "文本格式",
  "Formatting": "格式",
  "Text": "文字",
  "Fill": "填充",
  "Style": "样式",
  "Bold": "粗体",
  "Dim": "变暗",
  "Italic": "斜体",
  "Underline": "下划线",
  "Strike": "删除线",
  "Inverse": "反色",
  "Hidden": "隐藏",
  "Black": "黑色",
  "Red": "红色",
  "Green": "绿色",
  "Yellow": "黄色",
  "Blue": "蓝色",
  "Magenta": "品红",
  "Cyan": "青色",
  "White": "白色",
  "Bright black (gray)": "亮黑（灰色）",
  "Bright red": "亮红",
  "Bright green": "亮绿",
  "Bright yellow": "亮黄",
  "Bright blue": "亮蓝",
  "Bright magenta": "亮品红",
  "Bright cyan": "亮青",
  "Bright white": "亮白",
  "Boron": "Boron",
  "Language:": "语言：",
  "English": "English",
  "简体中文": "简体中文",
  "Built by": "作者：",
  "Boron is a terminal screenshot generator": "Boron 是一款终端截图生成工具",
  "Paste real terminal output, or type it, and Boron keeps the ANSI colors, lets you edit the result like a document, and exports it as a PNG, SVG, JPEG or WebP. It runs in the browser and it is free. There is no upload: parsing and rendering happen on your machine.": "粘贴真实的终端输出，或直接输入内容，Boron 会保留 ANSI 颜色，让你像编辑文档一样修改内容，并导出为 PNG、SVG、JPEG 或 WebP 图片。它免费运行于浏览器中，不会上传你的内容：解析和渲染都在本机完成。",
  "More about Boron": "了解更多 Boron 信息",
};

const dictionaries: Record<Language, Dictionary> = { "zh-CN": zh, en: {} };
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: string, values?: Record<string, string | number>) => string } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("boron.language");
      return saved === "en" || saved === "zh-CN" ? saved : "zh-CN";
    } catch {
      return "zh-CN";
    }
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem("boron.language", next); } catch { /* storage is optional */ }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: string, values?: Record<string, string | number>) => {
      let result = dictionaries[language][key] ?? key;
      if (values) {
        for (const [name, replacement] of Object.entries(values)) {
          result = result.replaceAll(`{${name}}`, String(replacement));
        }
      }
      return result;
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used inside LanguageProvider");
  return value;
}
