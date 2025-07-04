document.addEventListener('DOMContentLoaded', () => {

    // ★★★【変更点】★★★
    // HTMLとBODY要素を定数として取得
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // ★★★【変更点】★★★
    // ページ読み込み完了時に、<html>と<body>の両方にクラスを追加してスクロールを禁止
    htmlElement.classList.add('no-scroll');
    bodyElement.classList.add('no-scroll');

    // ===== データ定義 =====
    const scores = [0, 0, 0, 0];
    const questions = [
        // 内向(I) vs 外向(E)
        { text: "大勢のパーティーより、少人数での会話を好む", type: 0, weight: 1 },
        { text: "初対面の人と話すのは、むしろエネルギーになる", type: 0, weight: -1 },
        { text: "じっくり考える時間がないと、結論を出せない", type: 0, weight: 1 },
        { text: "注目を浴びるのは、あまり好きではない", type: 0, weight: 1 },
        { text: "思いついたら、まず口に出していることが多い", type: 0, weight: -1 },
        { text: "一人の時間がないと、ストレスがたまる", type: 0, weight: 1 },
        { text: "自分の考えを話すことで、思考が整理される", type: 0, weight: -1 },
        { text: "行動する前に、他の人の意見を聞きたい", type: 0, weight: -1 },
        { text: "電話が鳴ると、少し身構えてしまう", type: 0, weight: 1 },
        { text: "グループのリーダー役を任されるのは得意な方だ", type: 0, weight: -1 },
        // 感覚(S) vs 直観(N)
        { text: "「木を見て森を見ず」よりは「森を見て木を見ず」だ", type: 1, weight: -1 },
        { text: "具体的な事実やデータに基づいて判断する", type: 1, weight: 1 },
        { text: "未来の可能性について空想するのが好きだ", type: 1, weight: -1 },
        { text: "マニュアルや手順通りに進めるのが心地よい", type: 1, weight: 1 },
        { text: "物事の裏にある意味やパターンを探してしまう", type: 1, weight: -1 },
        { text: "経験したことのない新しい方法を試すことに抵抗はない", type: 1, weight: -1 },
        { text: "現実的で、地に足のついた考え方をする", type: 1, weight: 1 },
        { text: "比喩的な表現や、抽象的な会話を好む", type: 1, weight: -1 },
        { text: "五感で感じられる、具体的なものが好きだ", type: 1, weight: 1 },
        { text: "アイデアが次々と湧いてきて、話が飛躍することがある", type: 1, weight: -1 },
        // 思考(T) vs 感情(F)
        { text: "決断するときは、論理的な正しさを最も重視する", type: 2, weight: 1 },
        { text: "他人の感情に共感しやすく、影響されやすい", type: 2, weight: -1 },
        { text: "批判や議論を個人的な攻撃と捉えることは少ない", type: 2, weight: 1 },
        { text: "チームの調和を保つためなら、自分の意見を抑えることもある", type: 2, weight: -1 },
        { text: "客観的な事実よりも、当事者の気持ちを優先したい", type: 2, weight: -1 },
        { text: "効率性を重視し、無駄をなくすのが好きだ", type: 2, weight: 1 },
        { text: "相手を傷つける可能性があるなら、真実を言わないこともある", type: 2, weight: -1 },
        { text: "公平さと平等さ、ルールを何よりも大切にする", type: 2, weight: 1 },
        { text: "人から感謝されることに、強い喜びを感じる", type: 2, weight: -1 },
        { text: "問題解決において、感情を挟むべきではないと思う", type: 2, weight: 1 },
        // 計画(J) vs 探索(P)
        { text: "旅行は、詳細な計画を立ててから行きたい", type: 3, weight: 1 },
        { text: "締め切りが迫らないと、なかなかやる気が出ない", type: 3, weight: -1 },
        { text: "物事は、白黒はっきりさせたい", type: 3, weight: 1 },
        { text: "新しい選択肢が出てきたら、計画を変更するのも面白い", type: 3, weight: -1 },
        { text: "デスクの上は、いつも整理整頓されている", type: 3, weight: 1 },
        { text: "ルールや制約に縛られるのは苦手だ", type: 3, weight: -1 },
        { text: "タスクリストを作り、完了させることに満足感を覚える", type: 3, weight: 1 },
        { text: "その場の状況に合わせて、臨機応変に対応するのが得意だ", type: 3, weight: -1 },
        { text: "一度始めたことは、最後までやり遂げないと気が済まない", type: 3, weight: 1 },
        { text: "選択肢は、できるだけ多く残しておきたい", type: 3, weight: -1 },
    ];
    const resultTypes = {
        'INTJ': { name: '孤高の戦略家', catchphrase: '万物を見通す慧眼で、未来の地図を描く人', summary: 'あなたは独創的な視点と高い論理性を持ち、複雑な問題の本質を見抜く天才です。壮大なビジョンを描き、その実現のために緻密な戦略を立てることを得意とします。知的好奇心が旺盛で、常に知識を吸収し、世界をより良くするためのシステムを構築することに情熱を燃やします。', keywords: ['#未来志向', '#論理的思考', '#独立心', '#探求心', '#完璧主義'], superpower: '複雑な情報の中から、未来に繋がる道筋を見つけ出す「未来予測能力」。あなたの戦略は、常に時代の半歩先を行きます。', growthHint: '時として、あなたの高い理想は他者から理解されにくいことも。あなたのビジョンを共有し、チームを巻き込むコミュニケーション能力を磨けば、あなたは真のリーダーとなるでしょう。', jobs: ['経営企画', 'コンサルタント', 'データサイエンティスト', '建築家', '研究者'], partner: 'あなたのビジョンに火をつける「情熱の革命家 (ENTP)」', chartData: [8, 9, 7, 3, 9] },
        'ENTP': { name: '情熱の革命家', catchphrase: '知的な刺激を求め、世界に革新を巻き起こす挑戦者', summary: 'あなたは頭の回転が速く、知的な会話と議論をこよなく愛する発明家です。常識に疑問を投げかけ、既成概念を打ち破る新しいアイデアで周囲を魅了します。その好奇心とエネルギーは、停滞した状況を打破し、新しいムーブメントを生み出す原動力となります。', keywords: ['#発明家', '#議論好き', '#好奇心旺盛', '#カリスマ', '#機知'], superpower: '常識の枠を超え、無数のアイデアを結合させて全く新しいものを生み出す「アイデア創出力」。退屈な会議も、あなたがいれば刺激的なブレストに変わります。', growthHint: '次々と湧き出るアイデアに夢中になるあまり、地道な実行や仕上げが疎かになることも。信頼できる実行力のあるパートナーを見つけることで、あなたのアイデアは現実のものとなります。', jobs: ['起業家', 'マーケター', 'プランナー', 'ジャーナリスト', '弁護士'], partner: 'あなたのアイデアを形にする「孤高の戦略家 (INTJ)」', chartData: [7, 10, 6, 5, 8] },
        'INFJ': { name: '共感の調停者', catchphrase: '人の心に寄り添い、静かな理想を追い求める導き手', summary: 'あなたは深い洞察力と共感力を持ち、人々の可能性を信じ、その成長を助けることに喜びを感じるカウンセラーです。静かでありながら強い信念を持ち、世界をより良い場所にするための理想を心に秘めています。あなたの言葉は、人々の心を癒し、進むべき道を照らす光となります。', keywords: ['#共感力', '#理想主義', '#洞察力', '#献身的', '#創造的'], superpower: '言葉の裏にある本当の感情や意図を読み解く「深層心理読解力」。あなたがそばにいるだけで、誰もが安心して心を開くことができます。', growthHint: '他人の感情に共感しすぎるあまり、自分のエネルギーを消耗してしまう傾向があります。時には自分自身を優先し、心を守るための境界線を引くことも大切です。', jobs: ['カウンセラー', '人事（HR）', '教師', 'NPO職員', 'ライター'], partner: 'あなたの理想を現実世界で守ってくれる「信頼の守護者 (ISFJ)」', chartData: [6, 7, 7, 10, 7] },
        'ISTJ': { name: '緻密なる分析官', catchphrase: '揺るぎない誠実さで、秩序と安定を守る社会の礎', summary: 'あなたは非常に責任感が強く、現実的かつ実務的な思考で物事を正確に遂行する専門家です。一度決めたことは最後までやり遂げる誠実さと、詳細への注意力は、組織にとって不可欠な存在です。伝統やルールを尊重し、安定した環境で着実に成果を出すことに誇りを持っています。', keywords: ['#誠実', '#責任感', '#現実的', '#几帳面', '#組織力'], superpower: '膨大な情報やルールを正確に記憶し、必要な時に完璧に再現する「完全無欠のデータベース能力」。どんな混乱した状況でも、あなたの存在が秩序をもたらします。', growthHint: 'ルールや過去の経験を重視するあまり、新しい変化に対して少し慎重になりすぎることも。時には新しいやり方を受け入れ、柔軟に対応することで、あなたの信頼性はさらに高まります。', jobs: ['公務員', '会計士', '法務', 'システム管理者', '品質管理'], partner: 'あなたの計画に新たな視点を与える「情熱の革命家 (ENTP)」', chartData: [9, 4, 9, 6, 5] },
        'INTP': { name: '夢見る論理学者', catchphrase: '知の探求を続け、世界の真理を解き明かす哲学者', summary: 'あなたは知的好奇心の塊であり、複雑な理論や抽象的な概念を理解することに喜びを感じます。独自の視点から物事を分析し、完璧な論理体系を構築しようとします。常識にとらわれず、可能性を追求するその姿勢は、新たな発見の源泉となります。', keywords: ['#分析的', '#独創的', '#知的好奇心', '#客観的', '#マイペース'], superpower: 'どんな複雑な問題も、その根源にある論理構造を見つけ出し、単純な原理に分解してしまう「システム解体能力」。', growthHint: 'あなたの素晴らしいアイデアを、現実世界で形にするための具体的なアクションプランを立てることを意識してみましょう。他者との協力が、その助けとなります。', jobs: ['プログラマー', '大学教授', '物理学者', 'エコノミスト', '哲学者'], partner: 'あなたの知性を刺激する「情熱の革命家 (ENTP)」', chartData: [10, 9, 4, 3, 6] },
        'ENTJ': { name: '大胆なる指揮官', catchphrase: '明確なビジョンで人々を導き、不可能を可能にするリーダー', summary: 'あなたは生まれながらのリーダーであり、集団をまとめ、目標達成へと導く力強いエネルギーを持っています。合理的で決断力があり、非効率を嫌います。長期的な計画を立て、それを実行に移すことで、大きな成功を収めることができます。', keywords: ['#リーダーシップ', '#決断力', '#戦略的', '#カリスマ', '#自信家'], superpower: '混乱した状況でも即座に本質を見抜き、最も効率的な解決策を導き出し、人々に指示を出す「戦場の司令塔能力」。', growthHint: 'あなたの力強いリーダーシップが、時に他者には「強引」と映ることも。部下や仲間の感情にも配慮し、彼らの意見に耳を傾けることで、より多くの支持を得られるでしょう。', jobs: ['経営者', 'プロジェクトマネージャー', '政治家', '軍事戦略家', 'ベンチャーキャピタリスト'], partner: 'あなたの戦略を深く理解する「夢見る論理学者 (INTP)」', chartData: [8, 7, 9, 4, 10] },
        'ENFJ': { name: '情熱の主人公', catchphrase: '人々を惹きつけ、その成長を促す、生まれながらのメンター', summary: 'あなたはカリスマ性と共感力を兼ね備え、人々の中に眠る可能性を引き出すことに情熱を燃やします。他人の成長を自分のことのように喜び、人々が協力し合う調和の取れたコミュニティを作ることを得意とします。あなたの周りには、いつも人が集まってきます。', keywords: ['#カリスマ', '#共感力', '#指導者', '#協調性', '#利他的'], superpower: '相手の言葉にならない願いや悩みを察知し、的確な励ましの言葉をかけることで、人の心を一瞬で掴む「人心掌握能力」。', growthHint: 'すべての人を助けたいという強い思いから、時に自分を犠牲にしすぎてしまうことがあります。自分のニーズも大切にし、断る勇気を持つことも必要です。', jobs: ['教師', '広報', '人事部長', 'セールスマネージャー', '非営利団体のディレクター'], partner: 'あなたの情熱を支える「優しき擁護者 (ISFP)」', chartData: [6, 7, 8, 9, 9] },
        'ENFP': { name: '自由な冒険家', catchphrase: '好奇心の羅針盤に従い、人生のあらゆる可能性を探求する旅人', summary: 'あなたは情熱的で想像力豊か。常に新しいアイデアや人々との出会いを求め、人生を一つの大きな冒険と捉えています。その明るさと自由な精神は、周囲の人々を元気づけ、インスピレーションを与えます。束縛を嫌い、常に変化と刺激を求めます。', keywords: ['#情熱的', '#創造性', '#社交的', '#楽観的', '#自由奔放'], superpower: '人と人、アイデアとアイデアを繋ぎ合わせ、予期せぬ化学反応を生み出す「インスピレーションの触媒能力」。', growthHint: '多くの可能性に惹かれるあまり、一つのことを最後までやり遂げるのが難しい時も。本当に大切なことを見極め、集中する習慣をつけることで、あなたの夢は現実となります。', jobs: ['コピーライター', '俳優', 'イベントプランナー', 'キャリアコンサルタント', '旅行ジャーナリスト'], partner: 'あなたの情熱を静かに見守る「共感の調停者 (INFJ)」', chartData: [5, 10, 6, 8, 7] },
        'INFP': { name: '夢見る詩人', catchphrase: '内なる価値観に従い、世界に美と誠実さを見出す理想主義者', summary: 'あなたは繊細な感受性と強い倫理観を持つ、心優しき理想主義者です。自分の内なる価値観や信念を何よりも大切にし、世界をより良くしたいと願っています。文章や芸術を通して、その美しい内面世界を表現することに長けています。', keywords: ['#理想主義', '#創造的', '#共感力', '#忠実', '#内省的'], superpower: 'ありふれた日常の中に、他人が見過ごしてしまうような深い意味や美しさを見つけ出す「感受性のアンテナ」。', growthHint: '理想と現実のギャップに苦しむことがあるかもしれません。小さな一歩からでも、あなたの理想を現実世界で形にしていく行動を起こすことが、あなたを強くします。', jobs: ['作家', 'アーティスト', '心理学者', '編集者', 'ソーシャルワーカー'], partner: 'あなたの理想を現実にする手助けをする「大胆なる指揮官 (ENTJ)」', chartData: [4, 9, 5, 10, 6] },
        'ISFJ': { name: '信頼の守護者', catchphrase: '献身的な愛情で、大切な人々を優しく守り抜く擁護者', summary: 'あなたは非常に忠実で心優しく、周りの人々への配慮を欠かさない、まさに「縁の下の力持ち」です。具体的な形で人を助けることに喜びを感じ、任された仕事は責任を持って完璧にこなします。あなたの存在は、コミュニティに安心感と安定をもたらします。', keywords: ['#献身的', '#忠実', '#忍耐強い', '#実務的', '#思いやり'], superpower: '大切な人の好みや必要としているものを細部まで記憶し、最高のサポートを提供する「究極のホスピタリティ能力」。', growthHint: '他人を優先するあまり、自分の意見や欲求を後回しにしがちです。時には「ノー」と言い、自分のための時間を作ることを恐れないでください。', jobs: ['看護師', '保育士', '秘書', '図書館司書', 'インテリアデザイナー'], partner: 'あなたの献身に心から感謝する「誠実な実行家 (ESFJ)」', chartData: [7, 5, 8, 10, 5] },
        'ISFP': { name: '優しき芸術家', catchphrase: '今この瞬間を五感で味わい、美と調和を愛するアーティスト', summary: 'あなたは穏やかで控えめながら、内面には豊かな感受性と美的センスを秘めています。今この瞬間を生きることを大切にし、五感を通して世界の美しさを感じ取ります。柔軟で寛容な心を持ち、争いごとを嫌う平和主義者です。', keywords: ['#美的センス', '#平和主義', '#柔軟', '#謙虚', '#探求心'], superpower: '身の回りの環境やモノを使い、心地よく美しい空間や体験を創造する「五感のハーモニー能力」。', growthHint: '長期的な計画を立てたり、将来のために現在の楽しみを犠牲にしたりするのが苦手な面も。自分の価値観に基づいた、わくわくする未来を描くことで、計画も楽しくなります。', jobs: ['ファッションデザイナー', '音楽家', '料理人', '獣医師', '造園家'], partner: 'あなたの芸術性を理解し、刺激を与える「自由な冒険家 (ENFP)」', chartData: [5, 8, 6, 9, 4] },
        'ISTP': { name: '孤高の職人', catchphrase: '冷静な観察眼で物事の仕組みを解明し、手でそれを体現するマイスター', summary: 'あなたは好奇心旺盛な実践主義者。手と頭脳を使って、物事がどのように機能するのかを探求し、問題を解決することに長けています。危機的な状況でも冷静さを失わず、利用可能なツールやリソースを駆使して、即座に対応することができます。', keywords: ['#実践的', '#効率重視', '#冷静沈着', '#好奇心旺盛', '#トラブルシューター'], superpower: 'どんな道具や機械でも、少し触っただけでその仕組みを理解し、修理・改善してしまう「メカニック・ハンド」。', growthHint: '人間関係の複雑さや感情の機微を理解するのが、少し苦手かもしれません。他人の感情にも、あなたが機械の仕組みに向けるのと同じくらいの好奇心を向けてみると、新しい発見があるでしょう。', jobs: ['エンジニア', 'パイロット', '消防士', '外科医', 'ITサポート'], partner: 'あなたのスキルを尊敬し、新たな挑戦をくれる「大胆なる指揮官 (ENTJ)」', chartData: [9, 6, 10, 3, 5] },
        'ESFJ': { name: '誠実な実行家', catchphrase: '社交性と責任感で、人々を繋ぎ、コミュニティを支える世話役', summary: 'あなたは非常に社交的で、人々を楽しませ、世話をすることに喜びを感じます。伝統や秩序を重んじ、自分が所属するコミュニティへの貢献を大切にします。他人のニーズに敏感で、具体的な手助けを申し出ることを厭いません。', keywords: ['#社交的', '#世話好き', '#責任感', '#協力的', '#伝統重視'], superpower: '場の空気を読み、誰もが心地よく過ごせるように配慮し、イベントを成功に導く「究極のホスト能力」。', growthHint: '他人の評価や承認を気にしすぎる傾向があります。自分自身の価値観を信じ、すべての人の期待に応えようとしないことが、心の平穏に繋がります。', jobs: ['営業', '広報マネージャー', '不動産仲介業者', 'イベントコーディネーター', 'カスタマーサポート'], partner: 'あなたのサポートを心から頼りにする「信頼の守護者 (ISFJ)」', chartData: [6, 5, 8, 9, 7] },
        'ESFP': { name: '天性のエンターテイナー', catchphrase: '人生という舞台を楽しみ、その場の主役となる華麗なパフォーマー', summary: 'あなたはエネルギッシュで自発的、そして何よりも楽しむことの天才です。その場の注目を一身に集め、人々を笑顔にする才能があります。洗練された美的センスを持ち、ファッションやインテリアなど、美しいもので自分を表現することを好みます。', keywords: ['#エンターテイナー', '#社交的', '#現実主義', '#美的センス', '#楽観的'], superpower: 'どんな退屈な場所でも、あなたの存在一つで一瞬にして華やかなパーティ会場に変えてしまう「スポットライト能力」。', growthHint: '目の前の楽しみに夢中になるあまり、将来の計画や退屈な義務を後回しにしがちです。楽しむことと責任を果たすことのバランスを取ることで、あなたの人生はさらに輝きます。', jobs: ['俳優', 'ツアーガイド', '美容師', 'マーケティング担当者', 'スポーツインストラクター'], partner: 'あなたの輝きを優しく見守る「優しき芸術家 (ISFP)」', chartData: [6, 8, 7, 8, 6] },
        'ESTJ': { name: '厳格なる監督官', catchphrase: '秩序と伝統を重んじ、物事を正しく、効率的に管理する執行者', summary: 'あなたは現実的で決断力があり、物事を組織化し、実行することに非常に優れています。明確なルールと基準に基づいて行動し、自分にも他人にも高い水準を求めます。そのリーダーシップは、組織やプロジェクトをスムーズに運営するために不可欠です。', keywords: ['#組織的', '#現実的', '#決断力', '#リーダー', '#伝統を重んじる'], superpower: 'どんなカオスなプロジェクトでも、明確な手順と役割分担を定め、秩序ある状態へと導く「プロジェクト管理能力」。', growthHint: '効率とルールを重視するあまり、新しいアイデアや型にはまらない意見に対して非寛容になることがあります。他人の視点や感情にも耳を傾けることで、より効果的なリーダーになれるでしょう。', jobs: ['マネージャー', '裁判官', '警察官', '銀行員', '最高執行責任者(COO)'], partner: 'あなたの計画を誠実に実行する「緻密なる分析官 (ISTJ)」', chartData: [8, 4, 9, 5, 9] },
        'ESTP': { name: 'スリルを求める冒険家', catchphrase: '五感をフルに使い、危機的状況さえも楽しむエネルギッシュな挑戦者', summary: 'あなたは行動的でエネルギッシュ、常に刺激的な体験を求めています。理論よりも実践を好み、危機的な状況においてこそ、その能力を最大限に発揮します。人との駆け引きを楽しみ、説得力のある交渉で自分の望む結果を手に入れることができます。', keywords: ['#行動的', '#現実的', '#エネルギッシュ', '#説得力', '#問題解決者'], superpower: '一瞬の状況変化を即座に見抜き、大胆かつ最適な行動を取ることができる「危機的状況での即応能力」。', growthHint: '衝動的に行動し、長期的な結果を考えないことがあります。行動を起こす前に一呼吸おいて、その影響を考える癖をつけると、大きな失敗を避けることができます。', jobs: ['起業家', '救急救命士', '探偵', 'セールス', 'プロアスリート'], partner: 'あなたの行動力を称賛する「孤高の職人 (ISTP)」', chartData: [7, 6, 9, 5, 8] },
    };
    const screens = { start: document.getElementById('start-screen'), question: document.getElementById('question-screen'), loading: document.getElementById('loading-screen'), result: document.getElementById('result-screen'), };
    const startBtn = document.getElementById('start-button');
    const optionBtns = document.querySelectorAll('.option-btn');
    const questionText = document.getElementById('question-text');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const restartBtn = document.getElementById('restart-button');
    const resultTypeName = document.getElementById('result-type-name');
    const resultCatchphrase = document.getElementById('result-catchphrase');
    const resultSummary = document.getElementById('result-summary');
    const resultKeywords = document.getElementById('result-keywords');
    const resultJobs = document.getElementById('result-jobs');
    const resultSuperpower = document.getElementById('result-superpower');
    const resultGrowthHint = document.getElementById('result-growth-hint');
    const resultPartner = document.getElementById('result-partner');
    const talentChartCanvas = document.getElementById('talent-chart');
    let talentChart = null;
    let currentQuestionIndex = 0;

    const switchScreen = (screenName) => {
        for (let key in screens) {
            screens[key].classList.remove('active');
        }
        screens[screenName].classList.add('active');
    };

    const startGame = () => {
        currentQuestionIndex = 0;
        scores.fill(0);
        switchScreen('question');
        displayQuestion();
    };

    const displayQuestion = () => {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.text;
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
    };

    const handleOptionClick = (e) => {
        const value = parseInt(e.target.dataset.value, 10);
        const question = questions[currentQuestionIndex];
        const point = value - 3;
        scores[question.type] += point * question.weight;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            showResult();
        }
    };

    const showResult = () => {
        switchScreen('loading');
        setTimeout(() => {
            const resultKey = calculateResult();
            const resultData = resultTypes[resultKey];
            displayResult(resultData);
            
            // ★★★【変更点】★★★
            // <html>と<body>の両方からクラスを削除してスクロールを許可
            htmlElement.classList.remove('no-scroll');
            bodyElement.classList.remove('no-scroll');

            switchScreen('result');
        }, 2000);
    };

    const calculateResult = () => {
        let key = '';
        key += scores[0] > 0 ? 'I' : 'E';
        key += scores[1] > 0 ? 'S' : 'N';
        key += scores[2] > 0 ? 'T' : 'F';
        key += scores[3] > 0 ? 'J' : 'P';
        return key;
    };

    const displayResult = (data) => {
        if (!data) {
            resultTypeName.textContent = "エラー";
            resultSummary.textContent = "結果の取得中にエラーが発生しました。もう一度お試しください。";
            return;
        }
        resultTypeName.textContent = data.name;
        resultCatchphrase.textContent = data.catchphrase;
        resultSummary.textContent = data.summary;
        resultKeywords.innerHTML = '';
        data.keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.textContent = keyword;
            resultKeywords.appendChild(tag);
        });
        resultJobs.innerHTML = '';
        data.jobs.forEach(job => {
            const li = document.createElement('li');
            li.textContent = job;
            resultJobs.appendChild(li);
        });
        resultSuperpower.textContent = data.superpower;
        resultGrowthHint.textContent = data.growthHint;
        resultPartner.textContent = data.partner;
        if (talentChart) {
            talentChart.destroy();
        }
        const ctx = talentChartCanvas.getContext('2d');
        talentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['分析力', '創造力', '実行力', '協調性', '指導力'],
                datasets: [{
                    label: 'あなたの才能',
                    data: data.chartData,
                    backgroundColor: 'rgba(0, 174, 255, 0.2)',
                    borderColor: 'rgba(0, 174, 255, 1)',
                    pointBackgroundColor: 'rgba(0, 174, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 174, 255, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(224, 225, 221, 0.3)' },
                        grid: { color: 'rgba(224, 225, 221, 0.3)' },
                        pointLabels: { color: '#e0e1dd', font: { size: 12 } },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: { backdropColor: 'transparent', color: '#e0e1dd', stepSize: 2 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    };
    const restartGame = () => {
        // ★★★【変更点】★★★
        // <html>と<body>の両方にクラスを追加してスクロールを禁止
        htmlElement.classList.add('no-scroll');
        bodyElement.classList.add('no-scroll');

        window.scrollTo(0, 0);
        switchScreen('start');
    };
    startBtn.addEventListener('click', startGame);
    optionBtns.forEach(btn => btn.addEventListener('click', handleOptionClick));
    restartBtn.addEventListener('click', restartGame);
});