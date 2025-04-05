# react-native-html-soup

React Native module for parsing HTML using jsoup (Android) and SwiftSoup (iOS). Provides a unified API to select elements and extract data from HTML using CSS selectors.

## Installation

```sh
npm install react-native-html-soup
```

## Usage

```js
import { 
  parse,
  select,
  selectFirst,
  getText,
  getHtml,
  getAttributeByQuery,
  getAttributesByQuery 
} from 'react-native-html-soup';

// Parse HTML and get document info
const html = `
  <html>
    <head><title>Sample Page</title></head>
    <body>
      <h1 class="title">Hello World</h1>
      <ul class="list">
        <li class="item" data-id="1">Item 1</li>
        <li class="item" data-id="2">Item 2</li>
        <li class="item" data-id="3">Item 3</li>
      </ul>
      <a href="https://example.com" class="link">Example Link</a>
    </body>
  </html>
`;

// Parse HTML document
const document = parse(html);
console.log(document.title); // "Sample Page"

// Select all elements matching a CSS selector
const items = select(html, "li.item");
console.log(items.length); // 3

// Select first element matching a CSS selector
const firstItem = selectFirst(html, "li.item");
console.log(firstItem.text); // "Item 1"

// Get text content of elements
const listText = getText(html, "ul.list");
console.log(listText); // "Item 1 Item 2 Item 3"

// Get HTML content of elements
const listHtml = getHtml(html, "ul.list");
console.log(listHtml); // "<li class="item" data-id="1">Item 1</li>..."

// Get attribute value from first matching element
const linkHref = getAttributeByQuery(html, "a.link", "href");
console.log(linkHref); // "https://example.com"

// Get attribute values from all matching elements
const itemIds = getAttributesByQuery(html, "li.item", "data-id");
console.log(itemIds); // ["1", "2", "3"]
```

## API Reference

### `parse(html: string): ParseResult`

Parses an HTML string and returns basic document information.

### `select(html: string, cssQuery: string): Element[]`

Selects all elements matching the CSS selector from the HTML string.

### `selectFirst(html: string, cssQuery: string): Element | null`

Selects the first element matching the CSS selector from the HTML string.

### `getText(html: string, cssQuery: string): string`

Extracts text content from elements matching the CSS selector.

### `getHtml(html: string, cssQuery: string): string`

Extracts HTML content from elements matching the CSS selector.

### `getAttributeByQuery(html: string, cssQuery: string, attributeName: string): string`

Gets an attribute value from the first element matching the CSS selector.

### `getAttributesByQuery(html: string, cssQuery: string, attributeName: string): string[]`

Gets attribute values from all elements matching the CSS selector.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
