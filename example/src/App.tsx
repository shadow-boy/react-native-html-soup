import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import * as HtmlSoup from 'react-native-html-soup';

// 仿照Python脚本的动漫解析器
class YhdmParser {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://www.yhdm6.top';
  }

  // 从URL中提取ID
  private extractIdFromUrl(url: string | null): string | null {
    if (!url) return null;
    // 处理相对路径
    if (url.startsWith('/')) {
      url = this.baseUrl + url;
    }
    // 尝试从URL中提取ID
    const match = url.match(/\/(\d+)(?:\.html|\/?)$/);

    // @ts-ignore
    return match ? match[1] : null;
  }

  // 解析每周更新表
  parseWeeklySchedule(html: string): any[] {
    const weeklySchedule: any[] = [];

    try {
      // 查找番剧表部分
      let scheduleSection = HtmlSoup.selectFirst(html, 'div.pannel h2.title:contains(番剧表)');
      if (!scheduleSection) return weeklySchedule;

      // 获取父级的pannel元素
      const parentId = scheduleSection?.attributes?.id;
      if (!parentId) return weeklySchedule;

      // 获取所有ul标签
      const uls = HtmlSoup.select(html, `#${parentId} ul.vodlist`);

      // 遍历每个ul（每天的更新）
      uls.forEach((ul) => {
        const ulHtml = ul.outerHtml;
        // 获取所有动漫项
        const items = HtmlSoup.select(ulHtml, 'li.vodlist_item');

        // 创建一个列表来存储这一天的动漫
        const animeList: any[] = [];

        items.forEach((item) => {
          const itemHtml = item.outerHtml;
          // 解析动漫项
          const anime = this.parseAnimeItem(itemHtml);
          if (!anime) return;

          // 获取更新信息
          const updateText = HtmlSoup.getText(itemHtml, 'span.pic_text.text_right');
          if (updateText) {
            anime.update_info = updateText;
          }

          animeList.push(anime);
        });

        // 如果这一天有动漫，添加到weekly_schedule
        if (animeList.length > 0) {
          weeklySchedule.push({
            anime_list: animeList,
          });
        }
      });
    } catch (error) {
      console.error('Error parsing weekly schedule:', error);
    }

    return weeklySchedule;
  }

  // 解析分类
  parseCategories(html: string): any[] {
    const categories: any[] = [];

    try {
      // 获取所有分类部分
      const sections = HtmlSoup.select(html, 'div.pannel');

      sections.forEach((section) => {
        const sectionHtml = section.outerHtml;
        const title = HtmlSoup.getText(sectionHtml, 'h2.title');

        if (!title) return;
        const categoryName = title.trim();

        // 跳过番剧表，因为已经单独处理
        if (categoryName.includes('番剧表')) return;

        // 只处理包含特定关键词的分类
        if (!['动漫', '番剧', '排行榜'].some(keyword => categoryName.includes(keyword))) return;

        // 获取category_id
        let categoryId = null;
        const moreLink = HtmlSoup.selectFirst(sectionHtml, 'a.text_muted.pull_left');
        if (moreLink) {
          const href = moreLink.attributes.href || '';
          if (href) {
            // 从URL中提取分类ID
            const match = href.match(/\/type\/id\/(\d+)\/?/);
            if (match) {
              categoryId = match[1];
            }
          }
        }

        // 处理动漫列表
        const animeList: any[] = [];
        const vodlistItems = HtmlSoup.select(sectionHtml, 'ul.vodlist li.vodlist_item');

        vodlistItems.forEach((item) => {
          const anime = this.parseAnimeItem(item.outerHtml);
          if (anime) {
            animeList.push(anime);
          }
        });

        if (animeList.length > 0) {
          categories.push({
            name: categoryName,
            category_id: categoryId,
            anime_list: animeList,
          });
        }
      });
    } catch (error) {
      console.error('Error parsing categories:', error);
    }

    return categories;
  }

  // 解析最近更新
  parseRecentUpdates(html: string): any[] {
    const recentUpdates: any[] = [];

    try {
      // 获取最近更新的12个项目
      const recentItems = HtmlSoup.select(html, '.vodlist_item');
      const items = recentItems.slice(0, 12);

      items.forEach((item) => {
        const anime = this.parseAnimeItem(item.outerHtml);
        if (anime) {
          recentUpdates.push(anime);
        }
      });
    } catch (error) {
      console.error('Error parsing recent updates:', error);
    }

    return recentUpdates;
  }

  // 解析排行榜
  parseRankings(html: string): any[] {
    const rankings: any[] = [];

    try {
      const rankSections = HtmlSoup.select(html, 'div.list_info');

      rankSections.forEach((section) => {
        const sectionHtml = section.outerHtml;
        const titleElem = HtmlSoup.selectFirst(sectionHtml, 'h3.title');

        if (!titleElem) return;
        const rankName = titleElem.text.trim();

        const rankItems: any[] = [];
        const items = HtmlSoup.select(sectionHtml, 'li');

        items.forEach((item, index) => {
          const itemHtml = item.outerHtml;

          // 判断是否为带图片的排行项
          if (itemHtml.includes('ranklist_item')) {
            const titleElem = HtmlSoup.selectFirst(itemHtml, 'h4.title');
            if (!titleElem) return;

            const title = titleElem.text.trim();
            const linkElem = HtmlSoup.selectFirst(itemHtml, 'a');
            const url = linkElem?.attributes?.href || '';

            const info = HtmlSoup.getText(itemHtml, 'p.vodlist_sub');
            const infoText = info ? info.replace(/\s/g, ' ').trim() : '';

            // 获取热度信息
            const heat = this.extractHeat(itemHtml);

            // 获取缩略图
            let thumbnail = '';
            const thumbElem = HtmlSoup.selectFirst(itemHtml, 'div.ranklist_thumb.lazyload');

            if (thumbElem) {
              thumbnail = thumbElem.attributes['data-original'] || '';

              if (!thumbnail) {
                // 尝试从style属性中提取背景图片URL
                const style = thumbElem.attributes.style || '';
                const bgMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
                if (bgMatch) {
                  // @ts-ignore
                  thumbnail = bgMatch[1];
                }
              }
            }

            rankItems.push({
              rank: index + 1,
              title,
              id: this.extractIdFromUrl(url),
              info: infoText,
              heat,
              thumbnail,
            });
          } else {
            // 处理普通排行项
            const link = HtmlSoup.selectFirst(itemHtml, 'a');
            if (!link) return;

            const title = this.cleanTitle(link.text.trim());
            const url = link.attributes.href || '';

            // 获取热度信息
            const heat = this.extractHeat(itemHtml);

            rankItems.push({
              rank: index + 1,
              title,
              id: this.extractIdFromUrl(url),
              heat,
            });
          }
        });

        if (rankItems.length > 0) {
          rankings.push({
            name: rankName,
            items: rankItems,
          });
        }
      });
    } catch (error) {
      console.error('Error parsing rankings:', error);
    }

    return rankings;
  }

  // 解析动漫项
  parseAnimeItem(html: string): any | null {
    try {
      const titleElem = HtmlSoup.selectFirst(html, 'a.vodlist_thumb');
      if (!titleElem) return null;

      const title = titleElem.attributes.title?.trim() || '';
      const url = titleElem.attributes.href || '';
      let thumbUrl = titleElem.attributes['data-original'] || '';

      if (!thumbUrl) {
        thumbUrl = titleElem.attributes.src || '';
      }

      const info = HtmlSoup.getText(html, 'p.vodlist_sub');
      const infoText = info ? info.replace(/\s/g, ' ').trim() : '';

      // 解析年份和类型
      let year = '';
      let animeType = '';
      let status = '';

      // 获取状态信息
      const statusElem = HtmlSoup.getText(html, 'span.pic_text');
      if (statusElem) {
        status = statusElem.trim();
      }

      // 从vodlist_top中获取年份和类型
      const vodlistTop = HtmlSoup.selectFirst(html, 'span.vodlist_top');
      if (vodlistTop) {
        const topHtml = vodlistTop.outerHtml;
        const yearElem = HtmlSoup.getText(topHtml, 'em.voddate_year');
        const typeElem = HtmlSoup.getText(topHtml, 'em.voddate_type');

        if (yearElem) {
          year = yearElem.trim();
        }

        if (typeElem) {
          animeType = typeElem.trim();
        }
      }

      return {
        title,
        id: this.extractIdFromUrl(url),
        thumbnail: thumbUrl,
        year,
        type: animeType,
        status,
        info: infoText,
      };
    } catch (error) {
      console.error('Error parsing anime item:', error);
      return null;
    }
  }

  // 清理标题
  private cleanTitle(title: string): string {
    // 清理标题中的排名和点击数
    // 移除开头的数字和空格
    title = title.replace(/^\d+\s+/, '');
    // 移除剩余的数字和空格
    title = title.replace(/\d+\s*/, '');
    // 移除前导和尾随空格
    title = title.trim();
    // 移除多余的空格
    title = title.replace(/\s+/, ' ');
    // 移除所有空格
    title = title.replace(/\s/g, '');
    // 移除特殊字符
    title = title.replace(/[^\w\u4e00-\u9fff]/g, '');
    // 移除前导空格
    title = title.trim();

    return title;
  }

  // 提取热度信息
  private extractHeat(html: string): number {
    try {
      // 尝试从 text_muted pull_right 类中提取
      let heatElem = HtmlSoup.getText(html, 'span.text_muted.pull_right');
      if (heatElem) {
        const heatMatch = heatElem.match(/(\d+)/);
        if (heatMatch) {
          // @ts-ignore
          return parseInt(heatMatch[1], 10);
        }
      }

      // 尝试从 text_muted pull_right renqi 类中提取
      heatElem = HtmlSoup.getText(html, 'span.text_muted.pull_right.renqi');
      if (heatElem) {
        const heatMatch = heatElem.match(/(\d+)/);
        if (heatMatch) {
          // @ts-ignore
          return parseInt(heatMatch[1], 10);
        }
      }

      return 0;
    } catch (error) {
      console.error('Error extracting heat:', error);
      return 0;
    }
  }

  // 生成JSON数据
  async generateJson(html: string): Promise<string> {
    try {
      const data = {
        weekly_schedule: this.parseWeeklySchedule(html),
        categories: this.parseCategories(html),
        recent_updates: this.parseRecentUpdates(html),
        rankings: this.parseRankings(html),
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error generating JSON:', error);
      return JSON.stringify({ error: 'Failed to generate JSON data' });
    }
  }
}

