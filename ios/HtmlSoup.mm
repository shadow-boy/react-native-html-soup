#import "HtmlSoup.h"

@implementation HtmlSoup
RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _soupInstance = [[HtmlSoupImp alloc] init];
    }
    return self;
}

// HTML Parsing
- (NSDictionary *)parse:(NSString *)html {
    return [self.soupInstance parse:html];
}

// Element Selection
- (NSArray *)select:(NSString *)html cssQuery:(NSString *)cssQuery {
    return [self.soupInstance select:html cssQuery:cssQuery];
}

- (NSDictionary *)selectFirst:(NSString *)html cssQuery:(NSString *)cssQuery {
    return [self.soupInstance selectFirst:html cssQuery:cssQuery];
}

// Next Sibling
- (NSDictionary *)nextSibling:(NSString *)html cssQuery:(NSString *)cssQuery {
    return [self.soupInstance nextSibling:html cssQuery:cssQuery];
}


// Text Extraction
- (NSString *)getText:(NSString *)html cssQuery:(NSString *)cssQuery {
    return [self.soupInstance getText:html cssQuery:cssQuery];
}

- (NSString *)getHtml:(NSString *)html cssQuery:(NSString *)cssQuery {
    return [self.soupInstance getHtml:html cssQuery:cssQuery];
}

// Attribute Operations
- (NSArray *)getAttributesByQuery:(NSString *)html cssQuery:(NSString *)cssQuery attributeName:(NSString *)attributeName {
    return [self.soupInstance getAttributesByQuery:html cssQuery:cssQuery attributeName:attributeName];
}

- (NSString *)getAttributeByQuery:(NSString *)html cssQuery:(NSString *)cssQuery attributeName:(NSString *)attributeName {
    return [self.soupInstance getAttributeByQuery:html cssQuery:cssQuery attributeName:attributeName];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeHtmlSoupSpecJSI>(params);
}

@end
