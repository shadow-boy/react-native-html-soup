#import <HtmlSoup/RNHtmlSoupSpec.h>
#import <HtmlSoup/HtmlSoup-Swift.h>

@class HtmlSoupImp;

@interface HtmlSoup : NSObject <NativeHtmlSoupSpec>
@property (nonatomic, strong) HtmlSoupImp *soupInstance;
@end
