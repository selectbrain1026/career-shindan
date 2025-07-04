document.addEventListener('DOMContentLoaded', () => {

    // ===== データ定義 =====

    // 診断タイプを決定づける4つの軸
    // [0]: 内向(I) vs 外向(E)
    // [1]: 感覚(S) vs 直観(N)
    // [2]: 思考(T) vs 感情(F)
    // [3]: 計画(J) vs 探索(P)
    const scores = [0, 0, 0, 0];

    // 設問データ (40問)
    // type: どの軸に影響するか (I/E, S/N, T/F, J/P)
    // weight: 影響の向き (+1 or -1)
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

    // 結果データ (サンプル4タイプ)
    const resultTypes = {
        'INTJ': {
            name: '孤高の戦略家',
            catchphrase: '万物を見通す慧眼で、未来の地図を描く人',
            summary: 'あなたは独創的な視点と高い論理性を持ち、複雑な問題の本質を見抜く天才です。壮大なビジョンを描き、その実現のために緻密な戦略を立てることを得意とします。知的好奇心が旺盛で、常に知識を吸収し、世界をより良くするためのシステムを構築することに情熱を燃やします。',
            keywords: ['#未来志向', '#論理的思考', '#独立心', '#探求心', '#完璧主義'],
            superpower: '複雑な情報の中から、未来に繋がる道筋を見つけ出す「未来予測能力」。あなたの戦略は、常に時代の半歩先を行きます。',
            growthHint: '時として、あなたの高い理想は他者から理解されにくいことも。あなたのビジョンを共有し、チームを巻き込むコミュニケーション能力を磨けば、あなたは真のリーダーとなるでしょう。',
            jobs: ['経営企画', 'コンサルタント', 'データサイエンティスト', '建築家', '研究者'],
            partner: 'あなたのビジョンに火をつける「情熱の革命家 (ENTP)」',
            chartData: [8, 9, 7, 3, 9] // 分析力, 創造力, 実行力, 協調性, 指導力
        },
        'ENTP': {
            name: '情熱の革命家',
            catchphrase: '知的な刺激を求め、世界に革新を巻き起こす挑戦者',
            summary: 'あなたは頭の回転が速く、知的な会話と議論をこよなく愛する発明家です。常識に疑問を投げかけ、既成概念を打ち破る新しいアイデアで周囲を魅了します。その好奇心とエネルギーは、停滞した状況を打破し、新しいムーブメントを生み出す原動力となります。',
            keywords: ['#発明家', '#議論好き', '#好奇心旺盛', '#カリスマ', '#機知'],
            superpower: '常識の枠を超え、無数のアイデアを結合させて全く新しいものを生み出す「アイデア創出力」。退屈な会議も、あなたがいれば刺激的なブレストに変わります。',
            growthHint: '次々と湧き出るアイデアに夢中になるあまり、地道な実行や仕上げが疎かになることも。信頼できる実行力のあるパートナーを見つけることで、あなたのアイデアは現実のものとなります。',
            jobs: ['起業家', 'マーケター', 'プランナー', 'ジャーナリスト', '弁護士'],
            partner: 'あなたのアイデアを形にする「孤高の戦略家 (INTJ)」',
            chartData: [7, 10, 6, 5, 8]
        },
        'INFJ': {
            name: '共感の調停者',
            catchphrase: '人の心に寄り添い、静かな理想を追い求める導き手',
            summary: 'あなたは深い洞察力と共感力を持ち、人々の可能性を信じ、その成長を助けることに喜びを感じるカウンセラーです。静かでありながら強い信念を持ち、世界をより良い場所にするための理想を心に秘めています。あなたの言葉は、人々の心を癒し、進むべき道を照らす光となります。',
            keywords: ['#共感力', '#理想主義', '#洞察力', '#献身的', '#創造的'],
            superpower: '言葉の裏にある本当の感情や意図を読み解く「深層心理読解力」。あなたがそばにいるだけで、誰もが安心して心を開くことができます。',
            growthHint: '他人の感情に共感しすぎるあまり、自分のエネルギーを消耗してしまう傾向があります。時には自分自身を優先し、心を守るための境界線を引くことも大切です。',
            jobs: ['カウンセラー', '人事（HR）', '教師', 'NPO職員', 'ライター'],
            partner: 'あなたの理想を現実世界で守ってくれる「信頼の守護者 (ISFJ)」',
            chartData: [6, 7, 7, 10, 7]
        },
        'ISTJ': {
            name: '緻密なる分析官',
            catchphrase: '揺るぎない誠実さで、秩序と安定を守る社会の礎',
            summary: 'あなたは非常に責任感が強く、現実的かつ実務的な思考で物事を正確に遂行する専門家です。一度決めたことは最後までやり遂げる誠実さと、詳細への注意力は、組織にとって不可欠な存在です。伝統やルールを尊重し、安定した環境で着実に成果を出すことに誇りを持っています。',
            keywords: ['#誠実', '#責任感', '#現実的', '#几帳面', '#組織力'],
            superpower: '膨大な情報やルールを正確に記憶し、必要な時に完璧に再現する「完全無欠のデータベース能力」。どんな混乱した状況でも、あなたの存在が秩序をもたらします。',
            growthHint: 'ルールや過去の経験を重視するあまり、新しい変化に対して少し慎重になりすぎることも。時には新しいやり方を受け入れ、柔軟に対応することで、あなたの信頼性はさらに高まります。',
            jobs: ['公務員', '会計士', '法務', 'システム管理者', '品質管理'],
            partner: 'あなたの計画に新たな視点を与える「情熱の革命家 (ENTP)」',
            chartData: [9, 4, 9, 6, 5]
        }
        // 他の12タイプも同様に定義...
    };


    // ===== DOM要素 =====
    const screens = {
        start: document.getElementById('start-screen'),
        question: document.getElementById('question-screen'),
        loading: document.getElementById('loading-screen'),
        result: document.getElementById('result-screen'),
    };
    const startBtn = document.getElementById('start-button');
    const optionBtns = document.querySelectorAll('.option-btn');
    const questionText = document.getElementById('question-text');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loadingText = document.getElementById('loading-text');
    const restartBtn = document.getElementById('restart-button');

    // 結果表示用の要素
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


    // ===== ゲームロジック =====
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
        const value = parseInt(e.target.dataset.value, 10); // 1-5
        const question = questions[currentQuestionIndex];
        
        // スコア計算: 3を中央値として加点・減点
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
            const resultData = resultTypes[resultKey] || resultTypes['ISTJ']; // フォールバック
            displayResult(resultData);
            switchScreen('result');
        }, 2000); // 2秒間のローディング演出
    };

    const calculateResult = () => {
        let key = '';
        key += scores[0] > 0 ? 'I' : 'E';
        key += scores[1] > 0 ? 'S' : 'N';
        key += scores[2] > 0 ? 'T' : 'F';
        key += scores[3] > 0 ? 'J' : 'P';
        // サンプルにない組み合わせの場合は、最も近い定義済みのタイプを返すなどの処理も可能
        // 今回は定義済みの4タイプに合致しない場合、ISTJを返すようにする
        return resultTypes[key] ? key : 'ISTJ';
    };

    const displayResult = (data) => {
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

        // レーダーチャートの描画
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
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#e0e1dd',
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    };

    const restartGame = () => {
        switchScreen('start');
    };

    // ===== イベントリスナー =====
    startBtn.addEventListener('click', startGame);
    optionBtns.forEach(btn => btn.addEventListener('click', handleOptionClick));
    restartBtn.addEventListener('click', restartGame);
});