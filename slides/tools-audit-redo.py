import re, sys, json
from html.parser import HTMLParser
OLD, NEW = sys.argv[1], sys.argv[2]
class P(HTMLParser):
    def __init__(s, skipcls):
        super().__init__(); s.pages=[]; s.stack=[]; s.cur=None; s.skip=0; s.skipcls=skipcls
    def handle_starttag(s, tag, a):
        a=dict(a); cls=(a.get('class') or '').split()
        if tag=='section' and 'slide' in cls and s.cur is None:
            s.cur={'label':a.get('aria-label',''),'frags':[],'lists':[],'rows':[],'cols':[],'imgs':[],'depth':0}; s.pages.append(s.cur)
        if s.cur is not None:
            if tag=='section': s.cur['depth']+=1
            sk = tag in ('script','style') or any(c in s.skipcls for c in cls)
            s.stack.append((tag,sk)); 
            if sk: s.skip+=1
            if tag in ('ul','ol'): s.cur['lists'].append(0)
            if tag=='li' and s.cur['lists']: s.cur['lists'][-1]+=1
            if tag=='img' and not s.skip and not sk and a.get('src'): s.cur['imgs'].append(imgkey(a['src']))
            if tag=='tr': s.cur['rows'].append(0)
            if tag in ('td','th') and s.cur['rows']: s.cur['rows'][-1]+=1
    def handle_endtag(s, tag):
        if s.cur is None: return
        while s.stack:
            t,sk=s.stack.pop()
            if sk: s.skip-=1
            if t==tag: break
        if tag=='section':
            s.cur['depth']-=1
            if s.cur['depth']==0: s.cur=None
    def handle_data(s, d):
        if s.cur is not None and not s.skip and d.strip(): s.cur['frags'].append(d.strip())
# 圖片比對用的名字：去掉路徑、副檔名、-mono／-dark 等版本字尾
ALIAS={'synology':'synology-nas','google-cloud-for-startups':'google-for-startups','avalanche-computing':'avalanche','anima-icon':'anima','anima-logomark-default':'anima','anima-showcase-final':'anima-showcase','anima-4a':'anima-showcase','anima-logomark':'anima','anima-horizontal-primary':'anima-logo'}
def imgkey(src):
    k=re.sub(r'\.(svg|png|jpe?g|gif|webp)$','',src.split('/')[-1].split('?')[0].lower()).replace('_','-')
    k=re.sub(r'-(mono|dark|light|txt|default)$','',k)
    return ALIAS.get(k,k)
norm=lambda t: re.sub(r'[\s，。、；：「」（）()！？,.;:!?/·—–\-"\'…＊*]','',t)
def chars(t):
    t=re.sub(r'\s+','',t); cjk=len(re.findall(r'[㐀-鿿　-〿＀-￯]',t)); return round(cjk+(len(t)-cjk)/2)
o=P({'meta','brand-logo','kicker','section-head','meta-org'}); o.feed(open(OLD).read())
n=P({'slide-foot','slide-head','slide-note'}); n.feed(open(NEW).read())
nh=P({'slide-foot'}); nh.feed(open(NEW).read())
newall=norm(''.join(f for p in nh.pages for f in p['frags']))
newtexts=[norm(''.join(p['frags'])) for p in nh.pages]
res=[]
for i,p in enumerate(o.pages):
    frs=[f for f in p['frags'] if len(norm(f))>=3]
    hits={}
    for f in frs:
        nf=norm(f)
        for j,t in enumerate(newtexts):
            if nf in t: hits[j]=hits.get(j,0)+len(nf)
    missing=[f for f in frs if norm(f) not in newall]
    body=''.join(p['frags'])
    res.append({'old':i+1,'label':p['label'],'chars':chars(body),'maxlist':max(p['lists'] or [0]),'rows':len(p['rows']),'cols':max(p['rows'] or [0]),
      'newpages':sorted(j+1 for j,v in hits.items() if v>=12),'missing':missing,'imgs':sorted(set(p['imgs']))})
json.dump(res,open(sys.argv[3],'w'),ensure_ascii=False,indent=1)
for r in res:
    print(f"舊{r['old']:>2} {r['label'][:14]:<14} 字{r['chars']:>4} 清單{r['maxlist']} 表{r['rows']}x{r['cols']} → 新{r['newpages']}  缺{len(r['missing'])}")
# 反向：每個新頁最主要的來源舊頁
best={}
for j,t in enumerate(newtexts):
    sc={}
    for i,p in enumerate(o.pages):
        for f in p['frags']:
            nf=norm(f)
            if len(nf)>=4 and nf in t: sc[i]=sc.get(i,0)+len(nf)
    if sc:
        i=max(sc,key=sc.get); best.setdefault(i+1,[]).append(j+1)
print('---- 舊頁 → 新頁（以新頁的主要來源歸類）')
for i in sorted(best): print(f"舊{i:>2} {o.pages[i-1]['label'][:14]:<14} 字{res[i-1]['chars']:>4} 清單{res[i-1]['maxlist']} 表{res[i-1]['rows']}x{res[i-1]['cols']} → 新{best[i]}")

# 圖片：舊頁的每個 logo／圖，對應的新頁裡要有（新稿換成 DS 版本的檔案也算，名字比對見 imgkey）
print('---- 圖片（舊頁有、對應新頁沒有）')
pages_of={}
for i,js in best.items():
    for j in js: pages_of.setdefault(i,set()).add(j)
for r in res: pages_of.setdefault(r['old'],set()).update(r['newpages'])
lost=0
for r in res:
    if not r['imgs']: continue
    js=pages_of.get(r['old']) or range(1,len(n.pages)+1)   # 文字對不到新頁時，整份找
    have=set(k for j in js for k in n.pages[j-1]['imgs'])|{'anima-logo'}   # ANIMA 橫式 logo 每頁頁尾都有
    miss=[k for k in r['imgs'] if k not in have]
    r['missing_imgs']=miss
    if miss: lost+=len(miss); print(f"舊{r['old']:>2} {r['label'][:14]:<14} 缺圖 {', '.join(miss)}  （對應新{sorted(pages_of.get(r['old'],()))}）")
print('圖片全部對上' if not lost else f'共缺 {lost} 張圖')
json.dump(res,open(sys.argv[3],'w'),ensure_ascii=False,indent=1)
