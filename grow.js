/* 向外分枝。
 * 落点只看主承启，数据里没有坐标。
 * 根没有亲代方向，子代按后代数把周围的空分掉。
 * 其余节点沿亲代实际长出的方向继续走，兄弟把前方的角度按后代数分掉。
 * 落点若离已有节点太近，就在这个方向附近再往外试，直到有空。
 * 虚线不参与落点。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CIV = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const LANES = [
    ["inq", "方法", "#B7B1A6", "方法论"],
    ["numalg", "数与代数", "#E8D4A8", "数学"],
    ["geometry", "几何", "#C6A15A", "数学"],
    ["anal", "分析", "#D4784A", "数学"],
    ["stoch", "概率统计", "#6E9A8A", "数学"],
    ["found", "基础", "#B7A898", "数学"],
    ["lang", "语言", "#E7C56A", "文学与艺术"],
    ["doc", "文献", "#A88860", "文学与艺术"],
    ["hist", "历史", "#8A6848", "文学与艺术"],
    ["art", "艺术", "#D48AB0", "文学与艺术"],
    ["media", "记录", "#B08CC8", "文学与艺术"],
    ["econ", "经济", "#D4B23A", "社会"],
    ["soc", "社会", "#8C8478", "社会"],
    ["pol", "政治", "#6E7C99", "社会"],
    ["cyto", "细胞", "#6FCB96", "生命"],
    ["hered", "遗传", "#2A9A8A", "生命"],
    ["evol", "演化", "#C2D05A", "生命"],
    ["microbe", "微生物", "#8A9A48", "生命"],
    ["morph", "形态", "#E0B8A4", "生命"],
    ["agri", "农学", "#A8B44A", "生命"],
    ["clinic", "临床", "#E08AA0", "生命"],
    ["health", "卫生", "#7EB8A0", "生命"],
    ["drug", "药物", "#C44868", "生命"],
    ["psy", "心理", "#C49AD0", "生命"],
    ["force", "力学", "#8EADC4", "物理"],
    ["heat", "热学", "#E25B3A", "物理"],
    ["electro", "电磁", "#3A6FD4", "物理"],
    ["cond", "凝聚态", "#B0A4C8", "物理"],
    ["nucl", "核与粒子", "#C45C9A", "物理"],
    ["chem", "化学", "#E0A07A", "物理"],
    ["astro", "天文", "#8AA0E0", "物理"],
    ["earth", "地学", "#3E8F72", "物理"],
    ["tool", "机械", "#D08A72", "物理"],
    ["mat", "材料", "#C4843A", "物理"],
    ["power", "动力", "#E39B2B", "物理"],
    ["comm", "通信", "#3A9BBF", "物理"],
    ["cs", "计算机", "#7E93D6", "物理"],
    ["civil", "营造", "#C2B49A", "物理"],
    ["transit", "交通", "#3E8F9A", "物理"]
  ];

  const DISC = {
    lang: "lang", grammar: "lang", writing: "lang", alpha: "lang", phoneme: "lang", kinlang: "lang",
    paper: "doc", print: "doc", lib: "doc", univ: "doc",
    source: "hist", chronicle: "hist",
    image: "art", music: "art", drama: "art", perspect: "art", notation: "art",
    method: "inq", journal: "inq",
    num: "numalg", frac: "numalg", zero: "numalg", neg: "numalg", irrat: "numalg",
    algebra: "numalg", group: "numalg", lin: "numalg", cplx: "numalg", loga: "numalg", bool: "numalg", abacus: "numalg",
    geom: "geometry", noneucl: "geometry", trig: "geometry", topo: "geometry", graphth: "geometry",
    calc: "anal", func: "anal", limit: "anal", fourier: "anal", model: "anal", chaos: "anal",
    prob: "stoch", stats: "stoch", regr: "stoch", merr: "stoch", bayes: "stoch", gametheory: "stoch",
    proof: "found", set: "found", incompleteness: "found", algo: "found",
    motion: "force", momentum: "force", grav: "force", buoy: "force", dimen: "force", rel: "force", noether: "force",
    fluid: "force", angmom: "force",
    vac: "heat", thermo: "heat", energy: "heat", entropy: "heat", kinetic: "heat", gaslaw: "heat", blackbody: "heat",
    induction: "electro", field: "electro", em: "electro", wave: "electro", doppler: "electro",
    semi: "cond", super: "cond", phase: "cond",
    electron: "nucl", decay: "nucl", nucleus: "nucl", fission: "nucl", quantum: "nucl",
    huncert: "nucl", qft: "nucl", anti: "nucl", standard: "nucl", neutrino: "nucl",
    calendar: "astro", helio: "astro", kepler: "astro", galaxies: "astro", cosmos: "astro",
    scope: "astro", spectrum: "astro", tilt: "astro", eclipse: "astro", spin: "astro", tide: "astro",
    comet: "astro", parallax: "astro", starlife: "astro", hole: "astro", dark: "astro",
    nucleosynth: "astro", darke: "astro", exoplanet: "astro",
    oxygen: "chem", mass: "chem", element: "chem", molecule: "chem", organic: "chem",
    acid: "chem", catal: "chem", atom: "chem", bond: "chem", periodic: "chem",
    iso: "chem", echem: "chem", diffract: "chem", equil: "chem", polymer: "chem",
    fire: "mat", pot: "mat", smelt: "mat", bronze: "mat", iron: "mat", glass: "mat",
    powder: "mat", coal: "mat", steel: "mat", textile: "mat", plastic: "mat", oil: "mat",
    porcelain: "mat", match: "mat", alum: "mat",
    steam: "power", ice: "power", battery: "power", dynamo: "power", emotor: "power", grid: "power",
    nuke: "power", solar: "power", liion: "power", wind: "power", lamp: "power", led: "power", mill: "power",
    boat: "transit", sail: "transit", rudder: "transit", lock: "transit", rail: "transit", car: "transit",
    plane: "transit", steamboat: "transit", bike: "transit", tire: "transit", rocket: "transit",
    container: "transit", drone: "transit", reuse: "transit", compass: "transit", stirrup: "transit", ev: "transit",
    arch: "civil", concrete: "civil", elev: "civil", toilet: "civil",
    stone: "tool", bow: "tool", lever: "tool", wheel: "tool", gear: "tool", screw: "tool",
    clock: "tool", chron: "tool", parts: "tool", thermom: "tool", glasses: "tool",
    sewing: "tool", wash: "tool", ac: "tool", millcloth: "tool",
    round: "earth", fossil: "earth", deep: "earth", drift: "earth", plate: "earth", hydro: "earth",
    atmos: "earth", green: "earth", strata: "earth", impact: "earth", iceage: "earth", map: "earth",
    dating: "earth", carbon: "earth", interior: "earth", ozone: "earth", milank: "earth",
    cell: "cyto", resp: "cyto", protein: "cyto", enzyme: "cyto", atp: "cyto", hormone: "cyto",
    homeo: "cyto", photo: "cyto", fold: "cyto",
    gene: "hered", chromosome: "hered", dna: "hered", dogma: "hered", mut: "hered",
    genereg: "hered", rdna: "hered", endo: "hered", ips: "hered",
    taxon: "evol", evo: "evol", synth: "evol", domains: "evol", ecology: "evol", extinct: "evol", biogeo: "evol",
    seen: "microbe", germ: "microbe", virus: "microbe", immune: "microbe", clonal: "microbe", micro: "microbe",
    anatomy: "morph", blood: "morph", brain: "morph", neuron: "morph", fert: "morph",
    epi: "health", water: "health", ors: "health", vari: "health", vitamin: "health",
    anes: "clinic", sterile: "clinic", xray: "clinic", transfuse: "clinic", ivf: "clinic",
    pcr: "clinic", ngs: "clinic", crispr: "clinic",
    vax: "drug", pharma: "drug", insulin: "drug", abx: "drug", artem: "drug", mab: "drug",
    mrna: "drug", haart: "drug", checkpoint: "drug", glp1: "drug", pill: "drug",
    agri: "agri", herd: "agri", ferment: "agri", plow: "agri", irrig: "agri", cold: "agri",
    haber: "agri", rice: "agri", breed: "agri", collar: "agri", can: "agri", pasteur: "agri",
    psych: "psy", cond: "psy", reflex: "psy", circa: "psy", operant: "psy", uncon: "psy",
    memcons: "psy", memrecon: "psy", workmem: "psy", cogdev: "psy", attach: "psy", acquire: "psy",
    tom: "psy", bias: "psy", prospect: "psy", plast: "psy",
    money: "econ", market: "econ", books: "econ", firm: "econ", measure: "econ", metric: "econ",
    labor: "econ", pay: "econ", ricardo: "econ", accounts: "econ", insure: "econ",
    city: "soc", law: "soc",
    info: "comm", coding: "comm", telegraph: "comm", radio: "comm", tube: "comm", laser: "comm",
    telephone: "comm", radar: "comm", sat: "comm", fiber: "comm", gnss: "comm", mobile: "comm",
    wifi: "comm", broadband: "comm", mbb: "comm",
    camera: "media", phono: "media", cinema: "media", tv: "media", lcd: "media",
    stream: "media", vcall: "media", cmos: "media",
    compute: "cs", computer: "cs", trans: "cs", ic: "cs", net: "cs", ml: "cs", web: "cs", ai: "cs",
    barcode: "cs", smartphone: "cs", cloud: "cs", flash: "cs", bitcoin: "cs",
    pubkey: "cs", complexity: "cs", relmodel: "cs",
    peer: "inq", gw: "astro", pulsar: "astro", lensing: "astro",
    chiral: "chem", chrom: "chem", masspec: "chem", rebar: "civil", hydroelec: "power", xfmr: "power",
    mineral: "earth", erosion: "earth", oceanc: "earth", magrev: "earth",
    ionchan: "morph", hox: "hered", hgt: "hered",
    transplant: "clinic", chemo: "drug", radioTx: "clinic", neurolep: "drug",
    psychom: "psy", sdt: "psy",
    lexicon: "lang", encycl: "doc", archive: "hist", chronol: "hist",
    harmony: "art", museum: "art",
    papermoney: "econ", cbank: "econ", inflation: "econ", oppcost: "econ",
    bureau: "pol", elect: "pol", constit: "pol", census: "pol", school: "pol",
    modul: "comm", compress: "comm", os: "cs", proglang: "cs", opensrc: "cs"
  };

  const STEP = 108;
  const GAP = 74;

  function N(id, name, kind, lane, year, src, parent, also, blurb, share) {
    return { id, name, kind, lane, year, src, parent, also: also || [], blurb, share: share || null };
  }

  const NODES = [
    N("stone", "石器", "发明", "stuff", "约260万年前", "tech", null, [],
      "第一件能留下来、也能再做一把的工具。"),
    N("fire", "用火", "发明", "stuff", "旧石器时代", "tech", "stone", [],
      "取暖、熟食。烧陶、冶炼和后来的蒸汽，都从留下这团火开始。"),
    N("bow", "弓", "发明", "stuff", "旧石器时代晚期", "tech", "stone", [],
      "把弹性能存进弯木，投掷的距离变远。"),
    N("pot", "陶器", "发明", "stuff", "约1万年前", "tech", "fire", [],
      "能煮、能存。水、粮和种子可以留到下一顿。"),
    N("smelt", "冶炼", "发明", "stuff", "约前5千纪起", "tech", "fire", ["pot"],
      "把矿石在炉里化成金属。炉温借了烧陶，出来的是金属，不是罐子。"),
    N("bronze", "青铜", "发明", "stuff", "约前3000年", "tech", "smelt", [],
      "铜和锡化开再凝固，器物可以按模子浇出来。"),
    N("iron", "冶铁", "发明", "stuff", "约前1200年", "tech", "bronze", [],
      "矿比铜锡常见，农具和兵器才够整个社会用。"),
    N("glass", "玻璃", "发明", "stuff", "古代", "tech", "fire", ["smelt"],
      "把砂和助熔剂烧成透明的固体。透镜和许多仪器用的是它，不是陶器。"),
    N("arch", "拱券", "发明", "stuff", "古代", "tech", "city", ["stone"],
      "开口上方的压力拐到两侧。石块或砖砌成门和桥，不必靠一根长梁。"),
    N("concrete", "混凝土", "发明", "stuff", "罗马与19世纪", "tech", "arch", [],
      "倒进模子就硬化。港、拱和后来的骨架建筑靠它。"),
    N("powder", "火药", "发明", "stuff", "9世纪", "tech", "fire", ["iron"],
      "把快速燃烧收进管子。采矿和火器从这里分出去，代价主要写在战争里。"),
    N("coal", "煤炭", "发明", "stuff", "古代已用，17世纪后大量供能", "", "fire", ["iron"],
      "比木柴密的热。蒸汽和冶炼不必只靠森林。"),
    N("steel", "钢", "发明", "stuff", "1856年", "tech", "iron", [],
      "把铁里的碳控制住，大量便宜的钢撑起轨道、机器和高层。"),
    N("textile", "纺织", "发明", "stuff", "新石器时代", "tech", "agri", ["herd"],
      "把纤维拧成线、织成布，衣服不再只靠皮毛。"),
    N("plastic", "塑料", "发明", "stuff", "1907年", "tech", "molecule", ["oil"],
      "性质可以设计的固体，便宜，也留下了很难收回的废物。"),

    N("lang", "语言", "认知", "symbol", "史前", "both", null, [],
      "说法可以不靠实物传下去。文字、数和课都站在这上面。"),
    N("grammar", "语法", "认知", "symbol", "古代", "", "lang", [],
      "句子有可以指出来的结构。语言学从这里开始，不必把每句话都记住。"),
    N("image", "图像", "发明", "symbol", "史前", "", "lang", [],
      "把看见的东西留在岩壁上。故事可以不靠说话的人在场。"),
    N("music", "音乐", "认知", "symbol", "史前", "", "lang", [],
      "把声音排成可以重复的样子。一群人因此有了同一套拍子。"),
    N("writing", "文字", "发明", "symbol", "约前3200年", "both", "lang", ["city", "num"],
      "把话固定在器物上，账、法令和知识才能离开说话的人。"),
    N("chronicle", "纪事", "认知", "symbol", "古代", "", "writing", ["calendar"],
      "把发生过的事按先后记下来。后来核对的就是这种记载。"),
    N("law", "成文法", "认知", "symbol", "约前18世纪", "", "writing", ["city"],
      "规则写成条文，处罚不必每次重新商量。法学后来核对的就是这种文本。"),
    N("alpha", "字母", "发明", "symbol", "约前2千纪起", "", "writing", [],
      "一类文字里，符号对上音素，要记的个数可以降到几十个。汉字对上的是语素，两条都从文字长出。"),
    N("money", "货币", "认知", "symbol", "约前7世纪", "tech", "writing", ["num"],
      "用可以点数的凭证交换，不必每次都换实物。"),
    N("market", "市场", "认知", "symbol", "古代", "", "money", [],
      "价格把想买的和想卖的对齐。不必认识对方，东西也能换手。"),
    N("measure", "度量衡", "认知", "symbol", "古代", "tech", "writing", ["num"],
      "长度、重量和容积有了共同的尺，交易和工程才能对得上。"),
    N("lib", "图书馆", "发明", "symbol", "古代", "", "writing", [],
      "把抄本收在一处，对照和注释才有地方发生。"),
    N("paper", "纸", "发明", "symbol", "2世纪", "tech", "writing", [],
      "比竹简和羊皮轻，抄写和后来的印刷才铺得开。"),
    N("univ", "大学", "发明", "symbol", "11世纪起", "", "lib", [],
      "讲者和文本稳定地留在同一处，学问不必只靠师徒散传。"),
    N("print", "印刷", "发明", "symbol", "7至15世纪", "tech", "paper", [],
      "同一份文本可以印很多份，读的人不再靠手抄。"),
    N("books", "复式记账", "认知", "symbol", "14至15世纪", "", "money", ["zero"],
      "每一笔同时记下从哪来、到哪去，账可以核。"),
    N("firm", "股份公司", "发明", "symbol", "17世纪", "", "books", ["money"],
      "许多人的本金合成一份长期资本，损失以出资为界。"),
    N("journal", "学术期刊", "发明", "symbol", "1665年", "", "print", ["method"],
      "实验和争议定期印出来，别人才能接着核对。"),
    N("metric", "公制", "认知", "symbol", "1790年代", "", "measure", ["method"],
      "用可以复现的标准取代各地各不相同的尺。"),

    N("num", "数", "认知", "number", "史前", "cog", "lang", [],
      "把多少从具体的东西里抽出来，才能比较和累计。"),
    N("proof", "证明", "认知", "number", "约前300年", "cog", "num", ["writing"],
      "从公认的前提出发，把后面的每一步写出来让别人检查。"),
    N("set", "集合", "认知", "number", "1870年代", "cog", "proof", [],
      "把对象收成一组来谈。无穷也可以比较大小，不再只是「没完」。"),
    N("geom", "几何", "认知", "number", "约前300年", "both", "proof", [],
      "用可以核对的图形关系谈土地、天文和后来的运动。"),
    N("noneucl", "非欧几何", "认知", "number", "1820年代", "cog", "geom", [],
      "平行线不必只有一种。后来的引力改成弯曲，用的是这种几何。"),
    N("zero", "零与位值", "认知", "number", "约7世纪", "both", "num", ["writing"],
      "空位也是数，同一套符号可以写下任意大的数。"),
    N("algebra", "代数", "认知", "number", "约820年", "cog", "zero", [],
      "未知量可以像已知量一样搬移，方程取代了只靠图形的做法。"),
    N("group", "群", "认知", "number", "1832至1854年", "", "algebra", [],
      "一组操作只要能结合、能还原，就有同一种结构。对称因此可以计算。"),
    N("algo", "算法", "认知", "number", "约9世纪起", "", "algebra", [],
      "把计算写成有限的步骤，换一个人也能照着做完。更早的手续各地都有，这里取它被单独当成方法的时候。"),
    N("loga", "对数", "认知", "number", "1614年", "", "algebra", [],
      "把乘除改成加减，天文和航海里的大数才算得动。"),
    N("prob", "概率", "认知", "number", "1654年", "cog", "algebra", [],
      "不确定的事可以分配数值。后来的统计和保险站在这里。"),
    N("method", "科学方法", "认知", "number", "17世纪", "both", "proof", ["print", "univ"],
      "把猜想交给可以重复的实验和对照，而不是只交给权威文本。"),
    N("wave", "波", "认知", "number", "1678至1747年", "", "method", [],
      "扰动可以离开源头往前传。声、光和后来的量子都用得上这种图景。"),
    N("source", "史料批判", "认知", "symbol", "15至19世纪", "cog", "print", ["method", "chronicle"],
      "一份记载先要问谁写的、凭什么。历史学因此能跟传说分开。"),
    N("taxon", "分类", "认知", "life", "1735年", "cog", "method", [],
      "生物按可以核对的特征归组、命名。后面谈物种变化，才有稳定的对象。"),
    N("hydro", "水循环", "认知", "cosmos", "17世纪", "cog", "method", ["agri"],
      "地上的水会蒸发、成云、再落下。江河不是用完就没了的库存。"),
    N("calc", "微积分", "认知", "number", "17世纪", "cog", "algebra", ["geom"],
      "坐标先把形写成数。变化本身可以计算：瞬时的快慢，和累积起来的总量。"),
    N("func", "函数", "认知", "number", "18世纪", "", "calc", [],
      "一个量怎样跟着另一个量变，可以单独写成对象。牛顿和莱布尼茨已经在用，欧拉把它写成独立的东西。"),
    N("limit", "极限", "认知", "number", "1821年", "", "calc", [],
      "无限靠近可以定义成严格的误差。瞬时变化不再靠比喻。"),
    N("fourier", "傅里叶分解", "认知", "number", "1822年", "cog", "wave", ["calc"],
      "一段复杂的变化可以拆成许多简单的波。信号处理从这里来。"),
    N("stats", "统计与对照", "认知", "number", "1747至1948年", "cog", "prob", ["method"],
      "用分组对照把「看起来有效」和「确实有效」分开。"),
    N("bool", "开关逻辑", "认知", "number", "1854至1938年", "", "algebra", ["proof"],
      "真假可以做成开关的开合。推理因而能交给电路。"),
    N("info", "信息", "认知", "number", "1948年", "cog", "prob", ["compute"],
      "消息可以按不确定程度计量，和具体用什么符号无关。"),

    N("calendar", "历法", "认知", "cosmos", "古代", "tech", "num", ["agri"],
      "把季节收成固定到可以预期的日子上，耕种才有共同的年。"),
    N("round", "地圆", "认知", "cosmos", "约前4世纪", "cog", "geom", [],
      "地面不是铺开的平面。影子和船影可以自己核。"),
    N("fossil", "化石", "认知", "cosmos", "17世纪", "", "round", [],
      "石头里的生物不像现存的种。地球的过去比文字记载长。"),
    N("helio", "日心说", "认知", "cosmos", "1543年", "cog", "round", ["calendar"],
      "天体的视运动改成地球在动。后来的力学才有一个太阳当中心。"),
    N("kepler", "行星运动", "认知", "cosmos", "1609至1619年", "cog", "helio", [],
      "行星的轨道是椭圆，扫过的面积均匀。天上的位置可以算，不再只是圆套圆。"),
    N("motion", "运动定律", "认知", "cosmos", "1638至1687年", "", "helio", ["calc"],
      "不受力就保持原有运动。力改变的是速度，不是位置本身。"),
    N("momentum", "动量守恒", "认知", "cosmos", "17世纪", "cog", "motion", [],
      "碰撞前后，质量和速度的乘积可以对上。孤立系统里这个总量不变。"),
    N("grav", "万有引力", "认知", "cosmos", "1687年", "cog", "kepler", ["motion", "calc"],
      "地上的落体和天上的轨道用同一条力说明。", [40, 40, 20]),
    N("deep", "深时", "认知", "cosmos", "1788年", "cog", "fossil", [],
      "岩层要的时间远长于文字史。演化和板块才有地方发生。"),
    N("spectrum", "光谱", "认知", "cosmos", "1859年", "cog", "glass", ["scope"],
      "光的谱线可以认出元素。天上的物质不必把样品拿回地上。"),
    N("drift", "大陆漂移", "认知", "cosmos", "1912年", "", "deep", [],
      "大陆曾经拼在一起。机制当时还没有，后来的板块接上了它。"),
    N("rel", "相对论", "认知", "cosmos", "1905至1915年", "cog", "grav", ["em", "noneucl"],
      "时间和空间随运动和引力改变。低速下才回到原来的力学。"),
    N("plate", "板块构造", "认知", "cosmos", "1960年代", "cog", "drift", ["deep", "interior", "magrev"],
      "地壳分成在动的板块。地震、火山和山脉是同一件事的边。", [40, 20, 20, 20]),
    N("galaxies", "河外星系", "认知", "cosmos", "1923至1924年", "cog", "scope", [],
      "银河不是全部宇宙。外面还有别的星系，各自是一大群星。"),
    N("cosmos", "宇宙膨胀", "认知", "cosmos", "1927至1965年", "cog", "galaxies", ["rel", "spectrum"],
      "星系在远离。宇宙有一段从热而密开始的历史。"),

    N("vac", "真空与气压", "认知", "matter", "1643年", "", "method", [],
      "空气有重量。抽空一段管子，蒸汽机才有可比较的压力。"),
    N("oxygen", "氧与燃烧", "认知", "matter", "1770年代", "cog", "method", ["fire"],
      "燃烧是与氧的化合，不是一种物质从火里逃掉。"),
    N("mass", "质量守恒", "认知", "matter", "1789年", "cog", "oxygen", [],
      "化学反应前后，称得到的质量不变。元素账因此可以配平。"),
    N("atmos", "大气", "认知", "cosmos", "1770年代", "", "oxygen", [],
      "包着地面的是一层有成分的气体，不是空无一物的天。"),
    N("green", "温室效应", "认知", "cosmos", "1824至1896年", "", "atmos", ["thermo"],
      "大气会留住一部分热。某种气体变多，地面的能量账就要改。"),
    N("thermo", "热力学", "认知", "matter", "19世纪上半叶", "", "vac", ["steam"],
      "热不是一种物质。机器把热变成功，有做不到的上限。"),
    N("element", "化学元素", "认知", "matter", "1789年", "cog", "oxygen", ["mass"],
      "物质由不能再用化学方法拆开的元素组成。"),
    N("molecule", "分子", "认知", "matter", "19世纪初", "", "element", [],
      "元素按固定的份数结成分子，反应可以按份写。"),
    N("organic", "碳化合物", "认知", "matter", "1828年", "", "molecule", [],
      "生物体内的分子也可以用无机物做出来。有机化学不必再分成另一种物质。"),
    N("acid", "酸碱", "认知", "matter", "1880至1923年", "cog", "molecule", [],
      "一大类反应可以收成质子或电子对的授受。溶液里的强弱因此能比较。"),
    N("catal", "催化", "认知", "matter", "1835年", "cog", "molecule", [],
      "有的物质改得了反应的快慢，自己不被消耗掉。工业合成靠的就是找这种物质。"),
    N("atom", "原子", "认知", "matter", "1808年", "cog", "element", [],
      "每种元素有自己的原子，化合物是原子按比例的结合。"),
    N("bond", "化学键", "认知", "matter", "1858至1916年", "", "atom", ["molecule"],
      "原子按可以数的价连在一起。分子式因此能画成结构，不只是一份配比。"),
    N("energy", "能量守恒", "认知", "matter", "1840年代", "cog", "thermo", [],
      "热、功、电和化学变化可以互相折算，总量不凭空出现。"),
    N("periodic", "周期律", "认知", "matter", "1869年", "cog", "atom", [],
      "元素排成表之后，空格可以预测还没发现的元素。"),
    N("induction", "电磁感应", "认知", "matter", "1831年", "", "battery", ["compass"],
      "变化的磁场在电路里生出电流。这不是电池里的化学反应。"),
    N("field", "场", "认知", "matter", "1831至1852年", "", "induction", ["energy"],
      "力不必靠物体碰上才传递。空间里可以有一种会推、会拉的状态。"),
    N("em", "电磁", "认知", "matter", "1865年", "cog", "field", ["wave"],
      "电、磁和光是同一组场。光是其中的一段波。"),
    N("entropy", "熵", "认知", "matter", "1865年", "cog", "thermo", [],
      "能量还在，可用的差别会变少。热不能全部变成功。"),
    N("kinetic", "分子运动论", "认知", "matter", "1850至1870年代", "cog", "thermo", ["atom"],
      "热是大量分子的运动。温度、压强和熵可以回到粒子的统计。"),
    N("electron", "电子", "认知", "matter", "1897年", "", "em", [],
      "原子不是实心的尽头，里面有可分离的带电粒子。"),
    N("decay", "放射性", "认知", "matter", "1896年", "cog", "atom", [],
      "有的核自己放出能量，一种元素可以变成另一种。"),
    N("nucleus", "原子核", "认知", "matter", "1911年", "", "decay", ["electron"],
      "原子的质量集中在极小的核里，电子在外面。"),
    N("fission", "核裂变", "认知", "matter", "1938年", "cog", "nucleus", [],
      "重核可以裂成较轻的核，并放出能量。反应堆和原子弹是同一件事的两种用法。"),
    N("quantum", "量子", "认知", "matter", "1900至1926年", "cog", "em", ["blackbody", "nucleus", "wave"],
      "能量和轨道是一份一份的。经典轨道是大量子数下的样子。", [35, 30, 20, 15]),
    N("huncert", "不确定关系", "认知", "matter", "1927年", "", "quantum", [],
      "位置和动量不能同时量到任意准。这不是仪器笨，是这套理论的界。"),
    N("standard", "标准模型", "认知", "matter", "1970年代", "", "qft", ["nucleus"],
      "已知的粒子和三种相互作用收成一张表。引力还不在里面。", [70, 30]),
    N("semi", "半导体", "认知", "matter", "1940年代", "", "quantum", ["electron"],
      "导电可以落在导体和绝缘体之间，并随杂质改变。晶体管用的就是这件事。"),

    N("agri", "农业", "发明", "food", "约1万年前", "tech", "fire", [],
      "把可吃的植物种在固定的地里，人才能在同一处连续活下去。也带来了传染病和对一块地的绑定。"),
    N("herd", "畜牧", "发明", "food", "约1万年前", "tech", "agri", [],
      "把动物留在身边繁殖，肉、奶和拉力不必每次去猎。"),
    N("ferment", "发酵", "发明", "food", "新石器时代", "", "agri", ["fire"],
      "用微生物把谷物和乳变成放得更久的食物。这远早于知道微生物存在。"),
    N("city", "城市", "发明", "food", "约前4千纪起", "", "agri", [],
      "余粮让一部分人不必自己种。手艺、祭祀和权力聚到一处。"),
    N("drama", "戏剧", "发明", "symbol", "古代", "", "city", ["lang"],
      "当着别人的面把一件事演出来。城市给了观众。"),
    N("labor", "分工", "认知", "symbol", "1776年", "", "city", ["money"],
      "一个人不必做完全部工序。现象很早，把它写成一门学问是这一年。"),
    N("plow", "犁", "发明", "food", "古代", "tech", "agri", [],
      "翻开土层，一块地能养活的人变多。"),
    N("irrig", "灌溉", "发明", "food", "古代", "tech", "plow", [],
      "把水引到雨不够的地里，收成不再完全看天。"),
    N("cold", "冷藏", "发明", "food", "19至20世纪", "tech", "thermo", [],
      "食物可以运到远方再吃，城市不必守着产区。"),
    N("haber", "合成氨", "发明", "food", "1913年", "tech", "molecule", ["energy", "agri", "catal"],
      "用空气里的氮做肥料。粮食不再只靠粪肥和硝石。"),
    N("rice", "杂交水稻", "发明", "food", "1973年", "tech", "gene", ["agri"],
      "用杂种优势把水稻产量抬上去。"),

    N("breed", "选择育种", "发明", "life", "农业以来", "", "herd", [],
      "人按想要的性状留种。后来的遗传才有可追踪的谱系。"),
    N("anatomy", "人体解剖", "认知", "life", "1543年", "cog", "univ", [],
      "把人体打开对照着画。器官的位置不再只靠古代文本。"),
    N("blood", "血液循环", "认知", "life", "1628年", "cog", "anatomy", [],
      "血由心脏泵出，沿血管回到心脏。"),
    N("homeo", "内稳态", "认知", "life", "19至20世纪", "cog", "blood", ["cell"],
      "体内的温度、水分和化学环境会被维持在窄范围内。医学后来谈的是这套调节。"),
    N("seen", "看见微生物", "认知", "life", "1670年代", "", "micro", [],
      "一滴水里有活的小东西。当时还不知道它们会致病。"),
    N("photo", "光合作用", "认知", "life", "1779年", "cog", "oxygen", [],
      "植物把光和空气做成自己的身体。动物吃的能量由此进来。"),
    N("vari", "种痘", "发明", "med", "16世纪前后", "", "lib", [],
      "用轻度的天花换免疫。中国有明确记载，印度、非洲等地也有类似做法。解释晚于做法。"),
    N("immune", "获得性免疫", "认知", "life", "1796年", "cog", "vari", ["method"],
      "得过一次的病可以不再得。这件事先被用来防病，对微生物的解释还在后面。"),
    N("cell", "细胞", "认知", "life", "1838至1855年", "cog", "seen", [],
      "动植物都由细胞组成，细胞来自已有的细胞。"),
    N("resp", "细胞呼吸", "认知", "life", "19至20世纪", "cog", "cell", ["oxygen", "energy"],
      "细胞把养分里的能量换成可以花费的形式。呼吸不再只是肺的事。"),
    N("protein", "蛋白质", "认知", "life", "19世纪", "", "cell", ["molecule"],
      "生命体里大量的工作由这类大分子来做。后来才知道序列来自核酸。"),
    N("enzyme", "酶", "认知", "life", "1897年", "cog", "protein", ["catal"],
      "细胞里的催化几乎都是蛋白质。反应可以在体温下按需要加快。"),
    N("evo", "演化", "认知", "life", "1859年", "cog", "deep", ["breed", "taxon"],
      "物种会变。可遗传的差异被环境留下。深时给了这件事发生的时间。"),
    N("ecology", "生态", "认知", "life", "1920至1930年代", "cog", "evo", ["photo"],
      "生物连成食物网，能量在网里传递。一个种的变化会牵动别的种。"),
    N("gene", "遗传因子", "认知", "life", "1866年", "cog", "cell", ["breed"],
      "性状按一份一份的因子传递，不是混在一起就被稀释掉。"),
    N("chromosome", "染色体", "认知", "life", "1902至1915年", "cog", "gene", [],
      "遗传因子排在染色体上，可以跟着细胞分裂被看见。"),
    N("germ", "微生物致病", "认知", "life", "19世纪后半", "both", "cell", ["seen"],
      "特定的微生物引起特定的病。腐烂也是生命在分解。"),
    N("brain", "大脑", "认知", "life", "19世纪", "cog", "blood", ["cell"],
      "思和记忆依赖这块器官。"),
    N("neuron", "神经元", "认知", "life", "1888至1952年", "", "brain", ["em"],
      "神经是一颗颗细胞，信号沿它传，在接头处交接。"),
    N("psych", "实验心理", "认知", "life", "1879年", "", "brain", ["method"],
      "心智可以在可控的条件下测量，不必只靠内省和哲学。"),
    N("cond", "条件作用", "认知", "life", "1890年代", "cog", "psych", [],
      "一个无关的信号可以跟反应连上。学习因此能被重复观察。"),
    N("virus", "病毒", "认知", "life", "1890年代", "", "germ", [],
      "有的病原能穿过细菌滤器，比细胞更小，要靠宿主才能复制。"),
    N("dna", "DNA", "认知", "life", "1953年", "cog", "chromosome", ["diffract"],
      "遗传信息写在双螺旋上。原子的排列是从晶体衍射算出来的。", [60, 40]),
    N("dogma", "中心法则", "认知", "life", "1958年", "", "dna", ["protein"],
      "序列从核酸流到蛋白质。后来发现有例外，主方向仍是这条。"),
    N("rdna", "重组DNA", "发明", "life", "1970年代", "", "dogma", [],
      "把一段基因放进另一种细胞，细胞可以按设计生产蛋白质。"),

    N("lever", "杠杆", "发明", "power", "古代", "", "stone", [],
      "把力和距离对调。轮轴和滑轮是同一件事。"),
    N("boat", "船", "发明", "power", "史前至古代", "", "stone", [],
      "人可以走水路。帆和舵后来加在上面。"),
    N("wheel", "轮与轴", "发明", "power", "约前3500年", "tech", "lever", [],
      "滚动代替拖曳。车上、陶轮上和后来的齿轮上都是它。"),
    N("sail", "帆", "发明", "power", "古代", "tech", "boat", [],
      "用风走水路，人和桨不必一直出力。"),
    N("gear", "齿轮", "发明", "power", "古代", "tech", "wheel", [],
      "把转动换成另一种转速或方向。钟和机器才能接起来。"),
    N("mill", "水车与风车", "发明", "power", "古代", "tech", "wheel", ["agri"],
      "第一次稳定地用人力以外的动力做功。磨粮是它常见的用途。"),
    N("rudder", "船尾舵", "发明", "power", "汉代至宋代", "tech", "sail", [],
      "船的方向可以固定地扳。远航不必只靠桨改向。"),
    N("clock", "机械钟", "发明", "power", "11至14世纪", "tech", "gear", ["calendar"],
      "把时间切成均匀的小段。实验、航海和作息才有公共的尺。"),
    N("steam", "蒸汽机", "发明", "power", "1712至1769年", "tech", "coal", ["vac", "iron"],
      "热变成可移动的功。工厂不必再守着河流。"),
    N("chron", "航海钟", "发明", "power", "1761年", "tech", "clock", ["loga"],
      "在海上保住时间，经度才量得出来。"),
    N("battery", "电池", "发明", "power", "1800年", "tech", "oxygen", [],
      "化学反应给出持续电流。电报和早期的电学实验用它，它发不出一座城市用的电。"),
    N("rail", "铁路", "发明", "power", "1825年", "tech", "steam", ["iron"],
      "蒸汽机的力气收成一条稳定的路。早期轨道是铁，廉价的钢把路铺得更远。"),
    N("dynamo", "发电机", "发明", "power", "1831至1870年代", "", "induction", ["steam"],
      "用转动维持磁场的变化，持续发出电流。电网用的是它。"),
    N("emotor", "电动机", "发明", "power", "1821至19世纪后半", "", "induction", ["battery"],
      "电流在磁场里受力而转。1821年已能演示，能带动机器是在发电机成熟以后。"),
    N("oil", "石油", "发明", "power", "19世纪后半", "", "coal", [],
      "比煤更适合装进会动的机器。"),
    N("ice", "内燃机", "发明", "power", "1876年", "tech", "steam", ["oil"],
      "燃烧放进气缸。车和飞机不必拉着一座锅炉，废气也跟着来。"),
    N("grid", "电网", "发明", "power", "1882年", "tech", "dynamo", ["em"],
      "发电机发出的电送到远处。用的人不必自己有一台。"),
    N("car", "汽车", "发明", "power", "1885年", "tech", "ice", ["wheel"],
      "内燃机装上轮子，路程不必先有铁轨。"),
    N("plane", "飞机", "发明", "power", "1903年", "tech", "ice", [],
      "动力足以抬起机翼。陆地和海洋不再是路程的必经。"),
    N("nuke", "核能", "发明", "power", "1954年", "tech", "fission", [],
      "用可控裂变供热发电。同一条核物理也做出了武器。"),

    N("vax", "疫苗", "发明", "med", "1796年", "tech", "immune", [],
      "用牛痘代替人痘来防天花，风险小得多。"),
    N("anes", "麻醉", "发明", "med", "1846年", "tech", "method", [],
      "手术时人可以不醒着痛。外科才敢打开体腔。"),
    N("water", "洁净水", "发明", "med", "19世纪", "tech", "method", [],
      "饮水和污水分开之后，霍乱下去了。起初靠的是疫情地图，微生物的解释还在后面。"),
    N("sterile", "消毒外科", "发明", "med", "1867年", "tech", "germ", [],
      "伤口接触的东西先去掉微生物，开刀才经常救得了人。"),
    N("xray", "医学影像", "发明", "med", "1895年", "tech", "em", [],
      "不切开就能看见骨头。后来的断层扫描仍用这种射线；磁共振走的是核磁。"),
    N("insulin", "胰岛素", "发明", "med", "1921年", "tech", "hormone", [],
      "糖尿病从很快致死变成可以长期控制的代谢病。"),
    N("abx", "抗生素", "发明", "med", "1940年代", "tech", "germ", [],
      "细菌引起的感染可以用药压住。用多了，细菌也会改。"),
    N("pill", "口服避孕药", "发明", "med", "1960年", "tech", "hormone", ["stats"],
      "排卵可以被按日按下。生育可以比较稳定地和性行为分开。", [70, 30]),
    N("ors", "口服补液", "发明", "med", "1970年代", "tech", "water", ["germ"],
      "清水加盐和糖，补回腹泻失去的液体。"),
    N("pcr", "核酸扩增", "发明", "med", "1983年", "tech", "dna", [],
      "把极少量的核酸复制到可以检测。检验和测序都用它。"),
    N("ngs", "基因测序", "发明", "med", "1977至2005年", "tech", "dogma", ["pcr"],
      "把遗传序列读成字母。诊断和后来的编辑才有底稿。"),
    N("crispr", "CRISPR", "发明", "med", "2012年", "tech", "rdna", [],
      "按序列定位去改基因组。"),

    N("compass", "指南针", "发明", "info", "11世纪", "tech", "iron", [],
      "方向不再只靠天色。船可以离岸更远。"),
    N("scope", "望远镜", "发明", "info", "1608年", "tech", "glass", [],
      "把远处的光收进来。伽利略用它看见了支持日心说的卫星。日心说本身早于这台仪器。"),
    N("micro", "显微镜", "发明", "info", "17世纪", "tech", "glass", [],
      "把近处的小东西放大。细胞和微生物才进得了眼睛。"),
    N("telegraph", "电报", "发明", "info", "1844年", "tech", "battery", [],
      "消息第一次比人和马快，按电脉冲传到另一座城。"),
    N("radio", "无线电", "发明", "info", "1890年代", "tech", "em", ["telegraph"],
      "不用电线，电磁浪也能把信号送出去。"),
    N("tube", "真空管", "发明", "info", "1904至1906年", "tech", "radio", ["vac"],
      "用电流控制电流。放大和开关第一次成为电子的事。"),
    N("compute", "可计算性", "认知", "info", "1936年", "cog", "bool", ["algo"],
      "哪些问题能用有限步骤算完，有了一条清楚的界。"),
    N("computer", "计算机", "发明", "info", "1940年代", "tech", "compute", ["tube"],
      "按存储的指令改自己的下一步。一台机器可以做不同的计算。"),
    N("laser", "激光", "发明", "info", "1960年", "tech", "quantum", ["glass"],
      "单一波长的强光。后来的光纤、读盘和许多测量用它。"),
    N("trans", "晶体管", "发明", "info", "1947年", "tech", "semi", ["tube"],
      "固体开关取代真空管。小、省电，后来才能集成。"),
    N("ic", "集成电路", "发明", "info", "1958年", "tech", "trans", [],
      "许多晶体管做在同一片材料上。计算机才进得了手掌。"),
    N("net", "互联网", "发明", "info", "1969至1991年", "tech", "computer", [],
      "许多台机器用同一套办法互相传数据包。"),
    N("ml", "机器学习", "认知", "info", "20世纪后半至2012年", "", "computer", ["stats", "info"],
      "不把规则一条条写死，让模型从例子里改自己的参数。2012年后，多层网络在看图和语言上越过了手写规则。"),
    N("web", "万维网", "发明", "info", "1991年", "", "net", [],
      "用链接把文档接起来，不必先知道文件放在哪台机器上。"),
    N("ai", "人工智能", "发明", "info", "2012至2022年", "tech", "ml", ["web"],
      "用大量例子调整内部参数。机器开始做以前要人看一眼才行的判断。"),

    N("frac", "分数", "认知", "number", "古代", "cog", "num", [],
      "一个整体可以拆成若干等份，份数本身也是数。"),
    N("irrat", "无理数", "认知", "number", "约前5世纪", "cog", "geom", [],
      "有的长度不能写成两个整数之比。几何里就有这种数。"),
    N("trig", "三角学", "认知", "number", "2至15世纪", "cog", "geom", [],
      "角和边可以互相算出。测天和测地用的是这套表。"),
    N("neg", "负数", "认知", "number", "约1世纪", "cog", "zero", [],
      "比没有更少，也可以参加运算。方向和亏欠因此能写进式子。"),
    N("cplx", "复数", "认知", "number", "16至18世纪", "cog", "algebra", [],
      "负数开方被留下来当一种数。振荡和平面转动后来用它表示。"),
    N("topo", "拓扑", "认知", "number", "18至19世纪", "cog", "geom", [],
      "连续变形不撕开时，还剩哪些性质。形状可以不靠长度来分。"),
    N("graphth", "图论", "认知", "number", "1736年", "cog", "geom", [],
      "只留点和连线，路程和网络可以先不管距离。"),
    N("lin", "线性代数", "认知", "number", "19世纪", "cog", "algebra", [],
      "许多量同时按比例变化，可以收成一张表来算。"),
    N("model", "数学模型", "认知", "number", "17世纪", "cog", "method", ["calc"],
      "把事情收成变量和关系，解释同时给出可核对的数。"),
    N("regr", "回归与相关", "认知", "number", "1880年代", "cog", "stats", [],
      "两个量一起变，可以估计一个怎样跟着另一个走。一起变不等于一个造成另一个。"),
    N("merr", "测量误差", "认知", "number", "19世纪", "cog", "stats", [],
      "一次读数不是答案本身。结果要连同它可能偏多少一起交代。"),
    N("dimen", "量纲分析", "认知", "number", "19世纪", "cog", "motion", [],
      "等式两边必须是同一种量。只看单位，就能排除许多不可能的式子。"),
    N("buoy", "浮力", "认知", "matter", "约前3世纪", "cog", "lever", [],
      "浸在流体里的物体受到向上的力，等于它排开的那部分流体的重量。"),
    N("gaslaw", "气体定律", "认知", "matter", "17至19世纪", "cog", "vac", [],
      "气体的压强、体积和温度可以互相折算。容器里的气不再只是一肚子空。"),
    N("echem", "电化学", "认知", "matter", "1800年代", "cog", "battery", ["element"],
      "化学反应可以生出电流，电流也可以逼出化学反应。"),
    N("iso", "同位素", "认知", "matter", "1913年", "cog", "atom", ["nucleus"],
      "同一种元素可以有不同的核质量。化学性质相近，核的行为可以不同。"),
    N("anti", "反物质", "认知", "matter", "1928至1932年", "cog", "quantum", ["rel"],
      "每种粒子有一个电荷相反的对应。相遇时可以一起变成辐射。"),
    N("super", "超导", "认知", "matter", "1911年", "cog", "quantum", ["electron"],
      "有的材料冷到一定程度，电阻消失。电流可以一直转下去。"),
    N("fert", "受精", "认知", "life", "1875年", "cog", "cell", [],
      "新的个体从精子和卵的结合开始。遗传因此来自双方。"),
    N("extinct", "物种灭绝", "认知", "life", "1796年", "cog", "fossil", [],
      "有的物种整个消失了。化石里的兽不是还活在别处。"),
    N("biogeo", "生物地理", "认知", "life", "19世纪", "cog", "evo", [],
      "物种的分布跟着大陆、隔离和共同祖先走，不是各地随便长出来的。"),
    N("atp", "ATP", "认知", "life", "1929至1941年", "cog", "resp", [],
      "细胞把可花费的能量收在一种小分子上，再拿去推动别的反应。"),
    N("mut", "突变", "认知", "life", "1901至1927年", "cog", "gene", [],
      "遗传因子会突然改掉，改动可以传下去。演化因此有了新的差异。"),
    N("genereg", "基因调控", "认知", "life", "1961年", "cog", "dogma", [],
      "基因不是一直都在造蛋白质。细胞能按环境把某一些打开或关上。"),
    N("endo", "内共生", "认知", "life", "1967年", "cog", "cell", ["evo"],
      "线粒体和叶绿体来自曾经独立生活的细菌。复杂细胞是并进来的。"),
    N("tilt", "地轴倾斜", "认知", "cosmos", "古代至17世纪", "cog", "round", [],
      "季节来自地轴歪着转，不是太阳离地面忽近忽远。"),
    N("eclipse", "日月食", "认知", "cosmos", "约前5世纪", "cog", "geom", ["round"],
      "日食和月食是三个天体连成一条直线时的影子。可以预先算。"),
    N("spin", "地球自转", "认知", "cosmos", "1851年", "cog", "helio", [],
      "地面在转。摆的摆动面会慢慢偏开，不必靠看星星。"),
    N("tide", "潮汐", "认知", "cosmos", "1687年", "cog", "grav", [],
      "海水的涨落来自月和日的引力，不是海水自己呼吸。"),
    N("comet", "彗星轨道", "认知", "cosmos", "1577至1705年", "cog", "kepler", [],
      "彗星沿闭合或可算的轨道走，会再回来。它不是大气里的一阵火。"),
    N("parallax", "恒星视差", "认知", "cosmos", "1838年", "cog", "scope", ["helio"],
      "地球绕日运动时，近处的星会相对远处的星挪一点。星的距离因此量得出来。"),
    N("starlife", "恒星演化", "认知", "cosmos", "20世纪", "cog", "spectrum", ["thermo"],
      "星会老。燃料、光度和结局可以按质量和成分排成一条寿命。"),
    N("hole", "黑洞", "认知", "cosmos", "1916至1970年代", "cog", "rel", [],
      "质量挤到足够紧，光也走不出来。它是引力理论里的一个界，后来被观测到。"),
    N("dark", "暗物质", "认知", "cosmos", "1933至1970年代", "cog", "galaxies", ["grav"],
      "星系转得太快，可见的物质拉不住。还缺一种几乎不发光的质量。"),
    N("strata", "考古地层", "认知", "cosmos", "19世纪", "cog", "deep", [],
      "先埋的在下，后埋的在上。遗物的先后可以不靠铭文来排。"),
    N("impact", "撞击", "认知", "cosmos", "1960至1980年代", "cog", "deep", ["plate"],
      "天体撞上地面会留下坑，也能一下子改掉当时的生物。"),
    N("iceage", "冰期", "认知", "cosmos", "1837年", "cog", "deep", ["green"],
      "大片陆地曾经被冰盖住，而且不止一次。气候不是从来如此。"),
    N("map", "地图", "认知", "cosmos", "古代", "tech", "writing", ["geom"],
      "把地面的位置收成一张可以对照的图。路程不必只靠记在嘴里。"),
    N("kinlang", "语言亲缘", "认知", "symbol", "1786年", "cog", "grammar", [],
      "有的语言留下成套的音变对应，来自更早的共同祖语。像不够，规律的对应才算。"),
    N("epi", "流行病学", "认知", "life", "1854年", "cog", "stats", ["germ"],
      "病在人群里怎么传，可以用分布和对照来推断，不必先看见每一个病原。"),
    N("reflex", "反射", "认知", "life", "17至19世纪", "cog", "brain", [],
      "有的动作不经过商量就发生。刺激和反应可以在神经上定位。"),
    N("circa", "昼夜节律", "认知", "life", "18至20世纪", "cog", "brain", [],
      "身体自己有大约一天的钟。把它和外界的光隔开，钟还在走。"),
    N("operant", "操作条件", "认知", "life", "1898至1930年代", "cog", "cond", [],
      "一个动作如果带来后果，以后出现的次数会变。学习不只有铃声和食物。"),
    N("uncon", "无意识加工", "认知", "life", "19至20世纪", "cog", "psych", [],
      "有的判断在人说得清之前已经做完。心智不全是眼前这份报告。"),
    N("memcons", "记忆巩固", "认知", "life", "1880年代至1950年代", "cog", "brain", [],
      "新的记忆要过一段时间才稳。中间被打断，后来会丢。"),
    N("memrecon", "记忆重构", "认知", "life", "1932年", "cog", "psych", [],
      "回想不是把原件取出来。人会按现在的理解和暗示把记忆改一遍。"),
    N("workmem", "工作记忆", "认知", "life", "1956至1974年", "cog", "brain", [],
      "眼前能同时摆住的项目很少。推理和计算用的是这块很小的台面。"),
    N("cogdev", "儿童认知", "认知", "life", "20世纪", "cog", "psych", [],
      "孩子理解世界的方式会按阶段改，不是缩小的成人。"),
    N("attach", "依恋", "认知", "life", "1950至1960年代", "cog", "cogdev", [],
      "婴儿会跟特定的照料者结成稳定的靠近。分开和重逢时的表现可以观察。"),
    N("acquire", "语言习得", "认知", "life", "20世纪", "cog", "lang", ["brain"],
      "孩子在很少逐句纠正的情况下学会语法。输入不够解释全部规则。"),
    N("tom", "他心", "认知", "life", "1978至1983年", "cog", "psych", ["lang"],
      "人会推断别人相信的和自己看见的不一样。这可以设计成别人答错的题目。"),
    N("bias", "认知偏差", "认知", "life", "1970年代", "cog", "psych", [],
      "人在不确定时用的捷径，会稳定地偏到某些答案上。"),
    N("prospect", "前景理论", "认知", "life", "1979年", "cog", "prob", ["bias"],
      "人对得失的估价不对称。同样的数，亏的痛会压过赚的喜。"),
    N("plast", "脑可塑性", "认知", "life", "20世纪", "cog", "neuron", [],
      "神经连接会因使用而改。成年以后脑子也不是焊死的。"),

    N("abacus", "算盘", "发明", "number", "古代", "tech", "num", [],
      "用珠子把加减固定在一排位置上。大数可以不当场心算。"),
    N("screw", "螺纹", "发明", "power", "古代至16世纪", "tech", "gear", [],
      "转动可以变成缓慢而很大的推力。紧固和加压都用它。"),
    N("collar", "马颈圈", "发明", "food", "汉代，中世纪传入欧洲", "tech", "herd", [],
      "拉力改到肩和胸，马才拉得动重犁和重车。"),
    N("stirrup", "马镫", "发明", "power", "约4世纪", "tech", "herd", [],
      "骑者的脚有了支点，人和马才能一起发力。"),
    N("porcelain", "瓷器", "发明", "stuff", "东汉至唐", "tech", "pot", ["smelt"],
      "高岭土烧到足够高，坯体致密、透光。它不是普通的陶。"),
    N("lock", "船闸", "发明", "power", "古代至中世纪", "tech", "boat", ["arch"],
      "船可以分段升降，越过水位差。运河不必整段挖成斜坡。"),
    N("glasses", "眼镜", "发明", "stuff", "13世纪", "tech", "glass", [],
      "把透镜放到眼前。老花和近视的人可以继续读和做细活。"),
    N("thermom", "温度计", "发明", "power", "17至18世纪", "tech", "method", [],
      "冷热有了可以读的刻度。后来的热学才有可核对的数。"),
    N("can", "罐头", "发明", "food", "1809年", "tech", "agri", ["iron"],
      "食物密封加热之后可以存放。军队和远航不必只靠咸和干。"),
    N("match", "火柴", "发明", "stuff", "1826年", "tech", "fire", ["oxygen"],
      "摩擦就能把火点着。取火不必再带着火种。"),
    N("parts", "可互换零件", "发明", "power", "18至19世纪", "tech", "steam", [],
      "同一规格的零件可以互换。坏一件不必重做整台机器。"),
    N("steamboat", "汽船", "发明", "power", "1807年", "tech", "steam", ["boat"],
      "蒸汽机装上船。水路不必等风。"),
    N("pasteur", "巴氏消毒", "发明", "food", "1860年代", "tech", "germ", [],
      "加热到杀死大部分微生物，酒和奶可以不再那么快坏。"),
    N("millcloth", "动力纺织", "发明", "food", "18世纪", "tech", "steam", ["textile"],
      "纺和织改由机器带动。布的产量不再受着手和脚的限制。"),
    N("sewing", "缝纫机", "发明", "stuff", "1846年", "tech", "textile", ["gear"],
      "针脚由机器重复。一件衣服不必全部用手缝。"),
    N("toilet", "抽水马桶", "发明", "med", "18世纪", "tech", "water", [],
      "粪便被水冲走，和生活的房间分开。城市的卫生靠这一步。"),
    N("camera", "摄影", "发明", "info", "1839年", "tech", "glass", ["method"],
      "光在感光材料上留下可固定的像。看见的东西不必再手画。"),
    N("elev", "电梯", "发明", "power", "1852年", "tech", "steel", ["steam"],
      "轿厢有了安全制动。人可以日常地在高楼里上下。"),
    N("bike", "自行车", "发明", "power", "1885年", "tech", "wheel", ["gear"],
      "人用自己的力气稳定地走远路。它比马便宜，也不吃粮。"),
    N("tire", "充气轮胎", "发明", "power", "1888年", "tech", "bike", ["wheel"],
      "车轮用气垫着。自行车和后来的汽车才跑得起来。"),
    N("lamp", "电灯", "发明", "power", "1879年", "tech", "dynamo", [],
      "电流把灯丝烧亮。照明不必再靠火焰。"),
    N("telephone", "电话", "发明", "info", "1876年", "tech", "telegraph", [],
      "声音变成电流，再在另一头变回声音。说话不必写成电码。"),
    N("phono", "留声机", "发明", "info", "1877年", "tech", "gear", [],
      "声音刻进一条纹里，可以再放出来。演唱不必当场在场。"),
    N("alum", "铝", "发明", "stuff", "1886年", "tech", "echem", ["smelt"],
      "用电把铝从矿里还原出来。轻金属才便宜到能做器具。"),
    N("cinema", "电影", "发明", "info", "1895年", "tech", "camera", [],
      "一连串照片按时间放，看起来在动。场面可以离开剧场。"),
    N("ac", "空调", "发明", "power", "1902年", "tech", "thermo", [],
      "把室内的热抽走。工作和居住不必完全跟着外面的天气。"),
    N("wash", "洗衣机", "发明", "power", "1908年", "tech", "emotor", [],
      "衣服的搓洗交给机器。这项家务不再占掉大半天。"),
    N("tv", "电视", "发明", "info", "1920年代", "tech", "radio", ["camera"],
      "活动影像随无线电送进家里。场面不必先洗成胶片再运。"),
    N("radar", "雷达", "发明", "info", "1935年", "tech", "radio", [],
      "发出电波再听回声。看不见的时候也能知道远处有东西。"),
    N("rocket", "火箭", "发明", "power", "20世纪", "tech", "powder", ["plane"],
      "自己带氧化剂的推进。飞行可以离开空气。"),
    N("sat", "人造卫星", "发明", "info", "1957年", "tech", "rocket", ["radio"],
      "仪器留在绕地的轨道上。通信、观测和后来的定位从这里开始。"),
    N("solar", "光伏", "发明", "power", "1954年", "tech", "semi", ["em"],
      "光直接变成电流。电可以不经过热机。"),
    N("container", "集装箱", "发明", "power", "1956年", "tech", "steel", ["boat"],
      "货物装进标准箱子，船、火车和卡车不用再拆装。"),
    N("led", "发光二极管", "发明", "power", "1962至1990年代", "tech", "semi", [],
      "半导体自己发光。灯可以更小、更省，也不靠灯丝。"),
    N("lcd", "液晶显示", "发明", "info", "1968年", "tech", "semi", [],
      "电压改变液晶怎样透光。屏幕可以做平、做薄。"),
    N("fiber", "光纤", "发明", "info", "1970年", "tech", "laser", ["glass"],
      "光在玻璃丝里传很远还不散。通信的容量不再受铜线限制。"),
    N("barcode", "条形码", "发明", "info", "1974年", "tech", "computer", ["laser"],
      "一排粗细线可以让机器读出一个编号。货不必再逐件手抄。"),
    N("mab", "单克隆抗体", "发明", "med", "1975年", "tech", "clonal", ["cell"],
      "同一种抗体可以在培养里大量做出来。检验和后来的药物用它认准一个目标。", [70, 30]),
    N("ivf", "试管婴儿", "发明", "med", "1978年", "tech", "fert", [],
      "卵和精子在体外结合，再放回子宫。受孕不必只发生在体内。"),
    N("gnss", "卫星导航", "发明", "info", "1978至2000年", "tech", "sat", ["radio"],
      "同时听几颗卫星的信号，地面上的位置可以算出来。"),
    N("mobile", "移动通信", "发明", "info", "1979年起", "tech", "radio", ["trans"],
      "电话不固定在一条线上。人走动时信号在基站之间交接。"),
    N("artem", "青蒿素", "发明", "med", "1972年", "tech", "molecule", ["germ"],
      "从青蒿里得到能杀疟原虫的分子。疟疾有了新的药。"),
    N("smartphone", "智能手机", "发明", "info", "2007年", "tech", "mobile", ["ic"],
      "电话、计算和网络收进同一块屏。许多事不必再换一台机器。"),
    N("liion", "锂离子电池", "发明", "power", "1991年", "tech", "battery", [],
      "同样的重量里能存下更多电，并且可以反复充。手提的电子器件靠它。"),
    N("mrna", "mRNA疫苗", "发明", "med", "2020年", "tech", "vax", ["dogma"],
      "把一段指令送进细胞，让细胞自己做出抗原。疫苗不必先培养整个病原。"),
    N("pharma", "化学制药", "发明", "med", "1899年", "tech", "organic", ["molecule"],
      "按化学步骤做出成分明确的药，而不是只靠整株草药。"),
    N("transfuse", "输血", "发明", "med", "1901年", "tech", "blood", [],
      "把血型相符的血补进失血的人身体里。"),
    N("cloud", "云计算", "发明", "info", "2006年", "", "net", ["computer"],
      "按小时租一台计算机。软件不必再自备一座机房。"),
    N("wifi", "Wi-Fi", "发明", "info", "1997年", "", "radio", ["net"],
      "家里和咖啡馆的设备可以不插线，就连上同一张网。"),
    N("broadband", "家庭宽带", "发明", "info", "2000年代", "", "net", [],
      "家里的网从拨号变成一直在线。互联网是网上的世界，这一段是接进住宅的线。"),
    N("mbb", "移动宽带", "发明", "info", "2001至2009年", "", "mobile", ["radio"],
      "手机离开房间也能上网。3G 把数据带进蜂窝网，4G 把它变成日常宽带。"),
    N("stream", "音视频流媒体", "发明", "info", "2003至2007年", "", "net", ["tv"],
      "影像和声音顺着网络随时送出去。看片子和听歌从光盘变成打开就播。"),
    N("vcall", "视频通话", "发明", "info", "2003至2020年", "", "net", ["camera"],
      "两边同时看见、同时说话。流媒体送的是做好的片子，这一项是当场对讲。"),
    N("flash", "固态存储", "发明", "info", "2005至2012年", "", "semi", ["computer"],
      "用闪存代替转盘。手机和后来的电脑不再靠机械硬盘。"),
    N("cmos", "图像传感器", "发明", "info", "2000至2009年", "", "camera", ["semi"],
      "CMOS 把相机做进手机。拍照从带一台机器，变成随身就有。"),
    N("pay", "电子支付", "发明", "soc", "1998至2014年", "", "money", ["net", "pubkey"],
      "钱以账户里的数字过手。网上付款和手机钱包把现金从很多笔交易里拿掉。", [40, 35, 25]),
    N("bitcoin", "比特币", "发明", "info", "2008年", "", "net", ["pubkey", "money"],
      "不靠一家机构记账，也能在网上做出一份改不掉的稀缺记录。", [40, 40, 20]),
    N("fold", "AlphaFold", "发明", "bio", "2020年", "", "ml", ["protein", "diffract"],
      "给一段氨基酸序列，把蛋白质会折成的形状预测到接近实验。", [45, 35, 20]),
    N("ips", "诱导多能干细胞", "发明", "bio", "2006年", "", "cell", ["gene"],
      "用几个确定的因子，把已经分化的体细胞拉回还能再分化的状态。"),
    N("haart", "联合抗艾滋病治疗", "发明", "med", "1996年", "", "pharma", ["virus"],
      "几种抗艾滋病药合在一起用，HIV 从快速致死变成可以长期压制的感染。"),
    N("checkpoint", "免疫检查点抑制剂", "发明", "med", "2011年", "", "immune", ["mab"],
      "松开被肿瘤踩住的免疫刹车，让身体自己的免疫去认癌细胞。"),
    N("glp1", "GLP-1减重药物", "发明", "med", "2021年", "", "pharma", ["hormone"],
      "药物第一次比较稳定地打出大幅度、可重复的体重下降。", [55, 45]),
    N("ev", "电动汽车", "发明", "eng", "2012年", "", "car", ["liion"],
      "能跑远、能量产的电动车，加上外面的充电网络。电芯记在锂离子电池上。"),
    N("wind", "风力发电", "发明", "eng", "2000至2015年", "", "mill", ["grid"],
      "把风轮做大，接进电网。风机更早，这几十年它成了电力供应里稳定的一块。"),
    N("drone", "民用无人机", "发明", "eng", "2013年", "", "plane", ["gnss"],
      "便宜的多旋翼，加上卫星定位和稳像。航拍和植保不必再靠跑道。"),
    N("reuse", "可回收火箭", "发明", "eng", "2015年", "", "rocket", [],
      "轨道级助推器飞完可以落回来，再飞一次。进入太空的成本曲线改了方向。"),

    N("synth", "现代综合", "认知", "life", "1930至1942年", "", "evo", ["gene", "mut"],
      "可遗传的小差异被选择留下，物种因此分开。演化不再缺一套传得下去的差异。", [40, 40, 20]),
    N("diffract", "晶体衍射", "认知", "matter", "1912年", "", "bond", ["em"],
      "晶体把 X 射线散成规则的点。原子在分子里的位置可以由此算出来。", [55, 45]),
    N("dating", "放射性定年", "认知", "cosmos", "1907至1956年", "", "decay", ["deep"],
      "衰变有可以测定的速率。岩石的年龄因此是一个数，深时不再只是「比文字史长」。", [60, 40]),
    N("qft", "量子场论", "认知", "matter", "1927至1949年", "", "quantum", ["rel", "field"],
      "粒子是场的激发，可以产生，也可以湮灭。相对论和量子写进同一套能算出数的规则。", [45, 35, 20]),
    N("noether", "诺特定理", "认知", "matter", "1918年", "", "group", ["energy", "momentum"],
      "一种连续的对称对应一条守恒。能量守恒和动量守恒是这条定理的两例。", [50, 25, 25]),
    N("incompleteness", "不完备定理", "认知", "number", "1931年", "", "proof", ["set"],
      "一套强到能做算术的公理，若自身不矛盾，就有它证不出的真命题。", [60, 40]),
    N("domains", "三域", "认知", "life", "1977年", "", "taxon", ["dna"],
      "用核酸序列重画生命树，原核分成细菌和古菌。动物和植物只在第三支里。", [40, 60]),
    N("nucleosynth", "恒星核合成", "认知", "cosmos", "1957年", "", "starlife", ["nucleus"],
      "恒星内部把轻核焊成重核。周期表里较重的元素大多是星造出来的。", [45, 55]),
    N("darke", "暗能量", "认知", "cosmos", "1998年", "", "cosmos", ["grav"],
      "远处的超新星比预期更暗。膨胀在加快，还要有一种把空间推开的成分。暗物质解释不了这一项。", [60, 40]),
    N("carbon", "碳循环", "认知", "cosmos", "20世纪", "", "photo", ["atmos", "green"],
      "碳在空气、水、岩石和生物之间往来。燃烧化石燃料，是把地下的库存送回空气。", [40, 30, 30]),
    N("interior", "圈层结构", "认知", "cosmos", "1906至1936年", "", "wave", ["deep"],
      "地震波在一定深度折返或消失。地壳、地幔和地核是这样分出来的。", [55, 45]),
    N("hormone", "激素", "认知", "life", "1902年", "", "homeo", ["molecule"],
      "腺体放出的分子随血液到别处，改变那里的工作。调节不必靠神经一根根连过去。", [55, 45]),
    N("vitamin", "维生素", "认知", "life", "1912年", "", "method", ["molecule"],
      "有的病是食物里缺一种少量的分子。把这种分子补回去，病就不再发生。", [50, 50]),
    N("clonal", "克隆选择", "认知", "life", "1957年", "", "immune", ["cell"],
      "一个淋巴细胞只认一种抗原，对得上的那个克隆才大量增殖。抗体不是现配的。", [55, 45]),
    N("pubkey", "公钥密码", "认知", "info", "1976年", "", "info", ["algo"],
      "加密的钥匙可以公开，解密的钥匙自己留着。公开的信道上也能把话交给指定的人。", [55, 45]),
    N("complexity", "计算复杂性", "认知", "info", "1965至1971年", "", "compute", ["algo"],
      "能在有限步里算完，还不等于能在可接受的步数里算完。问题因此要按代价再分一次。", [60, 40]),
    N("gametheory", "博弈论", "认知", "number", "1944年", "", "prob", ["algebra"],
      "几个人的得失绑在一起时，各自的选择可以写成一局。对局有可以算出的结局。", [55, 45]),
    N("bayes", "贝叶斯推断", "认知", "number", "1763年", "", "prob", [],
      "一条新证据怎样改原来的把握，可以按它出现的机会写成比例。"),
    N("coding", "纠错码", "认知", "info", "1950年", "", "info", [],
      "消息里故意加上多余的部分，出错也能改回来。可靠的传递不必先有一条无噪声的信道。"),
    N("relmodel", "关系模型", "认知", "info", "1970年", "", "computer", ["set"],
      "数据收成若干张表，表与表用值相连。要问什么，就声明要哪几列，不必指定怎么找。", [60, 40]),
    N("exoplanet", "系外行星", "认知", "cosmos", "1995年", "", "spectrum", ["scope"],
      "别的恒星也有行星。第一例是从恒星光谱的周期性晃动里看出来的。", [60, 40]),
    N("ozone", "臭氧层", "认知", "cosmos", "1974至1985年", "", "atmos", ["catal"],
      "某些人造分子在高空催化拆开臭氧。到达地面的紫外线因此变多。", [55, 45]),
    N("equil", "化学平衡", "认知", "matter", "1864至1870年代", "", "thermo", ["mass"],
      "正反应和逆反应一样快时，各成分的比例不再变。反应往哪边走，可以由这个比例判断。", [55, 45]),
    N("polymer", "高分子", "认知", "matter", "1920年", "", "molecule", ["plastic"],
      "有的分子是同一种小单元连成的长链。塑料不是一种新元素，是这种长链。", [70, 30]),
    N("perspect", "透视", "认知", "symbol", "15世纪", "", "geom", ["image"],
      "场景里的平行线收到同一个灭点。平面上因此能按可核对的规则画出深度。", [55, 45]),
    N("notation", "记谱", "发明", "symbol", "11世纪", "", "music", ["writing"],
      "音高和时值写成稳定的符号。曲子可以离开唱歌的人，别人照着谱重做。", [50, 50]),
    N("phoneme", "音位", "认知", "symbol", "19世纪末至20世纪初", "", "grammar", [],
      "一种语言里，能区分词义的最小语音对立可以列出来。音的物理差别不等于音位。"),
    N("ricardo", "比较优势", "认知", "symbol", "1817年", "", "market", ["labor"],
      "各方都做自己相对更擅的那种生产，再互相交换，总产出可以更高。绝对都会做，不是关键。", [70, 30]),
    N("accounts", "国民账户", "认知", "symbol", "1930至1953年", "", "stats", ["books"],
      "一个国家的生产、收入和支出收成互相对得上的账。经济的规模因此可以逐年比较。", [60, 40]),
    N("insure", "保险", "发明", "symbol", "17世纪", "", "prob", ["money"],
      "许多人各自拿出一小笔，去补其中某人的大损失。这笔账要靠概率才算得平。", [55, 45]),
    N("milank", "轨道强迫", "认知", "cosmos", "1920至1976年", "", "iceage", ["tilt"],
      "地轴倾斜、轨道形状和进动慢慢改变各地得到的阳光。冰期的进退和这组周期对得上。", [50, 50]),
    N("chaos", "确定性混沌", "认知", "number", "1963年", "", "model", ["calc"],
      "规则完全确定的系统，初值差一点点，后来可以差很远。预测有一条算不准的界，不是量子那一条。", [60, 40]),

    N("peer", "同行评议", "发明", "symbol", "20世纪", "", "journal", [],
      "稿子先交给同行看过，再登出来。编辑部不再只凭自己判断。"),
    N("fluid", "流体力学", "认知", "matter", "1822至1845年", "", "motion", ["gaslaw"],
      "黏性和压力怎样改变流速，可以写成方程。管子里的水和空气里的风用的是同一套。", [55, 45]),
    N("angmom", "角动量守恒", "认知", "matter", "18世纪", "", "motion", [],
      "转动物体在没有外力矩时，转得有多猛保持不变。这和动量守恒是同一类账。"),
    N("blackbody", "黑体辐射", "认知", "matter", "1900年", "", "thermo", ["em"],
      "一个只按温度发光的物体，能量随频率的分布不能用经典的连续图景配平。量子从这里进来。", [55, 45]),
    N("phase", "相变", "认知", "matter", "19世纪", "", "thermo", ["molecule"],
      "同一物质可以在固、液、气之间更换状态。到了临界点，两相的差别可以消失。", [60, 40]),
    N("neutrino", "中微子", "认知", "matter", "1930至1956年", "", "decay", ["nucleus"],
      "衰变里缺掉的能量，由一种几乎不作用的粒子带走。后来在反应堆旁把它抓住了。", [55, 45]),
    N("doppler", "多普勒效应", "认知", "matter", "1842年", "", "wave", [],
      "波源靠近或离开时，收到的频率会变。速度可以不靠尺子，从频率读出来。"),
    N("gw", "引力波", "认知", "cosmos", "1916至2015年", "", "rel", [],
      "时空的涟漪可以测到。这是相对论里的一个预言，两台相距很远的干涉仪对上了同一次。"),
    N("pulsar", "脉冲星", "认知", "cosmos", "1967年", "", "starlife", ["radio"],
      "有的天体按极稳的节拍发出无线电脉冲。它是转得很快的中子星。", [60, 40]),
    N("lensing", "引力透镜", "认知", "cosmos", "1919至1979年", "", "rel", ["galaxies"],
      "质量把光路弯折。远处的星系可以被前面的质量拉成弧，亮度也会被放大。", [70, 30]),
    N("chiral", "手性", "认知", "matter", "1848年", "", "organic", [],
      "有的分子互为镜像，化学式相同。和生物体的作用可以完全不一样。"),
    N("chrom", "色谱", "发明", "matter", "1903至1952年", "", "molecule", ["method"],
      "混合物在两相之间反复分配，成分可以分开。后来的化学分析大多从这一步开始。", [60, 40]),
    N("masspec", "质谱", "发明", "matter", "1919年", "", "iso", ["spectrum"],
      "带电粒子在磁场里按质量分开。同位素和分子的质量由此读成一条谱。", [55, 45]),
    N("rebar", "钢筋混凝土", "发明", "stuff", "1867年", "", "concrete", ["steel"],
      "钢筋埋在混凝土里。压力主要由混凝土承担，拉力由钢筋承担。", [50, 50]),
    N("hydroelec", "水力发电", "发明", "power", "1882年", "", "mill", ["dynamo"],
      "水流的转动带动发电机。电不必都从燃烧里来。", [40, 60]),
    N("xfmr", "变压器", "发明", "power", "1885年", "", "em", ["dynamo"],
      "同一功率下升高电压、减小电流。电可以送到远处，再降回可用的电压。", [50, 50]),
    N("mineral", "矿物", "认知", "cosmos", "18至19世纪", "", "element", ["deep"],
      "岩石由成分固定的矿物组成。能炼出金属的矿石，是其中的一类。", [50, 50]),
    N("erosion", "侵蚀", "认知", "cosmos", "18至19世纪", "", "hydro", ["deep"],
      "流水、冰和风削低高处、填起低处。眼前的地形是这些过程走到现在的样子。", [60, 40]),
    N("oceanc", "洋流", "认知", "cosmos", "19世纪", "", "hydro", ["atmos"],
      "海水沿稳定的路线流动。热量因此在不同纬度之间搬迁。", [55, 45]),
    N("magrev", "地磁倒转", "认知", "cosmos", "1963年", "", "interior", [],
      "地磁方向会整个反过来，并留在冷却的岩石里。海底两侧的条带因此能对上时间。"),
    N("ionchan", "离子通道", "认知", "life", "1952年", "", "neuron", ["cell"],
      "神经上的电信号来自离子进出细胞膜。这不是导线里那种电流。", [60, 40]),
    N("hox", "发育基因", "认知", "life", "1978至1984年", "", "genereg", ["evo"],
      "身体各段怎样长出来，由沿轴线排列的一组基因控制。不同动物的体制因此可以比较。", [60, 40]),
    N("hgt", "水平基因转移", "认知", "life", "1928至1959年", "", "gene", ["evo"],
      "基因可以不经生殖，从一种生物进入另一种。生命树因此不只是不断分叉。", [55, 45]),
    N("transplant", "器官移植", "发明", "med", "1954年", "", "sterile", ["immune", "blood"],
      "把一个活人的器官接到另一个人体内，并让它继续工作。", [40, 35, 25]),
    N("chemo", "化学治疗", "发明", "med", "1940年代", "", "pharma", [],
      "用对正在分裂的细胞有毒的药压制肿瘤。它不专认癌，先伤到长得快的组织。"),
    N("radioTx", "放射治疗", "发明", "med", "20世纪", "", "decay", ["xray"],
      "用电离辐射杀死体内的肿瘤。剂量要算到能伤到目标，少伤到周围。", [55, 45]),
    N("neurolep", "抗精神病药", "发明", "med", "1952年", "", "pharma", ["brain"],
      "一类药物能压住精神病的急性症状。收容不再是唯一能用的办法。", [70, 30]),
    N("psychom", "心理测量", "认知", "life", "1905年", "", "psych", ["stats"],
      "心智差别可以排成可比较的分数。分数记的是这次作业，不是一个固定的本质。", [55, 45]),
    N("sdt", "信号检测", "认知", "life", "1950至1960年代", "", "psych", ["stats"],
      "一次判断要分成真的发现和空报。感觉不再只是有或者没有。", [50, 50]),
    N("lexicon", "词典", "发明", "symbol", "古代", "", "writing", ["grammar"],
      "词和它的解释收成可以查阅的表。词义不必只靠口传。", [60, 40]),
    N("encycl", "百科全书", "发明", "symbol", "1751年", "", "print", ["univ"],
      "已知的条目按可以检索的顺序编在一起。读者不必先知道该去找哪一本。", [60, 40]),
    N("archive", "档案", "发明", "symbol", "古代", "", "writing", ["law"],
      "公文按形成时的原样保存。后来核对的是这份原件，不是转述。", [55, 45]),
    N("chronol", "年代学", "认知", "symbol", "16至19世纪", "", "chronicle", ["calendar"],
      "不同地方的纪年可以对齐到同一条时间轴。事件的先后不必只靠一本史书。", [55, 45]),
    N("harmony", "和声", "认知", "symbol", "18世纪", "", "notation", ["music"],
      "几个音同时响起，有可以核对的进行。曲子不再只是一条旋律。", [55, 45]),
    N("museum", "博物馆", "发明", "symbol", "17至18世纪", "", "lib", ["image"],
      "原件被收在一处供人观看。作品不必只留在它被使用的地方。", [55, 45]),
    N("papermoney", "纸币", "发明", "symbol", "11世纪", "", "money", [],
      "钱可以是一张凭信用兑现的纸。携带不必再搬运金属。"),
    N("cbank", "中央银行", "发明", "symbol", "1694年", "", "money", ["law"],
      "发钞和最后贷款收归一家公共机构。挤兑不再只靠每一家银行自己顶住。", [60, 40]),
    N("inflation", "通货膨胀", "认知", "symbol", "16至20世纪", "", "money", [],
      "同一面额能买到的东西普遍变少。物价要和货币量、产出放在一起看。"),
    N("oppcost", "机会成本", "认知", "symbol", "1914年", "", "ricardo", [],
      "选了这一项，放弃的是次好的那一项。成本不只是已经花出去的钱。"),
    N("bureau", "官僚制", "认知", "symbol", "1922年", "", "city", ["writing"],
      "职务按条文和档案运转，不随在位的人一起消失。命令可以传到没有见过面的人。", [60, 40]),
    N("elect", "代议", "认知", "symbol", "18至19世纪", "", "law", [],
      "谁掌权由可点数的同意决定，并定期更换。统治不必只靠血统。"),
    N("constit", "宪法", "发明", "symbol", "18世纪", "", "law", [],
      "政权的权限写成高于日常法令的文本。改它要比改一条法律更难。"),
    N("census", "人口普查", "发明", "symbol", "19世纪", "", "stats", ["law"],
      "按同一套问题点数全部人口。治理有了可以核对的人数。", [55, 45]),
    N("school", "普及教育", "发明", "symbol", "19世纪", "", "print", ["law"],
      "儿童按年龄进入同一套课程。识字不必再只靠一家一户的师徒。", [55, 45]),
    N("modul", "调制", "认知", "info", "1906年", "", "radio", [],
      "把要送的信号乘到一个高频上。同一条信道可以分出很多路。"),
    N("compress", "压缩", "发明", "info", "1948至1950年代", "", "info", ["coding"],
      "重复和可预测的部分可以先去掉再传。同样的信道因此装得下更多消息。", [60, 40]),
    N("os", "操作系统", "发明", "info", "1960年代", "", "computer", [],
      "一台机器同时照看许多程序，并管理存储和设备。人不必再直接拨弄硬件。"),
    N("proglang", "编程语言", "发明", "info", "1950年代", "", "computer", ["algo"],
      "计算步骤写成可读的文本，再译成机器能执行的指令。", [55, 45]),
    N("opensrc", "开源", "发明", "info", "1980年代", "", "computer", ["print"],
      "程序的原文可以让别人阅读、修改和再分发。改进不必只发生在一家机构里。", [70, 30])
  ];

  function grow(source) {
    const lanes = new Set(LANES.map((l) => l[0]));
    const list = source.map((n) => {
      const lane = DISC[n.id];
      if (!lane) throw new Error("未分学科 " + n.id);
      if (!lanes.has(lane)) throw new Error("未知学科 " + lane + " ← " + n.id);
      return Object.assign({}, n, { also: n.also.slice(), lane, share: n.share ? n.share.slice() : null });
    });
    const byId = new Map(list.map((n) => [n.id, n]));
    const children = new Map(list.map((n) => [n.id, []]));
    for (const n of list) {
      if (!n.parent) continue;
      if (!byId.has(n.parent)) throw new Error("缺少亲代 " + n.parent + " ← " + n.id);
      children.get(n.parent).push(n);
    }
    const seen = new Set();
    function walk(id, stack) {
      if (stack.indexOf(id) >= 0) throw new Error("主承启成环 " + stack.concat(id).join(" → "));
      if (seen.has(id)) return;
      seen.add(id);
      stack.push(id);
      for (const kid of children.get(id)) walk(kid.id, stack);
      stack.pop();
    }
    const starts = list.filter((n) => !n.parent);
    if (!starts.length) throw new Error("没有起点");
    for (const start of starts) walk(start.id, []);
    if (seen.size !== list.length) {
      const missing = list.filter((n) => !seen.has(n.id)).map((n) => n.id);
      throw new Error("没有接到根上 " + missing.join(", "));
    }
    for (const n of list) {
      for (const id of n.also) {
        if (!byId.has(id)) throw new Error(n.id + " 还要借不存在的 " + id);
        if (id === n.parent) throw new Error(n.id + " 的虚线和主承启重复");
      }
    }

    const weightMemo = new Map();
    function weight(id) {
      if (weightMemo.has(id)) return weightMemo.get(id);
      let w = 1;
      for (const kid of children.get(id)) w += weight(kid.id);
      weightMemo.set(id, w);
      return w;
    }
    for (const n of list) n.weight = weight(n.id);

    const placed = [];
    function nearest(x, y, ignore) {
      let best = Infinity;
      for (const o of placed) {
        if (o === ignore) continue;
        const d = Math.hypot(o.x - x, o.y - y);
        if (d < best) best = d;
      }
      return best;
    }
    function occupy(node, x, y, heading) {
      node.x = x;
      node.y = y;
      node.heading = heading;
      placed.push(node);
    }
    function stepLen(w) {
      return STEP + 14 * Math.log2(w);
    }
    function placeFrom(parent, preferred, w) {
      const base = stepLen(w);
      let best = null;
      for (let i = 0; i < 21; i++) {
        const delta = i === 0 ? 0 : (i % 2 === 1 ? -1 : 1) * Math.ceil(i / 2) * 0.14;
        if (Math.abs(delta) > 1.55) continue;
        const heading = preferred + delta;
        let dist = base;
        for (let k = 0; k < 18; k++) {
          const x = parent.x + Math.cos(heading) * dist;
          const y = parent.y + Math.sin(heading) * dist;
          if (nearest(x, y, parent) >= GAP) {
            const cost = dist + Math.abs(delta) * 160;
            if (!best || cost < best.cost) best = { x, y, heading, dist, cost, delta };
            break;
          }
          dist += 28;
        }
      }
      if (!best) {
        const dist = base + GAP * 4;
        best = {
          x: parent.x + Math.cos(preferred) * dist,
          y: parent.y + Math.sin(preferred) * dist,
          heading: preferred,
          delta: 0
        };
      }
      return best;
    }

    const roots = list.filter((n) => !n.parent);
    let order = 0;
    roots.forEach((start, i) => {
      const angle = roots.length <= 1 ? 0 : (i / roots.length) * Math.PI * 2 - Math.PI / 2;
      occupy(start, Math.cos(angle) * 80, Math.sin(angle) * 80, angle);
      start.depth = 0;
      start.order = order++;
    });

    function fanOffset(index, count) {
      if (count <= 1 || index === 0) return 0;
      const side = index % 2 === 1 ? -1 : 1;
      const rank = Math.ceil(index / 2);
      const step = Math.min(0.58, 1.25 / Math.sqrt(count));
      return side * rank * step;
    }
    const queue = roots.slice();
    while (queue.length) {
      const parent = queue.shift();
      const kids = children.get(parent.id).slice().sort((a, b) => b.weight - a.weight || (a.id < b.id ? -1 : 1));
      kids.forEach((kid, index) => {
        const preferred = parent.heading + fanOffset(index, kids.length);
        const spot = placeFrom(parent, preferred, kid.weight);
        const heading = Math.atan2(spot.y - parent.y, spot.x - parent.x);
        occupy(kid, spot.x, spot.y, heading);
        kid.depth = parent.depth + 1;
        kid.order = order++;
        queue.push(kid);
      });
    }

    const links = [];
    for (const n of list) {
      const srcs = [];
      if (n.parent) srcs.push(n.parent);
      for (const id of n.also) if (srcs.indexOf(id) < 0) srcs.push(id);
      if (!srcs.length) continue;
      let pcts;
      if (n.share) {
        if (n.share.length !== srcs.length) throw new Error("占比个数不对 " + n.id);
        if (n.share.some((x) => !Number.isInteger(x) || x <= 0)) throw new Error("占比要是正整数 " + n.id);
        if (n.share.reduce((a, b) => a + b, 0) !== 100) throw new Error("占比不是 100 " + n.id);
        pcts = n.share;
      } else {
        const base = Math.floor(100 / srcs.length);
        const extra = 100 - base * srcs.length;
        pcts = srcs.map((_, i) => base + (i < extra ? 1 : 0));
      }
      srcs.forEach((id, i) => {
        links.push({ from: id, to: n.id, pct: pcts[i] });
      });
    }
    const outs = new Map(list.map((n) => [n.id, []]));
    for (const link of links) outs.get(link.from).push(link);
    const passMemo = new Map();
    const passStack = new Set();
    function passed(id) {
      if (passMemo.has(id)) return passMemo.get(id);
      const kids = outs.get(id);
      if (!kids.length) {
        passMemo.set(id, 1);
        return 1;
      }
      if (passStack.has(id)) return 0;
      passStack.add(id);
      let sum = 0;
      for (const link of kids) {
        link.credit = link.pct / 100 * passed(link.to);
        sum += link.credit;
      }
      passStack.delete(id);
      passMemo.set(id, sum);
      return sum;
    }
    const leafMemo = new Map();
    const leafStack = new Set();
    function leafIds(id) {
      if (leafMemo.has(id)) return leafMemo.get(id);
      if (leafStack.has(id)) return new Set();
      leafStack.add(id);
      const set = new Set();
      for (const link of outs.get(id)) {
        if (!outs.get(link.to).length) set.add(link.to);
        for (const leaf of leafIds(link.to)) set.add(leaf);
      }
      leafStack.delete(id);
      leafMemo.set(id, set);
      return set;
    }
    for (const n of list) {
      const kids = outs.get(n.id);
      n.contrib = kids.length ? passed(n.id) : 0;
      n.leaves = kids.length ? leafIds(n.id).size : 0;
    }
    return { nodes: list, byId, children, links, lanes: LANES };
  }

  /* 引力。有关系的互相拉近，没有关系的互相推开。没有随机数。 */
  function scatter(list) {
    const golden = Math.PI * (3 - Math.sqrt(5));
    list.forEach((n, i) => {
      n.dx = 0;
      n.dy = 0;
      n.vx = 0;
      n.vy = 0;
      n.hold = false;
      const angle = i * golden;
      const radius = 26 * Math.sqrt(i + 1);
      n.x = Math.cos(angle) * radius;
      n.y = Math.sin(angle) * radius;
      n.heading = angle;
    });
  }

  function pull(list, links, byId, alpha) {
    const cool = alpha == null ? 1 : alpha;
    const rest = 120;
    const stiff = 0.032;
    const repel = 6400;
    const center = 0.008;
    const damp = 0.72;
    for (const n of list) {
      n.fx = 0;
      n.fy = 0;
    }
    for (const link of links) {
      const a = byId.get(link.from);
      const b = byId.get(link.to);
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.hypot(dx, dy);
      if (dist < 0.01) {
        dx = 0.01;
        dy = 0;
        dist = 0.01;
      }
      const force = cool * stiff * (dist - rest);
      const fx = dx / dist * force;
      const fy = dy / dist * force;
      a.fx += fx;
      a.fy += fy;
      b.fx -= fx;
      b.fy -= fy;
    }
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist2 = dx * dx + dy * dy;
        if (dist2 < 64) dist2 = 64;
        const dist = Math.sqrt(dist2);
        const force = cool * repel / dist2;
        const fx = dx / dist * force;
        const fy = dy / dist * force;
        a.fx -= fx;
        a.fy -= fy;
        b.fx += fx;
        b.fy += fy;
      }
    }
    let speed = 0;
    for (const n of list) {
      if (!n.hold) {
        n.fx -= n.x * center * cool;
        n.fy -= n.y * center * cool;
        n.vx = (n.vx + n.fx) * damp;
        n.vy = (n.vy + n.fy) * damp;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 22) {
          n.vx *= 22 / sp;
          n.vy *= 22 / sp;
        }
        n.x += n.vx;
        n.y += n.vy;
      } else {
        n.vx = 0;
        n.vy = 0;
      }
      speed += Math.hypot(n.vx, n.vy);
    }
    const aim = new Map(list.map((n) => [n.id, { x: 0, y: 0 }]));
    for (const link of links) {
      const a = byId.get(link.from), b = byId.get(link.to);
      const h = aim.get(a.id);
      h.x += b.x - a.x;
      h.y += b.y - a.y;
    }
    for (const n of list) {
      const h = aim.get(n.id);
      if (h.x || h.y) n.heading = Math.atan2(h.y, h.x);
    }
    return speed / Math.max(1, list.length - 1);
  }

  return { LANES, NODES, STEP, GAP, grow, scatter, pull };
});