// 示例HTML内容（这里只是一个示例，实际应用中应该通过网络请求获取）
const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>动漫网站示例</title>
</head>
<body>
  <div class="pannel">
    <h2 class="title" id="pannel-1">番剧表</h2>
    <ul class="vodlist">
      <li class="vodlist_item">
        <a class="vodlist_thumb" href="/123.html" title="动漫标题1" data-original="https://example.com/img1.jpg">
          <span class="pic_text">更新至第12集</span>
        </a>
        <p class="vodlist_sub">2023 / 日本</p>
        <span class="vodlist_top">
          <em class="voddate_year">2023</em>
          <em class="voddate_type">TV</em>
        </span>
        <span class="pic_text text_right">周一更新</span>
      </li>
    </ul>
  </div>
  <div class="pannel">
    <h2 class="title" id="pannel-2">热门动漫</h2>
    <a class="text_muted pull_left" href="/type/id/123">更多</a>
    <ul class="vodlist">
      <li class="vodlist_item">
        <a class="vodlist_thumb" href="/456.html" title="热门动漫1" data-original="https://example.com/img2.jpg">
          <span class="pic_text">完结</span>
        </a>
        <p class="vodlist_sub">2022 / 日本</p>
        <span class="vodlist_top">
          <em class="voddate_year">2022</em>
          <em class="voddate_type">剧场版</em>
        </span>
      </li>
    </ul>
  </div>
  <div class="list_info">
    <h3 class="title">排行榜</h3>
    <li class="ranklist_item">
      <div class="ranklist_thumb lazyload" data-original="https://example.com/img3.jpg"></div>
      <h4 class="title">排行榜动漫1</h4>
      <a href="/789.html"></a>
      <p class="vodlist_sub">2023 / 日本</p>
      <span class="text_muted pull_right">12345</span>
    </li>
    <li>
      <a href="/101.html">1 普通排行动漫1</a>
      <span class="text_muted pull_right renqi">6789</span>
    </li>
  </div>
