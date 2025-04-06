import NativeHtmlSoup from './NativeHtmlSoup';
import type { Element, ParseResult, ElementAttributes } from './NativeHtmlSoup';

export type { Element, ParseResult, ElementAttributes };


/**
 * Parse HTML content and extract basic information
 * @param html HTML string to parse
 * @returns Object containing title and body content
 * @platform android, ios
 */
export function parse(html: string): ParseResult {
  return NativeHtmlSoup.parse(html);
}

/**
 * Select elements from HTML using CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find elements
 * @returns Array of Element objects
 * @platform android, ios
 */
export function select(html: string, cssQuery: string): Element[] {
  return NativeHtmlSoup.select(html, cssQuery);
}

/**
 * Select the first element from HTML using CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find element
 * @returns Element object or null if not found
 * @platform android, ios
 */
export function selectFirst(html: string, cssQuery: string): Element | null {
  return NativeHtmlSoup.selectFirst(html, cssQuery);
}

/**
 * Extract text content from elements matching the CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find elements
 * @returns Text content of matched elements
 * @platform android, ios
 */
export function getText(html: string, cssQuery: string): string {
  return NativeHtmlSoup.getText(html, cssQuery);
}

/**
 * Extract HTML content from elements matching the CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find elements
 * @returns HTML content of matched elements
 * @platform android, ios
 */
export function getHtml(html: string, cssQuery: string): string {
  return NativeHtmlSoup.getHtml(html, cssQuery);
}

/**
 * Get attribute values from multiple elements matching the CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find elements
 * @param attributeName Name of the attribute to extract
 * @returns Array of attribute values
 * @platform android, ios
 */
export function getAttributesByQuery(
  html: string,
  cssQuery: string,
  attributeName: string
): string[] {
  return NativeHtmlSoup.getAttributesByQuery(html, cssQuery, attributeName);
}

/**
 * Get attribute value from the first element matching the CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find element
 * @param attributeName Name of the attribute to extract
 * @returns Attribute value as string
 * @platform android, ios
 */
export function getAttributeByQuery(
  html: string,
  cssQuery: string,
  attributeName: string
): string {
  return NativeHtmlSoup.getAttributeByQuery(html, cssQuery, attributeName);
}

/**
 * Get the next sibling element of the first element matching the CSS selector
 * @param html HTML string to parse
 * @param cssQuery CSS selector to find element
 * @returns Element object of the next sibling or null if not found
 * @platform android, ios
 */
export function nextSibling(html: string, cssQuery: string): Element | null {
  return NativeHtmlSoup.nextSibling(html, cssQuery);
}

const HtmlSoupModule = {
  parse,
  select,
  selectFirst,
  getText,
  getHtml,
  getAttributesByQuery,
  getAttributeByQuery,
  nextSibling,
};

export default HtmlSoupModule; 
