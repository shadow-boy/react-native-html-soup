import Foundation
import SwiftSoup

@objcMembers
open class HtmlSoupImp: NSObject {
  
  // MARK: - HTML Parsing
  
  @objc
  open func parse(_ html: String) -> [String: Any] {
    do {
      let doc = try SwiftSoup.parse(html)
      return [
        "title": try doc.title(),
        "body": try doc.body()?.html() ?? ""
      ]
    } catch {
      return [
        "title": "",
        "body": ""
      ]
    }
  }
  
  // MARK: - Element Selection
  
  @objc
  open func select(_ html: String, cssQuery: String) -> [[String: Any]] {
    var results: [[String: Any]] = []
    
    do {
      let doc = try SwiftSoup.parse(html)
      let elements = try doc.select(cssQuery)
      
      for element in elements {
        if let elementMap = convertElementToDict(element) {
          results.append(elementMap)
        }
      }
    } catch {
      // Return empty array on error
    }
    
    return results
  }
  
  @objc
  open func selectFirst(_ html: String, cssQuery: String) -> [String: Any]? {
    do {
      let doc = try SwiftSoup.parse(html)
      if let element = try doc.select(cssQuery).first() {
        return convertElementToDict(element)
      }
    } catch {
      // Return nil on error
    }
    
    return nil
  }
  
  // MARK: - Text Extraction
  
  @objc
  open func getText(_ html: String, cssQuery: String) -> String {
    do {
      let doc = try SwiftSoup.parse(html)
      let elements = try doc.select(cssQuery)
      return try elements.text()
    } catch {
      return ""
    }
  }
  
  @objc
  open func getHtml(_ html: String, cssQuery: String) -> String {
    do {
      let doc = try SwiftSoup.parse(html)
      let elements = try doc.select(cssQuery)
      return try elements.html()
    } catch {
      return ""
    }
  }
  
  // MARK: - Attribute Operations
  
  @objc
  open func getAttributesByQuery(_ html: String, cssQuery: String, attributeName: String) -> [String] {
    var results: [String] = []
    
    do {
      let doc = try SwiftSoup.parse(html)
      let elements = try doc.select(cssQuery)
      
      for element in elements {
        if let attr = try? element.attr(attributeName), !attr.isEmpty {
          results.append(attr)
        }
      }
    } catch {
      // Return empty array on error
    }
    
    return results
  }
  
  @objc
  open func getAttributeByQuery(_ html: String, cssQuery: String, attributeName: String) -> String {
    do {
      let doc = try SwiftSoup.parse(html)
      if let element = try doc.select(cssQuery).first() {
        return try element.attr(attributeName)
      }
    } catch {
      // Return empty string on error
    }
    
    return ""
  }
  
  // MARK: - Next Sibling Operation
  
  @objc
  open func nextSibling(_ html: String, cssQuery: String) -> [String: Any]? {
    do {
      let doc = try SwiftSoup.parse(html)
      if let element = try doc.select(cssQuery).first() {
        if let nextSibling = try element.nextElementSibling() {
          return convertElementToDict(nextSibling)
        }
      }
    } catch {
      // Return nil on error
    }
    
    return nil
  }
  
  // MARK: - Helper Methods
  
  private func convertElementToDict(_ element: SwiftSoup.Element) -> [String: Any]? {
    do {
      var attributesDict: [String: String] = [:]
      
      for attribute in element.getAttributes()?.asList() ?? [] {
        attributesDict[attribute.getKey()] = attribute.getValue()
      }
      
      return [
        "tag": element.tagName(),
        "text": try element.text(),
        "html": try element.html(),
        "outerHtml": try element.outerHtml(),
        "attributes": attributesDict,
        "childCount": element.children().count
      ]
    } catch {
      return nil
    }
  }
}