</body>
</html>
`;

const App = () => {
  const [html, setHtml] = useState(sampleHtml);
  const [jsonResult, setJsonResult] = useState('');
  const [loading, setLoading] = useState(false);

  const parseHtml = async () => {
    try {
      setLoading(true);
      const parser = new YhdmParser();
      const result = await parser.generateJson(html);
      setJsonResult(result);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      setJsonResult(JSON.stringify({ error: 'Failed to parse HTML' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('https://www.yhdm6.top/')
      .then(response => response.text())
      .then(setHtml)
      .catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>动漫网站HTML解析器</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HTML输入：</Text>
        <TextInput
          style={styles.htmlInput}
          multiline
          value={html}
          onChangeText={setHtml}
        />
      </View>

      <TouchableOpacity
        style={styles.parseButton}
        onPress={parseHtml}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.parseButtonText}>解析HTML</Text>
        )}
      </TouchableOpacity>

      {jsonResult ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>解析结果：</Text>
          <ScrollView style={styles.jsonResult}>
            <TextInput
              style={[styles.htmlInput, { height: 'auto', }]}
              multiline
              value={jsonResult}

            />


          </ScrollView>
        </View>
      ) : null}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  htmlInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  parseButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  parseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  jsonResult: {
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    width: "100%"
  },
});

export default App;
