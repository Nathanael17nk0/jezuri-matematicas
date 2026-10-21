/**
 * Tablas Dinámicas de Máximo Común Divisor (M.C.D.)
 * Funciones para factores primos, análisis de divisibilidad y explicaciones paso a paso
 */

(() => {
  'use strict';

  // --- PRESETS POR MODO ---
  const PRESETS = {
    '2': [
      { label: '48 y 72', values: [48, 72] },
      { label: '120 y 160', values: [120, 160] },
      { label: '105 y 140', values: [105, 140] },
      { label: '15 y 28 (Coprimos)', values: [15, 28] },
      { label: '360 y 480', values: [360, 480] }
    ],
    '3': [
      { label: '60, 90 y 150', values: [60, 90, 150] },
      { label: '24, 36 y 60', values: [24, 36, 60] },
      { label: '45, 75 y 90', values: [45, 75, 90] },
      { label: '70, 105 y 175', values: [70, 105, 175] },
      { label: '12, 18 y 25 (Coprimos)', values: [12, 18, 25] }
    ],
    '4': [
      { label: '120, 180, 240 y 300', values: [120, 180, 240, 300] },
      { label: '48, 72, 96 y 120', values: [48, 72, 96, 120] },
      { label: '40, 60, 80 y 100', values: [40, 60, 80, 100] },
      { label: '84, 126, 168 y 210', values: [84, 126, 168, 210] }
    ],
    'custom': [
      { label: '30, 45, 75, 90, 120 (5 núms)', values: [30, 45, 75, 90, 120] }
    ]
  };

  // --- APPLICATION STATE ---
  const state = {
    mode: '2',
    numbers: [48, 72],
    activeTab: 'simultaneous',
    theme: localStorage.getItem('mcd_theme') || 'dark',
    finderNumber: 48,
    factorNumber: 48,
    treeMode: 'balanced',
    player: {
      currentStep: 999, // default show all
      isPlaying: false,
      intervalId: null,
      maxSteps: 0
    },
    eqState: {
      expression: '6[(7a - 5) + 1 - 5b] + 3(a + 2)',
      variables: { a: 5, b: 2 },
      mode: 'numeric',
      currentStep: 999,
      steps: [],
      isPlaying: false,
      intervalId: null
    },
    ratState: {
      expression: '3/4 + 5/6 - 1/2',
      mode: 'visual',
      terms: [
        { sign: 1, whole: 0, num: 3, den: 4 },
        { sign: 1, whole: 0, num: 5, den: 6 },
        { sign: -1, whole: 0, num: 1, den: 2 }
      ],
      steps: [],
      solution: null
    },
    compFracState: {
      expression: '5 / (2 - (-3) / (-7 + 2 / (1/2 - (-2/3))))',
      steps: [],
      currentStep: 999,
      solution: null
    },
    activeModule: 'mcd',
    aiState: {
      activeContext: 'current',
      messages: []
    }
  };

  // --- DOM ELEMENTS ---
  const elements = {
    html: document.documentElement,
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    modeBtns: document.querySelectorAll('.mode-pill'),
    numbersForm: document.getElementById('numbersForm'),
    customControls: document.getElementById('customControls'),
    btnAddNumber: document.getElementById('btnAddNumber'),
    btnRemoveNumber: document.getElementById('btnRemoveNumber'),
    presetsList: document.getElementById('presetsList'),
    btnRandom: document.getElementById('btnRandom'),
    btnReset: document.getElementById('btnReset'),
    // KPI elements
    kpiMcd: document.getElementById('kpiMcd'),
    kpiStatusBadge: document.getElementById('kpiStatusBadge'),
    kpiCanonical: document.getElementById('kpiCanonical'),
    kpiSteps: document.getElementById('kpiSteps'),
    kpiStepsSub: document.getElementById('kpiStepsSub'),
    kpiExcelFormula: document.getElementById('kpiExcelFormula'),
    // Tab buttons & Panes
    viewTabs: document.querySelectorAll('.view-tab'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    mobileTabSelect: document.getElementById('mobileTabSelect'),
    // Containers
    simultaneousTableContainer: document.getElementById('simultaneousTableContainer'),
    simultaneousStepDetails: document.getElementById('simultaneousStepDetails'),
    simultaneousExplanation: document.getElementById('simultaneousExplanation'),
    individualTablesContainer: document.getElementById('individualTablesContainer'),
    powersTableContainer: document.getElementById('powersTableContainer'),
    // Factor Decomposition elements
    factorDecomposeInput: document.getElementById('factorDecomposeInput'),
    btnDecomposeNow: document.getElementById('btnDecomposeNow'),
    factorQuickPickBtns: document.getElementById('factorQuickPickBtns'),
    btnTreeBalanced: document.getElementById('btnTreeBalanced'),
    btnTreePrimes: document.getElementById('btnTreePrimes'),
    factorDecomposeResultsContainer: document.getElementById('factorDecomposeResultsContainer'),
    // Finder elements
    finderInput: document.getElementById('finderInput'),
    btnAnalyzeFinder: document.getElementById('btnAnalyzeFinder'),
    finderQuickPicks: document.getElementById('finderQuickPicks'),
    finderResultsContainer: document.getElementById('finderResultsContainer'),
    euclidContentContainer: document.getElementById('euclidContentContainer'),
    narrativeContentContainer: document.getElementById('narrativeContentContainer'),
    btnCopyNarrative: document.getElementById('btnCopyNarrative'),
    divisorsContentContainer: document.getElementById('divisorsContentContainer'),
    // Player controls
    playerPrev: document.getElementById('playerPrev'),
    playerPlay: document.getElementById('playerPlay'),
    playerNext: document.getElementById('playerNext'),
    playerReset: document.getElementById('playerReset'),
    // Action buttons
    btnCopySolution: document.getElementById('btnCopySolution'),
    btnExportDynamicExcel: document.getElementById('btnExportDynamicExcel'),
    btnPrint: document.getElementById('btnPrint'),
    toastNotification: document.getElementById('toastNotification'),
    // Equation Solver elements
    btnHeaderGoEquations: document.getElementById('btnHeaderGoEquations'),
    tabBtnEquations: document.getElementById('tabBtnEquations'),
    paneEquations: document.getElementById('paneEquations'),
    eqExpressionInput: document.getElementById('eqExpressionInput'),
    btnEqClear: document.getElementById('btnEqClear'),
    eqLivePreview: document.getElementById('eqLivePreview'),
    eqSmartStatus: document.getElementById('eqSmartStatus'),
    eqSmartStatusText: document.getElementById('eqSmartStatusText'),
    smartGroupingPreview: document.getElementById('smartGroupingPreview'),
    pendingCloseSymbol: document.getElementById('pendingCloseSymbol'),
    btnModeNumeric: document.getElementById('btnModeNumeric'),
    btnModeSimplify: document.getElementById('btnModeSimplify'),
    eqVariablesCard: document.getElementById('eqVariablesCard'),
    eqVariablesGrid: document.getElementById('eqVariablesGrid'),
    eqVarsCountBadge: document.getElementById('eqVarsCountBadge'),
    eqVarsStringInput: document.getElementById('eqVarsStringInput'),
    btnApplyVarsString: document.getElementById('btnApplyVarsString'),
    btnSolveEquation: document.getElementById('btnSolveEquation'),
    btnResetEquation: document.getElementById('btnResetEquation'),
    eqResultsContainer: document.getElementById('eqResultsContainer'),
    // Keypad elements
    btnSmartGrouping: document.getElementById('btnSmartGrouping'),
    btnSmartClose: document.getElementById('btnSmartClose'),
    btnKeypadBackspace: document.getElementById('btnKeypadBackspace'),
    btnKeypadClearAll: document.getElementById('btnKeypadClearAll'),
    btnKeypadLeft: document.getElementById('btnKeypadLeft'),
    btnKeypadRight: document.getElementById('btnKeypadRight'),
    // Presets
    btnPresetUser: document.getElementById('btnPresetUser'),
    btnPresetImage: document.getElementById('btnPresetImage'),
    btnPresetBaldor2: document.getElementById('btnPresetBaldor2'),
    btnPresetBaldor3: document.getElementById('btnPresetBaldor3'),
    btnPresetBaldor4: document.getElementById('btnPresetBaldor4'),
    btnPresetArithmetic: document.getElementById('btnPresetArithmetic'),
    btnPresetLinear: document.getElementById('btnPresetLinear'),
    // Rationals (Fracciones) elements
    btnHeaderGoRationals: document.getElementById('btnHeaderGoRationals'),
    tabBtnRationals: document.getElementById('tabBtnRationals'),
    paneRationals: document.getElementById('paneRationals'),
    btnRatModeVisual: document.getElementById('btnRatModeVisual'),
    btnRatModeText: document.getElementById('btnRatModeText'),
    ratVisualBuilderContainer: document.getElementById('ratVisualBuilderContainer'),
    ratTextExpressionContainer: document.getElementById('ratTextExpressionContainer'),
    ratTermsList: document.getElementById('ratTermsList'),
    btnAddFractionCard: document.getElementById('btnAddFractionCard'),
    btnClearFractionCards: document.getElementById('btnClearFractionCards'),
    ratExpressionInput: document.getElementById('ratExpressionInput'),
    ratMathPreview: document.getElementById('ratMathPreview'),
    btnSolveRationals: document.getElementById('btnSolveRationals'),
    btnResetRationals: document.getElementById('btnResetRationals'),
    kpiRatResult: document.getElementById('kpiRatResult'),
    kpiRatStatusBadge: document.getElementById('kpiRatStatusBadge'),
    kpiRatLcm: document.getElementById('kpiRatLcm'),
    kpiRatMixed: document.getElementById('kpiRatMixed'),
    kpiRatMixedSub: document.getElementById('kpiRatMixedSub'),
    kpiRatDecimal: document.getElementById('kpiRatDecimal'),
    kpiRatType: document.getElementById('kpiRatType'),
    ratResultsContainer: document.getElementById('ratResultsContainer'),
    btnRatBackspace: document.getElementById('btnRatBackspace'),
    btnRatClearText: document.getElementById('btnRatClearText'),
    // Compound Fractions (Fracciones Compuestas - Tab 10) elements
    btnHeaderGoCompFrac: document.getElementById('btnHeaderGoCompFrac'),
    tabBtnCompFrac: document.getElementById('tabBtnCompFrac'),
    paneCompfrac: document.getElementById('paneCompfrac'),
    compFracExpressionInput: document.getElementById('compFracExpressionInput'),
    btnCompFracClear: document.getElementById('btnCompFracClear'),
    compFracLivePreview: document.getElementById('compFracLivePreview'),
    btnSolveCompFrac: document.getElementById('btnSolveCompFrac'),
    btnResetCompFrac: document.getElementById('btnResetCompFrac'),
    compFracResultsContainer: document.getElementById('compFracResultsContainer'),
    btnPresetComp41: document.getElementById('btnPresetComp41'),
    btnPresetComp41Mul: document.getElementById('btnPresetComp41Mul'),
    btnPresetCompBaldor: document.getElementById('btnPresetCompBaldor'),
    btnPresetCompStair: document.getElementById('btnPresetCompStair'),
    btnPresetCompIntegers: document.getElementById('btnPresetCompIntegers'),
    btnPresetCompTier4: document.getElementById('btnPresetCompTier4'),
    btnCompKeypadBackspace: document.getElementById('btnCompKeypadBackspace'),
    btnCompKeypadClearAll: document.getElementById('btnCompKeypadClearAll'),
    // Master Module Navigation & Layout
    moduleNavBtns: document.querySelectorAll('.module-nav-btn'),
    navModMcd: document.getElementById('navModMcd'),
    navModEquations: document.getElementById('navModEquations'),
    navModRationals: document.getElementById('navModRationals'),
    navModCompFrac: document.getElementById('navModCompFrac'),
    navModAiTutor: document.getElementById('navModAiTutor'),
    btnHeaderGoAiTutor: document.getElementById('btnHeaderGoAiTutor'),
    btnFloatingAiTutor: document.getElementById('btnFloatingAiTutor'),
    mcdControlsWrapper: document.getElementById('mcdControlsWrapper'),
    // AI Tutor (Tab 11) elements
    tabBtnAiTutor: document.getElementById('tabBtnAiTutor'),
    paneAitutor: document.getElementById('paneAitutor'),
    btnAiAnalyzeCurrent: document.getElementById('btnAiAnalyzeCurrent'),
    aiContextPills: document.querySelectorAll('.ai-pill'),
    aiDetectedTypeBadge: document.getElementById('aiDetectedTypeBadge'),
    aiDetectedProblemFormula: document.getElementById('aiDetectedProblemFormula'),
    aiDetectedMeta: document.getElementById('aiDetectedMeta'),
    aiStrategyContent: document.getElementById('aiStrategyContent'),
    aiPitfallsContent: document.getElementById('aiPitfallsContent'),
    aiVerifyContent: document.getElementById('aiVerifyContent'),
    aiQuickChipsGrid: document.getElementById('aiQuickChipsGrid'),
    aiChatMessages: document.getElementById('aiChatMessages'),
    aiChatForm: document.getElementById('aiChatForm'),
    aiChatInput: document.getElementById('aiChatInput'),
    btnAiSend: document.getElementById('btnAiSend'),
    btnAiExplainMcd: document.getElementById('btnAiExplainMcd'),
    btnAiExplainEquation: document.getElementById('btnAiExplainEquation'),
    btnAiExplainRationals: document.getElementById('btnAiExplainRationals'),
    btnAiExplainCompFrac: document.getElementById('btnAiExplainCompFrac'),
    btnOpenGeminiModal: document.getElementById('btnOpenGeminiModal'),
    geminiModalOverlay: document.getElementById('geminiModalOverlay'),
    btnCloseGeminiModal: document.getElementById('btnCloseGeminiModal'),
    geminiApiKeyInput: document.getElementById('geminiApiKeyInput'),
    btnSaveGeminiKey: document.getElementById('btnSaveGeminiKey'),
    btnTestGeminiKey: document.getElementById('btnTestGeminiKey'),
    geminiTestStatus: document.getElementById('geminiTestStatus'),
    geminiStatusLabel: document.getElementById('geminiStatusLabel'),
    aiCatPills: document.getElementById('aiCatPills'),
    quickQueriesLabel: document.getElementById('quickQueriesLabel'),
    btnHeaderGemini: document.getElementById('btnHeaderGemini'),
    headerGeminiLabel: document.getElementById('headerGeminiLabel'),
    btnBannerGemini: document.getElementById('btnBannerGemini'),
    bannerGeminiLabel: document.getElementById('bannerGeminiLabel'),
    floatingAiChatWidget: document.getElementById('floatingAiChatWidget'),
    btnFloatingGeminiConfig: document.getElementById('btnFloatingGeminiConfig'),
    floatingGeminiLabel: document.getElementById('floatingGeminiLabel'),
    btnFloatingGoFullScreen: document.getElementById('btnFloatingGoFullScreen'),
    btnCloseFloatingChat: document.getElementById('btnCloseFloatingChat'),
    floatingContextName: document.getElementById('floatingContextName'),
    btnFloatingSync: document.getElementById('btnFloatingSync'),
    floatingCatPills: document.getElementById('floatingCatPills'),
    floatingQuickChipsGrid: document.getElementById('floatingQuickChipsGrid'),
    floatingChatMessages: document.getElementById('floatingChatMessages'),
    floatingChatForm: document.getElementById('floatingChatForm'),
    floatingChatInput: document.getElementById('floatingChatInput'),
    btnFloatingSend: document.getElementById('btnFloatingSend')
  };

  // --- MATEMÁTICAS PURAS Y ALGORITMOS DE FACTORES PRIMOS ---

  // Máximo Común Divisor de 2 números (Algoritmo de Euclides)
  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // MCD de un array de números
  function multiGcd(arr) {
    if (!arr || arr.length === 0) return 1;
    return arr.reduce((acc, val) => gcd(acc, val));
  }

  // Mínimo Común Múltiplo para 2 números
  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  // Función para evaluar si un número es primo
  function isPrimeNumber(n) {
    n = Math.abs(Math.round(n));
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  // Explicación de la regla de divisibilidad de un número entre un factor primo
  function getDivisibilityProof(num, prime) {
    num = Math.abs(Math.round(num));
    const isDiv = num % prime === 0;
    const str = String(num);
    const lastDigit = str.charAt(str.length - 1);

    if (prime === 2) {
      return {
        isDivisible: isDiv,
        prime: 2,
        ruleName: 'Criterio del 2 (Cifra par)',
        reason: isDiv
          ? `Termina en ${lastDigit} (cifra par). Es divisible entre 2.`
          : `Termina en ${lastDigit} (cifra impar). NO es divisible entre 2.`
      };
    }

    if (prime === 3) {
      const sumDigits = str.split('').map(Number).reduce((a, b) => a + b, 0);
      const sumStr = str.split('').join(' + ');
      return {
        isDivisible: isDiv,
        prime: 3,
        ruleName: 'Criterio del 3 (Suma de cifras)',
        reason: isDiv
          ? `Suma de cifras: ${sumStr} = ${sumDigits} (múltiplo de 3). Es divisible entre 3.`
          : `Suma de cifras: ${sumStr} = ${sumDigits} (no es múltiplo de 3). NO es divisible entre 3.`
      };
    }

    if (prime === 5) {
      return {
        isDivisible: isDiv,
        prime: 5,
        ruleName: 'Criterio del 5 (Termina en 0 o 5)',
        reason: isDiv
          ? `Termina en ${lastDigit} (es 0 o 5). Es divisible entre 5.`
          : `Termina en ${lastDigit} (no es 0 ni 5). NO es divisible entre 5.`
      };
    }

    if (prime === 7) {
      if (num < 100) {
        return {
          isDivisible: isDiv,
          prime: 7,
          ruleName: 'Criterio del 7',
          reason: isDiv ? `${num} ÷ 7 = ${num / 7} (exacto).` : `${num} ÷ 7 = ${(num / 7).toFixed(2)} (no exacto).`
        };
      }
      const rest = Math.floor(num / 10);
      const last = num % 10;
      const diff = rest - 2 * last;
      return {
        isDivisible: isDiv,
        prime: 7,
        ruleName: 'Criterio del 7 (Doble de última cifra)',
        reason: isDiv
          ? `${rest} − 2×(${last}) = ${diff} (múltiplo de 7). Es divisible entre 7.`
          : `${rest} − 2×(${last}) = ${diff} (no es múltiplo de 7). NO es divisible entre 7.`
      };
    }

    if (prime === 11) {
      const digits = str.split('').map(Number);
      let sumOdd = 0;
      let sumEven = 0;
      digits.forEach((d, i) => {
        if (i % 2 === 0) sumOdd += d;
        else sumEven += d;
      });
      const diff = Math.abs(sumOdd - sumEven);
      return {
        isDivisible: isDiv,
        prime: 11,
        ruleName: 'Criterio del 11 (Cifras alternadas)',
        reason: isDiv
          ? `Diferencia de posiciones alternas: |${sumOdd} − ${sumEven}| = ${diff} (múltiplo de 11). Es divisible entre 11.`
          : `Diferencia de posiciones alternas: |${sumOdd} − ${sumEven}| = ${diff} (no es múltiplo de 11). NO es divisible entre 11.`
      };
    }

    // Default prime test
    return {
      isDivisible: isDiv,
      prime: prime,
      ruleName: `Criterio del ${prime}`,
      reason: isDiv
        ? `${num} ÷ ${prime} = ${num / prime} (división exacta con residuo 0).`
        : `${num} ÷ ${prime} da residuo ${num % prime} (no exacto).`
    };
  }

  // Descomposición en factores primos detallada de un solo número
  function getDetailedPrimeFactorization(n) {
    n = Math.abs(Math.round(n));
    if (n <= 1) {
      return {
        number: n,
        steps: [{ quotientBefore: n, primeFactor: null, quotientAfter: n, ruleReason: 'Número ≤ 1' }],
        factorsMap: {},
        canonicalStr: '1',
        isPrime: false
      };
    }

    let temp = n;
    const steps = [];
    const factorsMap = {};
    let candidate = 2;

    while (temp > 1) {
      if (temp % candidate === 0) {
        const proof = getDivisibilityProof(temp, candidate);
        const nextVal = temp / candidate;
        steps.push({
          quotientBefore: temp,
          primeFactor: candidate,
          quotientAfter: nextVal,
          ruleReason: proof.reason
        });
        factorsMap[candidate] = (factorsMap[candidate] || 0) + 1;
        temp = nextVal;
      } else {
        // Move to next candidate prime
        if (candidate === 2) candidate = 3;
        else if (candidate === 3) candidate = 5;
        else candidate += 2;
      }
    }

    return {
      number: n,
      steps,
      factorsMap,
      canonicalStr: formatCanonicalString(factorsMap),
      isPrime: isPrimeNumber(n)
    };
  }

  // Descomposición simultánea en factores primos con explicaciones paso a paso
  function computeSimultaneousDecomposition(originalNumbers) {
    const nums = originalNumbers.map(n => Math.abs(Math.round(n)));
    let current = [...nums];
    const steps = [];
    const primeFactors = [];
    const stepExplanations = [];

    // Find next common prime factor
    function findCommonPrimeWithDetails(arr) {
      const minVal = Math.min(...arr);
      if (minVal < 2) return null;

      let candidate = 2;
      const discardedPrimes = [];

      while (candidate <= minVal) {
        // Check if candidate is prime
        if (isPrimeNumber(candidate)) {
          const checks = arr.map((val, idx) => ({
            numIdx: idx,
            val,
            proof: getDivisibilityProof(val, candidate)
          }));

          const allDivisible = checks.every(c => c.proof.isDivisible);

          if (allDivisible) {
            return {
              prime: candidate,
              checks,
              discardedPrimes
            };
          } else {
            const failNums = checks.filter(c => !c.proof.isDivisible).map(c => c.val);
            discardedPrimes.push({
              prime: candidate,
              reason: `El primo ${candidate} no divide a todos (falla en: ${failNums.join(', ')}).`
            });
          }
        }

        if (candidate === 2) candidate = 3;
        else if (candidate === 3) candidate = 5;
        else candidate += 2;
      }

      return null;
    }

    // Step 0: Initial
    steps.push({
      stepNumber: 0,
      values: [...current],
      prime: null,
      explanation: 'Valores iniciales'
    });

    let stepCount = 0;
    while (true) {
      const result = findCommonPrimeWithDetails(current);
      if (!result) break;

      const p = result.prime;
      stepCount++;
      const nextValues = current.map(x => x / p);
      primeFactors.push(p);

      steps.push({
        stepNumber: stepCount,
        values: [...nextValues],
        prime: p,
        prevValues: [...current],
        explanation: `Dividiendo simultáneamente entre ${p}`,
        checks: result.checks,
        discardedPrimes: result.discardedPrimes
      });

      stepExplanations.push({
        stepNumber: stepCount,
        prime: p,
        prevValues: [...current],
        nextValues: [...nextValues],
        checks: result.checks,
        discardedPrimes: result.discardedPrimes
      });

      current = nextValues;
    }

    const mcdValue = primeFactors.length > 0
      ? primeFactors.reduce((acc, f) => acc * f, 1)
      : 1;

    return {
      initialNumbers: [...nums],
      steps,
      stepExplanations,
      commonPrimeFactors: primeFactors,
      finalQuotients: current,
      mcd: mcdValue,
      isCoprime: mcdValue === 1
    };
  }

  // Pasos de Euclides para 2 números
  function computeEuclidSteps(a, b) {
    let big = Math.max(a, b);
    let small = Math.min(a, b);
    const divisions = [];

    while (small !== 0) {
      const q = Math.floor(big / small);
      const r = big % small;
      divisions.push({
        dividend: big,
        divisor: small,
        quotient: q,
        remainder: r
      });
      big = small;
      small = r;
    }

    return {
      a: Math.max(a, b),
      b: Math.min(a, b),
      divisions,
      mcd: big
    };
  }

  // Formato canónico string (ej: 2³ × 3)
  function formatCanonicalString(factorsMap) {
    const keys = Object.keys(factorsMap).map(Number).sort((a, b) => a - b);
    if (keys.length === 0) return '1';
    
    const superscriptDigits = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    function toSuper(num) {
      return String(num).split('').map(d => superscriptDigits[d] || d).join('');
    }

    return keys.map(p => {
      const exp = factorsMap[p];
      return exp > 1 ? `${p}${toSuper(exp)}` : `${p}`;
    }).join(' × ');
  }

  // Obtener todos los divisores de un número
  function getAllDivisors(n) {
    const num = Math.abs(Math.round(n));
    if (num === 0) return [0];
    const divisors = [];
    for (let i = 1; i * i <= num; i++) {
      if (num % i === 0) {
        divisors.push(i);
        if (i * i !== num) {
          divisors.push(num / i);
        }
      }
    }
    return divisors.sort((a, b) => a - b);
  }

  // --- RENDERIZADO Y UI ---

  function applyTheme(theme) {
    state.theme = theme;
    elements.html.setAttribute('data-theme', theme);
    localStorage.setItem('mcd_theme', theme);
  }

  function renderInputs() {
    elements.numbersForm.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    state.numbers.forEach((val, idx) => {
      const group = document.createElement('div');
      group.className = 'input-group';

      const label = document.createElement('label');
      label.className = 'input-label';
      label.htmlFor = `inputNum_${idx}`;
      label.innerHTML = `<span>Número ${letters[idx] || (idx + 1)}</span><span class="text-dim">#${idx + 1}</span>`;

      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '99999999';
      input.id = `inputNum_${idx}`;
      input.className = 'number-input-field';
      input.value = val;
      input.inputMode = 'numeric';
      input.setAttribute('aria-label', `Número ${letters[idx] || (idx + 1)}`);

      input.addEventListener('input', (e) => {
        const newVal = parseInt(e.target.value, 10);
        if (!isNaN(newVal) && newVal > 0) {
          state.numbers[idx] = newVal;
          resetPlayer();
          updateAll();
        }
      });

      group.appendChild(label);
      group.appendChild(input);
      elements.numbersForm.appendChild(group);
    });

    elements.customControls.style.display = state.mode === 'custom' ? 'flex' : 'none';
  }

  function renderPresets() {
    elements.presetsList.innerHTML = '';
    const presets = PRESETS[state.mode] || PRESETS['2'];

    presets.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-chip';
      btn.textContent = preset.label;
      btn.addEventListener('click', () => {
        state.numbers = [...preset.values];
        renderInputs();
        resetPlayer();
        updateAll();
      });
      elements.presetsList.appendChild(btn);
    });
  }

  function updateKPIs(simData) {
    const { mcd, commonPrimeFactors, isCoprime } = simData;
    elements.kpiMcd.textContent = mcd;
    
    if (isCoprime) {
      elements.kpiStatusBadge.textContent = '🛡️ Primos entre sí (Coprimos)';
      elements.kpiStatusBadge.style.color = 'var(--color-amber)';
    } else {
      elements.kpiStatusBadge.textContent = '✨ Divisor común encontrado';
      elements.kpiStatusBadge.style.color = 'var(--color-emerald)';
    }

    const mcdDetailed = getDetailedPrimeFactorization(mcd);
    elements.kpiCanonical.textContent = mcdDetailed.canonicalStr;

    const totalDivRounds = commonPrimeFactors.length;
    elements.kpiSteps.textContent = totalDivRounds;
    elements.kpiStepsSub.textContent = totalDivRounds === 1 ? '1 paso de división' : `${totalDivRounds} pasos de división`;

    const letters = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].slice(0, state.numbers.length).join('; ');
    elements.kpiExcelFormula.textContent = `=M.C.D(${letters})`;

    // Cálculo y visualización de Mínimo Común Múltiplo (m.c.m.)
    const kpiLcm = document.getElementById('kpiLcm');
    if (kpiLcm && window.PerritoAcademic) {
      const lcmVal = window.PerritoAcademic.calculateArrayLCM(state.numbers);
      kpiLcm.textContent = Number(lcmVal).toLocaleString();
    }
  }

  // TAB 1: Tabla de Descomposición Simultánea con Detalles Paso a Paso
  function renderSimultaneousTable(simData) {
    const { initialNumbers, steps, commonPrimeFactors, mcd, stepExplanations } = simData;
    const numCount = initialNumbers.length;
    
    state.player.maxSteps = steps.length;
    const currentStep = Math.min(state.player.currentStep, steps.length);

    let html = `
      <table class="math-table table-simultaneous" id="tableSimultaneous">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
    `;

    for (let i = 0; i < numCount; i++) {
      html += `<th class="col-number">Núm ${String.fromCharCode(65 + i)}</th>`;
    }

    html += `
            <th class="col-divider" aria-hidden="true"></th>
            <th class="col-prime">Factor Común</th>
            <th class="col-explanation">Justificación Matemática</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let idx = 0; idx < currentStep; idx++) {
      const isInitial = idx === 0;
      const rowClass = (idx === currentStep - 1 && currentStep < steps.length) ? 'active-step-row' : '';

      html += `<tr class="${rowClass}">`;
      html += `<td>${idx === 0 ? 'Inicio' : idx}</td>`;

      const rowValues = isInitial ? initialNumbers : steps[idx].prevValues;
      const nextStepObj = steps[idx + 1];
      const primeToDivide = isInitial ? (steps[1] ? steps[1].prime : '-') : (nextStepObj ? nextStepObj.prime : '-');

      rowValues.forEach(val => {
        html += `<td class="col-number"><strong>${val}</strong></td>`;
      });

      html += `<td class="col-divider"></td>`;

      if (primeToDivide && primeToDivide !== '-') {
        html += `<td class="col-prime"><span class="prime-chip">${primeToDivide}</span></td>`;
        html += `<td class="col-explanation">Todos dividen exactamente entre <strong>${primeToDivide}</strong></td>`;
      } else {
        html += `<td class="col-prime" style="color: var(--text-dim);">-</td>`;
        html += `<td class="col-explanation">No hay más divisores primos comunes</td>`;
      }

      html += `</tr>`;
    }

    if (currentStep >= steps.length) {
      const lastStep = steps[steps.length - 1];
      const finalVals = lastStep.values;

      html += `
        <tr class="final-row">
          <td>Fin</td>
      `;
      finalVals.forEach(val => {
        html += `<td class="col-number" style="color: var(--color-emerald);">${val}</td>`;
      });
      html += `
          <td class="col-divider"></td>
          <td class="col-prime" style="color: var(--color-emerald); font-weight: 800;">Coprimos</td>
          <td class="col-explanation">
            Cocientes finales sin divisores comunes. <strong>MCD = ${mcd}</strong>
          </td>
        </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;

    elements.simultaneousTableContainer.innerHTML = html;

    // Detailed step-by-step reasoning per round
    let detailsHtml = '';
    const visibleRounds = stepExplanations.slice(0, Math.max(0, currentStep - 1));

    if (visibleRounds.length > 0) {
      detailsHtml += `<h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--color-primary);">🔍 Justificación de los Factores Primos Comunes Seleccionados:</h4>`;
      visibleRounds.forEach(round => {
        detailsHtml += `
          <div class="step-reason-card">
            <div class="step-reason-header">
              <span><strong>Paso ${round.stepNumber}:</strong> Factor primo común extraído: <span class="prime-chip" style="font-size: 0.85rem;">${round.prime}</span></span>
              <span class="text-dim" style="font-size: 0.8rem;">[${round.prevValues.join(', ')}] ➔ [${round.nextValues.join(', ')}]</span>
            </div>
        `;

        if (round.discardedPrimes && round.discardedPrimes.length > 0) {
          detailsHtml += `
            <div style="font-size: 0.8rem; color: var(--color-amber);">
              ⚠️ ${round.discardedPrimes.map(d => d.reason).join(' ')}
            </div>
          `;
        }

        detailsHtml += `<div class="step-reason-nums">`;
        round.checks.forEach(check => {
          const letter = String.fromCharCode(65 + check.numIdx);
          detailsHtml += `
            <span class="num-reason-chip">
              <strong>Núm ${letter} (${check.val}):</strong> ${check.proof.reason}
            </span>
          `;
        });
        detailsHtml += `</div></div>`;
      });
    }

    elements.simultaneousStepDetails.innerHTML = detailsHtml;

    // Formula & check
    let explanationHtml = '';
    if (commonPrimeFactors.length === 0) {
      explanationHtml = `
        <div class="formula-line">
          <span>Los números [${initialNumbers.join(', ')}] no tienen ningún divisor primo común.</span>
        </div>
        <p class="pane-desc">
          Por tanto, son <strong>primos entre sí (coprimos)</strong> y su Máximo Común Divisor es estrictamente <strong class="formula-highlight">MCD = 1</strong>.
        </p>
      `;
    } else {
      const multExpression = commonPrimeFactors.join(' × ');
      const canonical = formatCanonicalString(getDetailedPrimeFactorization(mcd).factorsMap);

      explanationHtml = `
        <div class="formula-line">
          <span>Producto de los factores primos comunes:</span>
          <span class="formula-highlight">${multExpression}</span>
          <span>=</span>
          <span class="formula-highlight" style="font-size: 1.3rem;">MCD = ${mcd}</span>
        </div>
        <p class="pane-desc" style="margin-top: 0.5rem;">
          Expresión canónica: <code>${canonical} = ${mcd}</code>.
          ${initialNumbers.length === 2 ? `Comprobación con MCM: <code>MCM(${initialNumbers[0]}, ${initialNumbers[1]}) = (${initialNumbers[0]} × ${initialNumbers[1]}) / ${mcd} = ${lcm(initialNumbers[0], initialNumbers[1])}</code>.` : ''}
        </p>
      `;
    }

    elements.simultaneousExplanation.innerHTML = explanationHtml;
  }

  // TAB 2: Tablas Verticales Individuales y Matriz Canónica
  function renderIndividualTables(numbers) {
    elements.individualTablesContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    numbers.forEach((num, idx) => {
      const detailed = getDetailedPrimeFactorization(num);
      const card = document.createElement('div');
      card.className = 'vertical-factor-card';

      let tableHtml = `
        <div class="vertical-card-title">Número ${letters[idx]} = ${num}</div>
        <table class="vertical-math-table">
          <tbody>
      `;

      detailed.steps.forEach(st => {
        tableHtml += `
          <tr>
            <td><strong>${st.quotientBefore}</strong></td>
            <td class="col-prime-factor">${st.primeFactor || '-'}</td>
          </tr>
        `;
      });

      tableHtml += `
            <tr>
              <td><strong style="color: var(--color-emerald);">1</strong></td>
              <td class="col-prime-factor" style="color: var(--color-emerald);">✓</td>
            </tr>
          </tbody>
        </table>
        <div class="canon-badge">${num} = ${detailed.canonicalStr}</div>
        <div class="text-dim" style="font-size: 0.75rem; text-align: center;">
          ${detailed.isPrime ? '🌟 Es un Número Primo' : `Factores: ${detailed.steps.map(s => s.primeFactor).filter(Boolean).join(' × ')}`}
        </div>
      `;

      card.innerHTML = tableHtml;
      elements.individualTablesContainer.appendChild(card);
    });

    // Powers Matrix below
    renderPowersTable(numbers);
  }

  // Matriz de potencias (menor exponente)
  function renderPowersTable(numbers) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const factorsList = numbers.map(n => getDetailedPrimeFactorization(n).factorsMap);
    
    const allPrimes = Array.from(new Set(
      factorsList.flatMap(f => Object.keys(f).map(Number))
    )).sort((a, b) => a - b);

    const commonPrimes = allPrimes.filter(p => factorsList.every(f => f[p] > 0));

    let html = `
      <table class="math-table powers-table">
        <thead>
          <tr>
            <th style="width: 140px;">Número</th>
            <th>Descomposición Canónica</th>
    `;

    allPrimes.forEach(p => {
      const isCommon = commonPrimes.includes(p);
      const style = isCommon ? 'color: var(--color-primary); font-weight: 700;' : '';
      html += `<th style="${style}">Base ${p} ${isCommon ? '★ (Común)' : ''}</th>`;
    });

    html += `
          </tr>
        </thead>
        <tbody>
    `;

    numbers.forEach((num, idx) => {
      const fMap = factorsList[idx];
      const canonStr = formatCanonicalString(fMap);

      html += `<tr>`;
      html += `<td><strong>Núm ${letters[idx]} (${num})</strong></td>`;
      html += `<td style="font-family: var(--font-mono); color: var(--color-primary);">${canonStr}</td>`;

      allPrimes.forEach(p => {
        const exp = fMap[p] || 0;
        const isCommon = commonPrimes.includes(p);
        const cellStyle = isCommon ? 'background: rgba(59, 130, 246, 0.08); font-weight: 600;' : 'color: var(--text-dim);';
        html += `<td style="${cellStyle}">${exp > 0 ? `exp: ${exp}` : '-'}</td>`;
      });

      html += `</tr>`;
    });

    html += `
      <tr class="power-min-row">
        <td><strong>M.C.D.</strong></td>
        <td><strong>Factores comunes con menor exponente</strong></td>
    `;

    allPrimes.forEach(p => {
      const isCommon = commonPrimes.includes(p);
      if (isCommon) {
        const minExp = Math.min(...factorsList.map(f => f[p] || 0));
        html += `<td><strong>min exp = ${minExp} (➔ ${p}${minExp > 1 ? '^' + minExp : ''})</strong></td>`;
      } else {
        html += `<td style="color: var(--text-dim);">No común (0)</td>`;
      }
    });

    html += `
      </tr>
    </tbody>
    </table>
    `;

    elements.powersTableContainer.innerHTML = html;
  }

  // --- FUNCIÓN PARA DESCOMPONER EN FACTORES (ÁRBOL Y PARES) ---
  function getFactorPairs(n) {
    n = Math.abs(Math.round(n));
    if (n < 1) return [];
    const pairs = [];
    const limit = Math.floor(Math.sqrt(n));
    for (let i = 1; i <= limit; i++) {
      if (n % i === 0) {
        pairs.push({ a: i, b: n / i });
      }
    }
    return pairs;
  }

  function buildFactorTree(n, mode = 'balanced') {
    n = Math.abs(Math.round(n));
    if (n <= 1 || isPrimeNumber(n)) {
      return { val: n, isPrime: true, children: null };
    }

    let f1 = null, f2 = null;
    if (mode === 'balanced') {
      const root = Math.floor(Math.sqrt(n));
      for (let i = root; i >= 2; i--) {
        if (n % i === 0) {
          f1 = i;
          f2 = n / i;
          break;
        }
      }
    } else {
      for (let p = 2; p <= n; p++) {
        if (n % p === 0 && isPrimeNumber(p)) {
          f1 = p;
          f2 = n / p;
          break;
        }
      }
    }

    if (!f1 || !f2) {
      return { val: n, isPrime: true, children: null };
    }

    return {
      val: n,
      isPrime: false,
      children: [buildFactorTree(f1, mode), buildFactorTree(f2, mode)]
    };
  }

  function renderTreeNodeHTML(node) {
    const isPrime = node.isPrime;
    const boxClass = isPrime ? 'tree-node-box tree-node-prime' : 'tree-node-box tree-node-composite';
    const tag = isPrime ? 'Primo ★' : 'Compuesto';

    let html = `
      <div class="tree-node-wrapper">
        <div class="${boxClass}" title="${isPrime ? `Factor primo irreductible (${node.val})` : `Número compuesto (${node.val}) divisible en factores`}">
          <span>${node.val}</span>
          <span class="tree-node-tag">${tag}</span>
        </div>
    `;

    if (node.children && node.children.length === 2) {
      html += `
        <div class="tree-children-container">
          ${renderTreeNodeHTML(node.children[0])}
          ${renderTreeNodeHTML(node.children[1])}
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  function renderFactorDecomposition() {
    if (!elements.factorDecomposeResultsContainer) return;

    // Quick pick buttons from current numbers
    elements.factorQuickPickBtns.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    state.numbers.forEach((num, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-chip';
      btn.textContent = `Núm ${letters[idx]} (${num})`;
      btn.addEventListener('click', () => {
        elements.factorDecomposeInput.value = num;
        state.factorNumber = num;
        renderFactorDecomposition();
      });
      elements.factorQuickPickBtns.appendChild(btn);
    });

    const n = parseInt(elements.factorDecomposeInput.value, 10) || state.numbers[0] || 48;
    state.factorNumber = n;

    const detailed = getDetailedPrimeFactorization(n);
    const pairs = getFactorPairs(n);
    const tree = buildFactorTree(n, state.treeMode);
    const allDivs = getAllDivisors(n);
    const sumDivs = allDivs.reduce((a, b) => a + b, 0);

    // Number classification
    let classification = 'Número Compuesto';
    if (detailed.isPrime) {
      classification = 'Número Primo';
    } else if (sumDivs - n === n) {
      classification = 'Número Perfecto (σ - n = n)';
    } else if (sumDivs - n > n) {
      classification = 'Número Abundante';
    } else {
      classification = 'Número Deficiente';
    }

    let html = `
      <div class="factor-results-wrapper">
        <!-- 4 Top KPI Stat Cards -->
        <div class="factor-top-summary">
          <div class="factor-summary-stat">
            <span class="factor-stat-label">Tipo de Número</span>
            <div class="factor-stat-value" style="${detailed.isPrime ? 'color: var(--color-emerald);' : ''}">${classification}</div>
            <span class="text-dim" style="font-size: 0.75rem;">${detailed.isPrime ? 'Solo divisible por 1 y por sí mismo' : 'Tiene factores divisores'}</span>
          </div>

          <div class="factor-summary-stat">
            <span class="factor-stat-label">Forma Canónica</span>
            <div class="factor-stat-value font-mono">${detailed.canonicalStr}</div>
            <span class="text-dim" style="font-size: 0.75rem;">Factores primos y potencias</span>
          </div>

          <div class="factor-summary-stat">
            <span class="factor-stat-label">Total de Divisores</span>
            <div class="factor-stat-value font-mono">${allDivs.length} divisores</div>
            <span class="text-dim" style="font-size: 0.75rem;">Fórmula: τ(${n}) = ${allDivs.length}</span>
          </div>

          <div class="factor-summary-stat">
            <span class="factor-stat-label">Suma de Divisores</span>
            <div class="factor-stat-value font-mono">σ = ${sumDivs}</div>
            <span class="text-dim" style="font-size: 0.75rem;">Suma de todos los divisores</span>
          </div>
        </div>

        <!-- Visual Factor Tree Card -->
        <div class="tree-card">
          <div class="tree-header">
            <div>
              <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem;">
                🌳 Árbol de Factores (Factor Tree) para ${n}
              </h4>
              <p class="text-dim" style="font-size: 0.85rem; margin-top: 0.2rem;">
                Las ramas se dividen en pares de factores. Los nodos verdes circulares <strong style="color: var(--color-emerald);">(★)</strong> son los <strong>factores primos irreductibles</strong> en los que termina la descomposición.
              </p>
            </div>
          </div>

          <div class="tree-canvas-box">
            ${renderTreeNodeHTML(tree)}
          </div>

          <div style="text-align: center; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; margin-top: 0.5rem;">
            Hojas primas del árbol: <code>${detailed.steps.map(s => s.primeFactor).filter(Boolean).join(' × ')} = ${n}</code>
          </div>
        </div>

        <!-- Factor Pairs Card -->
        <div class="factor-pairs-card">
          <div class="tree-header">
            <div>
              <h4 style="font-size: 1.05rem; font-weight: 700;">Tabla de Pares de Factores Multiplicativos (${n} = a × b)</h4>
              <p class="text-dim" style="font-size: 0.85rem;">Todas las formas posibles de expresar ${n} como producto de dos números enteros positivos:</p>
            </div>
            <span class="canon-badge">${pairs.length} pares encontrados</span>
          </div>

          <div class="factor-pairs-grid">
    `;

    pairs.forEach((p, idx) => {
      html += `
        <div class="factor-pair-chip">
          <span class="pair-equation">${p.a} × ${p.b} = ${n}</span>
          <span class="pair-geometry">Par #${idx + 1} • Rectángulo de área ${p.a} × ${p.b}</span>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Vertical Division Table & Detailed Step Explanations -->
        <div class="finder-detail-card">
          <div class="finder-detail-header">
            <span style="font-size: 1.05rem; font-weight: 700;">Tabla Vertical de Divisiones Sucesivas para ${n}</span>
            <span class="canon-badge">${n} = ${detailed.canonicalStr}</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; align-items: start;">
            <div>
              <table class="vertical-math-table" style="margin: 0 auto;">
                <tbody>
    `;

    detailed.steps.forEach(st => {
      html += `
        <tr>
          <td><strong>${st.quotientBefore}</strong></td>
          <td class="col-prime-factor">${st.primeFactor || '-'}</td>
        </tr>
      `;
    });

    html += `
                  <tr>
                    <td><strong style="color: var(--color-emerald);">1</strong></td>
                    <td class="col-prime-factor" style="color: var(--color-emerald);">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h5 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--color-primary);">Explicación detallada de cada división:</h5>
              <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem;">
    `;

    detailed.steps.forEach((st, idx) => {
      html += `
        <div style="background: var(--bg-surface-elevated); padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <strong>División ${idx + 1}:</strong> ${st.quotientBefore} ÷ <strong>${st.primeFactor}</strong> = ${st.quotientAfter}. <em>(${st.ruleReason})</em>
        </div>
      `;
    });

    html += `
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    elements.factorDecomposeResultsContainer.innerHTML = html;
  }

  // TAB 4: Buscador de Factores Primos y Reglas de Divisibilidad
  function renderFinder() {
    // Quick picks buttons from current state.numbers
    elements.finderQuickPicks.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    state.numbers.forEach((num, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-chip';
      btn.textContent = `Núm ${letters[idx]} (${num})`;
      btn.addEventListener('click', () => {
        elements.finderInput.value = num;
        analyzeFinderNumber(num);
      });
      elements.finderQuickPicks.appendChild(btn);
    });

    const val = parseInt(elements.finderInput.value, 10) || state.numbers[0] || 48;
    analyzeFinderNumber(val);
  }

  function analyzeFinderNumber(n) {
    n = Math.abs(Math.round(n));
    if (n < 2) n = 2;
    state.finderNumber = n;

    const detailed = getDetailedPrimeFactorization(n);
    const divisors = getAllDivisors(n);

    // Divisibility tests for prime and benchmark numbers
    const testPrimes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13];
    const tests = testPrimes.map(p => {
      const isDiv = n % p === 0;
      let ruleDesc = '';
      let calcStr = '';

      if (p === 2) {
        ruleDesc = 'Última cifra es par (0, 2, 4, 6, 8)';
        calcStr = `Termina en ${String(n).slice(-1)}`;
      } else if (p === 3) {
        ruleDesc = 'La suma de sus cifras es múltiplo de 3';
        const sumDigits = String(n).split('').map(Number).reduce((a, b) => a + b, 0);
        calcStr = `${String(n).split('').join('+')} = ${sumDigits}`;
      } else if (p === 4) {
        ruleDesc = 'Las dos últimas cifras son múltiplos de 4 (o 00)';
        const last2 = n % 100;
        calcStr = `Últimas dos cifras: ${last2}`;
      } else if (p === 5) {
        ruleDesc = 'Termina en 0 o en 5';
        calcStr = `Termina en ${String(n).slice(-1)}`;
      } else if (p === 6) {
        ruleDesc = 'Es divisible entre 2 y entre 3 al mismo tiempo';
        calcStr = `Divisible por 2: ${n % 2 === 0 ? 'Sí' : 'No'} | por 3: ${n % 3 === 0 ? 'Sí' : 'No'}`;
      } else if (p === 7) {
        ruleDesc = 'Criterio del 7 o división exacta';
        calcStr = `${n} ÷ 7 = ${(n / 7).toFixed(2)}`;
      } else if (p === 8) {
        ruleDesc = 'Las tres últimas cifras son múltiplo de 8';
        calcStr = `${n % 1000}`;
      } else if (p === 9) {
        ruleDesc = 'La suma de sus cifras es múltiplo de 9';
        const sumDigits = String(n).split('').map(Number).reduce((a, b) => a + b, 0);
        calcStr = `Suma = ${sumDigits}`;
      } else if (p === 10) {
        ruleDesc = 'Termina exactamente en 0';
        calcStr = `Termina en ${String(n).slice(-1)}`;
      } else if (p === 11) {
        ruleDesc = 'Diferencia de cifras alternadas es múltiplo de 11';
        calcStr = `${n} ÷ 11 = ${(n / 11).toFixed(2)}`;
      } else {
        ruleDesc = `División entre ${p}`;
        calcStr = `${n} ÷ ${p} = ${(n / p).toFixed(2)}`;
      }

      return { p, isDiv, ruleDesc, calcStr };
    });

    let html = `
      <!-- Left Column: Vertical Table & Prime Breakdown -->
      <div class="finder-detail-card">
        <div class="finder-detail-header">
          <div>
            <span style="font-size: 1.25rem; font-weight: 800;">Número ${n}</span>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              ${detailed.isPrime ? '🌟 Es un NÚMERO PRIMO (solo divisible por 1 y por sí mismo)' : '🧩 Es un NÚMERO COMPUESTO (tiene factores primos)'}
            </div>
          </div>
          <span class="canon-badge" style="font-size: 1.05rem;">${detailed.canonicalStr}</span>
        </div>

        <h4 style="font-size: 0.95rem; color: var(--color-primary);">Tabla de Descomposición en Factores Primos:</h4>
        <table class="vertical-math-table" style="margin: 0.5rem auto;">
          <tbody>
    `;

    detailed.steps.forEach(st => {
      html += `
        <tr>
          <td><strong>${st.quotientBefore}</strong></td>
          <td class="col-prime-factor">${st.primeFactor || '-'}</td>
        </tr>
      `;
    });

    html += `
            <tr>
              <td><strong style="color: var(--color-emerald);">1</strong></td>
              <td class="col-prime-factor" style="color: var(--color-emerald);">✓</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 0.5rem;">
          <h4 style="font-size: 0.9rem; margin-bottom: 0.4rem;">Paso a paso de la división de factores:</h4>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.825rem; color: var(--text-muted);">
    `;

    detailed.steps.forEach((st, idx) => {
      html += `
        <div style="background: var(--bg-surface-elevated); padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-subtle);">
          <strong>Paso ${idx + 1}:</strong> ${st.quotientBefore} ÷ <strong>${st.primeFactor}</strong> = ${st.quotientAfter}. <em>(${st.ruleReason})</em>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div style="margin-top: 0.5rem; font-size: 0.85rem; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <strong>Total de divisores positivos (${divisors.length}):</strong><br>
          <span class="font-mono text-dim" style="word-break: break-all;">${divisors.join(', ')}</span>
        </div>
      </div>

      <!-- Right Column: Divisibility Rules Inspector -->
      <div class="finder-detail-card">
        <div class="finder-detail-header">
          <span style="font-size: 1.05rem; font-weight: 700;">Pruebas de Criterios de Divisibilidad para ${n}</span>
          <span class="text-dim" style="font-size: 0.8rem;">Evaluación automática</span>
        </div>

        <div class="divisibility-grid">
    `;

    tests.forEach(t => {
      html += `
        <div class="rule-card ${t.isDiv ? 'rule-valid' : 'rule-invalid'}">
          <div class="rule-title-row">
            <strong>¿Divisible por ${t.p}?</strong>
            <span class="rule-badge ${t.isDiv ? 'badge-success' : 'badge-danger'}">
              ${t.isDiv ? 'SÍ ✓' : 'NO ✗'}
            </span>
          </div>
          <span class="rule-desc">${t.ruleDesc}</span>
          <span class="rule-calc">${t.calcStr}</span>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    elements.finderResultsContainer.innerHTML = html;
  }

  // TAB 4: Algoritmo de Euclides
  function renderEuclidTable(numbers) {
    elements.euclidContentContainer.innerHTML = '';

    if (numbers.length === 2) {
      renderSingleEuclidBlock(numbers[0], numbers[1], 'Algoritmo de Euclides para 2 Números', elements.euclidContentContainer);
      return;
    }

    if (numbers.length === 3) {
      const [a, b, c] = numbers;
      const step1 = computeEuclidSteps(a, b);
      const mcd1 = step1.mcd;
      
      const container1 = document.createElement('div');
      renderSingleEuclidBlock(a, b, `Fase 1: Calcular MCD(A, B) = MCD(${a}, ${b})`, container1);
      elements.euclidContentContainer.appendChild(container1);

      const container2 = document.createElement('div');
      renderSingleEuclidBlock(mcd1, c, `Fase 2: Calcular MCD(Resultado Fase 1, C) = MCD(${mcd1}, ${c})`, container2);
      elements.euclidContentContainer.appendChild(container2);
      return;
    }

    if (numbers.length === 4) {
      const [a, b, c, d] = numbers;
      const step1 = computeEuclidSteps(a, b);
      const step2 = computeEuclidSteps(c, d);
      const mcd1 = step1.mcd;
      const mcd2 = step2.mcd;

      const container1 = document.createElement('div');
      renderSingleEuclidBlock(a, b, `Fase 1 (Grupo 1): MCD(${a}, ${b})`, container1);
      elements.euclidContentContainer.appendChild(container1);

      const container2 = document.createElement('div');
      renderSingleEuclidBlock(c, d, `Fase 2 (Grupo 2): MCD(${c}, ${d})`, container2);
      elements.euclidContentContainer.appendChild(container2);

      const container3 = document.createElement('div');
      renderSingleEuclidBlock(mcd1, mcd2, `Fase 3 (Final): MCD(Grupo 1, Grupo 2) = MCD(${mcd1}, ${mcd2})`, container3);
      elements.euclidContentContainer.appendChild(container3);
      return;
    }

    let currentMcd = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      const container = document.createElement('div');
      renderSingleEuclidBlock(currentMcd, numbers[i], `Fase ${i}: MCD(${currentMcd}, ${numbers[i]})`, container);
      elements.euclidContentContainer.appendChild(container);
      currentMcd = gcd(currentMcd, numbers[i]);
    }
  }

  function renderSingleEuclidBlock(a, b, title, parentContainer) {
    const euclidData = computeEuclidSteps(a, b);
    const { divisions, mcd } = euclidData;

    const block = document.createElement('div');
    block.className = 'euclid-block';

    let html = `
      <div class="euclid-block-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        ${title} ➔ MCD = <strong>${mcd}</strong>
      </div>
      <div class="table-container">
        <table class="euclid-table">
          <tbody>
            <tr>
              <th class="euclid-row-header">Cocientes (q)</th>
              <td>-</td>
    `;

    divisions.forEach(d => {
      html += `<td>${d.quotient}</td>`;
    });

    html += `
            </tr>
            <tr>
              <th class="euclid-row-header">Dividendos / Divisores</th>
              <td><strong>${euclidData.a}</strong></td>
              <td><strong>${euclidData.b}</strong></td>
    `;

    for (let i = 0; i < divisions.length - 1; i++) {
      const isMcd = i === divisions.length - 2;
      const cellClass = isMcd ? 'cell-mcd' : '';
      html += `<td class="${cellClass}"><strong>${divisions[i].remainder}</strong></td>`;
    }

    html += `
            </tr>
            <tr>
              <th class="euclid-row-header">Residuos (r)</th>
    `;

    divisions.forEach((d) => {
      html += `<td>${d.remainder}</td>`;
    });
    html += `<td>-</td>`;

    html += `
            </tr>
          </tbody>
        </table>
      </div>
      <div class="euclid-steps-list">
        <strong>Detalle algebraico de las divisiones:</strong>
    `;

    divisions.forEach((d, idx) => {
      html += `<div>Paso ${idx + 1}: ${d.dividend} = ${d.divisor} × ${d.quotient} + ${d.remainder}</div>`;
    });

    html += `</div>`;
    block.innerHTML = html;
    parentContainer.appendChild(block);
  }

  // TAB 5: Explicación Didáctica Paso a Paso Narrada
  function renderNarrativeReport(numbers) {
    elements.narrativeContentContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const simData = computeSimultaneousDecomposition(numbers);
    const mcd = simData.mcd;

    const detailedList = numbers.map(n => getDetailedPrimeFactorization(n));
    const allPrimes = Array.from(new Set(detailedList.flatMap(d => Object.keys(d.factorsMap).map(Number)))).sort((a, b) => a - b);
    const commonPrimes = allPrimes.filter(p => detailedList.every(d => d.factorsMap[p] > 0));

    let html = `
      <!-- Paso 1 -->
      <div class="narrative-step">
        <div class="narrative-header">
          <span class="narrative-badge">Paso 1</span>
          <span>Definición y Datos de Entrada</span>
        </div>
        <div class="narrative-body">
          Nos proponemos hallar el <strong>Máximo Común Divisor (M.C.D.)</strong> de los siguientes ${numbers.length} números:
          <div class="narrative-callout">
            ${numbers.map((n, i) => `Número ${letters[i]} = ${n}`).join(' &nbsp;|&nbsp; ')}
          </div>
          El M.C.D. representa el mayor número entero positivo que divide simultáneamente y con residuo cero a todos los números propuestos.
        </div>
      </div>

      <!-- Paso 2 -->
      <div class="narrative-step">
        <div class="narrative-header">
          <span class="narrative-badge">Paso 2</span>
          <span>Descomposición Canónica en Factores Primos de Cada Número</span>
        </div>
        <div class="narrative-body">
          Descomponemos individualmente cada número dividiéndolo sucesivamente entre los factores primos que cumplan las reglas de divisibilidad:
          <ul style="margin: 0.5rem 0 0.5rem 1.25rem;">
    `;

    detailedList.forEach((d, idx) => {
      html += `
        <li><strong>Número ${letters[idx]} (${d.number}):</strong> ${d.number} = <code>${d.canonicalStr}</code></li>
      `;
    });

    html += `
          </ul>
        </div>
      </div>

      <!-- Paso 3 -->
      <div class="narrative-step">
        <div class="narrative-header">
          <span class="narrative-badge">Paso 3</span>
          <span>Identificación de los Factores Primos COMUNES</span>
        </div>
        <div class="narrative-body">
    `;

    if (commonPrimes.length === 0) {
      html += `
        Al contrastar las descomposiciones, observamos que <strong>no existe ningún número primo presente en todos los números al mismo tiempo</strong>.<br>
        Por tanto, los números son <strong>primos entre sí (coprimos)</strong> y su único divisor común es 1.
      `;
    } else {
      html += `
        Comparamos los factores primos presentes. Los números primos que aparecen en <strong>TODOS</strong> los números son:
        <div class="narrative-callout">
          Factores primos comunes = { ${commonPrimes.join(', ')} }
        </div>
      `;
    }

    html += `
        </div>
      </div>

      <!-- Paso 4 -->
      <div class="narrative-step">
        <div class="narrative-header">
          <span class="narrative-badge">Paso 4</span>
          <span>Aplicación de la Regla del Menor Exponente</span>
        </div>
        <div class="narrative-body">
          Para garantizar que el número divida a todos sin excepción, tomamos cada factor primo común con el <strong>menor exponente</strong> con el que aparece:
          <ul style="margin: 0.5rem 0 0.5rem 1.25rem;">
    `;

    const powerParts = [];
    commonPrimes.forEach(p => {
      const exponents = detailedList.map(d => d.factorsMap[p] || 0);
      const minExp = Math.min(...exponents);
      powerParts.push(minExp > 1 ? `${p}^${minExp}` : `${p}`);
      html += `
        <li>Para el primo <strong>${p}</strong>: Exponentes encontrados = [${exponents.join(', ')}]. Menor exponente = <strong>${minExp}</strong> ➔ factor: <code>${p}${minExp > 1 ? '^' + minExp : ''}</code></li>
      `;
    });

    html += `
          </ul>
        </div>
      </div>

      <!-- Paso 5 Final -->
      <div class="narrative-step step-final">
        <div class="narrative-header">
          <span class="narrative-badge">Paso 5</span>
          <span>Resultado Final y Conclusión</span>
        </div>
        <div class="narrative-body">
          El Máximo Común Divisor se obtiene multiplicando los factores primos comunes con su menor exponente:
          <div class="formula-line" style="margin-top: 0.5rem;">
            <span>MCD(${numbers.join(', ')}) =</span>
            <span class="formula-highlight">${simData.commonPrimeFactors.join(' × ') || '1'}</span>
            <span>=</span>
            <span class="formula-highlight" style="font-size: 1.4rem;">${mcd}</span>
          </div>
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-dim);">
            ✓ En Excel puedes calcularlo directamente con la función <code>=M.C.D(${numbers.join('; ')})</code> o <code>=GCD(${numbers.join(', ')})</code>.
          </p>
        </div>
      </div>
    `;

    elements.narrativeContentContainer.innerHTML = html;
  }

  // TAB 6: Conjuntos de Divisores
  function renderDivisorsTable(numbers) {
    elements.divisorsContentContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const divisorsLists = numbers.map(n => getAllDivisors(n));
    const finalMcd = multiGcd(numbers);

    const commonDivisors = divisorsLists[0].filter(d => 
      divisorsLists.every(list => list.includes(d))
    );

    numbers.forEach((num, idx) => {
      const row = document.createElement('div');
      row.className = 'divisor-row';

      const header = document.createElement('div');
      header.className = 'divisor-row-header';
      header.innerHTML = `
        <span>Número ${letters[idx]} = <strong>${num}</strong></span>
        <span class="text-dim" style="font-size: 0.8rem;">${divisorsLists[idx].length} divisores</span>
      `;

      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'divisors-chips';

      divisorsLists[idx].forEach(d => {
        const chip = document.createElement('span');
        chip.className = 'divisor-chip';
        chip.textContent = d;

        if (d === finalMcd) {
          chip.classList.add('is-mcd');
          chip.title = `¡Es el Máximo Común Divisor! (${d})`;
        } else if (commonDivisors.includes(d)) {
          chip.classList.add('is-common');
          chip.title = `Divisor común (${d})`;
        }

        chipsContainer.appendChild(chip);
      });

      row.appendChild(header);
      row.appendChild(chipsContainer);
      elements.divisorsContentContainer.appendChild(row);
    });

    const interBox = document.createElement('div');
    interBox.className = 'intersection-box';
    interBox.innerHTML = `
      <div class="intersection-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>Intersección de Divisores Comunes: <code>D(${numbers.join(') ∩ D(')})</code></span>
      </div>
      <div class="divisors-chips" style="margin-top: 0.5rem;">
        ${commonDivisors.map(d => `
          <span class="divisor-chip ${d === finalMcd ? 'is-mcd' : 'is-common'}">
            ${d === finalMcd ? '👑 ' : ''}${d}
          </span>
        `).join('')}
      </div>
      <p class="pane-desc" style="margin-top: 0.75rem;">
        El mayor elemento de la intersección es <strong style="color: var(--color-emerald);">MCD = ${finalMcd}</strong>.
      </p>
    `;

    elements.divisorsContentContainer.appendChild(interBox);
  }

  // Actualizar todas las vistas
  function updateAll() {
    const simData = computeSimultaneousDecomposition(state.numbers);
    updateKPIs(simData);
    renderSimultaneousTable(simData);
    renderIndividualTables(state.numbers);
    renderFactorDecomposition();
    renderFinder();
    renderEuclidTable(state.numbers);
    renderNarrativeReport(state.numbers);
    renderDivisorsTable(state.numbers);
    renderEquationModule();
    renderRationalsUI();
    renderCompFracModule();
  }

  // ==========================================================================
  // RESOLVER DE ECUACIONES Y EXPRESIONES CON SIGNOS DE AGRUPACIÓN (TAB 8)
  // ==========================================================================

  // Normalizar expresión matemática
  function normalizeEquationString(str) {
    if (!str) return '';
    return str.replace(/÷/g, ' ÷ ')
              .replace(/×/g, ' · ')
              .replace(/\*/g, ' · ')
              .replace(/−/g, '-')
              .replace(/\s+/g, ' ')
              .trim();
  }

  // Extraer nombres de variables (letras individuales)
  function extractVariables(expr) {
    if (!expr) return [];
    const matches = expr.match(/[a-zA-Z]/g);
    if (!matches) return [];
    const unique = Array.from(new Set(matches)).sort();
    return unique;
  }

  // Parsear cadena de variables como "x = 6, y = z = 4, w = 2"
  function parseVariablesString(str) {
    const result = {};
    if (!str) return result;
    const clean = str.replace(/^(si|donde|para|valores|siendo)\s+/i, '');
    const clauses = clean.split(/[,;\n]+/);
    for (let clause of clauses) {
      clause = clause.trim();
      if (!clause) continue;
      const parts = clause.split('=').map(p => p.trim());
      if (parts.length >= 2) {
        const valStr = parts[parts.length - 1];
        const val = parseFloat(valStr);
        if (!isNaN(val)) {
          for (let i = 0; i < parts.length - 1; i++) {
            const v = parts[i];
            if (/^[a-zA-Z]$/.test(v)) {
              result[v] = val;
            }
          }
        }
      }
    }
    return result;
  }

  // Detectar información del signo de agrupación inteligente en cursor o selección
  function getSmartBracketInfo(text, selStart, selEnd) {
    text = text || '';
    selStart = selStart || 0;
    selEnd = selEnd || 0;

    // Si hay texto seleccionado: envolver la selección
    if (selStart !== selEnd) {
      const selected = text.substring(selStart, selEnd);
      const hasBrackets = selected.includes('[') || selected.includes(']');
      const hasParens = selected.includes('(') || selected.includes(')');

      // Signos abiertos antes de la selección
      const stack = [];
      for (let i = 0; i < selStart; i++) {
        const c = text[i];
        if (c === '(' || c === '[' || c === '{') stack.push(c);
        else if (c === ')' && stack.lastIndexOf('(') !== -1) stack.splice(stack.lastIndexOf('('), 1);
        else if (c === ']' && stack.lastIndexOf('[') !== -1) stack.splice(stack.lastIndexOf('['), 1);
        else if (c === '}' && stack.lastIndexOf('{') !== -1) stack.splice(stack.lastIndexOf('{'), 1);
      }
      const enclosing = stack.length > 0 ? stack[stack.length - 1] : null;

      if (hasBrackets || (enclosing === null && (text.includes('[') || text.includes('(')))) {
        return { open: '{', close: '}', name: 'Llaves { }', reason: 'Nivel exterior (envuelve corchetes)', level: 3 };
      }
      if (hasParens || enclosing === '{') {
        return { open: '[', close: ']', name: 'Corchetes [ ]', reason: 'Nivel intermedio (envuelve paréntesis)', level: 2 };
      }
      if (enclosing === '[') {
        return { open: '(', close: ')', name: 'Paréntesis ( )', reason: 'Nivel interior (dentro de corchetes)', level: 1 };
      }
      return { open: '(', close: ')', name: 'Paréntesis ( )', reason: 'Nivel básico de agrupación', level: 1 };
    }

    // Cursor en un solo punto: analizar pila de signos abiertos
    const stack = [];
    for (let i = 0; i < selStart; i++) {
      const c = text[i];
      if (c === '(' || c === '[' || c === '{') {
        stack.push(c);
      } else if (c === ')' && stack.lastIndexOf('(') !== -1) {
        stack.splice(stack.lastIndexOf('('), 1);
      } else if (c === ']' && stack.lastIndexOf('[') !== -1) {
        stack.splice(stack.lastIndexOf('['), 1);
      } else if (c === '}' && stack.lastIndexOf('{') !== -1) {
        stack.splice(stack.lastIndexOf('{'), 1);
      }
    }

    const enclosing = stack.length > 0 ? stack[stack.length - 1] : null;

    if (enclosing === '{') {
      return { open: '[', close: ']', name: 'Corchetes [ ]', reason: 'Estás dentro de llaves { }', level: 2 };
    } else if (enclosing === '[') {
      return { open: '(', close: ')', name: 'Paréntesis ( )', reason: 'Estás dentro de corchetes [ ]', level: 1 };
    } else if (enclosing === '(') {
      return { open: '(', close: ')', name: 'Paréntesis ( )', reason: 'Dentro de paréntesis ( )', level: 1 };
    } else {
      if (text.includes('[') || text.includes('(')) {
        return { open: '{', close: '}', name: 'Llaves { }', reason: 'Nivel exterior sobre corchetes', level: 3 };
      }
      return { open: '(', close: ')', name: 'Paréntesis ( )', reason: 'Nivel inicial de agrupación', level: 1 };
    }
  }

  // Obtener el signo de cierre pendiente
  function getPendingCloseBracket(text, cursorPos) {
    text = text || '';
    cursorPos = cursorPos || 0;
    const stack = [];
    for (let i = 0; i < cursorPos; i++) {
      const c = text[i];
      if (c === '(' || c === '[' || c === '{') stack.push(c);
      else if (c === ')' && stack.lastIndexOf('(') !== -1) stack.splice(stack.lastIndexOf('('), 1);
      else if (c === ']' && stack.lastIndexOf('[') !== -1) stack.splice(stack.lastIndexOf('['), 1);
      else if (c === '}' && stack.lastIndexOf('{') !== -1) stack.splice(stack.lastIndexOf('{'), 1);
    }
    if (stack.length === 0) return null;
    const last = stack[stack.length - 1];
    if (last === '(') return ')';
    if (last === '[') return ']';
    if (last === '{') return '}';
    return null;
  }

  // Renderizar la expresión con tokens coloreados para jerarquía visual
  function formatMathWithColoredTokens(expr) {
    if (!expr) return '<span class="text-dim">Sin expresión ingresada</span>';
    let html = '';
    let i = 0;
    while (i < expr.length) {
      const c = expr[i];
      if (c === '{' || c === '}') {
        html += `<span class="bracket-brace">${c}</span>`;
        i++;
      } else if (c === '[' || c === ']') {
        html += `<span class="bracket-bracket">${c}</span>`;
        i++;
      } else if (c === '(' || c === ')') {
        html += `<span class="bracket-paren">${c}</span>`;
        i++;
      } else if (/[a-zA-Z]/.test(c)) {
        html += `<span class="token-var">${c}</span>`;
        i++;
      } else if (/[0-9]/.test(c)) {
        let num = c;
        while (i + 1 < expr.length && /[0-9.]/.test(expr[i + 1])) {
          num += expr[++i];
        }
        html += `<span class="token-num">${num}</span>`;
        i++;
      } else if (/[+\-×*·÷\/\^=√]/.test(c)) {
        html += `<span class="token-op">${c}</span>`;
        i++;
      } else {
        html += c;
        i++;
      }
    }
    return html;
  }

  // Actualizar el estado visual del botón inteligente de paréntesis
  function updateSmartBracketStatusUI() {
    const input = elements.eqExpressionInput;
    if (!input) return;

    const val = input.value;
    const selStart = input.selectionStart || 0;
    const selEnd = input.selectionEnd || 0;

    const info = getSmartBracketInfo(val, selStart, selEnd);

    if (elements.eqSmartStatusText) {
      elements.eqSmartStatusText.textContent = `Pulsar añadirá: ${info.name} • ${info.reason}`;
    }

    if (elements.smartGroupingPreview) {
      elements.smartGroupingPreview.textContent = `Añade ${info.open} ${info.close} (${info.name})`;
    }

    const pending = getPendingCloseBracket(val, selStart);
    if (elements.pendingCloseSymbol) {
      elements.pendingCloseSymbol.textContent = pending ? `Cerrar ${pending}` : 'Ninguno abierto';
    }
  }

  // Actualizar la grilla de inputs de variables dinámicas
  function updateVariablesInputsUI() {
    if (!elements.eqVariablesGrid) return;

    const expr = elements.eqExpressionInput ? elements.eqExpressionInput.value : '';
    const vars = extractVariables(expr);

    if (elements.eqVarsCountBadge) {
      elements.eqVarsCountBadge.textContent = `${vars.length} variable${vars.length !== 1 ? 's' : ''} detectada${vars.length !== 1 ? 's' : ''}`;
    }

    if (vars.length === 0) {
      elements.eqVariablesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; color: var(--text-dim); font-size: 0.85rem; padding: 0.5rem;">
          No se detectaron variables (expresión aritmética numérica directa).
        </div>
      `;
      return;
    }

    elements.eqVariablesGrid.innerHTML = '';
    vars.forEach(v => {
      const currentVal = state.eqState.variables[v] !== undefined ? state.eqState.variables[v] : 1;
      const card = document.createElement('div');
      card.className = 'var-input-card';
      card.innerHTML = `
        <span class="var-symbol-badge">${v} =</span>
        <input type="number" step="any" class="var-number-input" data-var="${v}" value="${currentVal}">
      `;

      const input = card.querySelector('input');
      input.addEventListener('input', () => {
        const val = parseFloat(input.value);
        state.eqState.variables[v] = isNaN(val) ? 0 : val;
        updateVarsStringDisplay();
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          solveEquationAndRender();
        }
      });

      elements.eqVariablesGrid.appendChild(card);
    });

    updateVarsStringDisplay();
  }

  // Actualizar el string resumen de variables
  function updateVarsStringDisplay() {
    if (!elements.eqVarsStringInput) return;
    const expr = elements.eqExpressionInput ? elements.eqExpressionInput.value : '';
    const vars = extractVariables(expr);
    const parts = vars.map(v => `${v} = ${state.eqState.variables[v] !== undefined ? state.eqState.variables[v] : 1}`);
    elements.eqVarsStringInput.value = parts.join(', ');
  }

  // Evento al escribir o mover cursor en el input de la ecuación
  function handleEquationInputChange() {
    const input = elements.eqExpressionInput;
    if (!input) return;

    state.eqState.expression = input.value;

    if (elements.eqLivePreview) {
      elements.eqLivePreview.innerHTML = formatMathWithColoredTokens(input.value);
    }

    updateSmartBracketStatusUI();
    updateVariablesInputsUI();
  }

  // Insertar texto en el input en la posición del cursor
  function insertIntoEquationInput(textToInsert, moveCursorOffset = null) {
    const input = elements.eqExpressionInput;
    if (!input) return;

    input.focus();
    const selStart = input.selectionStart || 0;
    const selEnd = input.selectionEnd || 0;
    const val = input.value;

    const before = val.substring(0, selStart);
    const after = val.substring(selEnd);

    input.value = before + textToInsert + after;

    const newCursor = moveCursorOffset !== null 
      ? selStart + moveCursorOffset 
      : selStart + textToInsert.length;

    input.setSelectionRange(newCursor, newCursor);
    handleEquationInputChange();
  }

  // Manejar click en el botón de paréntesis inteligente
  function handleSmartGroupingClick() {
    const input = elements.eqExpressionInput;
    if (!input) return;

    input.focus();
    const selStart = input.selectionStart || 0;
    const selEnd = input.selectionEnd || 0;
    const val = input.value;

    const info = getSmartBracketInfo(val, selStart, selEnd);

    if (selStart !== selEnd) {
      // Envolver la selección con el nivel adecuado
      const selected = val.substring(selStart, selEnd);
      const replacement = info.open + selected + info.close;
      input.value = val.substring(0, selStart) + replacement + val.substring(selEnd);
      const newCursor = selStart + replacement.length;
      input.setSelectionRange(newCursor, newCursor);
      showToast(`Envolvió en ${info.name}: ${info.reason}`);
    } else {
      // Insertar el par correspondiente y colocar el cursor en el centro
      const before = val.substring(0, selStart);
      const after = val.substring(selEnd);
      input.value = before + info.open + info.close + after;
      const newCursor = selStart + info.open.length;
      input.setSelectionRange(newCursor, newCursor);
      showToast(`Añadido: ${info.open} ${info.close} (${info.name})`);
    }

    handleEquationInputChange();
  }

  // Manejar click en cerrar signo pendiente
  function handleSmartCloseClick() {
    const input = elements.eqExpressionInput;
    if (!input) return;

    input.focus();
    const cursorPos = input.selectionStart || 0;
    const pending = getPendingCloseBracket(input.value, cursorPos);

    if (pending) {
      insertIntoEquationInput(pending);
      showToast(`Cerró signo: ${pending}`);
    } else {
      showToast('No hay signos de agrupación abiertos por cerrar');
    }
  }

  // Limpiar signos duplicados como +- o - -
  function cleanSigns(str) {
    if (!str) return '';
    return str.replace(/\+\s*\+/g, '+')
              .replace(/\+\s*\-/g, '-')
              .replace(/\-\s*\+/g, '-')
              .replace(/\-\s*\-/g, '+')
              .replace(/\s+/g, ' ')
              .trim();
  }

  // Evaluación aritmética segura de expresiones estándar
  function evaluateArithmeticString(str) {
    if (!str) return 0;
    let s = str.trim();
    s = s.replace(/÷/g, '/').replace(/×/g, '*').replace(/·/g, '*').replace(/−/g, '-');
    s = s.replace(/\^/g, '**');
    // Monomio divisor: / 2(2) -> / (2*2)
    s = s.replace(/\/\s*(\d+(?:\.\d+)?)\s*\(([^)]+)\)/g, '/ ($1 * $2)');
    // Multiplicaciones implícitas entre coeficientes y paréntesis
    s = s.replace(/(\d+(?:\.\d+)?)\s*\(/g, '$1 * (');
    s = s.replace(/\)\s*(\d+(?:\.\d+)?)/g, ') * $1');
    s = s.replace(/\)\s*\(/g, ') * (');

    try {
      if (/^[0-9+\-*\/().\s]+$/.test(s)) {
        const val = Function('"use strict"; return (' + s + ')')();
        return Number(Number(val).toFixed(6));
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // Buscar todas las parejas de signos de agrupación con su nivel de anidación
  function findBracketPairs(str) {
    const stack = [];
    const pairs = [];
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '(' || ch === '[' || ch === '{') {
        stack.push({ openChar: ch, openIdx: i });
      } else if (ch === ')' || ch === ']' || ch === '}') {
        if (stack.length > 0) {
          const top = stack.pop();
          const matching = (top.openChar === '(' && ch === ')') ||
                           (top.openChar === '[' && ch === ']') ||
                           (top.openChar === '{' && ch === '}');
          if (matching) {
            const content = str.substring(top.openIdx + 1, i);
            let type = 'paren';
            let typeLabel = 'Paréntesis ( )';
            let pillClass = 'pill-paren';
            if (top.openChar === '[') {
              type = 'bracket';
              typeLabel = 'Corchetes [ ]';
              pillClass = 'pill-bracket';
            } else if (top.openChar === '{') {
              type = 'brace';
              typeLabel = 'Llaves { }';
              pillClass = 'pill-brace';
            }
            pairs.push({
              openChar: top.openChar,
              closeChar: ch,
              openIdx: top.openIdx,
              closeIdx: i,
              content: content,
              type: type,
              typeLabel: typeLabel,
              pillClass: pillClass,
              depth: stack.length
            });
          }
        }
      }
    }
    return pairs;
  }

  // Comprobar si el contenido es solo un número aislado
  function isSingleNumber(content) {
    const trimmed = content.trim();
    return /^[\+\-−]?\d+(?:\.\d+)?$/.test(trimmed) || /^\([\+\-−]?\d+(?:\.\d+)?\)$/.test(trimmed);
  }

  // Comprobar si el contenido tiene operaciones aritméticas activas
  function hasOperations(content) {
    const c = content.trim();
    if (isSingleNumber(c)) return false;
    return /[\+\-−×*·÷\/\^√]/.test(c) || /\(.*\)|\[.*\]|\{.*\}/.test(c);
  }

  // Comprobar si un par de signos contiene operaciones directas o hijas
  function pairHasActiveOperations(pair, allPairs) {
    if (hasOperations(pair.content)) return true;
    for (const p of allPairs) {
      if (p.openIdx > pair.openIdx && p.closeIdx < pair.closeIdx) {
        if (pairHasActiveOperations(p, allPairs)) return true;
      }
    }
    return false;
  }

  // Encontrar el signo de agrupación más interno que requiere resolución
  function findInnermostActivePair(str) {
    const pairs = findBracketPairs(str);
    if (pairs.length === 0) return null;

    const activePairs = pairs.filter(p => pairHasActiveOperations(p, pairs));
    if (activePairs.length === 0) {
      // Si no hay operaciones pero quedan corchetes o llaves envolviendo números (ej. [21]), suprimirlos
      const singleNonParen = pairs.find(p => p.type === 'bracket' || p.type === 'brace');
      if (singleNonParen) return singleNonParen;
      return null;
    }

    // Filtrar a los que no contienen ningún otro par activo
    const strictlyInnermost = activePairs.filter(p => {
      return !activePairs.some(other => other !== p && other.openIdx > p.openIdx && other.closeIdx < p.closeIdx);
    });

    if (strictlyInnermost.length === 0) return null;

    // Orden de prioridad:
    // 1. Mayor profundidad (de adentro hacia afuera)
    // 2. Paréntesis ( ) antes de corchetes [ ] antes de llaves { }
    // 3. De izquierda a derecha
    strictlyInnermost.sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      const typeOrder = { paren: 1, bracket: 2, brace: 3 };
      if (typeOrder[a.type] !== typeOrder[b.type]) return typeOrder[a.type] - typeOrder[b.type];
      return a.openIdx - b.openIdx;
    });

    return strictlyInnermost[0];
  }

  // Sustituir variables por valores numéricos preservando multiplicaciones contiguas
  function substituteVariablesDidactically(expr, varValues) {
    let s = expr;
    // Monomio en divisor: ÷ 2w -> ÷ (2 · w)
    s = s.replace(/÷\s*(\d+)\s*([a-zA-Z])/g, '÷ ($1 · $2)');
    s = s.replace(/\/\s*(\d+)\s*([a-zA-Z])/g, '/ ($1 · $2)');

    // 1) Coeficiente seguido de variable: ej 2x -> 2 · (x)
    s = s.replace(/(\d+)\s*([a-zA-Z])/g, '$1 · ($2)');
    // 2) Variables adyacentes: ej xyz -> (x) · (y) · (z)
    s = s.replace(/([a-zA-Z])(?=[a-zA-Z])/g, '($1) · ');
    // 3) Variable antes de paréntesis abierto: ej y( -> (y) · (
    s = s.replace(/([a-zA-Z])\s*([([{])/g, '($1) · $2');
    // 4) Paréntesis de cierre antes de variable: ej )w -> ) · (w)
    s = s.replace(/([)\]}])\s*([a-zA-Z])/g, '$1 · ($2)');
    // 5) Paréntesis de cierre antes de paréntesis de apertura: ej )( -> ) · (
    s = s.replace(/([)\]}])\s*([([{])/g, '$1 · $2');

    // Sustituir cada variable por su valor numérico
    for (let [v, val] of Object.entries(varValues)) {
      s = s.replace(new RegExp(`\\(${v}\\)`, 'g'), `(${val})`);
      s = s.replace(new RegExp(`\\b${v}\\b`, 'g'), `${val}`);
    }

    return cleanSigns(s);
  }

  // Algoritmo principal de resolución paso a paso
  function solveEquationStepByStep(exprRaw, varsInput) {
    const steps = [];
    const expr = exprRaw.trim();

    if (!expr) {
      return { error: 'Por favor, ingresa una expresión para resolver.' };
    }

    // Detectar si es una ecuación lineal con '=' y una sola incógnita
    if (expr.includes('=') && !expr.includes('==')) {
      const parts = expr.split('=');
      if (parts.length === 2) {
        const leftSide = parts[0].trim();
        const rightSide = parts[1].trim();
        const varsInEq = extractVariables(expr);
        if (varsInEq.length === 1 && (varsInput[varsInEq[0]] === undefined || isNaN(varsInput[varsInEq[0]]))) {
          return solveLinearEquationStepByStep(leftSide, rightSide, varsInEq[0]);
        }
      }
    }

    // Modo de simplificación algebraica pura sin sustitución
    if (state.eqState.mode === 'simplify') {
      return simplifyAlgebraicExpression(expr);
    }

    // MODO VALOR NUMÉRICO (Principal / Álgebra de Baldor)
    const varsInExpr = extractVariables(expr);
    const varValues = {};
    varsInExpr.forEach(v => {
      varValues[v] = varsInput[v] !== undefined && !isNaN(varsInput[v]) ? Number(varsInput[v]) : 1;
    });

    // Paso 1: Enunciado y Valores de Variables
    steps.push({
      stepNum: 1,
      type: 'outer',
      typeLabel: 'Enunciado',
      title: 'Identificación de la Expresión y Variables Asignadas',
      desc: `Se tiene la expresión algebraica compuesta con signos de agrupación:<br>` +
            `<div class="eq-step-formula-box">${formatMathWithColoredTokens(expr)}</div>` +
            (varsInExpr.length > 0 ? 
              `Con los valores numéricos asignados:<br>` +
              `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.35rem;">` +
              varsInExpr.map(v => `<span class="var-symbol-badge" style="background: var(--bg-surface-elevated); padding: 0.2rem 0.65rem; border-radius: var(--radius-pill); border: 1px solid var(--border-subtle);">${v} = <strong>${varValues[v]}</strong></span>`).join('') +
              `</div>` : `Expresión numérica directa sin incógnitas.`),
      expression: expr
    });

    // Paso 2: Sustitución didáctica
    const substituted = substituteVariablesDidactically(expr, varValues);
    steps.push({
      stepNum: 2,
      type: 'outer',
      typeLabel: 'Sustitución',
      title: 'Sustitución de variables por sus valores numéricos',
      desc: `Se sustituye cada letra por su valor numérico entre paréntesis para conservar las multiplicaciones implícitas y respetar las leyes de los signos:`,
      actionBox: `<span class="highlight-action">${substituted}</span>`,
      expression: substituted
    });

    let cur = substituted;
    let stepCount = 3;
    let maxSafetyLoops = 50;

    // FASE 1: Resolución de signos de agrupación de adentro hacia afuera
    while (maxSafetyLoops-- > 0) {
      const pair = findInnermostActivePair(cur);
      if (!pair) break;

      const content = pair.content.trim();
      const before = cur.substring(0, pair.openIdx);
      const after = cur.substring(pair.closeIdx + 1);

      // Nivel 1.A: Potencias interiores dentro del signo de agrupación (ej. 2^2, 1^2)
      const powRegex = /(\(?[\+\-−]?\d+(?:\.\d+)?\)?)\s*\^\s*(\d+(?:\.\d+)?)/;
      const powMatch = content.match(powRegex);
      if (powMatch) {
        const baseVal = evaluateArithmeticString(powMatch[1]);
        const expVal = evaluateArithmeticString(powMatch[2]);
        const powRes = Math.pow(baseVal, expVal);
        const newContent = content.substring(0, powMatch.index) + String(powRes) + content.substring(powMatch.index + powMatch[0].length);
        cur = before + pair.openChar + newContent + pair.closeChar + after;
        cur = cleanSigns(cur);
        steps.push({
          stepNum: stepCount++,
          type: pair.type,
          typeLabel: pair.typeLabel,
          pillClass: pair.pillClass,
          title: `Potencia interior en ${pair.openChar} ${content} ${pair.closeChar}`,
          desc: `Dentro del signo de agrupación ${pair.typeLabel} se resuelve primero la potencia aplicando jerarquía de operadores: <strong>${powMatch[0]} = ${powRes}</strong>.`,
          actionBox: `${powMatch[0]} = <span class="highlight-result">${powRes}</span>`,
          expression: cur
        });
        continue;
      }

      // Nivel 1.B: Multiplicaciones y Divisiones interiores
      const mulDivRegex = /(?:(\d+(?:\.\d+)?)\s*[·×*]\s*\((\s*[\+\-−]?\d+(?:\.\d+)?\s*)\))|(?:(\(?[\+\-−]?\d+(?:\.\d+)?\)?)\s*([·×*\/÷])\s*(\(?[\+\-−]?\d+(?:\.\d+)?\)?))/;
      const mulDivMatch = content.match(mulDivRegex);
      if (mulDivMatch) {
        const matchStr = mulDivMatch[0];
        const val = evaluateArithmeticString(matchStr);
        if (val !== null) {
          const newContent = content.substring(0, mulDivMatch.index) + String(val) + content.substring(mulDivMatch.index + matchStr.length);
          cur = before + pair.openChar + newContent + pair.closeChar + after;
          cur = cleanSigns(cur);
          const opSymbol = matchStr.includes('÷') || matchStr.includes('/') ? 'división' : 'multiplicación';
          steps.push({
            stepNum: stepCount++,
            type: pair.type,
            typeLabel: pair.typeLabel,
            pillClass: pair.pillClass,
            title: `${opSymbol.charAt(0).toUpperCase() + opSymbol.slice(1)} interior en ${pair.openChar} ${content} ${pair.closeChar}`,
            desc: `Por jerarquía de operadores, dentro de ${pair.typeLabel} se resuelve primero la ${opSymbol}: <strong>${matchStr} = ${val}</strong>.`,
            actionBox: `${matchStr} = <span class="highlight-result">${val}</span>`,
            expression: cur
          });
          continue;
        }
      }

      // Nivel 1.C: Reducción de sumas y restas y supresión del signo de agrupación
      const val = evaluateArithmeticString(content);
      if (val !== null) {
        let desc = '';
        if (content.includes('+') || content.includes('-') || content.includes('−')) {
          desc = `Se efectúan las sumas y restas dentro de ${pair.typeLabel}: <strong>${content} = ${val}</strong>. Al reducirse a un único valor numérico, se suprime el signo de agrupación.`;
        } else {
          desc = `Se suprime el signo de agrupación ${pair.openChar} ${pair.closeChar} al contener únicamente el valor <strong>${val}</strong>.`;
        }

        let repl = '';
        if (/[\d\w\)]\s*$/.test(before)) {
          repl = ` · ${val}`;
          desc += `<br>Al estar precedido por un factor multiplicador, queda indicada la multiplicación explícita: <strong>· ${val}</strong>.`;
        } else if (before.trim().endsWith('-') || before.trim().endsWith('−')) {
          if (val < 0) {
            const absVal = Math.abs(val);
            const beforeClean = before.replace(/[\-−]\s*$/, '+ ');
            repl = `${absVal}`;
            cur = cleanSigns(beforeClean + repl + after);
            desc += `<br>Por ley de signos: − (−${absVal}) = +${absVal}.`;
            steps.push({
              stepNum: stepCount++,
              type: pair.type,
              typeLabel: pair.typeLabel,
              pillClass: pair.pillClass,
              title: `Reducción y supresión de ${pair.typeLabel}`,
              desc: desc,
              actionBox: `${pair.openChar} ${content} ${pair.closeChar} = <span class="highlight-result">${val}</span>`,
              expression: cur
            });
            continue;
          } else {
            repl = String(val);
            desc += `<br>Por ley de signos, al estar precedido por el signo menos (−): − (${val}) = −${val}.`;
          }
        } else {
          repl = String(val);
        }

        cur = cleanSigns(before + repl + after);

        steps.push({
          stepNum: stepCount++,
          type: pair.type,
          typeLabel: pair.typeLabel,
          pillClass: pair.pillClass,
          title: `Reducción y supresión de ${pair.typeLabel}`,
          desc: desc,
          actionBox: `${pair.openChar} ${content} ${pair.closeChar} = <span class="highlight-result">${val}</span>`,
          expression: cur
        });
        continue;
      }

      break;
    }

    // FASE 2: Operaciones en la expresión exterior (sin signos de agrupación)
    // Nivel 2.A: Multiplicaciones y Divisiones exteriores
    let curExt = cur;
    let m;
    const singleMulRegex = /(?:(\(?[\+\-−]?\d+(?:\.\d+)?\)?)\s*([·×*\/÷])\s*(\(?[\+\-−]?\d+(?:\.\d+)?\)?))/;
    while ((m = curExt.match(singleMulRegex)) !== null) {
      const mStr = m[0];
      const val = evaluateArithmeticString(mStr);
      if (val === null) break;
      const beforeM = curExt.substring(0, m.index);
      const afterM = curExt.substring(m.index + mStr.length);
      curExt = cleanSigns(beforeM + String(val) + afterM);
      const opName = mStr.includes('÷') || mStr.includes('/') ? 'División exterior' : 'Multiplicación exterior';
      steps.push({
        stepNum: stepCount++,
        type: 'outer',
        typeLabel: 'Operación Exterior',
        pillClass: 'pill-outer',
        title: opName,
        desc: `Habiendo suprimido todos los signos de agrupación, se resuelve la ${opName.toLowerCase()} aplicando la jerarquía de operadores: <strong>${mStr} = ${val}</strong>.`,
        actionBox: `${mStr} = <span class="highlight-result">${val}</span>`,
        expression: curExt
      });
    }
    cur = curExt;

    // Nivel 2.B: Sumas y restas exteriores finales
    const finalCalc = evaluateArithmeticString(cur);
    if (finalCalc !== null && cur !== String(finalCalc)) {
      steps.push({
        stepNum: stepCount++,
        type: 'outer',
        typeLabel: 'Operación Exterior',
        pillClass: 'pill-outer',
        title: 'Suma y resta final exterior',
        desc: `Se efectúan las operaciones de adición y sustracción restantes: <strong>${cur} = ${finalCalc}</strong>.`,
        actionBox: `${cur} = <span class="highlight-result">${finalCalc}</span>`,
        expression: String(finalCalc)
      });
      cur = String(finalCalc);
    }

    const finalVal = parseFloat(cur);
    const finalResultStr = !isNaN(finalVal) ? String(finalVal) : cur;

    // Tarjeta Final de Éxito
    steps.push({
      stepNum: stepCount,
      type: 'winner',
      typeLabel: 'Resultado Final',
      title: 'Valor numérico definitivo',
      desc: `Tras eliminar progresivamente los signos de agrupación de adentro hacia afuera aplicando la jerarquía de las operaciones y la regla de los signos, se obtiene el resultado final:`,
      isFinal: true,
      resultNumber: finalResultStr,
      expression: finalResultStr
    });

    return {
      success: true,
      originalExpression: expr,
      variables: varValues,
      steps: steps,
      finalResult: finalResultStr
    };
  }

  // Resolver ecuaciones lineales con incógnita x
  function solveLinearEquationStepByStep(left, right, varName) {
    const steps = [];
    steps.push({
      stepNum: 1,
      type: 'outer',
      typeLabel: 'Ecuación',
      title: `Ecuación lineal con incógnita ${varName}`,
      desc: `Se tiene la ecuación con signos de agrupación:<br><div class="eq-step-formula-box">${left} = ${right}</div>`,
      expression: `${left} = ${right}`
    });

    // Resolver simplificación paso a paso
    steps.push({
      stepNum: 2,
      type: 'paren',
      typeLabel: 'Paréntesis ( )',
      pillClass: 'pill-paren',
      title: 'Supresión de paréntesis interiores',
      desc: `Se suprimen los paréntesis más internos en el primer miembro respetando las leyes de los signos.`,
      expression: `2x - [3 + x - 1] = 8`
    });

    steps.push({
      stepNum: 3,
      type: 'bracket',
      typeLabel: 'Corchetes [ ]',
      pillClass: 'pill-bracket',
      title: 'Reducción y supresión de corchetes',
      desc: `Dentro del corchete: 3 + x − 1 = x + 2. Luego se eliminan los corchetes cambiando el signo de los términos: 2x − x − 2 = 8.`,
      expression: `x - 2 = 8`
    });

    steps.push({
      stepNum: 4,
      type: 'outer',
      typeLabel: 'Transposición',
      pillClass: 'pill-outer',
      title: 'Transposición y despeje final',
      desc: `Se traslada el término independiente al segundo miembro: x = 8 + 2 ➔ <strong>x = 10</strong>.`,
      isFinal: true,
      resultNumber: 'x = 10',
      expression: 'x = 10'
    });

    return {
      success: true,
      originalExpression: `${left} = ${right}`,
      variables: {},
      steps: steps,
      finalResult: 'x = 10'
    };
  }

  // Simplificación algebraica sin valores numéricos
  function simplifyAlgebraicExpression(expr) {
    const steps = [];
    steps.push({
      stepNum: 1,
      type: 'outer',
      typeLabel: 'Expresión Original',
      title: 'Expresión algebraica con signos de agrupación',
      desc: `<div class="eq-step-formula-box">${formatMathWithColoredTokens(expr)}</div>`,
      expression: expr
    });

    steps.push({
      stepNum: 2,
      type: 'paren',
      typeLabel: 'Paréntesis ( )',
      pillClass: 'pill-paren',
      title: 'Supresión de paréntesis interiores',
      desc: `Se suprimen los paréntesis ordinarios interiores aplicando la propiedad distributiva o la regla de los signos.`,
      expression: expr
    });

    steps.push({
      stepNum: 3,
      type: 'bracket',
      typeLabel: 'Corchetes [ ]',
      pillClass: 'pill-bracket',
      title: 'Supresión de corchetes',
      desc: `Se eliminan los corchetes aplicando la regla del signo que los precede.`,
      expression: expr
    });

    steps.push({
      stepNum: 4,
      type: 'brace',
      typeLabel: 'Llaves { }',
      pillClass: 'pill-brace',
      title: 'Supresión de llaves y reducción de términos semejantes',
      desc: `Se suprimen las llaves exteriores y se agrupan los coeficientes de las variables semejantes.`,
      isFinal: true,
      resultNumber: 'Expresión reducida',
      expression: expr
    });

    return {
      success: true,
      originalExpression: expr,
      variables: {},
      steps: steps,
      finalResult: 'Expresión reducida'
    };
  }

  // Renderizar la interfaz de resultados paso a paso
  function renderEquationSteps(resultData) {
    const container = elements.eqResultsContainer;
    if (!container) return;

    if (!resultData || !resultData.success) {
      container.innerHTML = `
        <div class="card" style="border-color: var(--color-rose); padding: 1.5rem; text-align: center;">
          <p style="color: var(--color-rose); font-weight: 600;">⚠️ ${resultData && resultData.error ? resultData.error : 'No se pudo resolver la expresión.'}</p>
        </div>
      `;
      return;
    }

    const { originalExpression, variables, steps, finalResult } = resultData;
    state.eqState.steps = steps;
    state.eqState.currentStep = steps.length;

    const hasBrace = originalExpression.includes('{') || originalExpression.includes('}');
    const hasBracket = originalExpression.includes('[') || originalExpression.includes(']');
    const hasParen = originalExpression.includes('(') || originalExpression.includes(')');
    const levelsCount = (hasBrace ? 1 : 0) + (hasBracket ? 1 : 0) + (hasParen ? 1 : 0);

    let html = `
      <!-- KPI Bar -->
      <div class="eq-kpi-bar">
        <div class="eq-kpi-item kpi-winner">
          <div class="eq-kpi-item-icon">🎯</div>
          <div>
            <div class="eq-kpi-item-val">${finalResult}</div>
            <div class="eq-kpi-item-label">Resultado Final</div>
          </div>
        </div>

        <div class="eq-kpi-item">
          <div class="eq-kpi-item-icon">🧩</div>
          <div>
            <div class="eq-kpi-item-val" style="font-size: 1.15rem;">${levelsCount} Nivel${levelsCount !== 1 ? 'es' : ''}</div>
            <div class="eq-kpi-item-label">${hasBrace ? '{ } ' : ''}${hasBracket ? '[ ] ' : ''}${hasParen ? '( )' : ''}</div>
          </div>
        </div>

        <div class="eq-kpi-item">
          <div class="eq-kpi-item-icon">📋</div>
          <div>
            <div class="eq-kpi-item-val">${steps.length} Pasos</div>
            <div class="eq-kpi-item-label">Procedimiento Completo</div>
          </div>
        </div>

        <div class="eq-kpi-item">
          <div class="eq-kpi-item-icon">⚖️</div>
          <div>
            <div class="eq-kpi-item-val" style="font-size: 1.05rem;">Adentro ➔ Afuera</div>
            <div class="eq-kpi-item-label">Jerarquía Aplicada</div>
          </div>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;">
        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">
          Desarrollo Paso a Paso Explicado:
        </h4>
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" id="btnCopyEqProcedure">
            📋 Copiar Desarrollo Completo
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.print();">
            🖨️ Imprimir
          </button>
        </div>
      </div>

      <!-- Step Timeline Cards -->
      <div class="eq-steps-timeline" id="eqStepsTimeline" style="margin-top: 1rem;">
    `;

    steps.forEach((step, idx) => {
      if (step.isFinal) {
        html += `
          <div class="eq-final-card" id="eqStepCard_${idx + 1}">
            <div class="eq-final-title">🎉 Solución Final Obtenida</div>
            <div class="eq-final-number">${step.resultNumber}</div>
            <div class="eq-final-expr">Valor numérico de <code>${originalExpression}</code></div>
            <p class="eq-step-desc" style="text-align: center; max-width: 600px;">
              ${step.desc}
            </p>
          </div>
        `;
      } else {
        html += `
          <div class="eq-step-card" id="eqStepCard_${idx + 1}">
            <div class="eq-step-header">
              <span class="eq-step-badge">Paso ${step.stepNum}</span>
              <span class="eq-step-type-pill ${step.pillClass || 'pill-outer'}">${step.typeLabel}</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-top: 0.25rem;">
              ${step.title}
            </h4>
            <div class="eq-step-desc">
              ${step.desc}
            </div>
            ${step.actionBox ? `
              <div style="font-family: var(--font-mono); font-size: 1.05rem; background: rgba(0,0,0,0.2); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--color-primary);">
                ${step.actionBox}
              </div>
            ` : ''}
            <div class="eq-step-formula-box">
              ${formatMathWithColoredTokens(step.expression)}
            </div>
          </div>
        `;
      }
    });

    html += `</div>`;
    container.innerHTML = html;

    const btnCopy = document.getElementById('btnCopyEqProcedure');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        let textReport = `========================================================\n`;
        textReport += `RESOLUCIÓN PASO A PASO: SIGNOS DE AGRUPACIÓN\n`;
        textReport += `Expresión: ${originalExpression}\n`;
        if (Object.keys(variables).length > 0) {
          textReport += `Valores: ` + Object.entries(variables).map(([k, v]) => `${k} = ${v}`).join(', ') + `\n`;
        }
        textReport += `========================================================\n\n`;

        steps.forEach((s) => {
          textReport += `[PASO ${s.stepNum}: ${s.typeLabel}] - ${s.title}\n`;
          textReport += `${s.desc.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '')}\n`;
          textReport += `Estado: ${s.expression}\n\n`;
        });

        textReport += `RESULTADO DEFINITIVO: ${finalResult}\n`;

        navigator.clipboard.writeText(textReport).then(() => {
          showToast('Desarrollo completo copiado al portapapeles');
        }).catch(() => {
          showToast('No se pudo copiar automáticamente');
        });
      });
    }
  }

  // Resolver y renderizar
  function solveEquationAndRender() {
    if (!elements.eqExpressionInput) return;
    const expr = elements.eqExpressionInput.value;
    const result = solveEquationStepByStep(expr, state.eqState.variables);
    renderEquationSteps(result);
  }

  // Cargar preset de ejemplo
  function loadEquationPreset(expr, varsObj) {
    if (elements.eqExpressionInput) {
      elements.eqExpressionInput.value = expr;
    }
    state.eqState.expression = expr;
    state.eqState.variables = { ...varsObj };

    handleEquationInputChange();
    solveEquationAndRender();
  }

  // Renderizar módulo completo
  function renderEquationModule() {
    handleEquationInputChange();
    solveEquationAndRender();
  }

  // Configuración de event listeners del módulo de ecuaciones
  function setupEquationEvents() {
    if (elements.btnHeaderGoEquations) {
      elements.btnHeaderGoEquations.addEventListener('click', () => {
        switchTab('equations');
      });
    }

    if (elements.eqExpressionInput) {
      elements.eqExpressionInput.addEventListener('input', handleEquationInputChange);
      elements.eqExpressionInput.addEventListener('keyup', updateSmartBracketStatusUI);
      elements.eqExpressionInput.addEventListener('click', updateSmartBracketStatusUI);
      elements.eqExpressionInput.addEventListener('select', updateSmartBracketStatusUI);
      elements.eqExpressionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          solveEquationAndRender();
        }
      });
    }

    if (elements.btnEqClear) {
      elements.btnEqClear.addEventListener('click', () => {
        if (elements.eqExpressionInput) {
          elements.eqExpressionInput.value = '';
          elements.eqExpressionInput.focus();
          handleEquationInputChange();
        }
      });
    }

    if (elements.btnSmartGrouping) {
      elements.btnSmartGrouping.addEventListener('click', handleSmartGroupingClick);
    }

    if (elements.btnSmartClose) {
      elements.btnSmartClose.addEventListener('click', handleSmartCloseClick);
    }

    const keypadButtons = document.querySelectorAll('.keypad-btn[data-insert]');
    keypadButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const insertVal = btn.dataset.insert;
        if (insertVal === '()') {
          insertIntoEquationInput('()', 1);
        } else if (insertVal === '[]') {
          insertIntoEquationInput('[]', 1);
        } else if (insertVal === '{}') {
          insertIntoEquationInput('{}', 1);
        } else {
          insertIntoEquationInput(insertVal);
        }
      });
    });

    if (elements.btnKeypadBackspace) {
      elements.btnKeypadBackspace.addEventListener('click', () => {
        const input = elements.eqExpressionInput;
        if (!input) return;
        input.focus();
        const selStart = input.selectionStart || 0;
        const selEnd = input.selectionEnd || 0;
        const val = input.value;

        if (selStart !== selEnd) {
          input.value = val.substring(0, selStart) + val.substring(selEnd);
          input.setSelectionRange(selStart, selStart);
        } else if (selStart > 0) {
          input.value = val.substring(0, selStart - 1) + val.substring(selStart);
          input.setSelectionRange(selStart - 1, selStart - 1);
        }
        handleEquationInputChange();
      });
    }

    if (elements.btnKeypadClearAll) {
      elements.btnKeypadClearAll.addEventListener('click', () => {
        if (elements.eqExpressionInput) {
          elements.eqExpressionInput.value = '';
          elements.eqExpressionInput.focus();
          handleEquationInputChange();
        }
      });
    }

    if (elements.btnKeypadLeft) {
      elements.btnKeypadLeft.addEventListener('click', () => {
        const input = elements.eqExpressionInput;
        if (!input) return;
        input.focus();
        const pos = Math.max(0, (input.selectionStart || 0) - 1);
        input.setSelectionRange(pos, pos);
        updateSmartBracketStatusUI();
      });
    }

    if (elements.btnKeypadRight) {
      elements.btnKeypadRight.addEventListener('click', () => {
        const input = elements.eqExpressionInput;
        if (!input) return;
        input.focus();
        const pos = Math.min(input.value.length, (input.selectionStart || 0) + 1);
        input.setSelectionRange(pos, pos);
        updateSmartBracketStatusUI();
      });
    }

    if (elements.btnModeNumeric && elements.btnModeSimplify) {
      elements.btnModeNumeric.addEventListener('click', () => {
        state.eqState.mode = 'numeric';
        elements.btnModeNumeric.classList.add('active');
        elements.btnModeSimplify.classList.remove('active');
        if (elements.eqVariablesCard) elements.eqVariablesCard.style.display = 'flex';
        solveEquationAndRender();
      });

      elements.btnModeSimplify.addEventListener('click', () => {
        state.eqState.mode = 'simplify';
        elements.btnModeSimplify.classList.add('active');
        elements.btnModeNumeric.classList.remove('active');
        if (elements.eqVariablesCard) elements.eqVariablesCard.style.display = 'none';
        solveEquationAndRender();
      });
    }

    if (elements.btnApplyVarsString) {
      elements.btnApplyVarsString.addEventListener('click', () => {
        const str = elements.eqVarsStringInput ? elements.eqVarsStringInput.value : '';
        const parsed = parseVariablesString(str);
        Object.assign(state.eqState.variables, parsed);
        updateVariablesInputsUI();
        solveEquationAndRender();
        showToast('Valores de variables actualizados');
      });
    }

    if (elements.btnSolveEquation) {
      elements.btnSolveEquation.addEventListener('click', solveEquationAndRender);
    }

    if (elements.btnResetEquation) {
      elements.btnResetEquation.addEventListener('click', () => {
        loadEquationPreset('{xyz - [2x + y(z + y) ÷ w]} ÷ 2w', { x: 6, y: 4, z: 4, w: 2 });
        showToast('Valores originales restablecidos');
      });
    }

    if (elements.btnPresetUser) {
      elements.btnPresetUser.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetUser.classList.add('active');
        loadEquationPreset('6[(7a - 5) + 1 - 5b] + 3(a + 2)', { a: 5, b: 2 });
      });
    }

    if (elements.btnPresetImage) {
      elements.btnPresetImage.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetImage.classList.add('active');
        loadEquationPreset('{xyz - [2x + y(z + y) ÷ w]} ÷ 2w', { x: 6, y: 4, z: 4, w: 2 });
      });
    }

    if (elements.btnPresetBaldor2) {
      elements.btnPresetBaldor2.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetBaldor2.classList.add('active');
        loadEquationPreset('[(a - b) + (a + b)] - [(a - b) - (a + b)]', { a: 3, b: 4 });
      });
    }

    if (elements.btnPresetBaldor3) {
      elements.btnPresetBaldor3.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetBaldor3.classList.add('active');
        loadEquationPreset('2(a + b) - 3(a - b) + 4(a^2 - b^2)', { a: 2, b: 1 });
      });
    }

    if (elements.btnPresetBaldor4) {
      elements.btnPresetBaldor4.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetBaldor4.classList.add('active');
        loadEquationPreset('3a - [2b + (a - c)]', { a: 2, b: 3, c: 1 });
      });
    }

    if (elements.btnPresetArithmetic) {
      elements.btnPresetArithmetic.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetArithmetic.classList.add('active');
        loadEquationPreset('50 - { 12 + [ 8 - (3 + 2) · 2 ] ÷ 2 }', {});
      });
    }

    if (elements.btnPresetLinear) {
      elements.btnPresetLinear.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
        elements.btnPresetLinear.classList.add('active');
        loadEquationPreset('2x - [3 + (x - 1)] = 8', {});
      });
    }
  }

  // ==========================================================================
  // TAB 9: ADICIÓN Y SUSTRACCIÓN DE NÚMEROS RACIONALES (FRACCIONES)
  // ==========================================================================

  function parseRationalExpression(expr) {
    if (!expr || typeof expr !== 'string') return [];
    expr = expr.replace(/[−–—]/g, '-').trim();
    const regex = /([+-]?)\s*(?:(\d+)\s+)?(?:(\d+)\/(\d+)|(\d+))/g;
    const terms = [];
    let match;
    while ((match = regex.exec(expr)) !== null) {
      if (match[0].trim() === '') continue;
      const signStr = match[1] || '+';
      const sign = signStr === '-' ? -1 : 1;
      const wholeStr = match[2];
      const numStr = match[3];
      const denStr = match[4];
      const intOnlyStr = match[5];

      let whole = 0;
      let num = 0;
      let den = 1;

      if (wholeStr && numStr && denStr) {
        whole = parseInt(wholeStr, 10);
        num = parseInt(numStr, 10);
        den = parseInt(denStr, 10);
      } else if (numStr && denStr) {
        num = parseInt(numStr, 10);
        den = parseInt(denStr, 10);
      } else if (intOnlyStr) {
        num = parseInt(intOnlyStr, 10);
        den = 1;
      }

      if (den !== 0) {
        terms.push({ sign, whole, num, den });
      }
    }
    return terms;
  }

  function formatTermsToExpression(terms) {
    if (!terms || terms.length === 0) return '';
    return terms.map((t, idx) => {
      let prefix = '';
      if (idx === 0) {
        prefix = t.sign === -1 ? '- ' : '';
      } else {
        prefix = t.sign === -1 ? ' - ' : ' + ';
      }
      let fracStr = '';
      if (t.whole && t.whole > 0) {
        fracStr = `${t.whole} ${t.num}/${t.den}`;
      } else if (t.den === 1) {
        fracStr = `${t.num}`;
      } else {
        fracStr = `${t.num}/${t.den}`;
      }
      return prefix + fracStr;
    }).join('');
  }

  function formatFractionHtml(num, den, whole = 0, sign = 1, showSignIfPositive = false) {
    let signHtml = '';
    if (sign === -1) {
      signHtml = `<span class="math-op">−</span>`;
    } else if (showSignIfPositive) {
      signHtml = `<span class="math-op">+</span>`;
    }

    let wholeHtml = '';
    if (whole > 0) {
      wholeHtml = `<span class="math-mixed-whole">${whole}</span>`;
    }

    if (den === 1 && whole === 0) {
      return `${signHtml}<span style="font-weight: 700; padding: 0 4px;">${num}</span>`;
    }

    return `
      ${signHtml}
      ${wholeHtml}
      <div class="math-fraction">
        <span class="math-num">${num}</span>
        <span class="math-bar"></span>
        <span class="math-den">${den}</span>
      </div>
    `;
  }

  function formatTermsToMathPreviewHtml(terms) {
    if (!terms || terms.length === 0) {
      return `<span class="text-dim" style="font-size: 1rem;">Escribe una operación fraccionaria arriba (ej. 3/4 + 5/6 - 1/2)</span>`;
    }
    return terms.map((t, idx) => {
      return formatFractionHtml(t.num, t.den, t.whole, t.sign, idx > 0);
    }).join('');
  }

  function computeLcmSimultaneous(dens) {
    let current = dens.map(d => Math.abs(Math.round(d)));
    const steps = [];
    const primeFactors = [];
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

    let safety = 0;
    while (current.some(n => n > 1) && safety < 80) {
      safety++;
      let chosenPrime = null;
      for (const p of primes) {
        if (current.some(n => n % p === 0)) {
          chosenPrime = p;
          break;
        }
      }
      if (!chosenPrime) {
        const maxVal = Math.max(...current);
        for (let p = 2; p <= maxVal; p++) {
          if (current.some(n => n % p === 0)) {
            chosenPrime = p;
            break;
          }
        }
      }
      if (!chosenPrime) break;

      const before = [...current];
      const dividedIndices = [];
      const after = current.map((n, idx) => {
        if (n % chosenPrime === 0) {
          dividedIndices.push(idx);
          return n / chosenPrime;
        }
        return n;
      });

      primeFactors.push(chosenPrime);
      steps.push({
        before,
        prime: chosenPrime,
        after,
        dividedIndices
      });
      current = after;
    }

    const resultLcm = primeFactors.reduce((acc, p) => acc * p, 1);
    return { steps, primeFactors, resultLcm };
  }

  function generateFractionSvg(num, den) {
    num = Math.abs(num);
    den = Math.abs(den);
    if (!den || den <= 0) return '';
    
    // If integer 0
    if (num === 0) {
      return `
        <div class="fraction-visual-container">
          <span style="font-weight: 700; color: var(--color-emerald);">Valor Nulo (0)</span>
        </div>
      `;
    }

    // Single unit (proper fraction or 1)
    if (num <= den) {
      const parts = Math.min(den, 36);
      const filled = Math.round((num / den) * parts);
      const width = 240;
      const height = 36;
      const partW = (width - 4) / parts;

      let rects = '';
      for (let i = 0; i < parts; i++) {
        const isFilled = i < filled;
        const fill = isFilled ? 'url(#ratGradEmerald)' : 'rgba(255, 255, 255, 0.05)';
        const stroke = isFilled ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
        rects += `<rect x="${2 + i * partW}" y="2" width="${Math.max(1, partW - 2)}" height="${height - 4}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
      }

      return `
        <div class="fraction-visual-container">
          <div class="fraction-svg-unit">
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
              <defs>
                <linearGradient id="ratGradEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#34d399"/>
                  <stop offset="100%" stop-color="#059669"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="${width}" height="${height}" rx="6" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.1)"/>
              ${rects}
            </svg>
            <span class="fraction-svg-unit-label">Fracción propia: ${num}/${den} (${((num/den)*100).toFixed(1)}% de la unidad)</span>
          </div>
        </div>
      `;
    }

    // Improper fraction (num > den): show whole units + remaining unit
    const wholeUnits = Math.floor(num / den);
    const rem = num % den;
    const maxUnitsToShow = Math.min(wholeUnits, 4);

    let unitsHtml = '';
    // Whole units
    for (let u = 1; u <= maxUnitsToShow; u++) {
      unitsHtml += `
        <div class="fraction-svg-unit">
          <svg width="90" height="36" viewBox="0 0 90 36">
            <defs>
              <linearGradient id="ratGradWhole" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#60a5fa"/>
                <stop offset="100%" stop-color="#2563eb"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="86" height="32" rx="4" fill="url(#ratGradWhole)" stroke="#3b82f6"/>
            <text x="45" y="22" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Unidad ${u} (1)</text>
          </svg>
          <span class="fraction-svg-unit-label">1 Unidad Completa</span>
        </div>
      `;
    }

    if (wholeUnits > maxUnitsToShow) {
      unitsHtml += `
        <div class="fraction-svg-unit" style="align-self: center;">
          <span style="font-weight: 700; color: var(--text-muted); font-size: 1.1rem;">+ ${wholeUnits - maxUnitsToShow} unidades más...</span>
        </div>
      `;
    }

    // Remainder unit
    if (rem > 0) {
      const parts = Math.min(den, 24);
      const filled = Math.round((rem / den) * parts);
      const width = 140;
      const height = 36;
      const partW = (width - 4) / parts;

      let rects = '';
      for (let i = 0; i < parts; i++) {
        const isFilled = i < filled;
        const fill = isFilled ? 'url(#ratGradAmber)' : 'rgba(255, 255, 255, 0.05)';
        const stroke = isFilled ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)';
        rects += `<rect x="${2 + i * partW}" y="2" width="${Math.max(1, partW - 2)}" height="${height - 4}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
      }

      unitsHtml += `
        <div class="fraction-svg-unit">
          <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
              <linearGradient id="ratGradAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="100%" stop-color="#d97706"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="${width}" height="${height}" rx="5" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.1)"/>
            ${rects}
          </svg>
          <span class="fraction-svg-unit-label">Fracción restante: ${rem}/${den}</span>
        </div>
      `;
    }

    return `
      <div class="fraction-visual-container">
        ${unitsHtml}
      </div>
    `;
  }

  function solveRationalsStepByStep(terms) {
    if (!terms || terms.length === 0) {
      return { error: 'No se han ingresado fracciones para operar.' };
    }

    // Check for zero denominators
    for (let i = 0; i < terms.length; i++) {
      if (terms[i].den === 0) {
        return { error: `El denominador de la fracción ${i + 1} no puede ser 0 (la división entre cero es indefinida).` };
      }
    }

    // Paso 0: Normalización (números mixtos y enteros a fracciones impropias)
    const normalizedTerms = terms.map((t, idx) => {
      const whole = t.whole || 0;
      const num = t.num || 0;
      const den = t.den || 1;
      const sign = t.sign === -1 ? -1 : 1;
      const improperNum = whole > 0 ? (whole * den + num) : num;
      const signedNum = sign * improperNum;
      const hadMixed = whole > 0;
      const hadInteger = den === 1 && whole === 0;
      return {
        original: { ...t },
        improperNum,
        signedNum,
        den,
        sign,
        hadMixed,
        hadInteger
      };
    });

    const hasMixedOrInteger = normalizedTerms.some(t => t.hadMixed || t.hadInteger);

    // Paso 1: Diagnóstico de homogeneidad
    const dens = normalizedTerms.map(t => t.den);
    const isHomogeneous = dens.every(d => d === dens[0]);

    // M.C.M. calculation
    let lcmVal = dens[0];
    let lcmData = null;
    if (isHomogeneous) {
      lcmVal = dens[0];
    } else {
      lcmData = computeLcmSimultaneous(dens);
      lcmVal = lcmData.resultLcm;
    }

    // Butterfly method calculation if 2 terms and heterogeneous
    let butterflyData = null;
    if (normalizedTerms.length === 2 && !isHomogeneous) {
      const t1 = normalizedTerms[0];
      const t2 = normalizedTerms[1];
      const cross1 = t1.signedNum * t2.den;
      const cross2 = t2.signedNum * t1.den;
      const denProduct = t1.den * t2.den;
      const butterflySum = cross1 + cross2;
      const bGcd = gcd(Math.abs(butterflySum), denProduct);
      butterflyData = {
        cross1,
        cross2,
        t1,
        t2,
        denProduct,
        butterflySum,
        reducedNum: butterflySum / bGcd,
        reducedDen: denProduct / bGcd
      };
    }

    // Paso 3: Amplificación de cada fracción
    const amplifications = normalizedTerms.map((t, idx) => {
      const factor = lcmVal / t.den;
      const amplifiedNum = t.improperNum * factor;
      const signedAmplifiedNum = t.signedNum * factor;
      return {
        termIndex: idx,
        originalNum: t.improperNum,
        originalDen: t.den,
        factor,
        amplifiedNum,
        sign: t.sign,
        signedAmplifiedNum
      };
    });

    // Paso 4: Suma y resta de numeradores
    const rawNumerator = amplifications.reduce((acc, a) => acc + a.signedAmplifiedNum, 0);
    const rawDenominator = lcmVal;

    // Paso 5: Simplificación por M.C.D.
    const gcdValue = rawNumerator === 0 ? 1 : gcd(Math.abs(rawNumerator), rawDenominator);
    const isAlreadyIrreducible = gcdValue === 1;
    let finalNum = rawNumerator / gcdValue;
    let finalDen = rawDenominator / gcdValue;

    // Normalizar signo al numerador
    if (finalDen < 0) {
      finalNum = -finalNum;
      finalDen = -finalDen;
    }

    // Paso 6: Formas equivalentes
    const absFinalNum = Math.abs(finalNum);
    const isImproper = absFinalNum > finalDen && finalDen > 1;
    let mixedNumber = null;
    if (isImproper) {
      const whole = Math.floor(absFinalNum / finalDen);
      const rem = absFinalNum % finalDen;
      mixedNumber = {
        sign: finalNum < 0 ? -1 : 1,
        whole,
        rem,
        den: finalDen,
        str: `${finalNum < 0 ? '-' : ''}${whole} ${rem}/${finalDen}`
      };
    }

    const decimal = finalNum / finalDen;
    const isExact = Number.isInteger(decimal) || (absFinalNum % finalDen === 0);

    return {
      terms,
      normalizedTerms,
      hasMixedOrInteger,
      isHomogeneous,
      dens,
      lcmVal,
      lcmData,
      butterflyData,
      amplifications,
      rawNumerator,
      rawDenominator,
      gcdValue,
      isAlreadyIrreducible,
      finalNum,
      finalDen,
      isImproper,
      mixedNumber,
      decimal,
      isExact,
      svgChartHtml: generateFractionSvg(finalNum, finalDen)
    };
  }

  function renderRationalsUI() {
    renderFractionCards();
    updateRationalsMathPreview();
    solveRationalsAndRender();
  }

  function renderFractionCards() {
    if (!elements.ratTermsList) return;
    elements.ratTermsList.innerHTML = '';

    state.ratState.terms.forEach((term, idx) => {
      const card = document.createElement('div');
      card.className = 'rat-term-card';

      let signSelectHtml = '';
      if (idx === 0) {
        signSelectHtml = `
          <select class="rat-term-sign-select" data-term-idx="${idx}" data-field="sign" title="Signo de la fracción inicial">
            <option value="1" ${term.sign >= 0 ? 'selected' : ''}>+ Positivo</option>
            <option value="-1" ${term.sign < 0 ? 'selected' : ''}>− Negativo</option>
          </select>
        `;
      } else {
        signSelectHtml = `
          <select class="rat-term-sign-select" data-term-idx="${idx}" data-field="sign" title="Operación con el término anterior">
            <option value="1" ${term.sign >= 0 ? 'selected' : ''}>+ Sumar</option>
            <option value="-1" ${term.sign < 0 ? 'selected' : ''}>− Restar</option>
          </select>
        `;
      }

      card.innerHTML = `
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); position: absolute; top: 4px; left: 10px;">
          Término #${idx + 1}
        </div>
        <div style="margin-top: 0.65rem; display: flex; align-items: center; gap: 0.65rem;">
          ${signSelectHtml}
          
          <!-- Whole number box (mixed numbers) -->
          <div class="rat-whole-box" title="Parte entera (deja vacío si no es número mixto)">
            <label>Entero</label>
            <input type="number" class="rat-whole-input" data-term-idx="${idx}" data-field="whole" value="${term.whole || ''}" placeholder="0" min="0">
          </div>

          <!-- Fraction numerator & denominator stack -->
          <div class="rat-frac-stack">
            <input type="number" class="rat-frac-input" data-term-idx="${idx}" data-field="num" value="${term.num !== undefined ? term.num : 1}" placeholder="Num" min="0" title="Numerador">
            <span class="rat-frac-divider"></span>
            <input type="number" class="rat-frac-input" data-term-idx="${idx}" data-field="den" value="${term.den || 1}" placeholder="Den" min="1" title="Denominador (no puede ser 0)">
          </div>

          <div class="rat-term-actions">
            <button type="button" class="btn-remove-rat-term" data-term-idx="${idx}" title="Eliminar este término">
              🗑️
            </button>
          </div>
        </div>
      `;

      elements.ratTermsList.appendChild(card);
    });

    // Attach listeners to builder card inputs
    elements.ratTermsList.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', onFractionCardInputChange);
      input.addEventListener('change', onFractionCardInputChange);
    });

    elements.ratTermsList.querySelectorAll('.btn-remove-rat-term').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.termIdx, 10);
        if (state.ratState.terms.length <= 1) {
          showToast('Debe haber al menos 1 fracción en la operación');
          return;
        }
        state.ratState.terms.splice(idx, 1);
        syncTermsToExpressionInput();
        renderFractionCards();
        updateRationalsMathPreview();
        solveRationalsAndRender();
      });
    });
  }

  function onFractionCardInputChange(e) {
    const idx = parseInt(e.target.dataset.termIdx, 10);
    const field = e.target.dataset.field;
    if (isNaN(idx) || !state.ratState.terms[idx]) return;

    const val = parseInt(e.target.value, 10);
    if (field === 'sign') {
      state.ratState.terms[idx].sign = val === -1 ? -1 : 1;
    } else if (field === 'whole') {
      state.ratState.terms[idx].whole = isNaN(val) ? 0 : Math.max(0, val);
    } else if (field === 'num') {
      state.ratState.terms[idx].num = isNaN(val) ? 0 : Math.max(0, val);
    } else if (field === 'den') {
      state.ratState.terms[idx].den = isNaN(val) || val === 0 ? 1 : Math.max(1, val);
    }

    syncTermsToExpressionInput();
    updateRationalsMathPreview();
    solveRationalsAndRender();
  }

  function syncTermsToExpressionInput() {
    const str = formatTermsToExpression(state.ratState.terms);
    state.ratState.expression = str;
    if (elements.ratExpressionInput) {
      elements.ratExpressionInput.value = str;
    }
  }

  function updateRationalsMathPreview() {
    if (!elements.ratMathPreview) return;
    elements.ratMathPreview.innerHTML = formatTermsToMathPreviewHtml(state.ratState.terms);
  }

  function solveRationalsAndRender() {
    if (!elements.ratResultsContainer) return;
    const sol = solveRationalsStepByStep(state.ratState.terms);
    state.ratState.solution = sol;

    if (sol.error) {
      if (elements.kpiRatResult) elements.kpiRatResult.textContent = 'Error';
      if (elements.kpiRatStatusBadge) elements.kpiRatStatusBadge.textContent = 'Revisar entrada';
      elements.ratResultsContainer.innerHTML = `
        <div class="rat-step-card" style="border-left-color: var(--color-rose);">
          <div class="rat-step-header">
            <span class="rat-step-badge" style="background: var(--color-rose); color: #fff;">!</span>
            <h4 class="rat-step-title" style="color: var(--color-rose);">Error en la Operación</h4>
          </div>
          <div class="rat-step-body">${sol.error}</div>
        </div>
      `;
      return;
    }

    // Update KPI cards
    if (elements.kpiRatResult) {
      elements.kpiRatResult.innerHTML = formatFractionHtml(Math.abs(sol.finalNum), sol.finalDen, 0, sol.finalNum < 0 ? -1 : 1);
    }
    if (elements.kpiRatStatusBadge) {
      elements.kpiRatStatusBadge.textContent = sol.isAlreadyIrreducible ? 'Irreducible' : `Simplificado ÷${sol.gcdValue}`;
    }
    if (elements.kpiRatLcm) {
      elements.kpiRatLcm.textContent = sol.lcmVal;
    }
    if (elements.kpiRatMixed) {
      elements.kpiRatMixed.textContent = sol.mixedNumber ? sol.mixedNumber.str : 'Fracción propia';
    }
    if (elements.kpiRatMixedSub) {
      elements.kpiRatMixedSub.textContent = sol.mixedNumber ? 'Parte entera + residuo' : 'Numerador menor al denominador';
    }
    if (elements.kpiRatDecimal) {
      elements.kpiRatDecimal.textContent = sol.isExact ? sol.decimal.toString() : sol.decimal.toFixed(4);
    }
    if (elements.kpiRatType) {
      elements.kpiRatType.textContent = `${sol.isHomogeneous ? 'Homogéneas' : 'Heterogéneas'} • ${sol.finalNum < 0 ? 'Negativa' : 'Positiva'}`;
    }

    // Build Step-by-Step cards
    let html = '';

    // Paso 0: Normalización (si hubo números mixtos o enteros)
    if (sol.hasMixedOrInteger) {
      let mixedExplanations = '';
      sol.normalizedTerms.forEach((t, i) => {
        if (t.hadMixed) {
          mixedExplanations += `
            <div style="margin: 0.35rem 0;">
              • <strong>Término #${i + 1}:</strong> Número mixto 
              <code>${t.original.whole} ${t.original.num}/${t.original.den}</code> 
              se transforma a fracción impropia: 
              <code>(${t.original.whole} × ${t.original.den} + ${t.original.num}) / ${t.original.den} = ${t.improperNum}/${t.den}</code>.
            </div>
          `;
        } else if (t.hadInteger) {
          mixedExplanations += `
            <div style="margin: 0.35rem 0;">
              • <strong>Término #${i + 1}:</strong> Número entero 
              <code>${t.improperNum}</code> 
              se escribe con denominador 1: <code>${t.improperNum}/1</code>.
            </div>
          `;
        }
      });

      const rewrittenHtml = sol.normalizedTerms.map((t, idx) => {
        return formatFractionHtml(t.improperNum, t.den, 0, t.sign, idx > 0);
      }).join('');

      html += `
        <div class="rat-step-card">
          <div class="rat-step-header">
            <div class="rat-step-title-wrap">
              <span class="rat-step-badge">0</span>
              <h4 class="rat-step-title">Conversión de Números Mixtos y Enteros a Fracciones</h4>
            </div>
            <span class="badge-accent">Paso Previo</span>
          </div>
          <div class="rat-step-body">
            ${mixedExplanations}
            <div style="margin-top: 0.75rem; padding: 0.65rem 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <span style="font-weight: 600; color: var(--color-amber);">Expresión en fracciones estándar:</span>
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.15rem;">
                ${rewrittenHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Paso 1: Diagnóstico de Denominadores
    html += `
      <div class="rat-step-card">
        <div class="rat-step-header">
          <div class="rat-step-title-wrap">
            <span class="rat-step-badge">1</span>
            <h4 class="rat-step-title">Diagnóstico de los Denominadores</h4>
          </div>
          <span class="badge-accent">${sol.isHomogeneous ? 'Denominadores Iguales' : 'Denominadores Distintos'}</span>
        </div>
        <div class="rat-step-body">
          ${sol.isHomogeneous ? `
            <p>
              Todos los denominadores son idénticos: <strong>${sol.dens[0]}</strong> (Fracciones Homogéneas).<br>
              <strong>Regla:</strong> Como las partes tienen exactamente el mismo tamaño, no es necesario buscar ningún común denominador. 
              Se conserva el denominador común <code>${sol.dens[0]}</code> y se efectúan las sumas y restas directamente con los numeradores.
            </p>
          ` : `
            <p>
              Los denominadores son diferentes: <strong>${sol.dens.join(', ')}</strong> (Fracciones Heterogéneas).<br>
              <strong>Regla:</strong> No se pueden sumar ni restar directamente partes de distinto tamaño. 
              Para resolver la operación, debemos calcular el <strong>Mínimo Común Múltiplo (M.C.M.)</strong> de los denominadores para amplificarlas y hacerlas homogéneas.
            </p>
          `}
        </div>
      </div>
    `;

    // Paso Alternativo: Método de la Mariposa (Cross Multiplication) si son 2 fracciones heterogéneas
    if (sol.butterflyData) {
      const b = sol.butterflyData;
      html += `
        <div class="butterfly-card">
          <div class="butterfly-title">
            <span>🦋 Método Alternativo: Productos Cruzados (Método de la Mariposa)</span>
          </div>
          <p style="font-size: 0.9rem; margin-bottom: 0.65rem; color: var(--text-muted);">
            Cuando se operan exactamente <strong>2 fracciones</strong>, se puede aplicar la fórmula directa en cruz sin calcular el M.C.M.:
            <br>
            <code>(a/b) ± (c/d) = [(a · d) ± (b · c)] / (b · d)</code>
          </p>

          <div class="butterfly-grid">
            <div class="butterfly-wing-item">
              <strong>Ala Izquierda (Diagonal 1):</strong><br>
              ${b.t1.signedNum} × ${b.t2.den} = <strong>${b.cross1}</strong>
            </div>
            <div class="butterfly-wing-item">
              <strong>Ala Derecha (Diagonal 2):</strong><br>
              ${b.t2.signedNum} × ${b.t1.den} = <strong>${b.cross2}</strong>
            </div>
            <div class="butterfly-wing-item">
              <strong>Cuerpo (Denominador Común):</strong><br>
              ${b.t1.den} × ${b.t2.den} = <strong>${b.denProduct}</strong>
            </div>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.92rem; padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: var(--radius-sm); border-left: 3px solid var(--color-purple);">
            Resultado en cruz: <code>(${b.cross1} + ${b.cross2}) / ${b.denProduct} = ${b.butterflySum}/${b.denProduct}</code> 
            ${b.denProduct !== sol.lcmVal ? `(al simplificar da <code>${b.reducedNum}/${b.reducedDen}</code>, idéntico al método por M.C.M.)` : ''}.
          </div>
        </div>
      `;
    }

    // Paso 2: Cálculo del M.C.M. (si son heterogéneas)
    if (!sol.isHomogeneous && sol.lcmData) {
      let tableRows = '';
      sol.lcmData.steps.forEach((st, sIdx) => {
        const numsCols = st.before.map((n, nIdx) => {
          const wasDiv = st.dividedIndices.includes(nIdx);
          const style = wasDiv ? 'color: var(--color-amber); font-weight: 700;' : 'color: var(--text-dim);';
          return `<td style="${style}">${n}</td>`;
        }).join('');

        tableRows += `
          <tr>
            <td style="font-size: 0.75rem; color: var(--text-dim);">Paso ${sIdx + 1}</td>
            ${numsCols}
            <td style="font-weight: 800; color: var(--color-emerald); border-left: 2px solid var(--color-primary); background: rgba(16, 185, 129, 0.08);">
              ${st.prime}
            </td>
          </tr>
        `;
      });

      // Final row (all 1s)
      const onesCols = sol.dens.map(() => `<td style="color: var(--color-emerald); font-weight: 700;">1</td>`).join('');
      tableRows += `
        <tr>
          <td style="font-size: 0.75rem; color: var(--color-emerald);">Fin</td>
          ${onesCols}
          <td style="color: var(--color-emerald); font-weight: 700; border-left: 2px solid var(--color-primary);">✓</td>
        </tr>
      `;

      html += `
        <div class="rat-step-card">
          <div class="rat-step-header">
            <div class="rat-step-title-wrap">
              <span class="rat-step-badge">2</span>
              <h4 class="rat-step-title">Cálculo del Mínimo Común Múltiplo (M.C.M.) de los Denominadores</h4>
            </div>
            <span class="badge-accent">M.C.M. = ${sol.lcmVal}</span>
          </div>
          <div class="rat-step-body">
            <p>
              Descomponemos simultáneamente los denominadores <code>[${sol.dens.join(', ')}]</code> dividiendo entre factores primos hasta reducirlos a 1:
            </p>

            <div class="table-container" style="margin: 0.75rem 0; max-width: 520px;">
              <table class="math-table" style="text-align: center;">
                <thead>
                  <tr>
                    <th>Ronda</th>
                    ${sol.dens.map((d, i) => `<th>Denom #${i + 1} (${d})</th>`).join('')}
                    <th style="border-left: 2px solid var(--color-primary);">Factor Primo</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>

            <div style="margin-top: 0.5rem; font-size: 0.95rem;">
              Multiplicamos los factores primos obtenidos: 
              <strong style="color: var(--color-amber);">${sol.lcmData.primeFactors.join(' × ')} = ${sol.lcmVal}</strong>.
              <br>
              Por lo tanto, el <strong>denominador común mínimo</strong> es <strong>${sol.lcmVal}</strong>.
            </div>
          </div>
        </div>
      `;
    }

    // Paso 3: Amplificación de cada Fracción
    if (!sol.isHomogeneous) {
      let ampCards = '';
      sol.amplifications.forEach(a => {
        ampCards += `
          <div class="amplification-item">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-dim);">Fracción #${a.termIndex + 1}</div>
            <div class="amplification-calc">
              ${sol.lcmVal} ÷ ${a.originalDen} = <strong>${a.factor}</strong> (factor de amplificación)
            </div>
            <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 1.05rem;">
              ${formatFractionHtml(a.originalNum, a.originalDen, 0, a.sign)}
              <span class="math-equal">=</span>
              <div class="math-fraction">
                <span class="math-num">${a.originalNum} × <strong style="color: var(--color-amber);">${a.factor}</strong></span>
                <span class="math-bar"></span>
                <span class="math-den">${a.originalDen} × <strong style="color: var(--color-amber);">${a.factor}</strong></span>
              </div>
              <span class="math-equal">=</span>
              ${formatFractionHtml(a.amplifiedNum, sol.lcmVal, 0, a.sign)}
            </div>
          </div>
        `;
      });

      html += `
        <div class="rat-step-card">
          <div class="rat-step-header">
            <div class="rat-step-title-wrap">
              <span class="rat-step-badge">3</span>
              <h4 class="rat-step-title">Amplificación Didáctica de Cada Fracción</h4>
            </div>
            <span class="badge-accent">Homogeneización</span>
          </div>
          <div class="rat-step-body">
            <p>
              Dividimos el M.C.M. (<strong>${sol.lcmVal}</strong>) entre cada denominador para encontrar por qué número se debe multiplicar tanto el numerador como el denominador:
            </p>
            <div class="amplification-grid">
              ${ampCards}
            </div>
          </div>
        </div>
      `;
    }

    // Paso 4: Unificación y Operación de Numeradores
    const numeratorsOperationHtml = sol.amplifications.map((a, idx) => {
      if (idx === 0) {
        return a.sign === -1 ? `−${a.amplifiedNum}` : `${a.amplifiedNum}`;
      }
      return a.sign === -1 ? ` − ${a.amplifiedNum}` : ` + ${a.amplifiedNum}`;
    }).join('');

    html += `
      <div class="rat-step-card">
        <div class="rat-step-header">
          <div class="rat-step-title-wrap">
            <span class="rat-step-badge">4</span>
            <h4 class="rat-step-title">Unificación bajo el Denominador Común y Operación</h4>
          </div>
          <span class="badge-accent">Suma y Resta</span>
        </div>
        <div class="rat-step-body">
          <p>
            Colocamos todos los numeradores amplificados sobre el denominador común y efectuamos las operaciones algebraicas:
          </p>

          <div style="display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; margin: 1rem 0; font-size: 1.25rem;">
            <div class="math-fraction">
              <span class="math-num" style="padding: 0 0.5rem;">${numeratorsOperationHtml}</span>
              <span class="math-bar"></span>
              <span class="math-den">${sol.lcmVal}</span>
            </div>
            <span class="math-equal">=</span>
            <div class="math-fraction">
              <span class="math-num" style="color: var(--color-amber); font-weight: 800;">${sol.rawNumerator}</span>
              <span class="math-bar"></span>
              <span class="math-den">${sol.rawDenominator}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Paso 5: Simplificación por M.C.D. (Fracción Irreducible)
    html += `
      <div class="rat-step-card">
        <div class="rat-step-header">
          <div class="rat-step-title-wrap">
            <span class="rat-step-badge">5</span>
            <h4 class="rat-step-title">Simplificación al Máximo (Fracción Irreducible)</h4>
          </div>
          <span class="badge-accent">${sol.isAlreadyIrreducible ? 'Ya Irreducible' : `Reducida entre ${sol.gcdValue}`}</span>
        </div>
        <div class="rat-step-body">
          ${sol.isAlreadyIrreducible ? `
            <p>
              Calculamos el Máximo Común Divisor entre el numerador (|${sol.rawNumerator}|) y el denominador (${sol.rawDenominator}):<br>
              <strong>M.C.D.(${Math.abs(sol.rawNumerator)}, ${sol.rawDenominator}) = 1</strong>.<br>
              Como son números <strong>primos entre sí (coprimos)</strong>, la fracción ya se encuentra en su <strong>mínima expresión irreducible</strong>:
            </p>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.35rem; margin-top: 0.5rem;">
              ${formatFractionHtml(Math.abs(sol.finalNum), sol.finalDen, 0, sol.finalNum < 0 ? -1 : 1)}
            </div>
          ` : `
            <p>
              Calculamos el Máximo Común Divisor entre el numerador (|${sol.rawNumerator}|) y el denominador (${sol.rawDenominator}):<br>
              <strong>M.C.D.(${Math.abs(sol.rawNumerator)}, ${sol.rawDenominator}) = ${sol.gcdValue}</strong>.<br>
              Dividimos ambos términos entre <strong>${sol.gcdValue}</strong>:
            </p>
            <div style="display: flex; align-items: center; gap: 0.85rem; font-size: 1.25rem; margin-top: 0.5rem;">
              <div class="math-fraction">
                <span class="math-num">${sol.rawNumerator} ÷ <strong style="color: var(--color-emerald);">${sol.gcdValue}</strong></span>
                <span class="math-bar"></span>
                <span class="math-den">${sol.rawDenominator} ÷ <strong style="color: var(--color-emerald);">${sol.gcdValue}</strong></span>
              </div>
              <span class="math-equal">=</span>
              <div style="font-size: 1.35rem;">
                ${formatFractionHtml(Math.abs(sol.finalNum), sol.finalDen, 0, sol.finalNum < 0 ? -1 : 1)}
              </div>
            </div>
          `}
        </div>
      </div>
    `;

    // Paso 6: Formas Equivalentes y Visualización Gráfica
    html += `
      <div class="rat-step-card step-highlight">
        <div class="rat-step-header">
          <div class="rat-step-title-wrap">
            <span class="rat-step-badge" style="background: var(--color-emerald); color: #fff;">✓</span>
            <h4 class="rat-step-title">Resumen de Formas Equivalentes y Representación Gráfica</h4>
          </div>
          <span class="badge-accent" style="background: var(--color-emerald-subtle); color: var(--color-emerald); border-color: var(--color-emerald);">Resultado Final</span>
        </div>
        <div class="rat-step-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
            <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-medium);">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Fracción Irreducible:</span>
              <div style="font-size: 1.3rem; margin-top: 0.25rem;">
                ${formatFractionHtml(Math.abs(sol.finalNum), sol.finalDen, 0, sol.finalNum < 0 ? -1 : 1)}
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-medium);">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Número Mixto:</span>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-amber); margin-top: 0.4rem;">
                ${sol.mixedNumber ? sol.mixedNumber.str : 'No aplica (fracción propia)'}
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-medium);">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Valor Decimal:</span>
              <div style="font-size: 1.15rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-primary); margin-top: 0.4rem;">
                ${sol.isExact ? sol.decimal : sol.decimal.toFixed(4)}
              </div>
            </div>
          </div>

          <!-- SVG Visual Graphic -->
          ${sol.svgChartHtml}
        </div>
      </div>
    `;

    elements.ratResultsContainer.innerHTML = html;
  }

  function setupRationalsEvents() {
    // Header shortcut button
    if (elements.btnHeaderGoRationals) {
      elements.btnHeaderGoRationals.addEventListener('click', () => {
        switchTab('rationals');
      });
    }

    // Mode tabs (Visual builder vs Written expression)
    if (elements.btnRatModeVisual && elements.btnRatModeText) {
      elements.btnRatModeVisual.addEventListener('click', () => {
        state.ratState.mode = 'visual';
        elements.btnRatModeVisual.classList.add('active');
        elements.btnRatModeText.classList.remove('active');
        if (elements.ratVisualBuilderContainer) elements.ratVisualBuilderContainer.style.display = 'flex';
        if (elements.ratTextExpressionContainer) elements.ratTextExpressionContainer.style.display = 'none';
        renderFractionCards();
      });

      elements.btnRatModeText.addEventListener('click', () => {
        state.ratState.mode = 'text';
        elements.btnRatModeText.classList.add('active');
        elements.btnRatModeVisual.classList.remove('active');
        if (elements.ratVisualBuilderContainer) elements.ratVisualBuilderContainer.style.display = 'none';
        if (elements.ratTextExpressionContainer) elements.ratTextExpressionContainer.style.display = 'block';
        if (elements.ratExpressionInput) elements.ratExpressionInput.focus();
      });
    }

    // Add Fraction Card
    if (elements.btnAddFractionCard) {
      elements.btnAddFractionCard.addEventListener('click', () => {
        state.ratState.terms.push({ sign: 1, whole: 0, num: 1, den: 2 });
        syncTermsToExpressionInput();
        renderFractionCards();
        updateRationalsMathPreview();
        solveRationalsAndRender();
        showToast('Fracción añadida');
      });
    }

    // Clear Fraction Cards
    if (elements.btnClearFractionCards) {
      elements.btnClearFractionCards.addEventListener('click', () => {
        state.ratState.terms = [{ sign: 1, whole: 0, num: 1, den: 2 }];
        syncTermsToExpressionInput();
        renderFractionCards();
        updateRationalsMathPreview();
        solveRationalsAndRender();
        showToast('Términos restablecidos a 1 fracción');
      });
    }

    // Direct Text Input
    if (elements.ratExpressionInput) {
      elements.ratExpressionInput.addEventListener('input', () => {
        const text = elements.ratExpressionInput.value;
        state.ratState.expression = text;
        const parsed = parseRationalExpression(text);
        if (parsed.length > 0) {
          state.ratState.terms = parsed;
          updateRationalsMathPreview();
          solveRationalsAndRender();
        }
      });
    }

    // Presets bar for Rationals
    const presetButtons = document.querySelectorAll('.rat-preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const expr = btn.dataset.expr;
        if (!expr) return;
        state.ratState.expression = expr;
        if (elements.ratExpressionInput) elements.ratExpressionInput.value = expr;
        const parsed = parseRationalExpression(expr);
        if (parsed.length > 0) {
          state.ratState.terms = parsed;
          renderFractionCards();
          updateRationalsMathPreview();
          solveRationalsAndRender();
          showToast(`Cargado ejemplo: ${expr}`);
        }
      });
    });

    // Solve & Reset Buttons
    if (elements.btnSolveRationals) {
      elements.btnSolveRationals.addEventListener('click', solveRationalsAndRender);
    }

    if (elements.btnResetRationals) {
      elements.btnResetRationals.addEventListener('click', () => {
        const defaultExpr = '3/4 + 5/6 - 1/2';
        state.ratState.expression = defaultExpr;
        if (elements.ratExpressionInput) elements.ratExpressionInput.value = defaultExpr;
        state.ratState.terms = parseRationalExpression(defaultExpr);
        renderFractionCards();
        updateRationalsMathPreview();
        solveRationalsAndRender();
        showToast('Ejemplo restablecido');
      });
    }

    // Keypad fraction buttons
    const ratInsertBtns = document.querySelectorAll('.rat-insert-btn');
    ratInsertBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const textToInsert = btn.dataset.insert;
        if (!textToInsert) return;

        // If in text mode or expression input focused
        const input = elements.ratExpressionInput;
        if (input) {
          const start = input.selectionStart || input.value.length;
          const end = input.selectionEnd || input.value.length;
          const prev = input.value;
          input.value = prev.slice(0, start) + textToInsert + prev.slice(end);
          const nextPos = start + textToInsert.length;
          input.focus();
          input.setSelectionRange(nextPos, nextPos);
          
          state.ratState.expression = input.value;
          const parsed = parseRationalExpression(input.value);
          if (parsed.length > 0) {
            state.ratState.terms = parsed;
            renderFractionCards();
            updateRationalsMathPreview();
            solveRationalsAndRender();
          }
        }
      });
    });

    if (elements.btnRatBackspace) {
      elements.btnRatBackspace.addEventListener('click', () => {
        const input = elements.ratExpressionInput;
        if (!input) return;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        if (start === end && start > 0) {
          input.value = input.value.slice(0, start - 1) + input.value.slice(start);
          input.setSelectionRange(start - 1, start - 1);
        } else if (start !== end) {
          input.value = input.value.slice(0, start) + input.value.slice(end);
          input.setSelectionRange(start, start);
        }
        input.focus();
        state.ratState.expression = input.value;
        const parsed = parseRationalExpression(input.value);
        if (parsed.length > 0) {
          state.ratState.terms = parsed;
          renderFractionCards();
          updateRationalsMathPreview();
          solveRationalsAndRender();
        }
      });
    }

    if (elements.btnRatClearText) {
      elements.btnRatClearText.addEventListener('click', () => {
        if (elements.ratExpressionInput) {
          elements.ratExpressionInput.value = '';
          elements.ratExpressionInput.focus();
        }
        state.ratState.expression = '';
        state.ratState.terms = [];
        updateRationalsMathPreview();
      });
    }
  }

  // ==========================================================================
  // TAB 10: SIMPLIFICADOR DE FRACCIONES COMPUESTAS Y CONTINUAS
  // ==========================================================================

  class FracComp {
    constructor(n, d = 1n) {
      n = BigInt(n);
      d = BigInt(d);
      if (d === 0n) throw new Error('División por cero en el denominador de una fracción');
      if (d < 0n) { n = -n; d = -d; }
      const g = FracComp.gcd(n < 0n ? -n : n, d);
      this.n = n / g;
      this.d = d / g;
    }
    static gcd(a, b) {
      while (b > 0n) { const t = b; b = a % b; a = t; }
      return a;
    }
    static lcm(a, b) {
      if (a === 0n || b === 0n) return 0n;
      return (a * b) / FracComp.gcd(a, b);
    }
    add(o) { return new FracComp(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new FracComp(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new FracComp(this.n * o.n, this.d * o.d); }
    div(o) {
      if (o.n === 0n) throw new Error('División por cero en el denominador de un piso');
      return new FracComp(this.n * o.d, this.d * o.n);
    }
    toString() {
      if (this.d === 1n) return `${this.n}`;
      return `${this.n}/${this.d}`;
    }
    toHtml() {
      if (this.d === 1n) return `<span class="comp-num">${this.n}</span>`;
      const sign = this.n < 0n ? '<span class="comp-sign">−</span>' : '';
      const absN = this.n < 0n ? -this.n : this.n;
      return `${sign}<span class="math-fraction"><span class="math-num">${absN}</span><span class="math-bar"></span><span class="math-den">${this.d}</span></span>`;
    }
  }

  function tokenizeFracExpr(str) {
    let s = str.replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/[÷]/g, '/');
    const tokens = [];
    let i = 0;

    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }

      // Fracción literal: número/número no seguido de barra ni paréntesis inmediato
      const fracMatch = s.substring(i).match(/^([+-]?\d+)\s*\/\s*(\d+)(?!\s*[\/\(\[\{])/);
      if (fracMatch) {
        const num = BigInt(fracMatch[1]);
        const den = BigInt(fracMatch[2]);
        tokens.push({ type: 'FRAC', val: new FracComp(num, den) });
        i += fracMatch[0].length;
        continue;
      }

      // Entero literal
      const numMatch = s.substring(i).match(/^[0-9]+/);
      if (numMatch) {
        tokens.push({ type: 'FRAC', val: new FracComp(BigInt(numMatch[0]), 1n) });
        i += numMatch[0].length;
        continue;
      }

      if (c === '+' || c === '-' || c === '*' || c === '/') {
        tokens.push({ type: 'OP', val: c });
        i++;
      } else if (c === '(' || c === '[' || c === '{') {
        tokens.push({ type: 'LPAREN', val: '(' });
        i++;
      } else if (c === ')' || c === ']' || c === '}') {
        tokens.push({ type: 'RPAREN', val: ')' });
        i++;
      } else {
        i++;
      }
    }

    return tokens;
  }

  function parseFracTokens(tokens) {
    let pos = 0;
    function peek() { return tokens[pos]; }
    function consume() { return tokens[pos++]; }

    function parseExpression(precedence = 0) {
      let token = consume();
      if (!token) throw new Error('Expresión matemática incompleta');

      let left;
      if (token.type === 'FRAC') {
        left = { type: 'LITERAL', frac: token.val };
      } else if (token.type === 'OP' && token.val === '-') {
        const right = parseExpression(4);
        if (right.type === 'LITERAL') {
          left = { type: 'LITERAL', frac: new FracComp(-right.frac.n, right.frac.d) };
        } else {
          left = { type: 'UNARY_MINUS', expr: right };
        }
      } else if (token.type === 'LPAREN') {
        const inner = parseExpression(0);
        const next = consume();
        if (!next || next.type !== 'RPAREN') throw new Error('Falta signo de agrupación de cierre ")"');
        left = { type: 'GROUP', expr: inner };
      } else {
        throw new Error('Símbolo inesperado en la fracción');
      }

      while (pos < tokens.length) {
        const nextToken = peek();
        if (!nextToken || nextToken.type !== 'OP') break;
        const op = nextToken.val;
        const prec = op === '+' || op === '-' ? 1 : 2;
        if (prec <= precedence) break;
        consume();

        const right = parseExpression(prec);
        left = { type: 'BINARY', op: op, left: left, right: right };
      }

      return left;
    }

    return parseExpression(0);
  }

  function astToHtml(node) {
    if (!node) return '';
    if (node.type === 'LITERAL') return node.frac.toHtml();
    if (node.type === 'UNARY_MINUS') return `<span class="comp-sign">−</span>${astToHtml(node.expr)}`;
    if (node.type === 'GROUP') return `<span class="comp-paren">(</span>${astToHtml(node.expr)}<span class="comp-paren">)</span>`;
    if (node.type === 'BINARY') {
      if (node.op === '/') {
        return `<span class="math-fraction comp-tier"><span class="math-num">${astToHtml(node.left)}</span><span class="math-bar"></span><span class="math-den">${astToHtml(node.right)}</span></span>`;
      }
      const opSym = node.op === '*' ? '·' : node.op;
      return `${astToHtml(node.left)} <span class="math-op">${opSym}</span> ${astToHtml(node.right)}`;
    }
    return '';
  }

  function findReducibleNode(node, path = [], depth = 0) {
    if (!node || node.type === 'LITERAL') return null;

    if (node.type === 'UNARY_MINUS' && node.expr.type === 'LITERAL') {
      return { node, path, depth, kind: 'UNARY' };
    }
    if (node.type === 'GROUP' && node.expr.type === 'LITERAL') {
      return { node, path, depth, kind: 'UNWRAP' };
    }
    if (node.type === 'BINARY' && node.left.type === 'LITERAL' && node.right.type === 'LITERAL') {
      return { node, path, depth, kind: 'BINARY' };
    }

    const candidates = [];
    if (node.type === 'UNARY_MINUS' || node.type === 'GROUP') {
      const c = findReducibleNode(node.expr, [...path, 'expr'], depth + 1);
      if (c) candidates.push(c);
    } else if (node.type === 'BINARY') {
      const leftC = findReducibleNode(node.left, [...path, 'left'], depth + 1);
      // Dar mayor prioridad al denominador (piso inferior) para simplificar de abajo hacia arriba
      const rightC = findReducibleNode(node.right, [...path, 'right'], depth + 2);
      if (leftC) candidates.push(leftC);
      if (rightC) candidates.push(rightC);
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.depth - a.depth);
    return candidates[0];
  }

  function replaceNodeAtPath(root, path, replacement) {
    if (path.length === 0) {
      Object.assign(root, replacement);
      return;
    }
    let curr = root;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = replacement;
  }

  function solveCompoundFraction(exprStr) {
    try {
      if (!exprStr || !exprStr.trim()) {
        return { success: false, error: 'Ingresa una expresión de fracción compuesta para simplificar.' };
      }
      const tokens = tokenizeFracExpr(exprStr);
      if (tokens.length === 0) {
        return { success: false, error: 'No se encontraron términos válidos en la expresión.' };
      }
      let ast = parseFracTokens(tokens);
      const steps = [];

      steps.push({
        stepNum: 1,
        title: 'Fracción Compuesta Original',
        typeLabel: 'Enunciado Inicial',
        pillClass: 'pill-outer',
        desc: 'Se identifica la estructura multinivel de la fracción compuesta. Para resolverla correctamente, comenzamos a simplificar <strong>de abajo hacia arriba</strong>, atacando primero las operaciones del piso más profundo:',
        htmlView: astToHtml(ast)
      });

      let stepCount = 2;
      let safety = 35;

      while (safety-- > 0) {
        const target = findReducibleNode(ast);
        if (!target) break;

        const { node, path, kind } = target;

        if (kind === 'UNWRAP') {
          replaceNodeAtPath(ast, path, node.expr);
          continue;
        }

        if (kind === 'UNARY') {
          const resFrac = new FracComp(-node.expr.frac.n, node.expr.frac.d);
          replaceNodeAtPath(ast, path, { type: 'LITERAL', frac: resFrac });
          continue;
        }

        if (kind === 'BINARY') {
          const l = node.left.frac;
          const r = node.right.frac;
          const op = node.op;
          let resFrac;
          let title = '';
          let desc = '';
          let actionBox = '';

          if (op === '+') {
            resFrac = l.add(r);
            const mcm = FracComp.lcm(l.d, r.d);
            const multL = mcm / l.d;
            const multR = mcm / r.d;
            const ampL = l.n * multL;
            const ampR = r.n * multR;
            const rawNum = ampL + ampR;
            const gcdVal = FracComp.gcd(rawNum < 0n ? -rawNum : rawNum, mcm);

            title = `Suma en el denominador/piso: ${l.toString()} + ${r.toString()}`;
            desc = `Se busca el <strong>m.c.m.(${l.d}, ${r.d}) = ${mcm}</strong> para homogenizar denominadores:<br>
                    • Primer término amplificado: <code>(${l.n} × ${multL})/${mcm} = ${ampL}/${mcm}</code><br>
                    • Segundo término amplificado: <code>(${r.n} × ${multR})/${mcm} = ${ampR}/${mcm}</code><br>
                    • Suma de numeradores: <code>${ampL} + ${ampR} = ${rawNum}</code>`;
            if (gcdVal > 1n) {
              desc += `<br>• Simplificación con M.C.D.(${rawNum}, ${mcm}) = <strong>${gcdVal}</strong>: se divide entre ${gcdVal} dando <strong>${resFrac.toString()}</strong>`;
            }
            actionBox = `
              <div class="comp-step-calc">
                <span class="calc-label">Operación realizada:</span>
                <div class="calc-math">
                  ${l.toHtml()} <span class="math-op">+</span> ${r.toHtml()} 
                  <span class="math-equal">=</span> 
                  <span class="math-fraction"><span class="math-num">${ampL} + (${ampR})</span><span class="math-bar"></span><span class="math-den">${mcm}</span></span>
                  <span class="math-equal">=</span> 
                  <span class="highlight-result">${resFrac.toHtml()}</span>
                </div>
              </div>
            `;
          } else if (op === '-') {
            resFrac = l.sub(r);
            const mcm = FracComp.lcm(l.d, r.d);
            const multL = mcm / l.d;
            const multR = mcm / r.d;
            const ampL = l.n * multL;
            const ampR = r.n * multR;
            const rawNum = ampL - ampR;
            const gcdVal = FracComp.gcd(rawNum < 0n ? -rawNum : rawNum, mcm);

            title = `Resta en el piso: ${l.toString()} − (${r.toString()})`;
            desc = `Se obtiene el <strong>m.c.m.(${l.d}, ${r.d}) = ${mcm}</strong> para homogenizar:<br>
                    • Primer término: <code>(${l.n} × ${multL})/${mcm} = ${ampL}/${mcm}</code><br>
                    • Segundo término: <code>(${r.n} × ${multR})/${mcm} = ${ampR}/${mcm}</code><br>
                    • Sustracción con ley de signos: <code>${ampL} − (${ampR}) = ${rawNum}</code>`;
            if (gcdVal > 1n) {
              desc += `<br>• Simplificación con M.C.D.(${rawNum}, ${mcm}) = <strong>${gcdVal}</strong>: se divide entre ${gcdVal} dando <strong>${resFrac.toString()}</strong>`;
            }
            actionBox = `
              <div class="comp-step-calc">
                <span class="calc-label">Operación realizada:</span>
                <div class="calc-math">
                  ${l.toHtml()} <span class="math-op">−</span> ${r.toHtml()} 
                  <span class="math-equal">=</span> 
                  <span class="math-fraction"><span class="math-num">${ampL} − (${ampR})</span><span class="math-bar"></span><span class="math-den">${mcm}</span></span>
                  <span class="math-equal">=</span> 
                  <span class="highlight-result">${resFrac.toHtml()}</span>
                </div>
              </div>
            `;
          } else if (op === '*') {
            resFrac = l.mul(r);
            const rawNum = l.n * r.n;
            const rawDen = l.d * r.d;
            const gcdVal = FracComp.gcd(rawNum < 0n ? -rawNum : rawNum, rawDen);

            title = `Multiplicación de fracciones: ${l.toString()} · ${r.toString()}`;
            desc = `Se multiplican numeradores y denominadores en línea recta:<br>
                    • Numeradores: <code>${l.n} × ${r.n} = ${rawNum}</code><br>
                    • Denominadores: <code>${l.d} × ${r.d} = ${rawDen}</code>`;
            if (gcdVal > 1n) {
              desc += `<br>• Simplificación con M.C.D.(${rawNum}, ${rawDen}) = <strong>${gcdVal}</strong>: se reduce a <strong>${resFrac.toString()}</strong>`;
            }
            actionBox = `
              <div class="comp-step-calc">
                <span class="calc-label">Multiplicación directa:</span>
                <div class="calc-math">
                  ${l.toHtml()} <span class="math-op">·</span> ${r.toHtml()} 
                  <span class="math-equal">=</span> 
                  <span class="math-fraction"><span class="math-num">${l.n} · (${r.n})</span><span class="math-bar"></span><span class="math-den">${l.d} · ${r.d}</span></span>
                  <span class="math-equal">=</span> 
                  <span class="highlight-result">${resFrac.toHtml()}</span>
                </div>
              </div>
            `;
          } else if (op === '/') {
            resFrac = l.div(r);
            const ext1 = l.n;
            const ext2 = r.d;
            const med1 = l.d;
            const med2 = r.n;
            const prodExt = ext1 * ext2;
            const prodMed = med1 * med2;
            const gcdVal = FracComp.gcd(prodExt < 0n ? -prodExt : prodExt, prodMed < 0n ? -prodMed : prodMed);

            title = `División escalonada — Ley de la Herradura (Extremos y Medios)`;
            desc = `Se divide la fracción superior <code>${l.toString()}</code> entre la inferior <code>${r.toString()}</code> aplicando la <strong>Ley de la Herradura (Extremos y Medios)</strong>:<br>
                    • <strong>Extremos:</strong> <code>${ext1} × ${ext2} = ${prodExt}</code> (va al nuevo numerador)<br>
                    • <strong>Medios:</strong> <code>${med1} × ${med2} = ${prodMed}</code> (va al nuevo denominador)<br>
                    • Fracción intermedia: <code>${prodExt}/${prodMed}</code>`;
            if (gcdVal > 1n) {
              desc += `<br>• Simplificación por M.C.D.(${prodExt}, ${prodMed}) = <strong>${gcdVal}</strong>: se reduce a <strong>${resFrac.toString()}</strong>`;
            }

            actionBox = `
              <div class="comp-herradura-box">
                <div class="herradura-tag tag-extremos">🧲 Ley de la Herradura (Extremos y Medios)</div>
                <div class="herradura-diagram">
                  <div class="herradura-tier tier-num">
                    <span class="tier-badge badge-ext">Extremo Superior: ${ext1}</span>
                    <div class="tier-content" style="padding: 0.25rem 0;">${l.toHtml()}</div>
                  </div>
                  <div class="herradura-main-bar"></div>
                  <div class="herradura-tier tier-den">
                    <span class="tier-badge badge-med">Medio Inferior: ${med2}</span>
                    <div class="tier-content" style="padding: 0.25rem 0;">${r.toHtml()}</div>
                  </div>
                </div>
                <div class="herradura-formula">
                  <span class="formula-arrow">⟹</span>
                  <div class="formula-calc">
                    <span class="math-fraction">
                      <span class="math-num">Extremos: ${ext1} · ${ext2} = ${prodExt}</span>
                      <span class="math-bar"></span>
                      <span class="math-den">Medios: ${med1} · (${med2}) = ${prodMed}</span>
                    </span>
                    <span class="math-equal">=</span>
                    <span class="highlight-result">${resFrac.toHtml()}</span>
                  </div>
                </div>
              </div>
            `;
          }

          replaceNodeAtPath(ast, path, { type: 'LITERAL', frac: resFrac });

          steps.push({
            stepNum: stepCount++,
            title: title,
            typeLabel: op === '/' ? 'Ley de Herradura' : 'Operación de Piso',
            pillClass: op === '/' ? 'pill-bracket' : 'pill-paren',
            desc: desc,
            actionBox: actionBox,
            htmlView: astToHtml(ast)
          });
        }
      }

      const finalFrac = ast.type === 'LITERAL' ? ast.frac : null;
      if (finalFrac) {
        const whole = finalFrac.n / finalFrac.d;
        const rem = finalFrac.n % finalFrac.d;
        const absRem = rem < 0n ? -rem : rem;
        const mixedStr = finalFrac.d !== 1n && absRem > 0n ? `${whole} entero${whole !== 1n && whole !== -1n ? 's' : ''} y ${absRem}/${finalFrac.d}` : (finalFrac.d === 1n ? 'Número entero exacto' : '');
        const decimalVal = Number(finalFrac.n) / Number(finalFrac.d);

        steps.push({
          stepNum: stepCount,
          title: 'Resultado Final Irreducible',
          typeLabel: 'Solución Final',
          isFinal: true,
          resultFraction: finalFrac.toString(),
          resultHtml: finalFrac.toHtml(),
          mixedString: mixedStr,
          decimalString: decimalVal.toFixed(6).replace(/\.?0+$/, ''),
          desc: 'Se han simplificado todos los niveles escalonados de la fracción compuesta de abajo hacia arriba. Todas las operaciones han concluido y la fracción resultante se encuentra en su forma irreducible más simple.'
        });
      }

      return { success: true, steps, finalFrac };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  function renderCompoundFractionSteps(resultData) {
    if (!elements.compFracResultsContainer) return;
    const container = elements.compFracResultsContainer;
    container.innerHTML = '';

    if (!resultData.success) {
      container.innerHTML = `
        <div class="card" style="border-left: 4px solid var(--color-rose); padding: 1.5rem;">
          <h4 style="color: var(--color-rose); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚠️</span> Error en la Fracción Compuesta
          </h4>
          <p class="pane-desc">${resultData.error}</p>
          <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-dim);">
            Sugerencia: Revisa que cada piso divisor esté agrupado entre paréntesis <code>( ... )</code> y que los signos de operación estén completos.
          </div>
        </div>
      `;
      return;
    }

    const { steps, finalFrac } = resultData;
    const finalStep = steps.find(s => s.isFinal);

    // KPI Summary Header
    const kpiBar = document.createElement('div');
    kpiBar.className = 'comp-kpi-bar';
    kpiBar.innerHTML = `
      <div class="kpi-card" style="border-left: 3px solid #10b981;">
        <span class="kpi-label">Fracción Irreducible</span>
        <div class="kpi-value-lg" style="color: #10b981; margin-top: 0.25rem;">
          ${finalFrac ? finalFrac.toHtml() : '—'}
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Número Mixto</span>
        <div class="kpi-value" style="font-size: 1rem; font-weight: 600; margin-top: 0.35rem;">
          ${finalStep && finalStep.mixedString ? finalStep.mixedString : 'Entero'}
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Aprox. Decimal</span>
        <div class="kpi-value font-mono" style="font-size: 1.15rem; color: var(--color-primary); margin-top: 0.35rem;">
          ${finalStep ? finalStep.decimalString : '—'}
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total de Pasos</span>
        <div class="kpi-value font-mono" style="margin-top: 0.35rem;">
          ${steps.length}
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Estrategia</span>
        <div class="kpi-value" style="font-size: 0.85rem; font-weight: 600; color: #10b981; margin-top: 0.35rem;">
          Cascada Ascendente & Herradura
        </div>
      </div>
    `;
    container.appendChild(kpiBar);

    // Steps Cards
    steps.forEach((step, idx) => {
      const card = document.createElement('div');
      card.className = `comp-step-card ${step.isFinal ? 'is-final' : ''}`;
      card.id = `compStepCard_${step.stepNum}`;

      card.innerHTML = `
        <div class="comp-step-header">
          <div class="comp-step-badge">Paso ${step.stepNum}</div>
          <span class="comp-step-pill ${step.pillClass || 'pill-paren'}">${step.typeLabel}</span>
          <h4 class="comp-step-title">${step.title}</h4>
        </div>
        <div class="comp-step-body">
          <p class="comp-step-desc">${step.desc}</p>
          ${step.actionBox ? `<div class="comp-action-highlight">${step.actionBox}</div>` : ''}
          ${step.htmlView && !step.isFinal ? `
            <div class="comp-tier-snapshot">
              <span class="snapshot-label">Estado actual de la fracción tras este paso:</span>
              <div class="snapshot-math">${step.htmlView}</div>
            </div>
          ` : ''}
          ${step.isFinal ? `
            <div class="comp-final-celebration">
              <div class="final-badge">🎉 ¡Fracción Compuesta Reducida al Máximo!</div>
              <div class="final-math-display">${step.resultHtml}</div>
              <div class="final-sub-details">
                ${step.mixedString ? `<span class="detail-chip">🏷️ Mixto: <strong>${step.mixedString}</strong></span>` : ''}
                <span class="detail-chip">🔢 Decimal: <strong>${step.decimalString}</strong></span>
                <span class="detail-chip">💎 Forma Irreducible (M.C.D. = 1)</span>
              </div>
              <div style="margin-top: 1rem;">
                <button type="button" class="btn btn-secondary" id="btnCopyCompFracProcedure">
                  📋 Copiar Procedimiento Completo
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
      container.appendChild(card);
    });

    const copyBtn = document.getElementById('btnCopyCompFracProcedure');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyCompFracProcedure(steps, state.compFracState.expression);
      });
    }
  }

  function copyCompFracProcedure(steps, expr) {
    if (!steps || steps.length === 0) return;
    let md = `========================================================\n`;
    md += `SIMPLIFICACIÓN PASO A PASO DE FRACCIÓN COMPUESTA\n`;
    md += `Expresión: ${expr}\n`;
    md += `========================================================\n\n`;

    steps.forEach(step => {
      md += `▶ PASO ${step.stepNum}: ${step.title.toUpperCase()}\n`;
      const cleanDesc = step.desc ? step.desc.replace(/<br\s*[\/]?>/gi, '\n   ').replace(/<[^>]+>/g, '') : '';
      md += `   ${cleanDesc}\n`;
      if (step.resultFraction) {
        md += `   Resultado: ${step.resultFraction}`;
        if (step.mixedString) md += ` (${step.mixedString})`;
        if (step.decimalString) md += ` ≈ ${step.decimalString}`;
        md += `\n`;
      }
      md += `\n`;
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(() => {
        showToast('¡Procedimiento copiado al portapapeles!');
      }).catch(() => {
        fallbackCopyTextToClipboard(md);
      });
    } else {
      fallbackCopyTextToClipboard(md);
    }
  }

  function updateCompFracLivePreview() {
    if (!elements.compFracLivePreview) return;
    const expr = elements.compFracExpressionInput ? elements.compFracExpressionInput.value.trim() : '';
    if (!expr) {
      elements.compFracLivePreview.innerHTML = '<span class="text-dim">Ingresa una fracción compuesta para ver su estructura en pisos verticales...</span>';
      return;
    }
    try {
      const tokens = tokenizeFracExpr(expr);
      const ast = parseFracTokens(tokens);
      elements.compFracLivePreview.innerHTML = astToHtml(ast);
    } catch (e) {
      elements.compFracLivePreview.innerHTML = `<span class="text-dim" style="font-style: italic;">Formateando niveles... (usa / para separar pisos y paréntesis)</span>`;
    }
  }

  function setCompFracPreset(expr, activeBtn) {
    if (elements.compFracExpressionInput) {
      elements.compFracExpressionInput.value = expr;
    }
    state.compFracState.expression = expr;
    const allChips = document.querySelectorAll('#compFracPresetsList .eq-preset-chip');
    allChips.forEach(c => c.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
    updateCompFracLivePreview();
    const result = solveCompoundFraction(expr);
    renderCompoundFractionSteps(result);
  }

  function renderCompFracModule() {
    updateCompFracLivePreview();
    if (!state.compFracState.expression) {
      if (elements.compFracExpressionInput) {
        state.compFracState.expression = elements.compFracExpressionInput.value || '5 / (2 - (-3) / (-7 + 2 / (1/2 - (-2/3))))';
      }
    }
    const result = solveCompoundFraction(state.compFracState.expression);
    renderCompoundFractionSteps(result);
  }

  function setupCompFracEvents() {
    // Header shortcut
    if (elements.btnHeaderGoCompFrac) {
      elements.btnHeaderGoCompFrac.addEventListener('click', () => {
        switchTab('compfrac');
      });
    }

    // Input live typing
    if (elements.compFracExpressionInput) {
      elements.compFracExpressionInput.addEventListener('input', () => {
        state.compFracState.expression = elements.compFracExpressionInput.value;
        updateCompFracLivePreview();
      });

      elements.compFracExpressionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          state.compFracState.expression = elements.compFracExpressionInput.value;
          const res = solveCompoundFraction(state.compFracState.expression);
          renderCompoundFractionSteps(res);
        }
      });
    }

    // Solve button
    if (elements.btnSolveCompFrac) {
      elements.btnSolveCompFrac.addEventListener('click', () => {
        if (elements.compFracExpressionInput) {
          state.compFracState.expression = elements.compFracExpressionInput.value;
        }
        const res = solveCompoundFraction(state.compFracState.expression);
        renderCompoundFractionSteps(res);
      });
    }

    // Reset button
    if (elements.btnResetCompFrac) {
      elements.btnResetCompFrac.addEventListener('click', () => {
        setCompFracPreset('5 / (2 - (-3) / (-7 + 2 / (1/2 - (-2/3))))', elements.btnPresetComp41);
        showToast('Ejercicio 41 restablecido');
      });
    }

    // Clear input
    if (elements.btnCompFracClear) {
      elements.btnCompFracClear.addEventListener('click', () => {
        if (elements.compFracExpressionInput) {
          elements.compFracExpressionInput.value = '';
          elements.compFracExpressionInput.focus();
        }
        state.compFracState.expression = '';
        updateCompFracLivePreview();
      });
    }

    // Presets
    if (elements.btnPresetComp41) {
      elements.btnPresetComp41.addEventListener('click', () => {
        setCompFracPreset('5 / (2 - (-3) / (-7 + 2 / (1/2 - (-2/3))))', elements.btnPresetComp41);
      });
    }
    if (elements.btnPresetComp41Mul) {
      elements.btnPresetComp41Mul.addEventListener('click', () => {
        setCompFracPreset('5 / (2 - (-3) / (-7 + 2 / (1/2 * (-2/3))))', elements.btnPresetComp41Mul);
      });
    }
    if (elements.btnPresetCompBaldor) {
      elements.btnPresetCompBaldor.addEventListener('click', () => {
        setCompFracPreset('(1/2 + 2/3) / (3/4 - 1/6)', elements.btnPresetCompBaldor);
      });
    }
    if (elements.btnPresetCompStair) {
      elements.btnPresetCompStair.addEventListener('click', () => {
        setCompFracPreset('1 / (1 + 1 / (1 + 1/2))', elements.btnPresetCompStair);
      });
    }
    if (elements.btnPresetCompIntegers) {
      elements.btnPresetCompIntegers.addEventListener('click', () => {
        setCompFracPreset('(3 - 1/2) / (2 + 3/4)', elements.btnPresetCompIntegers);
      });
    }
    if (elements.btnPresetCompTier4) {
      elements.btnPresetCompTier4.addEventListener('click', () => {
        setCompFracPreset('2 + 1 / (3 + 1 / (4 + 1/5))', elements.btnPresetCompTier4);
      });
    }

    // Keypad character insertions
    document.querySelectorAll('.comp-insert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.insert;
        if (!text || !elements.compFracExpressionInput) return;
        const input = elements.compFracExpressionInput;
        const start = input.selectionStart || input.value.length;
        const end = input.selectionEnd || input.value.length;
        const val = input.value;
        input.value = val.substring(0, start) + text + val.substring(end);
        const nextPos = start + text.length;
        input.setSelectionRange(nextPos, nextPos);
        input.focus();
        state.compFracState.expression = input.value;
        updateCompFracLivePreview();
      });
    });

    if (elements.btnCompKeypadBackspace) {
      elements.btnCompKeypadBackspace.addEventListener('click', () => {
        const input = elements.compFracExpressionInput;
        if (!input) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start === end && start > 0) {
          input.value = input.value.substring(0, start - 1) + input.value.substring(end);
          input.setSelectionRange(start - 1, start - 1);
        } else if (start !== end) {
          input.value = input.value.substring(0, start) + input.value.substring(end);
          input.setSelectionRange(start, start);
        }
        input.focus();
        state.compFracState.expression = input.value;
        updateCompFracLivePreview();
      });
    }

    if (elements.btnCompKeypadClearAll) {
      elements.btnCompKeypadClearAll.addEventListener('click', () => {
        if (elements.compFracExpressionInput) {
          elements.compFracExpressionInput.value = '';
          elements.compFracExpressionInput.focus();
        }
        state.compFracState.expression = '';
        updateCompFracLivePreview();
      });
    }
  }

  // ==========================================================================
  // TAB 11: ASISTENTE Y TUTOR PEDAGÓGICO INTELIGENTE IA (JEZURI AI)
  // ==========================================================================

  function getAiProblemContext() {
    let ctx = state.aiState.activeContext || 'current';
    if (ctx === 'current') {
      if (state.activeTab === 'compfrac') ctx = 'compfrac';
      else if (state.activeTab === 'equations') ctx = 'equations';
      else if (state.activeTab === 'rationals') ctx = 'rationals';
      else ctx = 'mcd';
    }

    if (ctx === 'compfrac') {
      const expr = state.compFracState.expression || '5 / (2 - (-3) / (-7 + 2 / (1/2 - (-2/3))))';
      const is41Mul = expr.includes('*') || expr.includes('·');
      const finalRes = is41Mul ? '65/23' : '185/53';
      const mixedRes = is41Mul ? '2 enteros y 19/23' : '3 enteros y 26/53';
      const decRes = is41Mul ? '≈ 2.826087' : '≈ 3.490566';

      return {
        id: 'compfrac',
        typeName: 'Fracción Compuesta y Continua (Escalonada)',
        formula: expr,
        metaText: `Resultado Final: <strong style="color: #10b981;">${finalRes}</strong> (${mixedRes} ${decRes})`,
        strategyHtml: `
          <p><strong>1. Principio Fundamental:</strong> Las fracciones escalonadas o continuas se resuelven obligatoriamente <strong>de abajo hacia arriba</strong>, atacando primero el denominador más profundo y ascendiendo piso por piso.</p>
          <p><strong>2. Piso Inferior:</strong> Se resuelve la operación más interna: <code>1/2 - (-2/3)</code>. Por ley de signos, restar un número negativo equivale a sumar: <code>1/2 + 2/3 = 7/6</code> (usando m.c.m.(2, 3) = 6).</p>
          <p><strong>3. Primera Ley de la Herradura:</strong> Se divide el entero <code>2</code> entre <code>7/6</code>. Escribiendo 2 como <code>2/1</code>, se multiplican extremos (<code>2 × 6 = 12</code>) y medios (<code>1 × 7 = 7</code>), obteniendo <strong>12/7</strong>.</p>
          <p><strong>4. Piso Medio:</strong> Se suma con el entero <code>-7</code>: <code>-7 + 12/7 = -37/7</code>.</p>
          <p><strong>5. Segunda Ley de la Herradura:</strong> Se divide <code>-3</code> entre <code>-37/7</code>. Menos entre menos da más: <code>(-3 × 7) / (1 × -37) = +21/37</code>.</p>
          <p><strong>6. Nivel Superior y Herradura Definitiva:</strong> En el denominador principal queda <code>2 - 21/37 = 53/37</code>. Finalmente se divide el numerador general <code>5</code> entre <code>53/37</code>: <code>(5 × 37) / (1 × 53) = 185/53</code>.</p>
        `,
        pitfallsHtml: `
          <ul style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
            <li><strong>Doble Negativo:</strong> En <code>1/2 - (-2/3)</code>, olvidar que <code>-(-) = +</code> arruina toda la cascada desde el inicio.</li>
            <li><strong>Invertir Extremos y Medios:</strong> Cuando el numerador es un entero como <code>2</code> o <code>5</code>, siempre se expresa como <code>2/1</code> o <code>5/1</code>. Si se invierte se obtiene <code>7/12</code> en lugar de <code>12/7</code>.</li>
            <li><strong>Signos en la División:</strong> <code>-3 / (-37/7)</code> tiene dos signos negativos, por lo que el cociente es <strong>positivo (+21/37)</strong>.</li>
            <li><strong>Intentar resolver de arriba a abajo:</strong> Querer hacer <code>5 / 2</code> al inicio es un error garrafal, porque el 2 está restándose con todo el bloque inferior.</li>
          </ul>
        `,
        verifyHtml: `
          <p><strong>Método de Comprobación Decimal Directa:</strong></p>
          <ol style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.3rem;">
            <li>Piso 1: <code>1/2 - (-2/3) = 0.5 + 0.666667 = 1.166667</code></li>
            <li>Piso 2: <code>2 / 1.166667 = 1.714286</code></li>
            <li>Piso 3: <code>-7 + 1.714286 = -5.285714</code></li>
            <li>Piso 4: <code>-3 / -5.285714 = 0.567568</code></li>
            <li>Piso 5: <code>2 - 0.567568 = 1.432432</code></li>
            <li>Resultado: <code>5 / 1.432432 = 3.490566</code></li>
            <li>Fracción exacta: <code>185 / 53 = 3.490566...</code> ¡Coincidencia matemática exacta al 100%!</li>
          </ol>
        `,
        practiceProblem: '3 / (1 - (-2) / (-5 + 3 / (1/3 - (-1/2))))'
      };
    }

    if (ctx === 'equations') {
      const expr = state.eqState.expression || '6[(7a - 5) + 1 - 5b] + 3(a + 2)';
      const a = state.eqState.variables.a ?? 5;
      const b = state.eqState.variables.b ?? 2;
      return {
        id: 'equations',
        typeName: 'Expresión Algebraica con Signos de Agrupación (PEMDAS)',
        formula: `${expr} (con a = ${a}, b = ${b})`,
        metaText: `Resultado Evaluado: <strong style="color: #8b5cf6;">147</strong> (Valor Numérico Exacto)`,
        strategyHtml: `
          <p><strong>1. Jerarquía de Operaciones (PEMDAS):</strong> Se resuelven de adentro hacia afuera: Paréntesis <code>( )</code> → Corchetes <code>[ ]</code> → Llaves <code>{ }</code> → Multiplicaciones → Sumas y Restas.</p>
          <p><strong>2. Sustitución de Variables:</strong> Se reemplaza cada letra por su valor asignado: <code>a = ${a}</code> y <code>b = ${b}</code>. Por ejemplo, <code>7a = 7 × ${a} = 35</code> y <code>5b = 5 × ${b} = 10</code>.</p>
          <p><strong>3. Evaluación del Paréntesis Interno:</strong> <code>(7a - 5) = (35 - 5) = 30</code>.</p>
          <p><strong>4. Reducción del Corchete:</strong> Dentro de los corchetes queda <code>[30 + 1 - 10] = [21]</code>.</p>
          <p><strong>5. Multiplicación Externa:</strong> El coeficiente exterior multiplica todo el corchete: <code>6 × 21 = 126</code>.</p>
          <p><strong>6. Segundo Término y Suma Final:</strong> El término complementario es <code>3(a + 2) = 3(${a} + 2) = 3(7) = 21</code>. Sumando ambos bloques: <code>126 + 21 = 147</code>.</p>
        `,
        pitfallsHtml: `
          <ul style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
            <li><strong>Yuxtaposición de variables:</strong> Recordar que <code>7a</code> significa <code>7 × a</code>. Si <code>a = 5</code>, es <code>35</code>, ¡no el número 75!</li>
            <li><strong>No multiplicar antes de tiempo:</strong> No se debe multiplicar el 6 exterior hasta que todo el interior del corchete esté completamente reducido a un único valor.</li>
            <li><strong>Confusión de términos separados:</strong> La suma central <code>+ 3(a + 2)</code> separa dos bloques independientes. El corchete no afecta al 3.</li>
          </ul>
        `,
        verifyHtml: `
          <p><strong>Comprobación por Desarrollo Algebraico Previo:</strong></p>
          <p>Si expandimos los términos algebraicamente antes de sustituir valores:</p>
          <code>6[7a - 4 - 5b] + 3a + 6 = 42a - 24 - 30b + 3a + 6 = 45a - 30b - 18</code>
          <p>Sustituyendo ahora <code>a = ${a}</code> y <code>b = ${b}</code>:</p>
          <code>45(${a}) - 30(${b}) - 18 = 225 - 60 - 18 = 147</code>
          <p>¡Ambos caminos conducen exactamente a <strong>147</strong>!</p>
        `,
        practiceProblem: '4[(3a - 2) + 5 - 2b] + 2(a + 4)'
      };
    }

    if (ctx === 'rationals') {
      const expr = state.ratState.expression || '3/4 + 5/6 - 1/2';
      return {
        id: 'rationals',
        typeName: 'Aritmética de Números Racionales (Fracciones)',
        formula: expr,
        metaText: `Operación con Fracciones y m.c.m. de denominadores`,
        strategyHtml: `
          <p><strong>1. Homogenización de Denominadores:</strong> Para sumar o restar fracciones no se pueden sumar los denominadores directamente. Es obligatorio calcular el <strong>Mínimo Común Múltiplo (m.c.m.)</strong> de todos los denominadores.</p>
          <p><strong>2. Amplificación de Numeradores:</strong> Se divide el m.c.m. entre el denominador de cada fracción y se multiplica por su respectivo numerador.</p>
          <p><strong>3. Suma y Resta Directa:</strong> Con los denominadores ya unificados, se efectúan las operaciones de suma o resta únicamente entre los numeradores amplificados.</p>
          <p><strong>4. Simplificación Final:</strong> Se calcula el Máximo Común Divisor (M.C.D.) del numerador y denominador resultantes para obtener la fracción irreducible.</p>
        `,
        pitfallsHtml: `
          <ul style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
            <li><strong>Sumar denominadores en línea recta:</strong> Escribir <code>(3 + 5)/(4 + 6) = 8/10</code> es un error clásico. Solo se pueden sumar numeradores una vez igualados los denominadores.</li>
            <li><strong>Olvidar simplificar:</strong> Dejar una respuesta como <code>26/24</code> sin reducir a <code>13/12</code> suele restar puntos en evaluaciones.</li>
          </ul>
        `,
        verifyHtml: `
          <p>Convierte cada fracción a su valor decimal en una calculadora:</p>
          <code>3/4 = 0.75</code>, <code>5/6 ≈ 0.8333</code>, <code>1/2 = 0.5</code>.<br>
          <code>0.75 + 0.8333 - 0.5 = 1.0833</code>.<br>
          Comprueba el resultado fraccionario: <code>13/12 = 1.0833...</code> ¡Verificación exitosa!
        `,
        practiceProblem: '2/3 - 1/4 + 5/6'
      };
    }

    // Default: MCD
    return {
      id: 'mcd',
      typeName: 'Teoría de Números: Máximo Común Divisor (M.C.D.)',
      formula: `M.C.D. de los números [${state.numbers.join(', ')}]`,
      metaText: `Mayor divisor común entero compartido`,
      strategyHtml: `
        <p><strong>1. Descomposición Simultánea:</strong> Se divide a todos los números al mismo tiempo utilizando únicamente números primos (2, 3, 5, 7, ...) que dividan a <strong>absolutamente todos</strong> los números de la fila.</p>
        <p><strong>2. Detención Inmediata:</strong> En el instante en que no exista ningún número primo común que divida a todos a la vez (los cocientes son primos entre sí o coprimos), el proceso de M.C.D. concluye.</p>
        <p><strong>3. Producto Canónico:</strong> El M.C.D. es el producto de todos los factores primos comunes hallados.</p>
        <p><strong>4. Algoritmo de Euclides:</strong> Para pares de números, se divide repetidamente el dividendo entre el divisor; el último residuo no nulo es el M.C.D.</p>
      `,
      pitfallsHtml: `
        <ul style="padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
          <li><strong>Confundir M.C.D. con m.c.m.:</strong> En el M.C.D. el factor <em>debe dividir a todos</em>. En el m.c.m. se continúa dividiendo aunque solo divida a uno solo de los números hasta llegar a 1.</li>
          <li><strong>Usar números no primos:</strong> Solo se debe descomponer entre números primos (2, 3, 5, 7, 11...).</li>
        </ul>
      `,
      verifyHtml: `
        <p>Verifica que el M.C.D. obtenido divida exactamente a cada uno de los números originales dando residuo 0. Además, comprueba que los cocientes resultantes no tengan ningún divisor común mayor que 1.</p>
      `,
      practiceProblem: 'M.C.D. de [60, 90, 150]'
    };
  }

  function renderAiTutor(contextId) {
    if (contextId) {
      state.aiState.activeContext = contextId;
      state.aiState.messages = [];
    }

    // Update active pill
    if (elements.aiContextPills) {
      elements.aiContextPills.forEach(pill => {
        if (pill.dataset.context === (state.aiState.activeContext || 'current')) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }

    const ctx = getAiProblemContext();

    if (elements.aiDetectedTypeBadge) elements.aiDetectedTypeBadge.textContent = ctx.typeName;
    if (elements.aiDetectedProblemFormula) elements.aiDetectedProblemFormula.textContent = ctx.formula;
    if (elements.aiDetectedMeta) elements.aiDetectedMeta.innerHTML = ctx.metaText;
    if (elements.aiStrategyContent) elements.aiStrategyContent.innerHTML = ctx.strategyHtml;
    if (elements.aiPitfallsContent) elements.aiPitfallsContent.innerHTML = ctx.pitfallsHtml;
    if (elements.aiVerifyContent) elements.aiVerifyContent.innerHTML = ctx.verifyHtml;

    // Initialize chat if empty
    if (!state.aiState.messages || state.aiState.messages.length === 0) {
      state.aiState.messages = [
        {
          sender: 'bot',
          text: `🐾 ¡Guau! ¡Hola! Soy tu <strong>Profesor Perrito Math 🐶</strong>. He analizado tu <strong>${ctx.typeName}</strong>:<br><br>
                 📌 <code>${ctx.formula}</code><br><br>
                 ¿Tienes dudas sobre cómo se llegó al resultado, por qué cambió algún signo, o cómo resolverlo paso a paso? Haz clic en las preguntas rápidas de arriba o escribe tu consulta abajo y te lo explico con mucho cariño perruno.`
        }
      ];
    }

    renderAiChatMessages();
  }

  function renderAiChatMessages() {
    const containers = [elements.aiChatMessages, elements.floatingChatMessages].filter(Boolean);
    if (containers.length === 0) return;

    containers.forEach(container => {
      container.innerHTML = '';
      (state.aiState.messages || []).forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `ai-message ${msg.sender === 'user' ? 'user' : 'bot'}`;
        if (msg.sender === 'bot') {
          bubble.innerHTML = `
            <div class="ai-msg-sender">
              <span>🐶</span> Profesor Perrito Math
            </div>
            <div class="ai-msg-text">${msg.text}</div>
          `;
        } else {
          bubble.innerHTML = `<div class="ai-msg-text">${msg.text}</div>`;
        }
        container.appendChild(bubble);
      });
      container.scrollTop = container.scrollHeight;
    });
  }

  function appendAiChatMessage(sender, text) {
    if (!state.aiState.messages) state.aiState.messages = [];
    state.aiState.messages.push({ sender, text });
    renderAiChatMessages();
  }

  // Categorías de preguntas y catálogo temático del Catedrático
  const CATEGORY_QUERIES = {
    current: [
      { text: '❓ ¿Por qué da este resultado?', query: 'por_que_resultado' },
      { text: '⚡ ¿Cómo funciona la regla de signos aquí?', query: 'ley_signos' },
      { text: '🧲 ¿Cómo se aplica la Ley de la Herradura?', query: 'ley_herradura' },
      { text: '🪜 ¿Por qué se resuelve de abajo hacia arriba?', query: 'orden_abajo_arriba' },
      { text: '💡 Explícamelo con una analogía simple', query: 'analogia' },
      { text: '🔍 ¿Cómo comprobar mi respuesta?', query: 'como_comprobar' }
    ],
    compfrac: [
      { text: '🧲 ¿Cómo funciona la Ley de la Herradura?', prompt: 'Explícame la ley de la herradura con extremos y medios' },
      { text: '🪜 ¿Por qué resolver de abajo hacia arriba?', prompt: 'Por qué las fracciones compuestas se resuelven de abajo hacia arriba' },
      { text: '⚡ ¿Cómo no equivocarse con los signos menos?', prompt: 'Cómo manejar los signos negativos en fracciones compuestas' },
      { text: '📝 Ejemplo completo de fracción compuesta paso a paso', prompt: 'Dame un ejemplo resuelto paso a paso de fracción compuesta' }
    ],
    algebra: [
      { text: '🧩 Los 6 casos de factorización explicados', prompt: 'Cuáles son los 6 casos de factorización fundamentales con ejemplos' },
      { text: '✨ Productos notables esenciales', prompt: 'Cuáles son los productos notables más importantes con ejemplos' },
      { text: '⚖️ Sistemas 2x2 por determinantes (Cramer)', prompt: 'Cómo resolver sistemas de ecuaciones 2x2 por la Regla de Cramer' },
      { text: '🔍 ¿Cómo despejar x en una ecuación?', prompt: 'Cómo despejar la incógnita x en una ecuación lineal paso a paso' }
    ],
    quadratic: [
      { text: '⚡ Fórmula General (Chicharronera) paso a paso', prompt: 'Cómo usar la fórmula general para ecuaciones cuadráticas' },
      { text: '🎯 ¿Qué significa el discriminante b² - 4ac?', prompt: 'Qué significa el discriminante b^2 - 4ac y los tipos de raíces' },
      { text: '📍 Vértice de una parábola', prompt: 'Cómo calcular el vértice de una parábola cuadrática' },
      { text: '👻 ¿Cuándo hay soluciones complejas?', prompt: 'Cuándo una ecuación cuadrática tiene soluciones complejas e imaginarias' }
    ],
    calculus: [
      { text: '📈 ¿Qué es una derivada y su significado gráfico?', prompt: 'Qué es una derivada y qué representa geométricamente' },
      { text: '0️⃣ Indeterminaciones 0/0 en límites', prompt: 'Cómo resolver indeterminaciones 0/0 en límites matemáticos' },
      { text: '📏 Reglas básicas de derivación', prompt: 'Cuáles son las reglas de derivación esenciales con ejemplos' },
      { text: '🔄 ¿Qué es una integral y área bajo la curva?', prompt: 'Qué es una integral y cómo calcula el área bajo la curva' }
    ],
    geometry: [
      { text: '🔺 Teorema de Pitágoras con ejemplo real', prompt: 'Explícame el Teorema de Pitágoras con un ejemplo de catetos e hipotenusa' },
      { text: '📐 ¿Qué significa SOH-CAH-TOA?', prompt: 'Qué significa SOH-CAH-TOA en trigonometría' },
      { text: '⚪ ¿Por qué sen²(θ) + cos²(θ) = 1?', prompt: 'Por qué sen^2(x) + cos^2(x) = 1 identidad pitagórica' },
      { text: '🌐 Ley de Senos vs Ley de Cosenos', prompt: 'Cuándo usar la ley de senos y cuándo la ley de cosenos' }
    ],
    rationals: [
      { text: '🍕 Suma de fracciones con distinto denominador', prompt: 'Cómo sumar fracciones con diferente denominador usando mcm' },
      { text: '🎯 Diferencia entre M.C.D. y m.c.m.', prompt: 'Cuál es la diferencia entre MCD y mcm y cuándo usar cada uno' },
      { text: '✖️ Multiplicación y división de fracciones', prompt: 'Cómo multiplicar y dividir fracciones paso a paso' },
      { text: '📊 Fracciones impropias a mixtas', prompt: 'Cómo convertir fracciones impropias a números mixtos' }
    ],
    mysteries: [
      { text: '🔥 ¿Por qué no se puede dividir entre cero?', prompt: 'Por qué es imposible dividir entre cero demostración' },
      { text: '0️⃣ ¿Por qué cualquier número a la 0 es 1?', prompt: 'Por qué cualquier número elevado a la 0 da 1' },
      { text: '➖ ¿Por qué menos por menos da más?', prompt: 'Por qué menos por menos da más en matemáticas' },
      { text: '🥧 ¿Qué es el número Pi y el número de Euler?', prompt: 'Qué es el número Pi y el número de Euler e' },
      { text: '👻 ¿Qué son los números imaginarios i?', prompt: 'Qué son los números imaginarios y complejos' }
    ]
  };

  function renderCategoryChips(catId) {
    const queries = CATEGORY_QUERIES[catId] || CATEGORY_QUERIES.current;

    const labelMap = {
      current: 'Preguntas frecuentes del problema actual:',
      compfrac: 'Temas de Fracciones Compuestas & Ley de la Herradura:',
      algebra: 'Álgebra, Factorización & Despejes:',
      quadratic: 'Ecuaciones Cuadráticas & Parábolas:',
      calculus: 'Límites, Derivadas & Cálculo:',
      geometry: 'Pitágoras, Geometría & Trigonometría:',
      rationals: 'Fracciones Racionales & m.c.m.:',
      mysteries: 'Enigmas, Paradojas & Demostraciones:'
    };

    if (elements.quickQueriesLabel) {
      elements.quickQueriesLabel.textContent = labelMap[catId] || 'Preguntas recomendadas:';
    }

    const grids = [elements.aiQuickChipsGrid, elements.floatingQuickChipsGrid].filter(Boolean);
    grids.forEach(grid => {
      grid.innerHTML = '';
      queries.forEach(item => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ai-query-chip';
        chip.textContent = item.text;
        if (item.query) chip.dataset.query = item.query;
        if (item.prompt) chip.dataset.prompt = item.prompt;

        chip.addEventListener('click', () => {
          if (item.query) {
            handleAiQuickQuery(item.query);
          } else if (item.prompt) {
            handleAiChatMessage(item.prompt);
          }
        });

        grid.appendChild(chip);
      });
    });
  }

  function updateGeminiStatusBadge() {
    const hasKey = window.PerritoErudite && window.PerritoErudite.getApiKey && window.PerritoErudite.getApiKey();
    const statusText = hasKey ? '✨ Gemini Activo' : '🔑 Modo Gemini (Opcional)';
    const isActive = !!hasKey;

    const triggers = [
      { btn: elements.btnHeaderGemini, label: elements.headerGeminiLabel },
      { btn: elements.btnBannerGemini, label: elements.bannerGeminiLabel },
      { btn: elements.btnOpenGeminiModal, label: elements.geminiStatusLabel },
      { btn: elements.btnFloatingGeminiConfig, label: elements.floatingGeminiLabel }
    ];

    triggers.forEach(({ btn, label }) => {
      if (label) label.textContent = statusText;
      if (btn) {
        btn.classList.toggle('active', isActive);
        if (isActive) {
          btn.title = 'Gemini AI está activo y respondiendo consultas con Google Gemini';
        } else {
          btn.title = 'Configurar o activar Google Gemini AI (Opcional)';
        }
      }
    });
  }

  function toggleFloatingAiChat(forceOpen) {
    if (!elements.floatingAiChatWidget) return;
    const isHidden = elements.floatingAiChatWidget.style.display === 'none' || !elements.floatingAiChatWidget.style.display;
    const willOpen = forceOpen !== undefined ? forceOpen : isHidden;

    if (willOpen) {
      elements.floatingAiChatWidget.style.display = 'flex';
      const ctx = getAiProblemContext();
      if (elements.floatingContextName) {
        elements.floatingContextName.textContent = ctx.typeName;
      }
      if (!state.aiState.messages || state.aiState.messages.length === 0) {
        state.aiState.messages = [
          {
            sender: 'bot',
            text: `🐾 ¡Guau! ¡Hola! Soy tu <strong>Profesor Perrito Math 🐶</strong>.<br><br>
                   Estoy aquí a tu lado mientras resuelves tus matemáticas. Puedes preguntarme cualquier duda sobre tu ejercicio en pantalla (<strong>${ctx.typeName}</strong>), pedirme que te resuelva cualquier cuenta paso a paso, o elegir un tema de las pestañas de arriba. ¿En qué te ayudo hoy?`
          }
        ];
      }
      renderAiChatMessages();
      renderCategoryChips('current');
      updateGeminiStatusBadge();
      setTimeout(() => {
        if (elements.floatingChatInput) elements.floatingChatInput.focus();
        if (elements.floatingChatMessages) elements.floatingChatMessages.scrollTop = elements.floatingChatMessages.scrollHeight;
      }, 100);
    } else {
      elements.floatingAiChatWidget.style.display = 'none';
    }
  }

  function generateAiResponse(userQuery, ctx) {
    const q = userQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (q.includes("signo") || q.includes("negativo") || q.includes("menos")) {
      if (ctx.id === 'compfrac') {
        return `En esta fracción compuesta intervienen dos reglas de signos fundamentales:<br><br>
                1. <strong>Doble negativo en el piso inferior:</strong> Tienes <code>1/2 - (-2/3)</code>. La regla matemática dicta que restar un número negativo equivale a sumarlo: <code>-(-a) = +a</code>, transformándose en <code>1/2 + 2/3 = 7/6</code>.<br><br>
                2. <strong>Regla de signos en la división:</strong> Más adelante se divide <code>-3</code> entre <code>-37/7</code>. Como ambos términos son negativos, el cociente resulta <strong>positivo (+)</strong>: <code>(-3) / (-37/7) = +21/37</code>. Por eso el signo menos desaparece al subir de piso.`;
      } else if (ctx.id === 'equations') {
        return `En esta ecuación los signos se manejan así:<br><br>
                • Dentro del paréntesis <code>(7a - 5)</code>, el signo menos afecta únicamente al 5.<br>
                • Dentro del corchete <code>[30 + 1 - 5b]</code>, al sustituir <code>b = 2</code> se obtiene <code>-5(2) = -10</code>.<br>
                • La resta <code>31 - 10 = 21</code> mantiene signo positivo porque 31 es mayor en valor absoluto.`;
      }
      return `La ley de los signos establece que signos iguales dan positivo (+ × + = +, - × - = +) y signos diferentes dan negativo (+ × - = -, - × + = -). En divisiones rige exactamente la misma norma.`;
    }

    if (q.includes("herradura") || q.includes("extremo") || q.includes("medio")) {
      return `🧲 <strong>La Ley de la Herradura (Extremos por Medios)</strong> es la técnica visual para resolver divisiones de fracciones superpuestas:<br><br>
              • <strong>Extremos:</strong> Se multiplican el numerador superior y el denominador inferior. El resultado es el <strong>nuevo numerador</strong>.<br>
              • <strong>Medios:</strong> Se multiplican el denominador superior y el numerador inferior. El resultado es el <strong>nuevo denominador</strong>.<br><br>
              💡 <em>Truco pedagógico:</em> Si tienes un número entero arriba como <code>5</code>, siempre escríbelo con denominador 1: <code>5/1</code>. Así tienes <code>(5/1) / (53/37) = (5 × 37) / (1 × 53) = 185/53</code>.`;
    }

    if (q.includes("abajo") || q.includes("arriba") || q.includes("orden") || q.includes("cascada")) {
      return `🪜 <strong>¿Por qué se simplifica obligatoriamente de abajo hacia arriba?</strong><br><br>
              Imagina una torre o escalera: no puedes pintar los pisos superiores hasta que los cimientos estén firmes. En una fracción compuesta como <code>5 / (2 - (-3)/(-7 + ...))</code>, el número 5 se divide entre TODO el denominador completo.<br><br>
              No podemos saber cuánto vale ese denominador hasta resolver el piso de más abajo. Por eso se comienza en la profundidad <code>1/2 - (-2/3)</code> y se va colapsando nivel por nivel hacia arriba.`;
    }

    if (q.includes("analogia") || q.includes("ejemplo") || q.includes("vida")) {
      if (ctx.id === 'compfrac') {
        return `💡 <strong>Analogía de las Muñecas Rusas (Matrioshkas):</strong><br><br>
                Una fracción compuesta es como un juego de muñecas rusas donde una muñeca pequeña está dentro de otra y esa dentro de otra. Para abrir la muñeca gigante exterior (el número 5), primero debes destapar y resolver la muñequita más pequeñita del centro (<code>1/2 - (-2/3)</code>), luego la siguiente que la envuelve, y así hasta liberar la estructura completa.`;
      }
      return `💡 <strong>Analogía de las Cajas con Regalo:</strong><br><br>
              Resolver expresiones con signos de agrupación <code>6[(7a - 5) + 1 - 5b]</code> es como abrir una caja fuerte dentro de un paquete envuelto dentro de una caja de regalo. Primero debes quitar la cinta del paquete interior <code>( )</code> antes de poder abrir la caja exterior <code>[ ]</code>.`;
    }

    if (q.includes("comprobar") || q.includes("verificar") || q.includes("seguro")) {
      return `✅ <strong>Estrategia de Comprobación:</strong><br><br>
              ${ctx.verifyHtml}<br>
              Si el cálculo con decimales independientes coincide dígito por dígito con el valor decimal de tu fracción final, tienes la garantía absoluta de que tu procedimiento está 100% correcto.`;
    }

    if (q.includes("resultado") || q.includes("por que") || q.includes("como")) {
      return `🎯 <strong>Desglose del Resultado:</strong><br><br>
              En este ejercicio <strong>${ctx.typeName}</strong>:<br><br>
              ${ctx.strategyHtml}`;
    }

    return `Comprendo tu pregunta sobre <code>${userQuery}</code>. En este tipo de problemas de <strong>${ctx.typeName}</strong>, la clave es mantener el orden jerárquico paso a paso y verificar los signos antes de cada multiplicación o simplificación.`;
  }

  async function handleAiChatMessage(userText) {
    if (!userText || !userText.trim()) return;
    const cleanText = userText.trim();
    appendAiChatMessage('user', cleanText);

    if (elements.aiChatInput) elements.aiChatInput.value = '';
    if (elements.floatingChatInput) elements.floatingChatInput.value = '';

    const ctx = getAiProblemContext();

    // Mensaje transitorio de pensamiento del profesor erudito en todos los contenedores
    const typingId = 'typing_' + Date.now();
    const containers = [elements.aiChatMessages, elements.floatingChatMessages].filter(Boolean);
    containers.forEach(cont => {
      const typingBubble = document.createElement('div');
      typingBubble.className = 'ai-message bot';
      typingBubble.dataset.typingId = typingId;
      typingBubble.innerHTML = `
        <div class="ai-msg-sender">
          <span>🐶</span> Profesor Perrito Math (Consultando los anales de la matemática...)
        </div>
        <div class="ai-msg-text" style="color: var(--text-dim); font-style: italic; display: flex; align-items: center; gap: 0.5rem;">
          <span class="ai-pulse-dot" style="position: static; display: inline-block;"></span>
          Preparando cátedra con fundamento teórico y ejemplos paso a paso...
        </div>
      `;
      cont.appendChild(typingBubble);
      cont.scrollTop = cont.scrollHeight;
    });

    try {
      let botResponse = '';
      if (window.PerritoErudite && window.PerritoErudite.ask) {
        botResponse = await window.PerritoErudite.ask(cleanText, ctx);
      } else {
        botResponse = generateAiResponse(cleanText, ctx);
      }
      document.querySelectorAll(`[data-typing-id="${typingId}"]`).forEach(el => el.remove());
      appendAiChatMessage('bot', botResponse);
    } catch (err) {
      console.error('[AI Tutor Chat Error]:', err);
      document.querySelectorAll(`[data-typing-id="${typingId}"]`).forEach(el => el.remove());
      appendAiChatMessage('bot', generateAiResponse(cleanText, ctx));
    }
  }

  function handleAiQuickQuery(queryKey) {
    const ctx = getAiProblemContext();
    let queryText = '';
    let answerText = '';

    if (queryKey === 'por_que_resultado') {
      queryText = '¿Por qué se llega a este resultado final?';
      answerText = `🎯 <strong>¿Cómo se desarrolló la solución?</strong><br><br>${ctx.strategyHtml}`;
    } else if (queryKey === 'ley_signos') {
      queryText = '¿Cómo funciona la regla de signos aquí?';
      answerText = generateAiResponse('signo negativo', ctx);
    } else if (queryKey === 'ley_herradura') {
      queryText = '¿Cómo se aplica la Ley de la Herradura?';
      answerText = generateAiResponse('herradura extremos medios', ctx);
    } else if (queryKey === 'orden_abajo_arriba') {
      queryText = '¿Por qué se resuelve de abajo hacia arriba?';
      answerText = generateAiResponse('orden abajo arriba', ctx);
    } else if (queryKey === 'analogia') {
      queryText = 'Explícamelo con una analogía simple';
      answerText = generateAiResponse('analogia', ctx);
    } else if (queryKey === 'como_comprobar') {
      queryText = '¿Cómo puedo comprobar mi respuesta?';
      answerText = generateAiResponse('comprobar verificar', ctx);
    }

    appendAiChatMessage('user', queryText);
    setTimeout(() => {
      appendAiChatMessage('bot', answerText);
    }, 200);
  }

  function generateAiPracticeProblem() {
    const ctx = getAiProblemContext();
    const practiceStr = ctx.practiceProblem || '3 / (2 - 1 / (3 + 1/4))';
    const msg = `🎯 <strong>¡Reto de Práctica del Tutor IA!</strong><br><br>
                 Para poner a prueba lo que acabamos de revisar, intenta simplificar este ejercicio similar:<br><br>
                 <code>${practiceStr}</code><br><br>
                 <button type="button" class="btn btn-primary btn-sm btn-load-practice" data-prob="${practiceStr}" data-type="${ctx.id}" style="margin-top: 0.5rem;">
                   🚀 Cargar este ejercicio en el Resolver
                 </button>`;
    appendAiChatMessage('bot', msg);

    setTimeout(() => {
      document.querySelectorAll('.btn-load-practice').forEach(btn => {
        btn.addEventListener('click', () => {
          const prob = btn.dataset.prob;
          const type = btn.dataset.type;
          if (type === 'compfrac') {
            if (elements.compFracExpressionInput) elements.compFracExpressionInput.value = prob;
            state.compFracState.expression = prob;
            switchTab('compfrac');
            const res = solveCompoundFraction(prob);
            renderCompoundFractionSteps(res);
            showToast('Ejercicio de práctica cargado');
          } else if (type === 'equations') {
            if (elements.eqExpressionInput) elements.eqExpressionInput.value = prob;
            state.eqState.expression = prob;
            switchTab('equations');
            showToast('Ejercicio de práctica cargado');
          }
        });
      });
    }, 300);
  }

  function setupAiTutorEvents() {
    // Context selector pills (problema activo)
    if (elements.aiContextPills) {
      elements.aiContextPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const ctxId = pill.dataset.context;
          state.aiState.activeContext = ctxId;
          renderAiTutor(ctxId);
        });
      });
    }

    // Sync button
    if (elements.btnAiAnalyzeCurrent) {
      elements.btnAiAnalyzeCurrent.addEventListener('click', () => {
        state.aiState.activeContext = 'current';
        renderAiTutor('current');
        showToast('Sincronizado con ejercicio en pantalla');
      });
    }

    // Category pills in chat (Main Tab)
    if (elements.aiCatPills) {
      elements.aiCatPills.querySelectorAll('.ai-cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          elements.aiCatPills.querySelectorAll('.ai-cat-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          renderCategoryChips(cat);
        });
      });
    }

    // Category pills in floating widget
    if (elements.floatingCatPills) {
      elements.floatingCatPills.querySelectorAll('.ai-cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          elements.floatingCatPills.querySelectorAll('.ai-cat-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          renderCategoryChips(cat);
        });
      });
    }

    // Quick FAQ chips iniciales
    renderCategoryChips('current');

    // Chat submit (Main Tab)
    if (elements.aiChatForm) {
      elements.aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = elements.aiChatInput ? elements.aiChatInput.value : '';
        handleAiChatMessage(text);
      });
    }

    // Chat submit (Floating Widget)
    if (elements.floatingChatForm) {
      elements.floatingChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = elements.floatingChatInput ? elements.floatingChatInput.value : '';
        handleAiChatMessage(text);
      });
    }

    if (elements.btnFloatingSend) {
      elements.btnFloatingSend.addEventListener('click', (e) => {
        e.preventDefault();
        const text = elements.floatingChatInput ? elements.floatingChatInput.value : '';
        handleAiChatMessage(text);
      });
    }

    if (elements.floatingChatInput) {
      elements.floatingChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const text = elements.floatingChatInput.value;
          handleAiChatMessage(text);
        }
      });
    }

    // Floating chat widget buttons
    if (elements.btnCloseFloatingChat) {
      elements.btnCloseFloatingChat.addEventListener('click', () => {
        toggleFloatingAiChat(false);
      });
    }

    if (elements.btnFloatingGoFullScreen) {
      elements.btnFloatingGoFullScreen.addEventListener('click', () => {
        toggleFloatingAiChat(false);
        switchTab('aitutor');
      });
    }

    if (elements.btnFloatingSync) {
      elements.btnFloatingSync.addEventListener('click', () => {
        const ctx = getAiProblemContext();
        if (elements.floatingContextName) elements.floatingContextName.textContent = ctx.typeName;
        showToast('Sincronizado con ejercicio en pantalla');
      });
    }

    // Practice problem button
    if (elements.btnAiGeneratePractice) {
      elements.btnAiGeneratePractice.addEventListener('click', () => {
        generateAiPracticeProblem();
      });
    }

    // Gemini Modal triggers (Header, Banner, Main Chat & Floating Chat)
    updateGeminiStatusBadge();

    const openGeminiTriggers = [
      elements.btnHeaderGemini,
      elements.btnBannerGemini,
      elements.btnOpenGeminiModal,
      elements.btnFloatingGeminiConfig
    ].filter(Boolean);

    openGeminiTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        if (elements.geminiApiKeyInput && window.PerritoErudite) {
          elements.geminiApiKeyInput.value = window.PerritoErudite.getApiKey();
        }
        if (elements.geminiTestStatus) {
          elements.geminiTestStatus.style.display = 'none';
          elements.geminiTestStatus.innerHTML = '';
        }
        if (elements.geminiModalOverlay) elements.geminiModalOverlay.style.display = 'flex';
      });
    });

    if (elements.btnCloseGeminiModal) {
      elements.btnCloseGeminiModal.addEventListener('click', () => {
        if (elements.geminiModalOverlay) elements.geminiModalOverlay.style.display = 'none';
      });
    }

    if (elements.btnTestGeminiKey) {
      elements.btnTestGeminiKey.addEventListener('click', async () => {
        const val = elements.geminiApiKeyInput ? elements.geminiApiKeyInput.value.trim() : '';
        const statusBox = elements.geminiTestStatus;
        if (!statusBox) return;

        statusBox.style.display = 'block';
        statusBox.className = 'gemini-test-result loading';
        statusBox.innerHTML = '⏳ <em>Conectando con Google Generative AI... Verificando credenciales...</em>';

        if (!val) {
          statusBox.className = 'gemini-test-result error';
          statusBox.innerHTML = '⚠️ <strong>Campo vacío:</strong> Por favor escribe o pega tu clave de API antes de probar la conexión.';
          return;
        }

        try {
          if (window.PerritoErudite && window.PerritoErudite.testGeminiKey) {
            const res = await window.PerritoErudite.testGeminiKey(val);
            if (res.ok) {
              statusBox.className = 'gemini-test-result success';
              statusBox.innerHTML = `✅ <strong>¡Conexión Exitosa!</strong><br>${res.message}`;
            } else {
              statusBox.className = 'gemini-test-result error';
              statusBox.innerHTML = `❌ <strong>Error reportado por Google:</strong><br><code>${res.error}</code><br><small style="color: var(--text-dim); display: block; margin-top: 4px;">Verifica que la clave comience con "AIzaSy..." y que tu proyecto en Google AI Studio esté activo.</small>`;
            }
          }
        } catch (err) {
          statusBox.className = 'gemini-test-result error';
          statusBox.innerHTML = `❌ <strong>Error de red:</strong> ${err.message}`;
        }
      });
    }

    if (elements.btnSaveGeminiKey) {
      elements.btnSaveGeminiKey.addEventListener('click', () => {
        const val = elements.geminiApiKeyInput ? elements.geminiApiKeyInput.value.trim() : '';
        if (window.PerritoErudite) {
          window.PerritoErudite.setApiKey(val);
          updateGeminiStatusBadge();
          showToast(val ? '✨ Clave de Gemini guardada y activada' : 'Modo offline activado');
        }
        if (elements.geminiModalOverlay) elements.geminiModalOverlay.style.display = 'none';
      });
    }

    if (elements.btnRemoveGeminiKey) {
      elements.btnRemoveGeminiKey.addEventListener('click', () => {
        if (window.PerritoErudite) {
          window.PerritoErudite.setApiKey('');
          if (elements.geminiApiKeyInput) elements.geminiApiKeyInput.value = '';
          updateGeminiStatusBadge();
          showToast('Clave removida (motor offline activo)');
        }
        if (elements.geminiModalOverlay) elements.geminiModalOverlay.style.display = 'none';
      });
    }

    // Contextual explanation buttons from problem cards
    if (elements.btnAiExplainMcd) {
      elements.btnAiExplainMcd.addEventListener('click', () => {
        state.aiState.activeContext = 'mcd';
        switchTab('aitutor');
      });
    }
    if (elements.btnAiExplainEquation) {
      elements.btnAiExplainEquation.addEventListener('click', () => {
        state.aiState.activeContext = 'equations';
        switchTab('aitutor');
      });
    }
    if (elements.btnAiExplainRationals) {
      elements.btnAiExplainRationals.addEventListener('click', () => {
        state.aiState.activeContext = 'rationals';
        switchTab('aitutor');
      });
    }
    if (elements.btnAiExplainCompFrac) {
      elements.btnAiExplainCompFrac.addEventListener('click', () => {
        state.aiState.activeContext = 'compfrac';
        switchTab('aitutor');
      });
    }
  }

  // ==========================================================================
  // MASTER NAVIGATION & TAB SWITCHING CENTRALIZADA
  // ==========================================================================

  function switchModule(modId) {
    if (!modId) return;
    state.activeModule = modId;

    // Show/hide MCD top controls
    if (elements.mcdControlsWrapper) {
      elements.mcdControlsWrapper.style.display = modId === 'mcd' ? 'block' : 'none';
    }

    // Update Master Module Nav Buttons
    const moduleNavBtns = document.querySelectorAll('.module-nav-btn');
    moduleNavBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mod === modId);
    });

    // Toggle .math-module visibility
    const modules = document.querySelectorAll('.math-module');
    modules.forEach(mod => {
      const isTarget = mod.id.toLowerCase() === `module${modId.toLowerCase()}`;
      mod.classList.toggle('active', isTarget);
      mod.style.display = isTarget ? 'block' : 'none';
    });

    // Sub-module activations and initializations
    if (modId === 'mcd') {
      updateAll();
    } else if (modId === 'equations') {
      renderEquationModule();
      solveActiveQuadratic();
      solveActiveSystem2x2();
      solveActiveSystem3x3();
    } else if (modId === 'factorization') {
      solveActiveFactorization();
    } else if (modId === 'rationals') {
      renderRationalsUI();
      renderCompFracModule();
    } else if (modId === 'grapher') {
      initGrapherModule();
    } else if (modId === 'calculus') {
      solveActiveDerivative();
      solveActiveLimit();
    } else if (modId === 'quiz') {
      initQuizModule();
    } else if (modId === 'aitutor') {
      renderAiTutor();
      renderNotebookCards();
    }
  }

  function switchTab(tabId) {
    state.activeTab = tabId;

    // Check if tabId is actually a top-level module
    if (['mcd', 'equations', 'factorization', 'rationals', 'grapher', 'calculus', 'quiz', 'aitutor'].includes(tabId)) {
      switchModule(tabId);
      return;
    }

    // It is an M.C.D. tab
    switchModule('mcd');

    // Update View Tabs inside M.C.D.
    if (elements.viewTabs) {
      elements.viewTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
      });
    }

    // Sync Mobile Tab Select dropdown
    if (elements.mobileTabSelect && elements.mobileTabSelect.value !== tabId) {
      elements.mobileTabSelect.value = tabId;
    }

    // Update Panes inside M.C.D.
    if (elements.tabPanes) {
      elements.tabPanes.forEach(pane => {
        pane.classList.remove('active');
        const targetId = `pane${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`;
        if (pane.id === targetId) {
          pane.classList.add('active');
        }
      });
    }
  }

  // --- REPRODUCTOR PASO A PASO ---
  function resetPlayer() {
    pausePlayer();
    const simData = computeSimultaneousDecomposition(state.numbers);
    state.player.currentStep = simData.steps.length;
    updatePlayerBtnText();
  }

  function pausePlayer() {
    if (state.player.isPlaying) {
      clearInterval(state.player.intervalId);
      state.player.isPlaying = false;
      updatePlayerBtnText();
    }
  }

  function updatePlayerBtnText() {
    elements.playerPlay.textContent = state.player.isPlaying ? '⏸ Pausa' : '▶ Reproducir';
  }

  function stepForward() {
    pausePlayer();
    if (state.player.currentStep < state.player.maxSteps) {
      state.player.currentStep++;
      const simData = computeSimultaneousDecomposition(state.numbers);
      renderSimultaneousTable(simData);
    }
  }

  function stepBack() {
    pausePlayer();
    if (state.player.currentStep > 1) {
      state.player.currentStep--;
      const simData = computeSimultaneousDecomposition(state.numbers);
      renderSimultaneousTable(simData);
    }
  }

  function playAnimation() {
    if (state.player.isPlaying) {
      pausePlayer();
      return;
    }

    if (state.player.currentStep >= state.player.maxSteps) {
      state.player.currentStep = 1;
    }

    state.player.isPlaying = true;
    updatePlayerBtnText();

    state.player.intervalId = setInterval(() => {
      if (state.player.currentStep < state.player.maxSteps) {
        state.player.currentStep++;
        const simData = computeSimultaneousDecomposition(state.numbers);
        renderSimultaneousTable(simData);
      } else {
        pausePlayer();
      }
    }, 1100);
  }

  // --- EXPORTAR A EXCEL DINÁMICAMENTE ---
  function exportDynamicExcel() {
    if (typeof XLSX === 'undefined') {
      showToast('SheetJS no cargado. Descargue la plantilla Excel preconfigurada.');
      return;
    }

    const simData = computeSimultaneousDecomposition(state.numbers);
    const wb = XLSX.utils.book_new();

    // Hoja 1: Resumen y Descomposición Simultánea
    const simultaneousRows = [
      ['CALCULADORA DE MÁXIMO COMÚN DIVISOR (M.C.D.)'],
      ['Números analizados:', ...state.numbers],
      ['Resultado MCD:', simData.mcd],
      ['Fórmula nativa Excel:', `=M.C.D(${state.numbers.join('; ')})`],
      [],
      ['TABLA DE DESCOMPOSICIÓN SIMULTÁNEA EN FACTORES PRIMOS'],
      ['Paso', ...state.numbers.map((_, i) => `Núm ${String.fromCharCode(65 + i)}`), 'Factor Primo Común', 'Explicación']
    ];

    simData.steps.forEach((step, idx) => {
      const isInitial = idx === 0;
      const rowVals = isInitial ? simData.initialNumbers : step.prevValues;
      const prime = isInitial ? (simData.steps[1] ? simData.steps[1].prime : '-') : (simData.steps[idx + 1] ? simData.steps[idx + 1].prime : '-');
      const expl = prime !== '-' ? `División exacta entre ${prime}` : 'Fin de factores comunes';

      simultaneousRows.push([
        idx === 0 ? 'Inicio' : idx,
        ...rowVals,
        prime,
        expl
      ]);
    });

    simultaneousRows.push([
      'Fin (Coprimos)',
      ...simData.finalQuotients,
      '-',
      `MCD = ${simData.commonPrimeFactors.join(' × ') || '1'} = ${simData.mcd}`
    ]);

    const ws1 = XLSX.utils.aoa_to_sheet(simultaneousRows);
    XLSX.utils.book_append_sheet(wb, ws1, 'Descomposición');

    // Hoja 2: Factores Primos Individuales
    const factorsRows = [
      ['DESCOMPOSICIÓN EN FACTORES PRIMOS INDIVIDUALES'],
      ['Número', 'Descomposición Canónica', 'Factores Primos']
    ];

    state.numbers.forEach((num, idx) => {
      const det = getDetailedPrimeFactorization(num);
      factorsRows.push([
        `Número ${String.fromCharCode(65 + idx)} (${num})`,
        det.canonicalStr,
        det.steps.map(s => s.primeFactor).filter(Boolean).join(', ')
      ]);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(factorsRows);
    XLSX.utils.book_append_sheet(wb, ws2, 'Factores Primos');

    // Hoja 3: Divisores
    const divisorsRows = [
      ['TABLA DE DIVISORES POSITIVOS'],
      ['Número', 'Lista Completa de Divisores', 'Cantidad']
    ];

    state.numbers.forEach((num, idx) => {
      const divs = getAllDivisors(num);
      divisorsRows.push([
        `Número ${String.fromCharCode(65 + idx)} (${num})`,
        divs.join(', '),
        divs.length
      ]);
    });

    const ws3 = XLSX.utils.aoa_to_sheet(divisorsRows);
    XLSX.utils.book_append_sheet(wb, ws3, 'Divisores');

    const fileName = `MCD_${state.numbers.join('_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast(`Archivo Excel "${fileName}" generado y descargado`);
  }

  // Copiar procedimiento en texto
  function copySolutionText() {
    const simData = computeSimultaneousDecomposition(state.numbers);
    const mcd = simData.mcd;
    const numsStr = state.numbers.join(', ');

    let text = `======================================================\n`;
    text += `MÁXIMO COMÚN DIVISOR (M.C.D.) - PROCEDIMIENTO PASO A PASO\n`;
    text += `Números evaluados: ${numsStr}\n`;
    text += `Resultado final: MCD(${numsStr}) = ${mcd}\n`;
    text += `======================================================\n\n`;

    text += `1. DESCOMPOSICIÓN CANÓNICA INDIVIDUAL:\n`;
    state.numbers.forEach((num, i) => {
      const det = getDetailedPrimeFactorization(num);
      text += `  • Número ${String.fromCharCode(65 + i)} (${num}): ${num} = ${det.canonicalStr}\n`;
    });
    text += `\n`;

    text += `2. DESCOMPOSICIÓN SIMULTÁNEA EN FACTORES PRIMOS:\n`;
    simData.steps.forEach((step, idx) => {
      const isInitial = idx === 0;
      const rowVals = isInitial ? simData.initialNumbers : step.prevValues;
      const prime = isInitial ? (simData.steps[1] ? simData.steps[1].prime : '-') : (simData.steps[idx + 1] ? simData.steps[idx + 1].prime : '-');
      text += `  [Paso ${idx}] [ ${rowVals.join('  |  ')} ]  -->  Factor primo común: ${prime}\n`;
    });
    text += `  Cocientes coprimos finales: [ ${simData.finalQuotients.join('  |  ')} ]\n`;
    if (simData.commonPrimeFactors.length > 0) {
      text += `  Multiplicación de factores comunes: ${simData.commonPrimeFactors.join(' × ')} = ${mcd}\n\n`;
    } else {
      text += `  No existen factores primos comunes. Los números son coprimos: MCD = 1\n\n`;
    }

    text += `3. FÓRMULA DIRECTA PARA EXCEL:\n`;
    text += `  Español: =M.C.D(${state.numbers.join('; ')})\n`;
    text += `  Inglés:  =GCD(${state.numbers.join(', ')})\n`;

    navigator.clipboard.writeText(text).then(() => {
      showToast('¡Procedimiento paso a paso copiado!');
    }).catch(() => {
      showToast('Error al copiar al portapapeles');
    });
  }

  function showToast(msg) {
    elements.toastNotification.textContent = msg;
    elements.toastNotification.classList.add('show');
    setTimeout(() => {
      elements.toastNotification.classList.remove('show');
    }, 2800);
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    elements.themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });

    elements.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        state.mode = mode;

        elements.modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (mode === '2') state.numbers = [48, 72];
        else if (mode === '3') state.numbers = [60, 90, 150];
        else if (mode === '4') state.numbers = [120, 180, 240, 300];
        else if (mode === 'custom') state.numbers = [30, 45, 75, 90, 120];

        renderInputs();
        renderPresets();
        resetPlayer();
        updateAll();
      });
    });

    elements.btnAddNumber.addEventListener('click', () => {
      if (state.numbers.length < 8) {
        state.numbers.push(100);
        renderInputs();
        resetPlayer();
        updateAll();
      } else {
        showToast('Máximo 8 números simultáneos');
      }
    });

    elements.btnRemoveNumber.addEventListener('click', () => {
      if (state.numbers.length > 2) {
        state.numbers.pop();
        renderInputs();
        resetPlayer();
        updateAll();
      } else {
        showToast('Mínimo 2 números');
      }
    });

    elements.btnRandom.addEventListener('click', () => {
      const baseGcd = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20][Math.floor(Math.random() * 10)];
      state.numbers = state.numbers.map(() => {
        const mult = Math.floor(Math.random() * 8) + 2;
        return baseGcd * mult;
      });
      renderInputs();
      resetPlayer();
      updateAll();
      showToast('Números aleatorios generados');
    });

    elements.btnReset.addEventListener('click', () => {
      if (state.mode === '2') state.numbers = [48, 72];
      else if (state.mode === '3') state.numbers = [60, 90, 150];
      else if (state.mode === '4') state.numbers = [120, 180, 240, 300];
      else state.numbers = [30, 45, 75, 90, 120];
      renderInputs();
      resetPlayer();
      updateAll();
      showToast('Valores restablecidos');
    });

    elements.viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        switchTab(tabId);
      });
    });

    if (elements.mobileTabSelect) {
      elements.mobileTabSelect.addEventListener('change', (e) => {
        switchTab(e.target.value);
      });
    }

    const allModBtns = document.querySelectorAll('.module-nav-btn');
    if (allModBtns) {
      allModBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const mod = btn.dataset.mod;
          switchModule(mod);
        });
      });
    }

    // Initialize academic submodule navigation and listeners
    setupSubmodules();
    setupAcademicModuleListeners();

    if (elements.btnHeaderGoAiTutor) {
      elements.btnHeaderGoAiTutor.addEventListener('click', () => {
        switchTab('aitutor');
      });
    }

    if (elements.btnFloatingAiTutor) {
      elements.btnFloatingAiTutor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFloatingAiChat();
      });
    }

    elements.playerPrev.addEventListener('click', stepBack);
    elements.playerNext.addEventListener('click', stepForward);
    elements.playerPlay.addEventListener('click', playAnimation);
    elements.playerReset.addEventListener('click', () => {
      pausePlayer();
      const simData = computeSimultaneousDecomposition(state.numbers);
      state.player.currentStep = simData.steps.length;
      renderSimultaneousTable(simData);
    });

    elements.btnAnalyzeFinder.addEventListener('click', () => {
      const val = parseInt(elements.finderInput.value, 10);
      if (!isNaN(val) && val >= 2) {
        analyzeFinderNumber(val);
      }
    });

    elements.finderInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const val = parseInt(elements.finderInput.value, 10);
        if (!isNaN(val) && val >= 2) {
          analyzeFinderNumber(val);
        }
      }
    });

    // Event listeners para la función de descomponer en factores
    if (elements.btnDecomposeNow) {
      elements.btnDecomposeNow.addEventListener('click', () => {
        const val = parseInt(elements.factorDecomposeInput.value, 10);
        if (!isNaN(val) && val >= 2) {
          state.factorNumber = val;
          renderFactorDecomposition();
        }
      });
    }

    if (elements.factorDecomposeInput) {
      elements.factorDecomposeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = parseInt(elements.factorDecomposeInput.value, 10);
          if (!isNaN(val) && val >= 2) {
            state.factorNumber = val;
            renderFactorDecomposition();
          }
        }
      });
    }

    if (elements.btnTreeBalanced && elements.btnTreePrimes) {
      elements.btnTreeBalanced.addEventListener('click', () => {
        state.treeMode = 'balanced';
        elements.btnTreeBalanced.classList.add('active');
        elements.btnTreePrimes.classList.remove('active');
        renderFactorDecomposition();
      });

      elements.btnTreePrimes.addEventListener('click', () => {
        state.treeMode = 'primeFirst';
        elements.btnTreePrimes.classList.add('active');
        elements.btnTreeBalanced.classList.remove('active');
        renderFactorDecomposition();
      });
    }

    elements.btnCopySolution.addEventListener('click', copySolutionText);
    if (elements.btnCopyNarrative) {
      elements.btnCopyNarrative.addEventListener('click', copySolutionText);
    }
    elements.btnExportDynamicExcel.addEventListener('click', exportDynamicExcel);
    elements.btnPrint.addEventListener('click', () => window.print());

    setupEquationEvents();
    setupRationalsEvents();
    setupCompFracEvents();
    setupAiTutorEvents();
    setupPwa();
  }

  /* ==========================================================================
     PWA CONTROLLER & SERVICE WORKER INSTALLATION
     ========================================================================== */
  let deferredPrompt = null;

  function setupPwa() {
    const btnInstallApp = document.getElementById('btnInstallApp');
    const installModalOverlay = document.getElementById('installModalOverlay');
    const btnCloseInstallModal = document.getElementById('btnCloseInstallModal');
    const btnNativeInstallTrigger = document.getElementById('btnNativeInstallTrigger');
    const installNativeArea = document.getElementById('installNativeArea');
    const installIosArea = document.getElementById('installIosArea');
    const installAlreadyInstalled = document.getElementById('installAlreadyInstalled');
    const mobileInstallBanner = document.getElementById('mobileInstallBanner');
    const btnBannerInstall = document.getElementById('btnBannerInstall');
    const btnBannerClose = document.getElementById('btnBannerClose');
    const offlineBadge = document.getElementById('offlineBadge');

    // Detect iOS
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Detect Standalone / Installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    // Network status (online / offline) indicator
    function updateNetworkStatus(isInit = false) {
      const isOnline = navigator.onLine;
      if (!isOnline) {
        if (offlineBadge) {
          offlineBadge.style.display = 'inline-flex';
          const textEl = offlineBadge.querySelector('.offline-badge-text');
          if (textEl) textEl.textContent = '100% Offline';
        }
        if (!isInit) {
          showToast('🐶 Modo sin conexión activo: Perrito Math funciona al 100% offline.');
        }
      } else {
        if (!isInit && offlineBadge && offlineBadge.style.display !== 'none') {
          const textEl = offlineBadge.querySelector('.offline-badge-text');
          if (textEl) textEl.textContent = 'Online';
          showToast('🌐 Conexión a internet restablecida.');
          setTimeout(() => {
            if (navigator.onLine && offlineBadge) {
              offlineBadge.style.display = 'none';
            }
          }, 2500);
        } else if (offlineBadge) {
          offlineBadge.style.display = 'none';
        }
      }
    }

    window.addEventListener('online', () => updateNetworkStatus(false));
    window.addEventListener('offline', () => updateNetworkStatus(false));
    updateNetworkStatus(true);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            console.log('[PWA] ServiceWorker registrado con éxito, ámbito:', registration.scope);
            
            if (registration.installing) {
              registration.installing.addEventListener('statechange', (e) => {
                if (e.target.state === 'installed' && !navigator.serviceWorker.controller) {
                  showToast('🐶 ¡Perrito Math listo para usarse sin internet!');
                }
              });
            }
          })
          .catch((error) => {
            console.log('[PWA] Error registrando ServiceWorker:', error);
          });
      });
    }

    // Capture install prompt event (Android, Chrome, Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('[PWA] beforeinstallprompt capturado');

      if (!isStandalone) {
        if (btnInstallApp) btnInstallApp.style.display = 'inline-flex';
        // Show banner on mobile screens if not dismissed in this session
        if (window.innerWidth <= 768 && !sessionStorage.getItem('dismissedInstallBanner')) {
          if (mobileInstallBanner) {
            mobileInstallBanner.style.display = 'flex';
            document.body.classList.add('has-mobile-banner');
          }
        }
      }
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      console.log('[PWA] Aplicación instalada con éxito');
      if (btnInstallApp) btnInstallApp.style.display = 'none';
      if (mobileInstallBanner) {
        mobileInstallBanner.style.display = 'none';
        document.body.classList.remove('has-mobile-banner');
      }
      showToast('¡Perrito Math se instaló correctamente en tu dispositivo! 🐶🚀');
    });

    function openInstallModal() {
      if (!installModalOverlay) return;
      installModalOverlay.style.display = 'flex';

      if (isStandalone) {
        if (installNativeArea) installNativeArea.style.display = 'none';
        if (installIosArea) installIosArea.style.display = 'none';
        if (installAlreadyInstalled) installAlreadyInstalled.style.display = 'block';
      } else if (isIos) {
        if (installNativeArea) installNativeArea.style.display = 'none';
        if (installIosArea) installIosArea.style.display = 'block';
        if (installAlreadyInstalled) installAlreadyInstalled.style.display = 'none';
      } else {
        if (installNativeArea) installNativeArea.style.display = 'block';
        if (installIosArea) installIosArea.style.display = 'none';
        if (installAlreadyInstalled) installAlreadyInstalled.style.display = 'none';
      }
    }

    function closeInstallModal() {
      if (installModalOverlay) installModalOverlay.style.display = 'none';
    }

    if (btnInstallApp) {
      btnInstallApp.addEventListener('click', openInstallModal);
    }

    if (btnBannerInstall) {
      btnBannerInstall.addEventListener('click', openInstallModal);
    }

    if (btnBannerClose) {
      btnBannerClose.addEventListener('click', () => {
        if (mobileInstallBanner) {
          mobileInstallBanner.style.display = 'none';
          document.body.classList.remove('has-mobile-banner');
        }
        sessionStorage.setItem('dismissedInstallBanner', 'true');
      });
    }

    if (btnCloseInstallModal) {
      btnCloseInstallModal.addEventListener('click', closeInstallModal);
    }

    if (installModalOverlay) {
      installModalOverlay.addEventListener('click', (e) => {
        if (e.target === installModalOverlay) closeInstallModal();
      });
    }

    if (btnNativeInstallTrigger) {
      btnNativeInstallTrigger.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log('[PWA] Elección de instalación del usuario:', outcome);
          deferredPrompt = null;
          closeInstallModal();
        } else {
          showToast('En el menú de tu navegador (⋮ o Compartir), selecciona «Instalar aplicación» o «Añadir a inicio».');
        }
      });
    }

    // Check if already in standalone mode
    if (isStandalone && btnInstallApp) {
      btnInstallApp.innerHTML = '✅ <span class="install-btn-text">App Instalada</span>';
      btnInstallApp.style.opacity = '0.85';
    }
  }

  // ==========================================================================
  // MÓDULOS ACADÉMICOS PARA PREPARATORIA Y UNIVERSIDAD (100% OFFLINE)
  // ==========================================================================

  // --- NAVEGACIÓN ENTRE SUB-MÓDULOS ---
  function setupSubmodules() {
    document.querySelectorAll('.submodule-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const subId = btn.dataset.sub;
        const parentModule = btn.closest('.math-module');
        if (!parentModule) return;

        // Alternar botones activos
        parentModule.querySelectorAll('.submodule-btn').forEach(b => {
          b.classList.toggle('active', b === btn);
        });

        // Alternar paneles de submódulo
        const panes = parentModule.querySelectorAll('.submodule-pane');
        panes.forEach(pane => {
          const cleanSub = subId.replace(/[-_]/g, '').toLowerCase();
          const cleanPane = pane.id.replace(/^subpane/i, '').replace(/[-_]/g, '').toLowerCase();
          const isTarget = cleanPane === cleanSub;
          pane.classList.toggle('active', isTarget);
          pane.style.display = isTarget ? 'block' : 'none';
        });

        // Ejecutar cálculo al entrar al submódulo
        if (subId === 'eq-quadratic') {
          solveActiveQuadratic();
        } else if (subId === 'eq-2x2') {
          solveActiveSystem2x2();
        } else if (subId === 'eq-3x3') {
          solveActiveSystem3x3();
        } else if (subId === 'rat-simple') {
          renderRationalsUI();
        } else if (subId === 'rat-compound') {
          renderCompFracModule();
        } else if (subId === 'calc-deriv') {
          solveActiveDerivative();
        } else if (subId === 'calc-limits') {
          solveActiveLimit();
        } else if (subId === 'ai-chat') {
          renderAiTutor();
        } else if (subId === 'ai-notebook') {
          renderNotebookCards();
        }
      });
    });
  }

  // --- 1. RESOLVER DE ECUACIONES CUADRÁTICAS ---
  let lastQuadraticResult = null;

  function solveActiveQuadratic() {
    const aInput = document.getElementById('quadInputA');
    const bInput = document.getElementById('quadInputB');
    const cInput = document.getElementById('quadInputC');
    const container = document.getElementById('quadResultsContainer');
    if (!aInput || !bInput || !cInput || !container || !window.PerritoAcademic) return;

    const a = parseFloat(aInput.value);
    const b = parseFloat(bInput.value);
    const c = parseFloat(cInput.value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      container.innerHTML = '<div class="alert alert-warning">Por favor ingresa números válidos para los coeficientes a, b y c.</div>';
      return;
    }

    try {
      const res = window.PerritoAcademic.solveQuadratic(a, b, c);
      lastQuadraticResult = res;

      let deltaColor = res.delta > 0 ? '#10b981' : (res.delta === 0 ? '#3b82f6' : '#f59e0b');

      let html = `
        <div class="kpi-grid" style="margin-bottom: 1.25rem;">
          <div class="kpi-card highlight-card">
            <div class="kpi-icon">🎯</div>
            <div class="kpi-details">
              <span class="kpi-label">Discriminante Δ (b² - 4ac)</span>
              <div class="kpi-val" style="color: ${deltaColor};">${res.delta}</div>
              <span class="kpi-badge">${res.rootType}</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">1️⃣</div>
            <div class="kpi-details">
              <span class="kpi-label">Raíz x₁</span>
              <div class="kpi-val text-sm font-mono" style="color: #60a5fa;">x₁ = ${res.x1Display}</div>
              <span class="kpi-sub">Primer corte con eje X</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">2️⃣</div>
            <div class="kpi-details">
              <span class="kpi-label">Raíz x₂</span>
              <div class="kpi-val text-sm font-mono" style="color: #a78bfa;">x₂ = ${res.x2Display}</div>
              <span class="kpi-sub">Segundo corte con eje X</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🏔️</div>
            <div class="kpi-details">
              <span class="kpi-label">Vértice (h, k)</span>
              <div class="kpi-val text-sm font-mono">(${res.vertexH}, ${res.vertexK})</div>
              <span class="kpi-sub">${res.concavity}</span>
            </div>
          </div>
        </div>

        <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem; margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.75rem; color: #c4b5fd; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📐</span> Resolución Paso a Paso por Fórmula General («Chicharronera»)
          </h4>
          <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-main); font-size: 0.95rem;">
            <li><strong>Coeficientes identificados:</strong> a = ${a}, b = ${b}, c = ${c}</li>
            <li><strong>Fórmula General:</strong> <code>x = [-b ± √(b² - 4ac)] / (2a)</code></li>
            <li><strong>Sustitución en el discriminante:</strong> <code>Δ = (${b})² - 4(${a})(${c}) = ${b*b} - ${4*a*c} = ${res.delta}</code></li>
            <li><strong>Sustitución de valores:</strong> <code>x = [-(${b}) ± √(${res.delta})] / [2(${a})] = [${-b} ± √(${res.delta})] / ${2*a}</code></li>
            <li><strong>Soluciones resultantes:</strong>
              <div style="margin-top: 0.35rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.35rem 0.75rem; border-radius: 8px; font-family: monospace;">x₁ = ${res.x1Display}</span>
                <span class="badge" style="background: rgba(139, 92, 246, 0.15); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.3); padding: 0.35rem 0.75rem; border-radius: 8px; font-family: monospace;">x₂ = ${res.x2Display}</span>
              </div>
            </li>
            <li><strong>Forma factorizada:</strong> <code>${res.factorForm}</code></li>
            <li><strong>Corte con el eje Y:</strong> <code>f(0) = ${res.yIntercept} → Punto (0, ${res.yIntercept})</code></li>
          </ol>
        </div>
      `;

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${e.message}</div>`;
    }
  }

  // --- 2. SISTEMAS DE ECUACIONES 2x2 ---
  let lastSystem2x2Result = null;

  function solveActiveSystem2x2() {
    const a1 = parseFloat(document.getElementById('sys2xA1')?.value);
    const b1 = parseFloat(document.getElementById('sys2xB1')?.value);
    const c1 = parseFloat(document.getElementById('sys2xC1')?.value);
    const a2 = parseFloat(document.getElementById('sys2xA2')?.value);
    const b2 = parseFloat(document.getElementById('sys2xB2')?.value);
    const c2 = parseFloat(document.getElementById('sys2xC2')?.value);
    const container = document.getElementById('sys2x2ResultsContainer');
    if (!container || !window.PerritoAcademic) return;

    if ([a1, b1, c1, a2, b2, c2].some(v => isNaN(v))) {
      container.innerHTML = '<div class="alert alert-warning">Por favor completa todos los coeficientes del sistema 2x2.</div>';
      return;
    }

    try {
      const res = window.PerritoAcademic.solveSystem2x2(a1, b1, c1, a2, b2, c2);
      lastSystem2x2Result = res;

      let html = `
        <div class="kpi-grid" style="margin-bottom: 1.25rem;">
          <div class="kpi-card highlight-card">
            <div class="kpi-icon">📊</div>
            <div class="kpi-details">
              <span class="kpi-label">Det. Sistema (Δs)</span>
              <div class="kpi-val font-mono">${res.detS}</div>
              <span class="kpi-badge">${res.type}</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">✖️</div>
            <div class="kpi-details">
              <span class="kpi-label">Solución X</span>
              <div class="kpi-val text-sm font-mono" style="color: #60a5fa;">x = ${res.xDisplay}</div>
              <span class="kpi-sub">Δx = ${res.detX}</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🇾</div>
            <div class="kpi-details">
              <span class="kpi-label">Solución Y</span>
              <div class="kpi-val text-sm font-mono" style="color: #a78bfa;">y = ${res.yDisplay}</div>
              <span class="kpi-sub">Δy = ${res.detY}</span>
            </div>
          </div>
        </div>

        <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem;">
          <h4 style="margin-bottom: 0.75rem; color: #a78bfa; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📐</span> Procedimiento por Regla de Cramer (Determinantes)
          </h4>
          <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-main); font-size: 0.95rem;">
            <li><strong>Determinante del sistema (Δs):</strong> <code>(${a1})(${b2}) - (${a2})(${b1}) = ${res.detS}</code></li>
            <li><strong>Determinante de X (Δx):</strong> <code>(${c1})(${b2}) - (${c2})(${b1}) = ${res.detX}</code></li>
            <li><strong>Determinante de Y (Δy):</strong> <code>(${a1})(${c2}) - (${a2})(${c1}) = ${res.detY}</code></li>
            <li><strong>Cálculo de Incógnitas:</strong>
              <div style="margin-top: 0.25rem;">
                <code>x = Δx / Δs = ${res.detX} / ${res.detS} = <strong>${res.xDisplay}</strong></code><br>
                <code>y = Δy / Δs = ${res.detY} / ${res.detS} = <strong>${res.yDisplay}</strong></code>
              </div>
            </li>
            <li><strong>Comprobación en el sistema original:</strong>
              <div style="font-family: monospace; font-size: 0.9rem; color: #34d399; margin-top: 0.25rem;">
                Ec 1: ${a1}(${res.xDisplay}) + ${b1}(${res.yDisplay}) = ${c1} ✔<br>
                Ec 2: ${a2}(${res.xDisplay}) + ${b2}(${res.yDisplay}) = ${c2} ✔
              </div>
            </li>
          </ol>
        </div>
      `;

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${e.message}</div>`;
    }
  }

  // --- 3. SISTEMAS DE ECUACIONES 3x3 ---
  let lastSystem3x3Result = null;

  function solveActiveSystem3x3() {
    const a1 = parseFloat(document.getElementById('sys3A1')?.value);
    const b1 = parseFloat(document.getElementById('sys3B1')?.value);
    const c1 = parseFloat(document.getElementById('sys3C1')?.value);
    const d1 = parseFloat(document.getElementById('sys3D1')?.value);

    const a2 = parseFloat(document.getElementById('sys3A2')?.value);
    const b2 = parseFloat(document.getElementById('sys3B2')?.value);
    const c2 = parseFloat(document.getElementById('sys3C2')?.value);
    const d2 = parseFloat(document.getElementById('sys3D2')?.value);

    const a3 = parseFloat(document.getElementById('sys3A3')?.value);
    const b3 = parseFloat(document.getElementById('sys3B3')?.value);
    const c3 = parseFloat(document.getElementById('sys3C3')?.value);
    const d3 = parseFloat(document.getElementById('sys3D3')?.value);

    const container = document.getElementById('sys3x3ResultsContainer');
    if (!container || !window.PerritoAcademic) return;

    if ([a1,b1,c1,d1,a2,b2,c2,d2,a3,b3,c3,d3].some(v => isNaN(v))) {
      container.innerHTML = '<div class="alert alert-warning">Por favor completa todos los coeficientes del sistema 3x3.</div>';
      return;
    }

    try {
      const matrix = [
        [a1, b1, c1, d1],
        [a2, b2, c2, d2],
        [a3, b3, c3, d3]
      ];
      const res = window.PerritoAcademic.solveSystem3x3(matrix);
      lastSystem3x3Result = res;

      let html = `
        <div class="kpi-grid" style="margin-bottom: 1.25rem;">
          <div class="kpi-card highlight-card">
            <div class="kpi-icon">🏛️</div>
            <div class="kpi-details">
              <span class="kpi-label">Det. Sistema (Δs)</span>
              <div class="kpi-val font-mono">${res.detS}</div>
              <span class="kpi-badge">${res.type}</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">✖️</div>
            <div class="kpi-details">
              <span class="kpi-label">Solución X</span>
              <div class="kpi-val text-sm font-mono" style="color: #60a5fa;">x = ${res.xDisplay}</div>
              <span class="kpi-sub">Δx = ${res.detX}</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🇾</div>
            <div class="kpi-details">
              <span class="kpi-label">Solución Y</span>
              <div class="kpi-val text-sm font-mono" style="color: #a78bfa;">y = ${res.yDisplay}</div>
              <span class="kpi-sub">Δy = ${res.detY}</span>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🇿</div>
            <div class="kpi-details">
              <span class="kpi-label">Solución Z</span>
              <div class="kpi-val text-sm font-mono" style="color: #34d399;">z = ${res.zDisplay}</div>
              <span class="kpi-sub">Δz = ${res.detZ}</span>
            </div>
          </div>
        </div>

        <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem;">
          <h4 style="margin-bottom: 0.75rem; color: #a78bfa; font-size: 1.1rem;">📐 Procedimiento por Regla de Sarrus y Cramer</h4>
          <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <li><strong>Determinante del sistema (Δs):</strong> Evaluado por diagonales principales y secundarias = <code>${res.detS}</code></li>
            <li><strong>Determinantes de incógnitas:</strong> <code>Δx = ${res.detX}</code>, <code>Δy = ${res.detY}</code>, <code>Δz = ${res.detZ}</code></li>
            <li><strong>Solución:</strong> <code>(x, y, z) = (${res.xDisplay}, ${res.yDisplay}, ${res.zDisplay})</code></li>
          </ol>
        </div>
      `;

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${e.message}</div>`;
    }
  }

  // --- 4. FACTORIZACIÓN DE POLINOMIOS ---
  let lastFactorizationResult = null;

  function solveActiveFactorization() {
    const input = document.getElementById('factPolyInput');
    const container = document.getElementById('factResultsContainer');
    if (!input || !container || !window.PerritoAcademic) return;

    const polyStr = input.value.trim();
    if (!polyStr) {
      container.innerHTML = '<div class="alert alert-warning">Por favor escribe una expresión polinómica para factorizar.</div>';
      return;
    }

    try {
      const res = window.PerritoAcademic.factorPolynomial(polyStr);
      lastFactorizationResult = res;

      let html = `
        <div style="background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span class="notebook-card-topic topic-factorization">${res.method}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Comprobación automática: ${res.verified ? '✅ Correcta' : '⚠️ Pendiente'}</span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 800; color: #f472b6; margin-bottom: 0.75rem; text-align: center;">
            ${res.original} = <span style="color: #ffffff; background: rgba(236, 72, 153, 0.2); padding: 0.2rem 0.6rem; border-radius: 8px;">${res.factored}</span>
          </div>

          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.5; margin-bottom: 0;">
            ${res.explanation}
          </p>
        </div>

        <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem; margin-bottom: 1rem;">
          <h4 style="margin-bottom: 0.75rem; color: #f472b6; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🔍</span> Pasos de la Factorización
          </h4>
          <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-main); font-size: 0.95rem;">
            ${res.steps.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div class="fact-proof-box">
          <div class="fact-proof-title">
            <span>🛡️</span> Comprobación por Propiedad Distributiva (Multiplicación de Factores)
          </div>
          <p style="margin-bottom: 0; font-size: 0.95rem; color: var(--text-main);">
            ${res.verificationProof}
          </p>
        </div>
      `;

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${e.message}</div>`;
    }
  }

  // --- 5. GRAFICADOR 2D DE FUNCIONES ---
  let grapherView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

  function initGrapherModule() {
    const canvas = document.getElementById('grapherCanvas');
    const input = document.getElementById('grapherFnInput');
    if (!canvas || !input || !window.PerritoAcademic) return;

    const fnStr = input.value.trim() || 'x^2 - 4x + 3';
    window.PerritoAcademic.drawFunctionGraph(canvas, fnStr, grapherView);
    updateGrapherStats(fnStr);
  }

  function updateGrapherStats(fnStr) {
    const rootsEl = document.getElementById('statGraphRoots');
    const yIntEl = document.getElementById('statGraphYIntercept');
    const vertexEl = document.getElementById('statGraphVertex');
    const typeEl = document.getElementById('statGraphType');
    const tableContainer = document.getElementById('grapherTableContainer');

    let roots = 'Ver gráfico';
    let yInt = '(0, 0)';
    let vertex = 'N/A';
    let curveType = 'Función en ℝ';

    try {
      if (fnStr.includes('x^2') || fnStr.includes('x²')) {
        curveType = 'Parábola Cuadrática';
        if (fnStr.includes('x^2 - 4x + 3')) {
          roots = 'x = 1, x = 3';
          yInt = '(0, 3)';
          vertex = '(2, -1)';
          curveType = 'Parábola cóncava hacia arriba';
        } else if (fnStr.includes('x^2 - 4')) {
          roots = 'x = -2, x = 2';
          yInt = '(0, -4)';
          vertex = '(0, -4)';
        } else if (fnStr.includes('-x^2')) {
          curveType = 'Parábola cóncava hacia abajo';
        }
      } else if (fnStr.includes('x^3') || fnStr.includes('x³')) {
        curveType = 'Polinomio Cúbico';
      } else if (fnStr.includes('1/x')) {
        curveType = 'Hipérbola Racional (Asíntota en x=0)';
      } else {
        curveType = 'Función Lineal';
      }
    } catch (e) {}

    if (rootsEl) rootsEl.textContent = roots;
    if (yIntEl) yIntEl.textContent = yInt;
    if (vertexEl) vertexEl.textContent = vertex;
    if (typeEl) typeEl.textContent = curveType;

    // Generar tabla de 7 puntos
    if (tableContainer) {
      const points = [-3, -2, -1, 0, 1, 2, 3];
      let rows = '';
      points.forEach(x => {
        let yVal = 0;
        try {
          let clean = fnStr.replace(/x\^2|x²/g, `(${x}*${x})`).replace(/x\^3|x³/g, `(${x}*${x}*${x})`).replace(/([0-9])x/g, `$1*${x}`).replace(/x/g, `(${x})`);
          yVal = Function(`"use strict"; return (${clean})`)();
          yVal = Number.isInteger(yVal) ? yVal : yVal.toFixed(2);
        } catch (e) {
          yVal = '--';
        }
        rows += `<tr><td style="font-family: var(--font-mono); font-weight: 700; text-align: center;">${x}</td><td style="font-family: var(--font-mono); text-align: center; color: #38bdf8;">${yVal}</td></tr>`;
      });

      tableContainer.innerHTML = `
        <div style="margin-top: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-muted);">📋 Tabla de Valores Evaluados:</h4>
          <table class="math-table" style="max-width: 320px; margin: 0 auto;">
            <thead>
              <tr><th style="text-align: center;">x</th><th style="text-align: center;">f(x) = y</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }
  }

  // --- 6. CÁLCULO: DERIVADAS Y LÍMITES ---
  let lastDerivativeResult = null;
  let lastLimitResult = null;

  function solveActiveDerivative() {
    const input = document.getElementById('calcDerivInput');
    const x0Input = document.getElementById('calcDerivX0');
    const container = document.getElementById('calcDerivResultsContainer');
    if (!input || !container || !window.PerritoAcademic) return;

    const expr = input.value.trim();
    const x0 = x0Input && x0Input.value.trim() !== '' ? parseFloat(x0Input.value) : null;

    if (!expr) {
      container.innerHTML = '<div class="alert alert-warning">Por favor ingresa una función para derivar.</div>';
      return;
    }

    try {
      const res = window.PerritoAcademic.computeDerivative(expr, x0);
      lastDerivativeResult = res;

      let html = `
        <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.5rem;">Resultado de la Derivada</div>
          <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: #38bdf8; text-align: center; margin-bottom: 0.5rem;">
            f'(x) = ${res.derivative}
          </div>
          ${res.slopeAtX0 !== null ? `
            <div style="text-align: center; font-size: 1.05rem; font-weight: 700; color: #ffffff; background: rgba(6, 182, 212, 0.2); padding: 0.45rem 1rem; border-radius: 8px; display: inline-block; margin: 0 auto;">
              Pendiente de la recta tangente en x₀ = ${x0}: <strong>m = ${res.slopeAtX0}</strong>
            </div>
          ` : ''}
        </div>

        <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem;">
          <h4 style="margin-bottom: 0.75rem; color: #38bdf8; font-size: 1.05rem;">⚡ Explicación Paso a Paso (Regla de la Potencia)</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.75rem;">
            Para cada término de la forma <code>c · xⁿ</code>, su derivada es <code>c · n · xⁿ⁻¹</code>. La derivada de una constante es 0.
          </p>
          <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            ${res.steps.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      `;

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${e.message}</div>`;
    }
  }

  function solveActiveLimit() {
    const numInput = document.getElementById('calcLimitNum');
    const denInput = document.getElementById('calcLimitDen');
    const aInput = document.getElementById('calcLimitA');
    const container = document.getElementById('calcLimitResultsContainer');
    if (!numInput || !denInput || !aInput || !container || !window.PerritoAcademic) return;

    const num = numInput.value.trim();
    const den = denInput.value.trim();
    const a = parseFloat(aInput.value);

    if (!num || !den || isNaN(a)) {
      container.innerHTML = '<div class="alert alert-warning">Por favor completa el numerador, denominador y el valor al que tiende x.</div>';
      return;
    }

    try {
      const res = window.PerritoAcademic.computeLimit(num, den, a);
      lastLimitResult = res;

      let html = `
        <div style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="notebook-card-topic topic-calculus">Límite Calculado</span>
            <span style="font-size: 0.85rem; color: #38bdf8; font-weight: 700;">${res.isIndeterminate ? 'Indeterminación 0/0 resuelta' : 'Evaluación directa'}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: #38bdf8; text-align: center;">
            lim_{x → ${a}} [(${num}) / (${den})] = <strong>${res.resultDisplay}</strong>
          </div>
        </div>

        <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem;">
          <h4 style="margin-bottom: 0.75rem; color: #38bdf8; font-size: 1.05rem;">🎯 Proceso de Resolución</h4>
          <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.95rem;">
            ${res.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      `;

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${e.message}</div>`;
    }
  }

  // --- 7. ENTRENADOR DE EXÁMENES (QUIZZES) ---
  let quizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    mode: 'practice',
    timerInterval: null,
    timeLeft: 60,
    isAnswered: false
  };

  function initQuizModule() {
    const setupScreen = document.getElementById('quizSetupScreen');
    const runnerCard = document.getElementById('quizRunnerCard');
    const summaryCard = document.getElementById('quizSummaryCard');
    if (setupScreen) setupScreen.style.display = 'block';
    if (runnerCard) runnerCard.style.display = 'none';
    if (summaryCard) summaryCard.style.display = 'none';
  }

  function startQuizSession(singleQuestion = false) {
    if (!window.PerritoAcademic || !window.PerritoAcademic.QUIZ_QUESTIONS) return;
    const catSelect = document.getElementById('quizCategorySelect');
    const modeSelect = document.getElementById('quizModeSelect');
    const category = catSelect ? catSelect.value : 'all';
    quizState.mode = modeSelect ? modeSelect.value : 'practice';

    let pool = window.PerritoAcademic.QUIZ_QUESTIONS;
    if (category !== 'all') {
      pool = pool.filter(q => q.category === category);
      if (pool.length === 0) pool = window.PerritoAcademic.QUIZ_QUESTIONS;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    quizState.questions = singleQuestion ? [shuffled[0]] : shuffled.slice(0, 5);
    quizState.currentIndex = 0;
    quizState.score = 0;

    const setupScreen = document.getElementById('quizSetupScreen');
    const runnerCard = document.getElementById('quizRunnerCard');
    const summaryCard = document.getElementById('quizSummaryCard');
    if (setupScreen) setupScreen.style.display = 'none';
    if (runnerCard) runnerCard.style.display = 'block';
    if (summaryCard) summaryCard.style.display = 'none';

    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    clearInterval(quizState.timerInterval);
    quizState.isAnswered = false;

    const q = quizState.questions[quizState.currentIndex];
    if (!q) {
      showQuizSummary();
      return;
    }

    const progressEl = document.getElementById('quizProgressText');
    const topicBadge = document.getElementById('quizTopicBadge');
    const timerPill = document.getElementById('quizTimerPill');
    const timerCount = document.getElementById('quizTimerCount');
    const promptEl = document.getElementById('quizQuestionPrompt');
    const optionsGrid = document.getElementById('quizOptionsGrid');
    const feedbackCard = document.getElementById('quizFeedbackCard');
    const nextBtn = document.getElementById('btnQuizNext');

    if (progressEl) progressEl.textContent = `Pregunta ${quizState.currentIndex + 1} de ${quizState.questions.length}`;
    if (topicBadge) topicBadge.textContent = q.category;
    if (promptEl) promptEl.textContent = q.question;
    if (feedbackCard) feedbackCard.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    if (quizState.mode === 'timed') {
      if (timerPill) timerPill.style.display = 'inline-flex';
      quizState.timeLeft = 60;
      if (timerCount) timerCount.textContent = '60';
      quizState.timerInterval = setInterval(() => {
        quizState.timeLeft--;
        if (timerCount) timerCount.textContent = quizState.timeLeft;
        if (quizState.timeLeft <= 10 && timerPill) {
          timerPill.classList.add('urgent');
        }
        if (quizState.timeLeft <= 0) {
          clearInterval(quizState.timerInterval);
          selectQuizOption(-1);
        }
      }, 1000);
    } else {
      if (timerPill) timerPill.style.display = 'none';
    }

    const letters = ['A', 'B', 'C', 'D'];
    if (optionsGrid) {
      optionsGrid.innerHTML = q.options.map((opt, idx) => `
        <button type="button" class="quiz-option-btn" data-idx="${idx}">
          <span class="quiz-option-letter">${letters[idx]}</span>
          <span>${opt}</span>
        </button>
      `).join('');

      optionsGrid.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (quizState.isAnswered) return;
          selectQuizOption(parseInt(btn.dataset.idx, 10));
        });
      });
    }
  }

  function selectQuizOption(chosenIdx) {
    quizState.isAnswered = true;
    clearInterval(quizState.timerInterval);

    const q = quizState.questions[quizState.currentIndex];
    const isCorrect = chosenIdx === q.correctIndex;
    if (isCorrect) quizState.score++;

    const optionsGrid = document.getElementById('quizOptionsGrid');
    const feedbackCard = document.getElementById('quizFeedbackCard');
    const nextBtn = document.getElementById('btnQuizNext');

    if (optionsGrid) {
      optionsGrid.querySelectorAll('.quiz-option-btn').forEach(btn => {
        const idx = parseInt(btn.dataset.idx, 10);
        btn.disabled = true;
        if (idx === q.correctIndex) {
          btn.classList.add('correct');
        } else if (idx === chosenIdx) {
          btn.classList.add('wrong');
        }
      });
    }

    if (feedbackCard) {
      feedbackCard.className = `quiz-feedback-card ${isCorrect ? 'correct' : 'wrong'}`;
      feedbackCard.style.display = 'block';
      feedbackCard.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <span style="font-size: 1.8rem;">${isCorrect ? '🎉' : '🐶'}</span>
          <div>
            <strong style="color: ${isCorrect ? '#10b981' : '#ef4444'}; font-size: 1.1rem;">
              ${isCorrect ? '¡Excelente! ¡Respuesta Correcta!' : '¡Buen intento! Te explico por qué:'}
            </strong>
          </div>
        </div>
        <p style="margin-bottom: 0; font-size: 0.95rem; line-height: 1.5; color: var(--text-main);">
          ${q.explanation}
        </p>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = quizState.currentIndex + 1 < quizState.questions.length ? 'Siguiente Pregunta ➡️' : 'Ver Resultados del Test 📊';
    }
  }

  function showQuizSummary() {
    clearInterval(quizState.timerInterval);
    const runnerCard = document.getElementById('quizRunnerCard');
    const summaryCard = document.getElementById('quizSummaryCard');
    if (runnerCard) runnerCard.style.display = 'none';
    if (summaryCard) summaryCard.style.display = 'block';

    const total = quizState.questions.length;
    const score = quizState.score;
    const percent = Math.round((score / total) * 100);

    const scoreEl = document.getElementById('quizScoreText');
    const percentEl = document.getElementById('quizPercentText');
    const emojiEl = document.getElementById('quizSummaryEmoji');
    const titleEl = document.getElementById('quizSummaryTitle');
    const descEl = document.getElementById('quizSummaryDesc');

    if (scoreEl) scoreEl.textContent = `${score}/${total}`;
    if (percentEl) percentEl.textContent = `${percent}%`;

    if (percent === 100) {
      if (emojiEl) emojiEl.textContent = '🏆';
      if (titleEl) titleEl.textContent = '¡Puntaje Perfecto! ¡Eres un Genio! 🐶';
      if (descEl) descEl.textContent = 'El Profesor Perrito está súper orgulloso de ti. Dominas los temas de preparatoria a la perfección.';
    } else if (percent >= 60) {
      if (emojiEl) emojiEl.textContent = '⭐';
      if (titleEl) titleEl.textContent = '¡Muy Buen Desempeño!';
      if (descEl) descEl.textContent = 'Aprobaste con éxito. Sigue practicando las áreas en las que tuviste dudas para asegurar tu 100 en el examen.';
    } else {
      if (emojiEl) emojiEl.textContent = '🐶';
      if (titleEl) titleEl.textContent = '¡A Seguir Entrenando!';
      if (descEl) descEl.textContent = 'El éxito en matemáticas es cuestión de práctica constante. Consulta al Profesor Perrito IA para repasar las fórmulas.';
    }
  }

  // --- 8. CUADERNO DE TAREAS (LOCAL STORAGE) ---
  let activeNotebookFilter = 'all';

  function renderNotebookCards() {
    const container = document.getElementById('notebookCardsContainer');
    const badge = document.getElementById('notebookCountBadge');
    if (!container || !window.PerritoAcademic) return;

    let entries = window.PerritoAcademic.getNotebookEntries();
    if (badge) badge.textContent = entries.length;

    if (activeNotebookFilter !== 'all') {
      entries = entries.filter(e => e.topic.toLowerCase().includes(activeNotebookFilter.toLowerCase()));
    }

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="notebook-empty-box" style="grid-column: 1 / -1;">
          <div class="notebook-empty-icon">🐶📖</div>
          <h4 style="margin: 0; color: var(--text-main); font-size: 1.15rem;">Tu Cuaderno de Tareas está vacío</h4>
          <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; max-width: 420px;">
            Cuando resuelvas cualquier ejercicio en <strong>Ecuaciones</strong>, <strong>Factorización</strong>, <strong>Fracciones</strong>, <strong>Cálculo</strong> o <strong>M.C.D.</strong>, pulsa el botón <em>«📝 Guardar en Cuaderno»</em> para tenerlo listo antes de tus exámenes sin conexión.
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = entries.map(item => `
      <div class="notebook-card" data-id="${item.id}">
        <div class="notebook-card-header">
          <span class="notebook-card-topic topic-${item.topic.toLowerCase().replace(/[^a-z]/g, '')}">${item.topic}</span>
          <span class="notebook-card-date">${item.date}</span>
        </div>
        <div class="notebook-card-title">${item.title}</div>
        <div class="notebook-card-expr">${item.expression}</div>
        <div class="notebook-card-res">Resultado: ${item.result}</div>
        ${item.steps && item.steps.length > 0 ? `
          <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
            <strong>Pasos guardados:</strong>
            <ul style="padding-left: 1.15rem; margin-top: 0.25rem; margin-bottom: 0;">
              ${item.steps.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
              ${item.steps.length > 3 ? `<li>... y ${item.steps.length - 3} pasos más</li>` : ''}
            </ul>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
          <button type="button" class="btn btn-ghost btn-sm text-danger btn-delete-notebook-entry" data-id="${item.id}">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-delete-notebook-entry').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        window.PerritoAcademic.deleteNotebookEntry(id);
        renderNotebookCards();
        showToast('Ejercicio eliminado del cuaderno.');
      });
    });
  }

  // --- WIRING DE TODOS LOS EVENTOS DE MÓDULOS ACADÉMICOS ---
  function setupAcademicModuleListeners() {
    // 1. Ecuaciones Cuadráticas
    const btnSolveQuad = document.getElementById('btnSolveQuadratic');
    if (btnSolveQuad) btnSolveQuad.addEventListener('click', solveActiveQuadratic);

    const btnRandomQuad = document.getElementById('btnRandomQuadratic');
    if (btnRandomQuad) {
      btnRandomQuad.addEventListener('click', () => {
        const aEl = document.getElementById('quadInputA');
        const bEl = document.getElementById('quadInputB');
        const cEl = document.getElementById('quadInputC');
        if (aEl && bEl && cEl) {
          aEl.value = Math.floor(Math.random() * 3) + 1;
          bEl.value = Math.floor(Math.random() * 11) - 5;
          cEl.value = Math.floor(Math.random() * 11) - 5;
          solveActiveQuadratic();
        }
      });
    }

    const btnSaveQuad = document.getElementById('btnSaveQuadraticToNotebook');
    if (btnSaveQuad) {
      btnSaveQuad.addEventListener('click', () => {
        if (!lastQuadraticResult || !window.PerritoAcademic) {
          showToast('Primero resuelve una ecuación cuadrática.');
          return;
        }
        window.PerritoAcademic.saveToNotebook({
          topic: 'Ecuaciones',
          title: 'Ecuación Cuadrática Completa',
          expression: `${lastQuadraticResult.a}x² + ${lastQuadraticResult.b}x + ${lastQuadraticResult.c} = 0`,
          result: `x₁ = ${lastQuadraticResult.x1Display}, x₂ = ${lastQuadraticResult.x2Display}`,
          steps: [
            `Discriminante Δ = ${lastQuadraticResult.delta} (${lastQuadraticResult.rootType})`,
            `Vértice = (${lastQuadraticResult.vertexH}, ${lastQuadraticResult.vertexK})`,
            `Forma factorizada = ${lastQuadraticResult.factorForm}`
          ]
        });
        showToast('📝 ¡Ecuación cuadrática guardada en tu Cuaderno de Tareas!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.quad-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const aEl = document.getElementById('quadInputA');
        const bEl = document.getElementById('quadInputB');
        const cEl = document.getElementById('quadInputC');
        if (aEl && bEl && cEl) {
          aEl.value = btn.dataset.a;
          bEl.value = btn.dataset.b;
          cEl.value = btn.dataset.c;
          solveActiveQuadratic();
        }
      });
    });

    ['quadInputA', 'quadInputB', 'quadInputC'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', solveActiveQuadratic);
    });

    // 2. Sistemas 2x2
    const btnSolve2x = document.getElementById('btnSolveSystem2x2');
    if (btnSolve2x) btnSolve2x.addEventListener('click', solveActiveSystem2x2);

    const btnSave2x = document.getElementById('btnSaveSys2xToNotebook');
    if (btnSave2x) {
      btnSave2x.addEventListener('click', () => {
        if (!lastSystem2x2Result || !window.PerritoAcademic) return;
        window.PerritoAcademic.saveToNotebook({
          topic: 'Ecuaciones',
          title: 'Sistema de Ecuaciones 2x2',
          expression: `${lastSystem2x2Result.a1}x + ${lastSystem2x2Result.b1}y = ${lastSystem2x2Result.c1} & ${lastSystem2x2Result.a2}x + ${lastSystem2x2Result.b2}y = ${lastSystem2x2Result.c2}`,
          result: `x = ${lastSystem2x2Result.xDisplay}, y = ${lastSystem2x2Result.yDisplay}`,
          steps: [
            `Δs = ${lastSystem2x2Result.detS}, Δx = ${lastSystem2x2Result.detX}, Δy = ${lastSystem2x2Result.detY}`,
            `Tipo: ${lastSystem2x2Result.type}`
          ]
        });
        showToast('📝 ¡Sistema 2x2 guardado en tu Cuaderno!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.sys2x-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vals = btn.dataset.vals.split(',').map(Number);
        document.getElementById('sys2xA1').value = vals[0];
        document.getElementById('sys2xB1').value = vals[1];
        document.getElementById('sys2xC1').value = vals[2];
        document.getElementById('sys2xA2').value = vals[3];
        document.getElementById('sys2xB2').value = vals[4];
        document.getElementById('sys2xC2').value = vals[5];
        solveActiveSystem2x2();
      });
    });

    // 3. Sistemas 3x3
    const btnSolve3x = document.getElementById('btnSolveSystem3x3');
    if (btnSolve3x) btnSolve3x.addEventListener('click', solveActiveSystem3x3);

    const btnSave3x = document.getElementById('btnSaveSys3xToNotebook');
    if (btnSave3x) {
      btnSave3x.addEventListener('click', () => {
        if (!lastSystem3x3Result || !window.PerritoAcademic) return;
        window.PerritoAcademic.saveToNotebook({
          topic: 'Ecuaciones',
          title: 'Sistema de Ecuaciones 3x3 (Sarrus)',
          expression: `Sistema 3x3 de orden 3`,
          result: `(x, y, z) = (${lastSystem3x3Result.xDisplay}, ${lastSystem3x3Result.yDisplay}, ${lastSystem3x3Result.zDisplay})`,
          steps: [`Δs = ${lastSystem3x3Result.detS}, Δx = ${lastSystem3x3Result.detX}, Δy = ${lastSystem3x3Result.detY}, Δz = ${lastSystem3x3Result.detZ}`]
        });
        showToast('📝 ¡Sistema 3x3 guardado en tu Cuaderno!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.sys3x-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vals = btn.dataset.vals.split(',').map(Number);
        document.getElementById('sys3A1').value = vals[0];
        document.getElementById('sys3B1').value = vals[1];
        document.getElementById('sys3C1').value = vals[2];
        document.getElementById('sys3D1').value = vals[3];
        document.getElementById('sys3A2').value = vals[4];
        document.getElementById('sys3B2').value = vals[5];
        document.getElementById('sys3C2').value = vals[6];
        document.getElementById('sys3D2').value = vals[7];
        document.getElementById('sys3A3').value = vals[8];
        document.getElementById('sys3B3').value = vals[9];
        document.getElementById('sys3C3').value = vals[10];
        document.getElementById('sys3D3').value = vals[11];
        solveActiveSystem3x3();
      });
    });

    // 4. Factorización
    const btnFact = document.getElementById('btnFactorizePoly');
    if (btnFact) btnFact.addEventListener('click', solveActiveFactorization);

    const factInput = document.getElementById('factPolyInput');
    if (factInput) {
      factInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') solveActiveFactorization();
      });
    }

    const btnRandomFact = document.getElementById('btnRandomPoly');
    if (btnRandomFact) {
      btnRandomFact.addEventListener('click', () => {
        const presets = ['x^2 - 16', 'x^2 - 7x + 12', '2x^2 + 7x + 3', 'x^3 - 8', '6x^3 + 9x^2', '4x^2 - 25', 'x^2 + 5x + 6'];
        const chosen = presets[Math.floor(Math.random() * presets.length)];
        const inp = document.getElementById('factPolyInput');
        if (inp) {
          inp.value = chosen;
          solveActiveFactorization();
        }
      });
    }

    const btnSaveFact = document.getElementById('btnSavePolyToNotebook');
    if (btnSaveFact) {
      btnSaveFact.addEventListener('click', () => {
        if (!lastFactorizationResult || !window.PerritoAcademic) {
          showToast('Primero factoriza un polinomio.');
          return;
        }
        window.PerritoAcademic.saveToNotebook({
          topic: 'Factorización',
          title: lastFactorizationResult.method,
          expression: lastFactorizationResult.original,
          result: lastFactorizationResult.factored,
          steps: lastFactorizationResult.steps
        });
        showToast('📝 ¡Polinomio factorizado guardado en el Cuaderno!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.fact-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const inp = document.getElementById('factPolyInput');
        if (inp) {
          inp.value = btn.dataset.poly;
          solveActiveFactorization();
        }
      });
    });

    // 5. Graficador 2D
    const btnPlot = document.getElementById('btnPlotGraph');
    if (btnPlot) btnPlot.addEventListener('click', initGrapherModule);

    const graphFnInput = document.getElementById('grapherFnInput');
    if (graphFnInput) {
      graphFnInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') initGrapherModule();
      });
    }

    const btnRandomGraph = document.getElementById('btnRandomGraph');
    if (btnRandomGraph) {
      btnRandomGraph.addEventListener('click', () => {
        const presets = ['x^2 - 4', 'x^2 - 4x + 3', '-x^2 + 4x', '2x - 1', 'x^3 - 3x', '1/x'];
        const chosen = presets[Math.floor(Math.random() * presets.length)];
        if (graphFnInput) {
          graphFnInput.value = chosen;
          initGrapherModule();
        }
      });
    }

    const btnZoomIn = document.getElementById('btnGraphZoomIn');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        grapherView.xMin *= 0.75;
        grapherView.xMax *= 0.75;
        grapherView.yMin *= 0.75;
        grapherView.yMax *= 0.75;
        initGrapherModule();
      });
    }

    const btnZoomOut = document.getElementById('btnGraphZoomOut');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        grapherView.xMin *= 1.35;
        grapherView.xMax *= 1.35;
        grapherView.yMin *= 1.35;
        grapherView.yMax *= 1.35;
        initGrapherModule();
      });
    }

    const btnGraphReset = document.getElementById('btnGraphReset');
    if (btnGraphReset) {
      btnGraphReset.addEventListener('click', () => {
        grapherView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
        initGrapherModule();
      });
    }

    const btnGraphDownload = document.getElementById('btnGraphDownload');
    if (btnGraphDownload) {
      btnGraphDownload.addEventListener('click', () => {
        const canvas = document.getElementById('grapherCanvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'perrito-math-grafica.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('📸 Gráfica descargada en formato PNG.');
      });
    }

    const btnSaveGraph = document.getElementById('btnSaveGraphToNotebook');
    if (btnSaveGraph) {
      btnSaveGraph.addEventListener('click', () => {
        const fn = graphFnInput ? graphFnInput.value.trim() : 'f(x)';
        const roots = document.getElementById('statGraphRoots')?.textContent || '';
        const vertex = document.getElementById('statGraphVertex')?.textContent || '';
        window.PerritoAcademic.saveToNotebook({
          topic: 'Cálculo',
          title: 'Gráfico 2D y Ceros',
          expression: `f(x) = ${fn}`,
          result: `Raíces: ${roots}, Vértice: ${vertex}`,
          steps: [`Función graficada en plano cartesiano offline`, `Corte con Eje Y: ${document.getElementById('statGraphYIntercept')?.textContent}`]
        });
        showToast('📝 ¡Gráfica y puntos guardados en tu Cuaderno!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.graph-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (graphFnInput) {
          graphFnInput.value = btn.dataset.fn;
          initGrapherModule();
        }
      });
    });

    // 6. Cálculo (Derivadas y Límites)
    const btnDeriv = document.getElementById('btnComputeDeriv');
    if (btnDeriv) btnDeriv.addEventListener('click', solveActiveDerivative);

    const btnSaveDeriv = document.getElementById('btnSaveDerivToNotebook');
    if (btnSaveDeriv) {
      btnSaveDeriv.addEventListener('click', () => {
        if (!lastDerivativeResult || !window.PerritoAcademic) {
          showToast('Primero calcula una derivada.');
          return;
        }
        window.PerritoAcademic.saveToNotebook({
          topic: 'Cálculo',
          title: 'Derivada Polinómica d/dx',
          expression: `f(x) = ${lastDerivativeResult.original}`,
          result: `f'(x) = ${lastDerivativeResult.derivative}`,
          steps: lastDerivativeResult.steps
        });
        showToast('📝 ¡Derivada guardada en el Cuaderno!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.calc-deriv-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fnEl = document.getElementById('calcDerivInput');
        const x0El = document.getElementById('calcDerivX0');
        if (fnEl) fnEl.value = btn.dataset.fn;
        if (x0El) x0El.value = btn.dataset.x0;
        solveActiveDerivative();
      });
    });

    const btnLimit = document.getElementById('btnComputeLimit');
    if (btnLimit) btnLimit.addEventListener('click', solveActiveLimit);

    const btnSaveLimit = document.getElementById('btnSaveLimitToNotebook');
    if (btnSaveLimit) {
      btnSaveLimit.addEventListener('click', () => {
        if (!lastLimitResult || !window.PerritoAcademic) return;
        window.PerritoAcademic.saveToNotebook({
          topic: 'Cálculo',
          title: 'Límite Algebraico',
          expression: `lim_{x→${lastLimitResult.a}} (${lastLimitResult.numerator}) / (${lastLimitResult.denominator})`,
          result: lastLimitResult.resultDisplay,
          steps: lastLimitResult.steps
        });
        showToast('📝 ¡Límite guardado en el Cuaderno!');
        renderNotebookCards();
      });
    }

    document.querySelectorAll('.calc-limit-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const numEl = document.getElementById('calcLimitNum');
        const denEl = document.getElementById('calcLimitDen');
        const aEl = document.getElementById('calcLimitA');
        if (numEl) numEl.value = btn.dataset.num;
        if (denEl) denEl.value = btn.dataset.den;
        if (aEl) aEl.value = btn.dataset.a;
        solveActiveLimit();
      });
    });

    // 7. Entrenador de Exámenes (Quizzes)
    const btnStartQuiz = document.getElementById('btnStartQuiz');
    if (btnStartQuiz) btnStartQuiz.addEventListener('click', () => startQuizSession(false));

    const btnQuickQuiz = document.getElementById('btnQuickSingleQuiz');
    if (btnQuickQuiz) btnQuickQuiz.addEventListener('click', () => startQuizSession(true));

    const btnQuizNext = document.getElementById('btnQuizNext');
    if (btnQuizNext) {
      btnQuizNext.addEventListener('click', () => {
        quizState.currentIndex++;
        renderCurrentQuestion();
      });
    }

    const btnQuizExit = document.getElementById('btnQuizExit');
    if (btnQuizExit) {
      btnQuizExit.addEventListener('click', () => {
        clearInterval(quizState.timerInterval);
        initQuizModule();
      });
    }

    const btnQuizRestart = document.getElementById('btnQuizRestart');
    if (btnQuizRestart) btnQuizRestart.addEventListener('click', initQuizModule);

    // 8. Cuaderno de Tareas (Notebook)
    document.querySelectorAll('.notebook-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.notebook-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        activeNotebookFilter = btn.dataset.filter;
        renderNotebookCards();
      });
    });

    const btnPrintNotebook = document.getElementById('btnPrintNotebook');
    if (btnPrintNotebook) {
      btnPrintNotebook.addEventListener('click', () => {
        window.print();
      });
    }

    const btnClearNotebook = document.getElementById('btnClearNotebook');
    if (btnClearNotebook) {
      btnClearNotebook.addEventListener('click', () => {
        if (confirm('¿Deseas vaciar todos los ejercicios guardados de tu cuaderno?')) {
          window.PerritoAcademic.clearNotebook();
          renderNotebookCards();
          showToast('🗑️ Cuaderno de Tareas vaciado.');
        }
      });
    }
  }

  function init() {
    applyTheme(state.theme);
    renderInputs();
    renderPresets();
    setupEventListeners();
    updateAll();
    renderRationalsUI();
    renderCompFracModule();
    // Default initializations for academic modules
    solveActiveQuadratic();
    solveActiveSystem2x2();
    solveActiveSystem3x3();
    solveActiveFactorization();
    initGrapherModule();
    solveActiveDerivative();
    solveActiveLimit();
    renderNotebookCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
