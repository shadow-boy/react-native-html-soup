import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Map of element attributes as a plain object
 */
export type ElementAttributes = {[key: string]: string};

/**
 * HTML element representation
 */
export interface Element {
  tag: string;
  text: string;
  html: string;
  outerHtml: string;
  attributes: ElementAttributes;
  childCount: number;
}

/**
 * Result of parsing an HTML document
 */
export interface ParseResult {
  title: string;
  body: string;
}

/**
 * Native HTML Soup module specification
 */
export interface Spec extends TurboModule {


  /**
   * Parse HTML content and extract basic information
   * @param html HTML string to parse
   * @returns Object containing title and body content
   * @platform android, ios
   */
  parse(html: string): ParseResult;

  /**
   * Select elements from HTML using CSS selector
   * @param html HTML string to parse
   * @param cssQuery CSS selector to find elements
   * @returns Array of Element objects
   * @platform android, ios
   */
  select(html: string, cssQuery: string): Element[];

  /**
   * Select the first element from HTML using CSS selector
   * @param html HTML string to parse
   * @param cssQuery CSS selector to find element
   * @returns Element object or null if not found
   * @platform android, ios
   */
  selectFirst(html: string, cssQuery: string): Element | null;

  /**
   * Extract text content from elements matching the CSS selector
   * @param html HTML string to parse
   * @param cssQuery CSS selector to find elements
   * @returns Text content of matched elements
   * @platform android, ios
   */
  getText(html: string, cssQuery: string): string;

  /**
   * Extract HTML content from elements matching the CSS selector
   * @param html HTML string to parse
   * @param cssQuery CSS selector to find elements
   * @returns HTML content of matched elements
   * @platform android, ios
   */
  getHtml(html: string, cssQuery: string): string;

  /**
   * Get attribute values from multiple elements matching the CSS selector
   * @param html HTML string to parse
   * @param cssQuery CSS selector to find elements
   * @param attributeName Name of the attribute to extract
   * @returns Array of attribute values
   * @platform android, ios
   */
  getAttributesByQuery(html: string, cssQuery: string, attributeName: string): string[];

  /**
   * Get attribute value from the first element matching the CSS selector
   * @param html HTML string to parse
   * @param cssQuery CSS selector to find element
   * @param attributeName Name of the attribute to extract
   * @returns Attribute value as string
   * @platform android, ios
   */
  getAttributeByQuery(html: string, cssQuery: string, attributeName: string): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('HtmlSoup');
