#import "HtmlSoup.h"
#import <HtmlSoup/HtmlSoup-Swift.h>

@implementation HtmlSoup
RCT_EXPORT_MODULE()

// HTML Parsing
- (NSDictionary *)parse:(NSString *)html {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup parse:html];
}

// Element Selection
- (NSArray *)select:(NSString *)html cssQuery:(NSString *)cssQuery {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup select:html cssQuery:cssQuery];
}

- (NSDictionary *)selectFirst:(NSString *)html cssQuery:(NSString *)cssQuery {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup selectFirst:html cssQuery:cssQuery];
}

// Next Sibling
- (NSDictionary *)nextSibling:(NSString *)html cssQuery:(NSString *)cssQuery {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup nextSibling:html cssQuery:cssQuery];
}


// Text Extraction
- (NSString *)getText:(NSString *)html cssQuery:(NSString *)cssQuery {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup getText:html cssQuery:cssQuery];
}

- (NSString *)getHtml:(NSString *)html cssQuery:(NSString *)cssQuery {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup getHtml:html cssQuery:cssQuery];
}

// Attribute Operations
- (NSArray *)getAttributesByQuery:(NSString *)html cssQuery:(NSString *)cssQuery attributeName:(NSString *)attributeName {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup getAttributesByQuery:html cssQuery:cssQuery attributeName:attributeName];
}

- (NSString *)getAttributeByQuery:(NSString *)html cssQuery:(NSString *)cssQuery attributeName:(NSString *)attributeName {
    HtmlSoupImp *soup = [[HtmlSoupImp alloc] init];
    return [soup getAttributeByQuery:html cssQuery:cssQuery attributeName:attributeName];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeHtmlSoupSpecJSI>(params);
}

@end
