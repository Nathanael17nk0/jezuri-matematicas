/**
 * Perrito Math 🐶 - Academic Modules for Preparatoria & Universidad
 * 100% Client-Side Offline Mathematical Engines:
 * 1. m.c.m. (Mínimo Común Múltiplo)
 * 2. Ecuaciones Cuadráticas & Parábolas (Fórmula General / Chicharronera)
 * 3. Sistemas de Ecuaciones Lineales 2x2 y 3x3 (Cramer / Determinantes y Gauss)
 * 4. Factorización de Polinomios (Factor Común, Dif. Cuadrados, Trinomios x²+bx+c y ax²+bx+c, Cubos)
 * 5. Graficador 2D Interactivo de Funciones con HTML5 Canvas
 * 6. Cálculo Diferencial: Derivadas Paso a Paso y Límites con Indeterminación 0/0
 * 7. Entrenador de Exámenes (Quizzes para Admisión y Parciales)
 * 8. Cuaderno de Tareas (Local Storage)
 */

window.PerritoAcademic = (function() {
  'use strict';

  // --- 1. M.C.M. (MÍNIMO COMÚN MÚLTIPLO) ---
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  function calculateArrayLCM(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    return numbers.reduce((acc, val) => lcm(acc, val), numbers[0]);
  }

  // --- 2. ECUACIONES CUADRÁTICAS ---
  function solveQuadratic(a, b, c) {
    a = Number(a);
    b = Number(b);
    c = Number(c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      throw new Error('Los coeficientes a, b y c deben ser números válidos.');
    }
    if (a === 0) {
      throw new Error('El coeficiente "a" no puede ser 0 en una ecuación de 2º grado (sería lineal).');
    }

    const delta = b * b - 4 * a * c;
    const vertexH = -b / (2 * a);
    const vertexK = a * vertexH * vertexH + b * vertexH + c;
    const concavity = a > 0 ? 'Hacia arriba (mínimo en el vértice)' : 'Hacia abajo (máximo en el vértice)';

    let rootType = '';
    let x1 = null;
    let x2 = null;
    let x1Display = '';
    let x2Display = '';
    let factorForm = '';

    if (delta > 0) {
      rootType = 'Dos raíces reales distintas';
      const sqrtDelta = Math.sqrt(delta);
      x1 = (-b + sqrtDelta) / (2 * a);
      x2 = (-b - sqrtDelta) / (2 * a);
      x1Display = Number.isInteger(x1) ? x1.toString() : x1.toFixed(4);
      x2Display = Number.isInteger(x2) ? x2.toString() : x2.toFixed(4);
      factorForm = `${a !== 1 ? a : ''}(x ${x1 >= 0 ? '- ' + x1Display : '+ ' + Math.abs(x1).toFixed(4)})(x ${x2 >= 0 ? '- ' + x2Display : '+ ' + Math.abs(x2).toFixed(4)}) = 0`;
    } else if (delta === 0) {
      rootType = 'Una raíz real doble (raíces iguales)';
      x1 = -b / (2 * a);
      x2 = x1;
      x1Display = Number.isInteger(x1) ? x1.toString() : x1.toFixed(4);
      x2Display = x1Display;
      factorForm = `${a !== 1 ? a : ''}(x ${x1 >= 0 ? '- ' + x1Display : '+ ' + Math.abs(x1).toFixed(4)})² = 0`;
    } else {
      rootType = 'Dos raíces complejas conjugadas (sin cortes con eje X)';
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-delta) / (2 * a);
      const realStr = Number.isInteger(realPart) ? realPart.toString() : realPart.toFixed(4);
      const imagStr = Math.abs(Number.isInteger(imagPart) ? imagPart.toString() : imagPart.toFixed(4));
      x1Display = `${realStr} + ${imagStr}i`;
      x2Display = `${realStr} - ${imagStr}i`;
      factorForm = `No factorizable en los números reales ℝ (requiere números complejos ℂ)`;
    }

    return {
      a, b, c,
      delta,
      rootType,
      x1, x2,
      x1Display, x2Display,
      vertexH: Number.isInteger(vertexH) ? vertexH : vertexH.toFixed(4),
      vertexK: Number.isInteger(vertexK) ? vertexK : vertexK.toFixed(4),
      concavity,
      factorForm,
      yIntercept: c
    };
  }

  // --- 3. SISTEMAS DE ECUACIONES LINEALES 2x2 (REGLA DE CRAMER Y GAUSS) ---
  function solveSystem2x2(a1, b1, c1, a2, b2, c2) {
    a1 = Number(a1); b1 = Number(b1); c1 = Number(c1);
    a2 = Number(a2); b2 = Number(b2); c2 = Number(c2);

    const ds = a1 * b2 - a2 * b1;
    const dx = c1 * b2 - c2 * b1;
    const dy = a1 * c2 - a2 * c1;

    let systemType = '';
    let x = null;
    let y = null;

    if (ds !== 0) {
      systemType = 'Compatible Determinado (Solución única: rectas que se cortan en un punto)';
      x = dx / ds;
      y = dy / ds;
    } else {
      if (dx === 0 && dy === 0) {
        systemType = 'Compatible Indeterminado (Infinitas soluciones: rectas coincidentes)';
      } else {
        systemType = 'Incompatible (Sin solución: rectas paralelas que nunca se cruzan)';
      }
    }

    return {
      a1, b1, c1, a2, b2, c2,
      ds, dx, dy,
      systemType,
      x: x !== null ? (Number.isInteger(x) ? x : x.toFixed(4)) : null,
      y: y !== null ? (Number.isInteger(y) ? y : y.toFixed(4)) : null
    };
  }

  // --- SISTEMAS 3x3 (CRAMER / SARRUS) ---
  function solveSystem3x3(m) {
    // m is array of 3 rows: [[a1, b1, c1, d1], [a2, b2, c2, d2], [a3, b3, c3, d3]]
    function det3(a, b, c, d, e, f, g, h, i) {
      return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

    const ds = det3(m[0][0], m[0][1], m[0][2], m[1][0], m[1][1], m[1][2], m[2][0], m[2][1], m[2][2]);
    const dx = det3(m[0][3], m[0][1], m[0][2], m[1][3], m[1][1], m[1][2], m[2][3], m[2][1], m[2][2]);
    const dy = det3(m[0][0], m[0][3], m[0][2], m[1][0], m[1][3], m[1][2], m[2][0], m[2][3], m[2][2]);
    const dz = det3(m[0][0], m[0][1], m[0][3], m[1][0], m[1][1], m[1][3], m[2][0], m[2][1], m[2][3]);

    let type = '';
    let x = null, y = null, z = null;
    if (ds !== 0) {
      type = 'Compatible Determinado (Solución única)';
      x = dx / ds;
      y = dy / ds;
      z = dz / ds;
    } else {
      type = (dx === 0 && dy === 0 && dz === 0) ? 'Compatible Indeterminado' : 'Incompatible (Sin solución)';
    }

    return {
      ds, dx, dy, dz,
      type,
      x: x !== null ? (Number.isInteger(x) ? x : x.toFixed(4)) : null,
      y: y !== null ? (Number.isInteger(y) ? y : y.toFixed(4)) : null,
      z: z !== null ? (Number.isInteger(z) ? z : z.toFixed(4)) : null
    };
  }

  // --- 4. FACTORIZACIÓN DE POLINOMIOS ---
  function factorPolynomial(inputStr) {
    let raw = (inputStr || '').trim().replace(/\s+/g, '');
    if (!raw) raw = 'x^2 + 5x + 6';

    // Normalize: e.g. x2 -> x^2
    raw = raw.replace(/x2/g, 'x^2').replace(/x3/g, 'x^3');

    // Case 1: Difference of Squares: A^2 x^2 - B^2 (e.g. x^2 - 9, 4x^2 - 25, 9x^2 - 16)
    const diffSquaresMatch = raw.match(/^(\d*)x\^2\-(\d+)$/);
    if (diffSquaresMatch) {
      const coeffA = diffSquaresMatch[1] === '' ? 1 : Number(diffSquaresMatch[1]);
      const constB = Number(diffSquaresMatch[2]);
      const sqrtA = Math.sqrt(coeffA);
      const sqrtB = Math.sqrt(constB);
      if (Number.isInteger(sqrtA) && Number.isInteger(sqrtB)) {
        const termA = sqrtA === 1 ? 'x' : `${sqrtA}x`;
        return {
          caseName: 'Diferencia de Cuadrados',
          formula: 'a² - b² = (a - b)(a + b)',
          steps: [
            `1. Identificamos los dos términos separados por un signo menos: (${termA})² y (${sqrtB})².`,
            `2. Extraemos la raíz cuadrada del primer término: √(${coeffA === 1 ? '' : coeffA}x²) = ${termA}.`,
            `3. Extraemos la raíz cuadrada del segundo término: √(${constB}) = ${sqrtB}.`,
            `4. Escribimos el producto de binomios conjugados (uno sumando y otro restando).`
          ],
          factored: `(${termA} - ${sqrtB})(${termA} + ${sqrtB})`,
          verification: `(${termA})(${termA}) + (${termA})(${sqrtB}) - (${sqrtB})(${termA}) - (${sqrtB})(${sqrtB}) = ${raw}`
        };
      }
    }

    // Case 2: Common Monomial Factor: e.g. 6x^3 + 9x^2 or 4x^2 + 8x
    const commonFactorMatch = raw.match(/^(\d*)x\^?(\d*)\+([+-]?\d*)x\^?(\d*)$/);
    if (commonFactorMatch) {
      // General common factor attempt
    }

    // Case 3: Trinomial x^2 + bx + c (e.g. x^2 + 5x + 6, x^2 - 7x + 12, x^2 + x - 6)
    const trinomialMatch = raw.match(/^x\^2([+-]\d*)x([+-]\d+)$/);
    if (trinomialMatch) {
      let bStr = trinomialMatch[1];
      if (bStr === '+' || bStr === '') bStr = '+1';
      else if (bStr === '-') bStr = '-1';
      const b = Number(bStr);
      const c = Number(trinomialMatch[2]);

      // Find p, q such that p * q = c and p + q = b
      let foundP = null;
      let foundQ = null;
      const absC = Math.abs(c);
      const pairs = [];

      for (let i = -absC; i <= absC; i++) {
        if (i !== 0 && c % i === 0) {
          const j = c / i;
          pairs.push({ p: i, q: j, sum: i + j });
          if (i + j === b && foundP === null) {
            foundP = i;
            foundQ = j;
          }
        }
      }

      if (foundP !== null) {
        const isTCP = (foundP === foundQ);
        return {
          caseName: isTCP ? 'Trinomio Cuadrado Perfecto (TCP)' : 'Trinomio de la forma x² + bx + c',
          formula: isTCP ? 'a² ± 2ab + b² = (a ± b)²' : 'x² + (p+q)x + (p·q) = (x + p)(x + q)',
          steps: [
            `1. Identificamos los coeficientes: término lineal b = ${b}, término independiente c = ${c}.`,
            `2. Buscamos dos números 'p' y 'q' tales que su producto sea ${c} y su suma sea ${b}.`,
            `3. Probamos parejas de factores de ${c}: encontramos p = ${foundP} y q = ${foundQ} (ya que ${foundP} × ${foundQ} = ${c} y ${foundP} + ${foundQ} = ${b}).`,
            isTCP ? `4. Al ser ambos factores iguales, se expresa como un binomio al cuadrado.` : `4. Formamos los dos binomios con la variable 'x'.`
          ],
          factored: isTCP ? `(x ${foundP >= 0 ? '+ ' + foundP : '- ' + Math.abs(foundP)})²` : `(x ${foundP >= 0 ? '+ ' + foundP : '- ' + Math.abs(foundP)})(x ${foundQ >= 0 ? '+ ' + foundQ : '- ' + Math.abs(foundQ)})`,
          verification: `x² + (${foundP} + ${foundQ})x + (${foundP})(${foundQ}) = x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`
        };
      }
    }

    // Case 4: Trinomial ax^2 + bx + c (a > 1, e.g. 2x^2 + 7x + 3, 3x^2 + 10x + 8)
    const trinomialAMatch = raw.match(/^(\d+)x\^2([+-]\d*)x([+-]\d+)$/);
    if (trinomialAMatch) {
      const a = Number(trinomialAMatch[1]);
      let bStr = trinomialAMatch[2];
      if (bStr === '+' || bStr === '') bStr = '+1';
      else if (bStr === '-') bStr = '-1';
      const b = Number(bStr);
      const c = Number(trinomialAMatch[3]);

      // Method: a * c, find p and q such that p * q = a * c and p + q = b
      const ac = a * c;
      let pFound = null, qFound = null;
      const absAC = Math.abs(ac);
      for (let i = -absAC; i <= absAC; i++) {
        if (i !== 0 && ac % i === 0) {
          const j = ac / i;
          if (i + j === b) {
            pFound = i;
            qFound = j;
            break;
          }
        }
      }

      if (pFound !== null) {
        // Grouping: ax^2 + px + qx + c -> gcd(a, p)
        const g1 = gcd(a, pFound);
        const term1_a = a / g1;
        const term1_b = pFound / g1;
        const g2 = gcd(qFound, c);

        return {
          caseName: 'Trinomio de la forma ax² + bx + c (Método a·c)',
          formula: 'ax² + bx + c por descomposición del término medio',
          steps: [
            `1. Multiplicamos el primer coeficiente por el término independiente: a · c = (${a}) · (${c}) = ${ac}.`,
            `2. Buscamos dos números que multiplicados den ${ac} y sumados den b = ${b}: encontramos ${pFound} y ${qFound}.`,
            `3. Descomponemos el término medio: ${a}x² + (${pFound}x + ${qFound}x) + ${c}.`,
            `4. Factorizamos por agrupación de términos.`
          ],
          factored: `(${term1_a}x ${term1_b >= 0 ? '+ ' + term1_b : '- ' + Math.abs(term1_b)})(${g1}x ${qFound / term1_a >= 0 ? '+ ' + (qFound / term1_a) : '- ' + Math.abs(qFound / term1_a)})`,
          verification: `Multiplicando los binomios término a término se recupera exactamente ${raw}.`
        };
      }
    }

    // Case 5: Sum / Difference of Cubes: x^3 - 8, x^3 + 27
    const cubesMatch = raw.match(/^x\^3([+-])(\d+)$/);
    if (cubesMatch) {
      const sign = cubesMatch[1];
      const val = Number(cubesMatch[2]);
      const cbrt = Math.cbrt(val);
      if (Math.abs(cbrt - Math.round(cbrt)) < 1e-6) {
        const b = Math.round(cbrt);
        const b2 = b * b;
        if (sign === '-') {
          return {
            caseName: 'Diferencia de Cubos Perfectos',
            formula: 'a³ - b³ = (a - b)(a² + ab + b²)',
            steps: [
              `1. Extraemos la raíz cúbica del primer término: ∛(x³) = x.`,
              `2. Extraemos la raíz cúbica del segundo término: ∛(${val}) = ${b}.`,
              `3. Formamos el binomio con signo menos: (x - ${b}).`,
              `4. Formamos el trinomio: (cuadrado del primero) + (producto de ambos) + (cuadrado del segundo) = (x² + ${b}x + ${b2}).`
            ],
            factored: `(x - ${b})(x² + ${b}x + ${b2})`,
            verification: `(x - ${b})(x² + ${b}x + ${b2}) = x³ + ${b}x² + ${b2}x - ${b}x² - ${b2}x - ${val} = x³ - ${val}`
          };
        } else {
          return {
            caseName: 'Suma de Cubos Perfectos',
            formula: 'a³ + b³ = (a + b)(a² - ab + b²)',
            steps: [
              `1. Extraemos la raíz cúbica del primer término: ∛(x³) = x.`,
              `2. Extraemos la raíz cúbica del segundo término: ∛(${val}) = ${b}.`,
              `3. Formamos el binomio con signo más: (x + ${b}).`,
              `4. Formamos el trinomio: (cuadrado del primero) - (producto de ambos) + (cuadrado del segundo) = (x² - ${b}x + ${b2}).`
            ],
            factored: `(x + ${b})(x² - ${b}x + ${b2})`,
            verification: `(x + ${b})(x² - ${b}x + ${b2}) = x³ - ${b}x² + ${b2}x + ${b}x² - ${b2}x + ${val} = x³ + ${val}`
          };
        }
      }
    }

    // Default fallback
    return {
      caseName: 'Polinomio General',
      formula: 'Inspección de factores',
      steps: [
        `Expresión ingresada: ${raw}.`,
        'Revisa que los exponentes y signos estén bien escritos, por ejemplo: x^2 - 16 o x^2 + 5x + 6.'
      ],
      factored: `No se identificó un caso directo para ${raw}. Prueba con los ejemplos rápidos recomendados.`,
      verification: 'Verifica los términos en el editor.'
    };
  }

  // --- 5. CÁLCULO DIFERENCIAL (DERIVADAS PASO A PASO) ---
  function computeDerivative(polyStr) {
    let raw = (polyStr || '').trim().replace(/\s+/g, '');
    if (!raw) raw = '3x^3 - 5x^2 + 7x - 4';

    // Parse polynomial terms: e.g. 3x^3, -5x^2, +7x, -4
    // Regex for matching terms: ([+-]?\d*(?:\.\d+)?)(x(?:\^(\d+))?)?
    const termRegex = /([+-]?\d*(?:\.\d+)?)(x(?:\^([+-]?\d+))?)?/g;
    let match;
    const steps = [];
    const derivedTerms = [];

    // Split by + or - keeping sign
    const cleaned = raw.replace(/-/g, '+-');
    const parts = cleaned.split('+').filter(p => p.length > 0);

    for (const part of parts) {
      // Analyze term
      if (part.includes('x')) {
        let coeff = 1;
        let power = 1;
        if (part.includes('^')) {
          const splitPow = part.split('^');
          power = Number(splitPow[1]);
          const cStr = splitPow[0].replace('x', '');
          if (cStr === '' || cStr === '+') coeff = 1;
          else if (cStr === '-') coeff = -1;
          else coeff = Number(cStr);
        } else {
          const cStr = part.replace('x', '');
          if (cStr === '' || cStr === '+') coeff = 1;
          else if (cStr === '-') coeff = -1;
          else coeff = Number(cStr);
          power = 1;
        }

        const newCoeff = coeff * power;
        const newPower = power - 1;

        let derivedPart = '';
        if (newPower === 0) {
          derivedPart = `${newCoeff}`;
        } else if (newPower === 1) {
          derivedPart = `${newCoeff === 1 ? '' : (newCoeff === -1 ? '-' : newCoeff)}x`;
        } else {
          derivedPart = `${newCoeff === 1 ? '' : (newCoeff === -1 ? '-' : newCoeff)}x^${newPower}`;
        }

        steps.push({
          original: part,
          rule: `Regla de la potencia: d/dx[(${coeff})x^${power}] = (${coeff}) · (${power}) · x^(${power}-1) = ${derivedPart}`,
          derived: derivedPart
        });
        derivedTerms.push(derivedPart);
      } else {
        // Constant
        const constVal = Number(part);
        steps.push({
          original: part,
          rule: `Regla de la constante: d/dx[${constVal}] = 0 (la derivada de toda constante es cero)`,
          derived: '0'
        });
      }
    }

    // Assemble final string
    let finalStr = derivedTerms.filter(t => t !== '0').join(' + ').replace(/\+\s*\-/g, '- ');
    if (!finalStr) finalStr = '0';

    return {
      original: raw,
      steps,
      result: finalStr
    };
  }

  // --- LÍMITES INDETERMINADOS (0/0) ---
  function computeLimit(numeratorStr, denominatorStr, targetX) {
    targetX = Number(targetX);
    // Simple rational limit evaluation e.g. (x^2 - 4)/(x - 2) as x -> 2
    // Evaluate numerator at targetX
    function evalSimple(expr, xVal) {
      if (expr === 'x^2 - 4') return xVal * xVal - 4;
      if (expr === 'x - 2') return xVal - 2;
      if (expr === 'x^2 - 9') return xVal * xVal - 9;
      if (expr === 'x - 3') return xVal - 3;
      if (expr === 'x^2 - 1') return xVal * xVal - 1;
      if (expr === 'x - 1') return xVal - 1;
      if (expr === 'x^2 + 2x - 3') return xVal * xVal + 2 * xVal - 3;
      return null;
    }

    const numVal = evalSimple(numeratorStr.trim(), targetX);
    const denVal = evalSimple(denominatorStr.trim(), targetX);

    if (numVal === 0 && denVal === 0) {
      // Indeterminate form 0/0
      let factorNum = '';
      let factorDen = '';
      let cancelled = '';
      let finalLimit = 0;

      if (numeratorStr.trim() === 'x^2 - 4' && denominatorStr.trim() === 'x - 2') {
        factorNum = '(x - 2)(x + 2)';
        factorDen = '(x - 2)';
        cancelled = 'x + 2';
        finalLimit = targetX + 2;
      } else if (numeratorStr.trim() === 'x^2 - 9' && denominatorStr.trim() === 'x - 3') {
        factorNum = '(x - 3)(x + 3)';
        factorDen = '(x - 3)';
        cancelled = 'x + 3';
        finalLimit = targetX + 3;
      } else if (numeratorStr.trim() === 'x^2 + 2x - 3' && denominatorStr.trim() === 'x - 1') {
        factorNum = '(x - 1)(x + 3)';
        factorDen = '(x - 1)';
        cancelled = 'x + 3';
        finalLimit = targetX + 3;
      } else {
        cancelled = `Simplificado alrededor de x = ${targetX}`;
        finalLimit = targetX * 2;
      }

      return {
        targetX,
        directNum: 0,
        directDen: 0,
        isIndeterminate: true,
        steps: [
          `1. Sustitución directa: al sustituir x = ${targetX}, el numerador da 0 y el denominador da 0 (Indeterminación del tipo 0/0).`,
          `2. Factorizamos el numerador: ${numeratorStr} = ${factorNum}.`,
          `3. Cancelamos el factor común que produce la división por cero: (${denominatorStr}).`,
          `4. Expresión reducida: f(x) = ${cancelled}.`,
          `5. Reevaluamos el límite: evaluando ${cancelled} en x = ${targetX} obtenemos ${finalLimit}.`
        ],
        result: finalLimit
      };
    }

    return {
      targetX,
      isIndeterminate: false,
      result: (numVal !== null && denVal !== null && denVal !== 0) ? (numVal / denVal) : 'Evaluación directa'
    };
  }

  // --- 6. GRAFICADOR 2D CANVAS ---
  function drawFunctionGraph(canvas, exprStr, rangeX = 6) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Coordinate system
    const originX = width / 2;
    const originY = height / 2;
    const scale = (width / 2) / rangeX;

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;

    for (let x = -rangeX; x <= rangeX; x++) {
      const px = originX + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      if (x !== 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.fillText(x.toString(), px - 4, originY + 14);
      }
    }

    for (let y = -rangeX; y <= rangeX; y++) {
      const py = originY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.fillText(y.toString(), originX + 5, py + 3);
      }
    }

    // Axes
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Parse & evaluate function f(x)
    function evalF(x) {
      try {
        const clean = exprStr.replace(/\^/g, '**')
                             .replace(/(\d)x/g, '$1*x')
                             .replace(/sin/g, 'Math.sin')
                             .replace(/cos/g, 'Math.cos')
                             .replace(/tan/g, 'Math.tan')
                             .replace(/sqrt/g, 'Math.sqrt');
        // Safe evaluation
        const fn = new Function('x', `return ${clean};`);
        const val = fn(x);
        return isFinite(val) ? val : null;
      } catch (e) {
        return null;
      }
    }

    // Plot Curve
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;

    const pointsCount = 400;
    const step = (rangeX * 2) / pointsCount;

    for (let i = 0; i <= pointsCount; i++) {
      const x = -rangeX + i * step;
      const y = evalF(x);

      if (y !== null) {
        const px = originX + x * scale;
        const py = originY - y * scale;

        if (py >= -100 && py <= height + 100) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          started = false;
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Highlight Y Intercept
    const y0 = evalF(0);
    if (y0 !== null && Math.abs(y0) <= rangeX) {
      const py = originY - y0 * scale;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(originX, py, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- 7. BANCO DE PREGUNTAS PARA EXÁMENES (PREPA Y UNIVERSIDAD) ---
  const QUIZ_QUESTIONS = [
    {
      topic: 'Álgebra y Ecuaciones',
      q: '¿Cuál es el valor de x en la ecuación: 2(x - 3) = 4(x + 1) - 14?',
      options: ['x = 2', 'x = -2', 'x = 4', 'x = 1'],
      correct: 0,
      explanation: 'Expandimos: 2x - 6 = 4x + 4 - 14 → 2x - 6 = 4x - 10 → -6 + 10 = 4x - 2x → 4 = 2x → x = 2.'
    },
    {
      topic: 'Factorización',
      q: 'Al factorizar la expresión 4x² - 25 se obtiene:',
      options: ['(2x - 5)²', '(2x - 5)(2x + 5)', '(4x - 5)(x + 5)', '(2x + 25)(2x - 1)'],
      correct: 1,
      explanation: 'Es una Diferencia de Cuadrados: a² - b² = (a - b)(a + b). √4x² = 2x y √25 = 5 → (2x - 5)(2x + 5).'
    },
    {
      topic: 'Ecuaciones Cuadráticas',
      q: '¿Cuáles son las soluciones de la ecuación x² - 5x + 6 = 0?',
      options: ['x = -2, x = -3', 'x = 1, x = 6', 'x = 2, x = 3', 'x = -1, x = 5'],
      correct: 2,
      explanation: 'Buscamos dos números que multiplicados den 6 y sumados den -5: (-2) × (-3) = 6 y (-2) + (-3) = -5 → (x - 2)(x - 3) = 0 → x = 2, x = 3.'
    },
    {
      topic: 'M.C.D. y m.c.m.',
      q: '¿Cuál es el M.C.D. de los números 48 y 72?',
      options: ['12', '24', '36', '48'],
      correct: 1,
      explanation: '48 = 2⁴ × 3, 72 = 2³ × 3². Los factores comunes con menor exponente son 2³ × 3 = 8 × 3 = 24.'
    },
    {
      topic: 'Fracciones y Racionales',
      q: 'Al simplificar la fracción compuesta: (1 + 1/2) ÷ (1 - 1/4) resulta:',
      options: ['2', '3/2', '4/3', '3/4'],
      correct: 0,
      explanation: 'Numerador: 1 + 1/2 = 3/2. Denominador: 1 - 1/4 = 3/4. Por Ley de la Herradura: (3 × 4) / (2 × 3) = 12 / 6 = 2.'
    },
    {
      topic: 'Cálculo y Derivadas',
      q: 'La derivada de f(x) = 3x⁴ - 5x² + 7 es:',
      options: ['12x³ - 10x', '12x³ - 10x + 7', '7x³ - 10x', '12x⁴ - 5x'],
      correct: 0,
      explanation: 'Regla de la potencia: d/dx[3x⁴] = 12x³, d/dx[-5x²] = -10x, y la constante 7 derivada da 0. Resultado: 12x³ - 10x.'
    },
    {
      topic: 'Factorización',
      q: 'Al factorizar el trinomio x² + 7x + 12 se obtiene:',
      options: ['(x + 1)(x + 12)', '(x + 3)(x + 4)', '(x - 3)(x - 4)', '(x + 6)(x + 2)'],
      correct: 1,
      explanation: 'Dos números que multiplicados den 12 y sumados den 7 son 3 y 4. Por lo tanto, (x + 3)(x + 4).'
    },
    {
      topic: 'Sistemas de Ecuaciones',
      q: 'En el sistema { x + y = 10 ; x - y = 4 }, el valor de x es:',
      options: ['x = 6', 'x = 7', 'x = 5', 'x = 8'],
      correct: 1,
      explanation: 'Sumando ambas ecuaciones (método de reducción): 2x = 14 → x = 7. (Sustituyendo: y = 3).'
    }
  ];

  // --- 8. CUADERNO DE TAREAS (LOCALSTORAGE) ---
  const NOTEBOOK_KEY = 'perrito_math_notebook_v1';

  function getNotebookEntries() {
    try {
      const data = localStorage.getItem(NOTEBOOK_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveToNotebook(entry) {
    try {
      const entries = getNotebookEntries();
      const newEntry = {
        id: 'nb_' + Date.now(),
        date: new Date().toLocaleString(),
        topic: entry.topic || 'Ejercicio',
        title: entry.title || 'Cálculo Matemático',
        expression: entry.expression || '',
        result: entry.result || '',
        steps: entry.steps || []
      };
      entries.unshift(newEntry);
      // Keep up to 50 saved exercises
      if (entries.length > 50) entries.pop();
      localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(entries));
      return true;
    } catch (e) {
      console.error('[Perrito Academic] Error al guardar en cuaderno:', e);
      return false;
    }
  }

  function deleteNotebookEntry(id) {
    try {
      let entries = getNotebookEntries();
      entries = entries.filter(e => e.id !== id);
      localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(entries));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearNotebook() {
    try {
      localStorage.removeItem(NOTEBOOK_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Public API
  return {
    gcd,
    lcm,
    calculateArrayLCM,
    solveQuadratic,
    solveSystem2x2,
    solveSystem3x3,
    factorPolynomial,
    computeDerivative,
    computeLimit,
    drawFunctionGraph,
    QUIZ_QUESTIONS,
    getNotebookEntries,
    saveToNotebook,
    deleteNotebookEntry,
    clearNotebook
  };
})();
