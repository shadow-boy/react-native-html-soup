package com.htmlsoup

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule
import org.jsoup.Jsoup
import org.jsoup.nodes.Element
import org.jsoup.select.Elements

@ReactModule(name = HtmlSoupModule.NAME)
class HtmlSoupModule(reactContext: ReactApplicationContext) :
  NativeHtmlSoupSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }


  // HTML Parsing

  override fun parse(html: String): WritableMap? {
    try {
      val doc = Jsoup.parse(html)
      val result = WritableNativeMap()
      result.putString("title", doc.title())
      result.putString("body", doc.body().html())
      return result
    } catch (e: Exception) {
      val result = WritableNativeMap()
      result.putString("title", "")
      result.putString("body", "")
      return result
    }
  }

  // Element Selection

  override fun select(html: String, cssQuery: String): WritableArray? {
    val results = WritableNativeArray()
    try {
      val doc = Jsoup.parse(html)
      val elements = doc.select(cssQuery)

      for (element in elements) {
        val elementMap = convertElementToMap(element)
        if (elementMap != null) {
          results.pushMap(elementMap)
        }
      }
    } catch (e: Exception) {
      // Return empty array on error
    }

    return results
  }

  override fun selectFirst(html: String, cssQuery: String): WritableMap? {
    try {
      val doc = Jsoup.parse(html)
      val element = doc.select(cssQuery).first()
      return element?.let { convertElementToMap(it) }
    } catch (e: Exception) {
      // Return null on error
    }

    return null
  }

  // Text Extraction

  override fun getText(html: String, cssQuery: String): String {
    try {
      val doc = Jsoup.parse(html)
      val elements = doc.select(cssQuery)
      return elements.text()
    } catch (e: Exception) {
      return ""
    }
  }

  override fun getHtml(html: String, cssQuery: String): String {
    try {
      val doc = Jsoup.parse(html)
      val elements = doc.select(cssQuery)
      return elements.html()
    } catch (e: Exception) {
      return ""
    }
  }

  // Attribute Operations

  override fun getAttributesByQuery(html: String, cssQuery: String, attributeName: String): WritableArray? {
    val results = WritableNativeArray()
    try {
      val doc = Jsoup.parse(html)
      val elements = doc.select(cssQuery)

      for (element in elements) {
        val attr = element.attr(attributeName)
        if (attr.isNotEmpty()) {
          results.pushString(attr)
        }
      }
    } catch (e: Exception) {
      // Return empty array on error
    }

    return results
  }

  override fun getAttributeByQuery(html: String, cssQuery: String, attributeName: String): String {
    try {
      val doc = Jsoup.parse(html)
      val element = doc.select(cssQuery).first()
      return element?.attr(attributeName) ?: ""
    } catch (e: Exception) {
      return ""
    }
  }

  // Helper Methods

  private fun convertElementToMap(element: Element): WritableMap? {
    try {
      val map = WritableNativeMap()
      val attributesMap = WritableNativeMap()

      for (attribute in element.attributes()) {
        attributesMap.putString(attribute.key, attribute.value)
      }

      map.putString("tag", element.tagName())
      map.putString("text", element.text())
      map.putString("html", element.html())
      map.putString("outerHtml", element.outerHtml())
      map.putMap("attributes", attributesMap)
      map.putInt("childCount", element.children().size)

      return map
    } catch (e: Exception) {
      return null
    }
  }

  companion object {
    const val NAME = "HtmlSoup"
  }
}
