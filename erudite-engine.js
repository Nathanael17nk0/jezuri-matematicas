/**
 * Perrito Math 🐶 - Universal Mathematical Erudite Engine (Motor Erudito Catedrático)
 * 100% Offline Universal Mathematics Knowledge Base & Real-Time Step-by-Step Solver
 *
 * Disciplinas cubiertas con rigor académico y pedagogía de excelencia:
 * 1. Aritmética & Teoría de Números (M.C.D., m.c.m., Primos, Regla de Tres, Porcentajes, PEMDAS)
 * 2. Fracciones Racionales & Fracciones Compuestas (Ley de la Herradura, Cascada, Inversos)
 * 3. Álgebra Elemental y Superior (Productos Notables, Factorización total, Despejes, Ruffini)
 * 4. Ecuaciones & Sistemas (Lineales 1er Grado, Sistemas 2x2/3x3 por Cramer/Gauss, Cuadráticas/Chicharronera)
 * 5. Geometría Euclidiana & Trigonometría (Teorema de Pitágoras, Áreas, Volúmenes, SOH-CAH-TOA, Identidades, Ley de Senos y Cosenos)
 * 6. Geometría Analítica (Pendiente, Rectas paralelas y perpendiculares, Distancia, Cónicas)
 * 7. Cálculo Diferencial (Límites, Indeterminación 0/0, Derivadas por definición y reglas, Cadena, Máximos/Mínimos, L'Hôpital)
 * 8. Cálculo Integral (Antiderivada, Inmediatas, Sustitución, Por Partes, Teorema Fundamental del Cálculo)
 * 9. Álgebra Lineal (Vectores 2D/3D, Producto Punto, Producto Cruz, Matrices, Determinantes 2x2 y 3x3, Inversa)
 * 10. Probabilidad & Estadística (Media, Mediana, Moda, Desviación Estándar, Permutaciones, Combinaciones, Laplace, Bayes)
 * 11. Enigmas & Paradojas Matemáticas (División por cero, a⁰=1, Regla de signos (-)(-)=+, Pi, Euler, Imaginarios i, 0.999...=1)
 *
 * Incluye además:
 * • Solucionador interactivo en vivo de cuentas, fracciones, ecuaciones y derivadas
 * • Conexión opcional a la API de Google Gemini (si el alumno dispone de API Key)
 */

(function(global) {
  'use strict';

  // ==========================================================================
  // 1. ARITMÉTICA EXACTA Y EVALUADOR MATEMÁTICO INTEGRADO (PERRITO SOLVER)
  // ==========================================================================

  function gcdBig(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b > 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function lcmBig(a, b) {
    if (a === 0n || b === 0n) return 0n;
    return (a * b) / gcdBig(a, b);
  }

  // Descomposición en factores primos y pasos pedagógicos de m.c.m. / M.C.D.
  function getPrimeFactorization(n) {
    n = Math.abs(Math.round(n));
    if (n <= 1) return { factors: { [n]: 1 }, text: `${n}` };
    const factors = {};
    let d = 2;
    let temp = n;
    while (d * d <= temp) {
      while (temp % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        temp = Math.floor(temp / d);
      }
      d = d === 2 ? 3 : d + 2;
    }
    if (temp > 1) {
      factors[temp] = (factors[temp] || 0) + 1;
    }
    const parts = Object.entries(factors).map(([p, exp]) => {
      const sup = exp === 1 ? '' : (exp === 2 ? '²' : (exp === 3 ? '³' : `<sup>${exp}</sup>`));
      return `${p}${sup}`;
    });
    return { factors, text: parts.join(' × ') };
  }

  function computeLcmWithSteps(numbers) {
    const factorizations = numbers.map(n => ({ num: n, fact: getPrimeFactorization(n) }));
    const maxExps = {};
    for (const { fact } of factorizations) {
      for (const [p, exp] of Object.entries(fact.factors)) {
        maxExps[p] = Math.max(maxExps[p] || 0, exp);
      }
    }
    let lcmVal = 1;
    const lcmExprParts = [];
    for (const [p, exp] of Object.entries(maxExps)) {
      const powVal = Math.pow(Number(p), exp);
      lcmVal *= powVal;
      const sup = exp === 1 ? '' : (exp === 2 ? '²' : (exp === 3 ? '³' : `<sup>${exp}</sup>`));
      lcmExprParts.push(`${p}${sup}`);
    }
    return { lcmVal, factorizations, lcmExpr: lcmExprParts.join(' × ') };
  }

  function computeGcdWithSteps(numbers) {
    const factorizations = numbers.map(n => ({ num: n, fact: getPrimeFactorization(n) }));
    if (!factorizations.length) return { gcdVal: 1, factorizations: [], gcdExpr: '1' };
    const allPrimes = Object.keys(factorizations[0].fact.factors);
    const commonPrimes = allPrimes.filter(p => factorizations.every(f => f.fact.factors[p]));
    let gcdVal = 1;
    const gcdExprParts = [];
    for (const p of commonPrimes) {
      const minExp = Math.min(...factorizations.map(f => f.fact.factors[p]));
      gcdVal *= Math.pow(Number(p), minExp);
      const sup = minExp === 1 ? '' : (minExp === 2 ? '²' : (minExp === 3 ? '³' : `<sup>${minExp}</sup>`));
      gcdExprParts.push(`${p}${sup}`);
    }
    const gcdExpr = gcdExprParts.length > 0 ? gcdExprParts.join(' × ') : '1';
    return { gcdVal, factorizations, gcdExpr };
  }

  // Clase racional de alta precisión
  class Rational {
    constructor(num, den = 1n) {
      num = BigInt(num);
      den = BigInt(den);
      if (den === 0n) throw new Error('División por cero');
      if (den < 0n) { num = -num; den = -den; }
      const g = gcdBig(num, den);
      this.n = num / g;
      this.d = den / g;
    }
    add(o) { return new Rational(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new Rational(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new Rational(this.n * o.n, this.d * o.d); }
    div(o) {
      if (o.n === 0n) throw new Error('División por cero');
      return new Rational(this.n * o.d, this.d * o.n);
    }
    toString() {
      if (this.d === 1n) return `${this.n}`;
      return `${this.n}/${this.d}`;
    }
    toHtml() {
      if (this.d === 1n) return `<code>${this.n}</code>`;
      const sign = this.n < 0n ? '<span class="comp-sign">−</span>' : '';
      const absN = this.n < 0n ? -this.n : this.n;
      return `${sign}<span class="math-fraction"><span class="math-num">${absN}</span><span class="math-bar"></span><span class="math-den">${this.d}</span></span>`;
    }
  }

  // Solucionador al vuelo de problemas específicos en el chat
  const PerritoSolver = {
    // Resolver fracciones directas: ej: 3/8 mas 9/3, 3/4 + 5/6, (2/3) / (4/5), 3/8 + 2
    solveFractions(expr) {
      try {
        let clean = expr.replace(/[?¿!¡;]/g, ' ').trim();
        clean = clean.replace(/^(por\s+favor\s+|hola\s*perrito\s*,?\s*|profesor\s*,?\s*|oiga\s*,?\s*|oye\s*,?\s*|profe\s*,?\s*)/i, '');
        clean = clean.replace(/^(resuelve|resolver|calcula|calcular|halla|hallar|evalua|evaluar|cuanto\s+es|cuanto\s+da|simplifica|simplificar|opera|operar|solve)\s*(la\s+operacion\s+|la\s+fraccion\s+|el\s+ejercicio\s+|:)?\s*/i, '');
        clean = clean.replace(/^(suma|resta|multiplicacion|division|producto|cociente)\s+(de\s+)?/i, '');

        // Normalizar operadores en lenguaje natural a símbolos matemáticos
        clean = clean.replace(/\b(m[aá]s|sumado\s+(con|a)|sumar)\b/gi, ' + ');
        clean = clean.replace(/\b(menos|restado\s+de|restar)\b/gi, ' - ');
        clean = clean.replace(/\b(por|multiplicado\s+por|multiplicar)\b/gi, ' * ');
        clean = clean.replace(/\b(entre|dividido\s+entre|dividido\s+por|dividido|sobre|dividir)\b/gi, ' / ');
        clean = clean.replace(/\bcon\b/gi, ' + ');
        clean = clean.replace(/\by\b/gi, ' + ');
        clean = clean.replace(/[×·]/g, '*').replace(/[÷:]/g, '/');
        clean = clean.replace(/\s+/g, '');

        // Caso 1: Operación binaria (A op B), donde al menos uno es fracción (tiene /)
        const binaryMatch = clean.match(/^([+-]?\d+(?:\/\d+)?)([\+\-\*\/])([+-]?\d+(?:\/\d+)?)$/);
        if (binaryMatch && clean.includes('/')) {
          function parseFrac(s) {
            if (s.includes('/')) {
              const parts = s.split('/');
              return { n: BigInt(parts[0]), d: BigInt(parts[1]) };
            }
            return { n: BigInt(s), d: 1n };
          }

          const raw1 = parseFrac(binaryMatch[1]);
          const op = binaryMatch[2];
          const raw2 = parseFrac(binaryMatch[3]);

          if (raw1.d === 0n || raw2.d === 0n) {
            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">⚠️ Indefinición Matemática</span>
                  <strong>División entre Cero</strong>
                </div>
                <p>El denominador de una fracción no puede ser <code>0</code> porque la división entre cero está indefinida en el campo de los números reales (<code>ℝ</code>).</p>
              </div>
            `;
          }

          const r1 = new Rational(raw1.n, raw1.d);
          const r2 = new Rational(raw2.n, raw2.d);
          let res, opName, stepsHtml, pedagogicalTip = '';

          // Tip didáctico si alguna fracción se podía simplificar antes (ej: 9/3 = 3)
          if (raw1.d > 1n && raw1.n % raw1.d === 0n) {
            pedagogicalTip += `<div class="erudite-tip-box" style="margin-top:0.6rem;">💡 <strong>Cátedra didáctica:</strong> Observa que la primera fracción <code>${raw1.n}/${raw1.d} = ${raw1.n / raw1.d}</code> es un número entero exacto antes de operar.</div>`;
          } else if (gcdBig(raw1.n, raw1.d) > 1n) {
            pedagogicalTip += `<div class="erudite-tip-box" style="margin-top:0.6rem;">💡 <strong>Cátedra didáctica:</strong> La fracción <code>${raw1.n}/${raw1.d}</code> se puede pre-simplificar a <code>${r1.toString()}</code>.</div>`;
          }
          if (raw2.d > 1n && raw2.n % raw2.d === 0n) {
            pedagogicalTip += `<div class="erudite-tip-box" style="margin-top:0.6rem;">💡 <strong>Cátedra didáctica:</strong> Observa que la segunda fracción <code>${raw2.n}/${raw2.d} = ${raw2.n / raw2.d}</code> es un número entero exacto (${raw2.n / raw2.d}). Sumar como entero o como fracción arroja el mismo resultado exacto.</div>`;
          } else if (gcdBig(raw2.n, raw2.d) > 1n) {
            pedagogicalTip += `<div class="erudite-tip-box" style="margin-top:0.6rem;">💡 <strong>Cátedra didáctica:</strong> La fracción <code>${raw2.n}/${raw2.d}</code> se puede pre-simplificar a <code>${r2.toString()}</code>.</div>`;
          }

          if (op === '+') {
            res = r1.add(r2);
            const mcm = lcmBig(raw1.d, raw2.d);
            const f1 = mcm / raw1.d;
            const f2 = mcm / raw2.d;
            const amp1 = raw1.n * f1;
            const amp2 = raw2.n * f2;
            const sum = amp1 + amp2;
            const g = gcdBig(sum, mcm);
            opName = 'Suma de Fracciones con Mínimo Común Múltiplo (m.c.m.)';
            stepsHtml = `
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 1</span>
                <div>
                  <strong>Homogenización de denominadores (m.c.m.):</strong><br>
                  Los denominadores son <code>${raw1.d}</code> y <code>${raw2.d}</code>.<br>
                  Calculamos su mínimo común múltiplo: <code>m.c.m.(${raw1.d}, ${raw2.d}) = <strong>${mcm}</strong></code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 2</span>
                <div>
                  <strong>Amplificación de numeradores al denominador común:</strong><br>
                  • Primera fracción: <code>(${raw1.n} × ${f1})/${mcm} = ${amp1}/${mcm}</code><br>
                  • Segunda fracción: <code>(${raw2.n} × ${f2})/${mcm} = ${amp2}/${mcm}</code>
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 3</span>
                <div>
                  <strong>Suma de numeradores homogéneos:</strong><br>
                  <code>(${amp1} + ${amp2})/${mcm} = <strong>${sum}/${mcm}</strong></code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 4</span>
                <div>
                  <strong>Simplificación final al máximo por M.C.D.:</strong><br>
                  ${g > 1n ? `Calculamos <code>M.C.D.(${sum}, ${mcm}) = ${g}</code>. Dividiendo numerador y denominador entre ${g}:<br><code>(${sum} ÷ ${g}) / (${mcm} ÷ ${g}) = <strong>${res.toString()}</strong></code>.` : `La fracción <code>${res.toString()}</code> ya es irreducible puesto que <code>M.C.D.(${sum}, ${mcm}) = 1</code>.`}
                </div>
              </div>
            `;
          } else if (op === '-') {
            res = r1.sub(r2);
            const mcm = lcmBig(raw1.d, raw2.d);
            const f1 = mcm / raw1.d;
            const f2 = mcm / raw2.d;
            const amp1 = raw1.n * f1;
            const amp2 = raw2.n * f2;
            const diff = amp1 - amp2;
            const g = gcdBig(diff, mcm);
            opName = 'Resta de Fracciones con m.c.m.';
            stepsHtml = `
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 1</span>
                <div>
                  <strong>Denominador común por m.c.m.:</strong><br>
                  <code>m.c.m.(${raw1.d}, ${raw2.d}) = <strong>${mcm}</strong></code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 2</span>
                <div>
                  <strong>Amplificación de fracciones:</strong><br>
                  • Primera: <code>(${raw1.n} × ${f1})/${mcm} = ${amp1}/${mcm}</code><br>
                  • Segunda: <code>(${raw2.n} × ${f2})/${mcm} = ${amp2}/${mcm}</code>
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 3</span>
                <div>
                  <strong>Sustracción de numeradores:</strong><br>
                  <code>(${amp1} − ${amp2})/${mcm} = <strong>${diff}/${mcm}</strong></code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 4</span>
                <div>
                  <strong>Reducción por M.C.D.:</strong><br>
                  ${g > 1n ? `<code>M.C.D.(${diff}, ${mcm}) = ${g}</code> ⟹ Fracción irreducible: <strong>${res.toString()}</strong>.` : `Fracción irreducible directa: <strong>${res.toString()}</strong>.`}
                </div>
              </div>
            `;
          } else if (op === '*') {
            res = r1.mul(r2);
            opName = 'Multiplicación de Fracciones (En Línea Recta)';
            const rawN = raw1.n * raw2.n;
            const rawD = raw1.d * raw2.d;
            const g = gcdBig(rawN, rawD);
            stepsHtml = `
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 1</span>
                <div>
                  <strong>Multiplicar numeradores en línea recta:</strong><br>
                  <code>${raw1.n} × ${raw2.n} = <strong>${rawN}</strong></code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 2</span>
                <div>
                  <strong>Multiplicar denominadores en línea recta:</strong><br>
                  <code>${raw1.d} × ${raw2.d} = <strong>${rawD}</strong></code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 3</span>
                <div>
                  <strong>Simplificación de la fracción resultante:</strong><br>
                  <code>${rawN}/${rawD}</code> ${g > 1n ? `⟹ Dividiendo entre <code>M.C.D. = ${g}</code> ⟹ <strong>${res.toString()}</strong>.` : '⟹ Ya es irreducible.'}
                </div>
              </div>
            `;
          } else if (op === '/') {
            if (raw2.n === 0n) {
              return `
                <div class="erudite-card-response">
                  <div class="erudite-header">
                    <span class="erudite-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">⚠️ Indefinición Matemática</span>
                    <strong>División entre Cero</strong>
                  </div>
                  <p>No se puede dividir una fracción entre <code>0</code>.</p>
                </div>
              `;
            }
            res = r1.div(r2);
            opName = 'División de Fracciones (Ley de la Herradura / Extremos y Medios)';
            const ext = raw1.n * raw2.d;
            const med = raw1.d * raw2.n;
            const g = gcdBig(ext, med);
            stepsHtml = `
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 1</span>
                <div>
                  <strong>Ley de la Herradura (Extremos por Medios):</strong><br>
                  • <em>Extremos (arriba y abajo):</em> <code>${raw1.n} × ${raw2.d} = <strong>${ext}</strong></code> (nuevo numerador).<br>
                  • <em>Medios (los del centro):</em> <code>${raw1.d} × ${raw2.n} = <strong>${med}</strong></code> (nuevo denominador).<br>
                  Fracción intermedia: <code>${ext}/${med}</code>.
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 2</span>
                <div>
                  <strong>Simplificación final:</strong><br>
                  ${g > 1n ? `Dividiendo entre <code>M.C.D.(${ext}, ${med}) = ${g}</code> ⟹ <strong>${res.toString()}</strong>.` : `Fracción irreducible: <strong>${res.toString()}</strong>.`}
                </div>
              </div>
            `;
          }

          // Generar representación de número mixto si |n| > d y d != 1
          let mixedHtml = '';
          if (res.d !== 1n && res.n > res.d) {
            const whole = res.n / res.d;
            const rem = res.n % res.d;
            mixedHtml = `<span class="result-dec">(o en número mixto: <strong>${whole} ${rem}/${res.d}</strong>)</span>`;
          }

          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">🧮 Solución al Vuelo</span>
                <strong>${opName}</strong>
              </div>
              <div class="erudite-problem-line">
                Operación planteada: <code>${raw1.n}${raw1.d !== 1n ? '/' + raw1.d : ''} ${op} ${raw2.n}${raw2.d !== 1n ? '/' + raw2.d : ''}</code>
              </div>
              <div class="erudite-steps">
                ${stepsHtml}
              </div>
              ${pedagogicalTip}
              <div class="erudite-result-box">
                <span class="result-label">Resultado Irreducible:</span>
                <span class="result-highlight">${res.toString()}</span>
                ${mixedHtml}
                ${res.d !== 1n ? `<span class="result-dec">≈ ${(Number(res.n) / Number(res.d)).toFixed(5)}</span>` : ''}
              </div>
            </div>
          `;
        }

        // Caso 2: Cadena de 3 o más fracciones sumadas/restadas (ej: 1/2 + 2/3 - 1/4)
        if (clean.includes('/') && !clean.includes('*') && (clean.includes('+') || clean.includes('-'))) {
          const tokens = clean.match(/([+-]?[^+-]+)/g);
          if (tokens && tokens.length >= 3) {
            const terms = [];
            for (const tok of tokens) {
              let sign = 1n;
              let t = tok;
              if (t.startsWith('+')) t = t.substring(1);
              else if (t.startsWith('-')) { sign = -1n; t = t.substring(1); }
              if (t.includes('/')) {
                const parts = t.split('/');
                terms.push({ n: sign * BigInt(parts[0]), d: BigInt(parts[1]) });
              } else {
                terms.push({ n: sign * BigInt(t), d: 1n });
              }
            }

            let mcmGlobal = terms[0].d;
            for (let i = 1; i < terms.length; i++) {
              mcmGlobal = lcmBig(mcmGlobal, terms[i].d);
            }

            let sumNumerators = 0n;
            const stepsAmp = terms.map((t, idx) => {
              const factor = mcmGlobal / t.d;
              const amp = t.n * factor;
              sumNumerators += amp;
              return `• Término ${idx + 1}: <code>(${t.n} × ${factor})/${mcmGlobal} = ${amp}/${mcmGlobal}</code>`;
            }).join('<br>');

            const g = gcdBig(sumNumerators, mcmGlobal);
            const finalN = sumNumerators / g;
            const finalD = mcmGlobal / g;
            const resRational = new Rational(finalN, finalD);

            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">🧮 Solución al Vuelo</span>
                  <strong>Suma y Resta Combinada de Múltiples Fracciones</strong>
                </div>
                <div class="erudite-problem-line">
                  Expresión: <code>${expr}</code>
                </div>
                <div class="erudite-steps">
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Paso 1</span>
                    <div>
                      <strong>Mínimo Común Múltiplo global de los denominadores:</strong><br>
                      Denominadores: <code>${terms.map(t => t.d).join(', ')}</code> ⟹ <code>m.c.m. = <strong>${mcmGlobal}</strong></code>.
                    </div>
                  </div>
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Paso 2</span>
                    <div>
                      <strong>Amplificación de cada término al denominador común:</strong><br>
                      ${stepsAmp}
                    </div>
                  </div>
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Paso 3</span>
                    <div>
                      <strong>Suma algebraica de numeradores y reducción:</strong><br>
                      Suma de numeradores: <code>${sumNumerators}/${mcmGlobal}</code>.<br>
                      ${g > 1n ? `Simplificando por <code>M.C.D. = ${g}</code> ⟹ <strong>${resRational.toString()}</strong>.` : `Ya es irreducible: <strong>${resRational.toString()}</strong>.`}
                    </div>
                  </div>
                </div>
                <div class="erudite-result-box">
                  <span class="result-label">Resultado Final:</span>
                  <span class="result-highlight">${resRational.toString()}</span>
                  ${resRational.d !== 1n ? `<span class="result-dec">≈ ${(Number(resRational.n) / Number(resRational.d)).toFixed(5)}</span>` : ''}
                </div>
              </div>
            `;
          }
        }

        return null;
      } catch (e) {
        return null;
      }
    },

    // Resolver operaciones aritméticas al vuelo (raíces, potencias, porcentajes, aritmética directa)
    solveArithmetic(expr) {
      try {
        let clean = expr.replace(/[?¿!¡;]/g, ' ').trim();
        clean = clean.replace(/^(por\s+favor\s+|hola\s*perrito\s*,?\s*|profesor\s*,?\s*|oiga\s*,?\s*|oye\s*,?\s*|profe\s*,?\s*)/i, '');
        clean = clean.replace(/^(resuelve|resolver|calcula|calcular|halla|hallar|evalua|evaluar|cuanto\s+es|cuanto\s+da|simplifica|simplificar|opera|operar|solve)\s*(la\s+operacion\s+|el\s+ejercicio\s+|:)?\s*/i, '');

        // 1. Porcentaje: ej: 15% de 300, 20% sobre 50
        const pctMatch = clean.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:de|sobre|\*)\s*(\d+(?:\.\d+)?)$/i);
        if (pctMatch) {
          const pct = parseFloat(pctMatch[1]);
          const base = parseFloat(pctMatch[2]);
          const result = (pct / 100) * base;
          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">📊 Cálculo Porcentual</span>
                <strong>Porcentaje al Vuelo</strong>
              </div>
              <div class="erudite-problem-line">
                Pregunta: <code>${pct}% de ${base}</code>
              </div>
              <div class="erudite-steps">
                <div class="erudite-step-item">
                  <span class="step-num-badge">Paso 1</span>
                  <div><strong>Convertir el porcentaje a factor decimal:</strong><br><code>${pct}% = ${pct} / 100 = ${pct / 100}</code>.</div>
                </div>
                <div class="erudite-step-item">
                  <span class="step-num-badge">Paso 2</span>
                  <div><strong>Multiplicar por la cantidad base:</strong><br><code>(${pct} / 100) × ${base} = ${pct / 100} × ${base} = <strong>${result}</strong></code>.</div>
                </div>
              </div>
              <div class="erudite-result-box">
                <span class="result-label">Resultado:</span>
                <span class="result-highlight">${result}</span>
              </div>
            </div>
          `;
        }

        // 2. Raíz cuadrada: ej: raiz de 144, sqrt(81), raiz cuadrada de 25
        const sqrtMatch = clean.match(/^(?:raiz|ra[ií]z|sqrt)\s*(?:cuadrada\s+)?(?:de\s+)?(\d+(?:\.\d+)?)$/i);
        if (sqrtMatch) {
          const num = parseFloat(sqrtMatch[1]);
          const root = Math.sqrt(num);
          const isExact = Number.isInteger(root);
          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">📐 Radicación</span>
                <strong>Raíz Cuadrada Exacta / Aproximada</strong>
              </div>
              <div class="erudite-problem-line">
                Radical: <code>√(${num})</code>
              </div>
              <div class="erudite-steps">
                <div class="erudite-step-item">
                  <span class="step-num-badge">Desarrollo</span>
                  <div>
                    Buscamos un número <code>r</code> tal que <code>r² = ${num}</code>.<br>
                    ${isExact ? `Dado que <code>${root} × ${root} = ${num}</code>, es un <strong>cuadrado perfecto</strong>.` : `No es cuadrado perfecto. Su aproximación decimal es <code>≈ ${root.toFixed(6)}</code>.`}
                  </div>
                </div>
              </div>
              <div class="erudite-result-box">
                <span class="result-label">Raíz Cuadrada:</span>
                <span class="result-highlight">√${num} = ${isExact ? root : root.toFixed(5)}</span>
              </div>
            </div>
          `;
        }

        // 3. Potencia: ej: 2^8, 5^3, 2**10
        const powMatch = clean.match(/^(\d+(?:\.\d+)?)\s*(?:\^|\*\*|elevado\s+(?:a\s+la|al)?)\s*(\d+)$/i);
        if (powMatch) {
          const base = parseFloat(powMatch[1]);
          const exp = parseInt(powMatch[2], 10);
          if (exp <= 50) {
            const res = Math.pow(base, exp);
            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">⚡ Potenciación</span>
                  <strong>Exponente Entero</strong>
                </div>
                <div class="erudite-problem-line">
                  Potencia: <code>${base}^${exp}</code>
                </div>
                <div class="erudite-steps">
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Concepto</span>
                    <div>Multiplicamos la base <code>${base}</code> por sí misma <code>${exp}</code> veces consecutivas.</div>
                  </div>
                </div>
                <div class="erudite-result-box">
                  <span class="result-label">Resultado:</span>
                  <span class="result-highlight">${res}</span>
                </div>
              </div>
            `;
          }
        }

        // 4. Aritmética elemental directa (ej: 15 * 8, 125 + 380, 144 / 12)
        let normArith = clean.replace(/\b(m[aá]s|sumar|con)\b/gi, '+')
                             .replace(/\b(menos|restar)\b/gi, '-')
                             .replace(/\b(por|multiplicar)\b/gi, '*')
                             .replace(/\b(entre|dividido\s+entre|dividido|dividir)\b/gi, '/')
                             .replace(/[×·]/g, '*')
                             .replace(/[÷:]/g, '/')
                             .replace(/\s+/g, '');

        if (/^[0-9\.\+\-\*\/\(\)]+$/.test(normArith) && /[\+\-\*\/]/.test(normArith) && !normArith.includes('//')) {
          const calcVal = Function(`'use strict'; return (${normArith})`)();
          if (typeof calcVal === 'number' && !isNaN(calcVal) && isFinite(calcVal)) {
            const isInt = Number.isInteger(calcVal);
            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">🧮 Aritmética Fundamental</span>
                  <strong>Cálculo Numérico Directo</strong>
                </div>
                <div class="erudite-problem-line">
                  Operación: <code>${normArith.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ').replace(/\+/g, ' + ').replace(/\-/g, ' − ')}</code>
                </div>
                <div class="erudite-steps">
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Jerarquía PEMDAS</span>
                    <div>Aplicamos el orden matemático universal: primero paréntesis, luego multiplicaciones y divisiones de izquierda a derecha, y finalmente adiciones y sustracciones.</div>
                  </div>
                </div>
                <div class="erudite-result-box">
                  <span class="result-label">Resultado Final:</span>
                  <span class="result-highlight">${isInt ? calcVal : calcVal.toFixed(5)}</span>
                </div>
              </div>
            `;
          }
        }

        return null;
      } catch (e) {
        return null;
      }
    },

    // Resolver ecuación lineal de 1er grado: ej: 2x + 5 = 15, 3x - 4 = x + 8
    solveLinear(expr) {
      try {
        if (!expr.includes('=') || !expr.toLowerCase().includes('x')) return null;
        if (expr.includes('x^2') || expr.includes('x²')) return null; // Dejar que lo resuelva solveQuadratic

        let clean = expr.replace(/[?¿!¡;]/g, ' ').trim();
        clean = clean.replace(/^(por\s+favor\s+|hola\s*perrito\s*,?\s*|profesor\s*,?\s*)/i, '');
        clean = clean.replace(/^(resuelve|resolver|despeja|despejar|calcula|calcular|halla|hallar|soluciona|solucionar|solve|cuanto\s+vale\s+x\s+(en|si)?|valor\s+de\s+x\s+(en|si)?)\s*(la\s+ecuacion\s+|el\s+ejercicio\s+|:)?\s*/i, '');

        const sides = clean.split('=');
        if (sides.length !== 2) return null;

        // ax + b = cx + d
        function parseSide(s) {
          let a = 0, b = 0;
          // Normalize +- signs
          let norm = s.replace(/([+-])/g, ' $1');
          if (norm.startsWith(' ')) norm = norm.substring(1);
          const parts = norm.split(/\s+/);
          parts.forEach(p => {
            p = p.trim();
            if (!p) return;
            if (p.toLowerCase().includes('x')) {
              let coef = p.toLowerCase().replace('x', '').replace(/[^0-9\.\+\-]/g, '');
              if (coef === '' || coef === '+') a += 1;
              else if (coef === '-') a -= 1;
              else {
                const val = parseFloat(coef);
                if (!isNaN(val)) a += val;
              }
            } else {
              const num = parseFloat(p.replace(/[^0-9\.\+\-]/g, ''));
              if (!isNaN(num)) b += num;
            }
          });
          return { a, b };
        }

        const left = parseSide(sides[0]);
        const right = parseSide(sides[1]);

        const netA = left.a - right.a;
        const netB = right.b - left.b;

        if (netA === 0) {
          if (netB === 0) {
            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">📐 Ecuación Lineal</span>
                  <strong>Identidad Matemática (Infinitas Soluciones)</strong>
                </div>
                <p>Al simplificar la ecuación <code>${expr}</code>, ambos miembros se cancelan completamente (<code>0x = 0</code>). Esto indica que es una <strong>identidad</strong> y es verdadera para cualquier valor real de <code>x ∈ ℝ</code>.</p>
              </div>
            `;
          } else {
            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">📐 Ecuación Lineal</span>
                  <strong>Inconsistencia / Sin Solución</strong>
                </div>
                <p>Al simplificar se obtiene <code>0 = ${netB}</code>, lo cual es una contradicción lógica. La ecuación no tiene solución (conjunto vacío <code>∅</code>).</p>
              </div>
            `;
          }
        }

        const sol = netB / netA;
        const solExact = Number.isInteger(sol) ? sol.toString() : sol.toFixed(4);

        return `
          <div class="erudite-card-response">
            <div class="erudite-header">
              <span class="erudite-badge">📐 Despeje Algebraico</span>
              <strong>Ecuación Lineal de 1er Grado</strong>
            </div>
            <div class="erudite-problem-line">
              Ecuación: <code>${sides[0]} = ${sides[1]}</code>
            </div>
            <div class="erudite-steps">
              <div class="erudite-step-item">
                <strong>Paso 1: Agrupación de incógnitas en el miembro izquierdo.</strong><br>
                Pasamos todos los términos con <code>x</code> al lado izquierdo cambiando su signo:<br>
                <code>(${left.a}x) − (${right.a}x) = ${netA}x</code>.
              </div>
              <div class="erudite-step-item">
                <strong>Paso 2: Trasposición de términos numéricos al miembro derecho.</strong><br>
                Pasamos las constantes al lado derecho:<br>
                <code>${right.b} − (${left.b}) = ${netB}</code>.<br>
                Ecuación reducida: <code>${netA}x = ${netB}</code>.
              </div>
              <div class="erudite-step-item">
                <strong>Paso 3: Despeje final.</strong><br>
                Dividimos ambos miembros entre el coeficiente de la incógnita (<code>${netA}</code>):<br>
                <code>x = ${netB} / ${netA} = <strong>${solExact}</strong></code>.
              </div>
            </div>
            <div class="erudite-result-box">
              <span class="result-label">Solución Única:</span>
              <span class="result-highlight">x = ${solExact}</span>
            </div>
          </div>
        `;
      } catch (e) {
        return null;
      }
    },

    // Resolver ecuación cuadrática: ej: x^2 - 5x + 6 = 0, 2x^2 + 5x - 3 = 0
    solveQuadratic(expr) {
      try {
        if (!expr.includes('x^2') && !expr.includes('x²')) return null;

        let clean = expr.replace(/[?¿!¡;]/g, ' ').trim();
        clean = clean.replace(/^(por\s+favor\s+|hola\s*perrito\s*,?\s*|profesor\s*,?\s*)/i, '');
        clean = clean.replace(/^(resuelve|resolver|despeja|despejar|calcula|calcular|halla|hallar|soluciona|solucionar|solve|raices\s+de\s+|encuentra\s+las\s+raices\s+de\s*)\s*(la\s+ecuacion\s+|:)?\s*/i, '');

        // Parse ax^2 + bx + c = 0
        const sides = clean.split('=');
        const side0 = sides[0];
        let a = 0, b = 0, c = 0;

        let norm = side0.replace(/([+-])/g, ' $1');
        if (norm.startsWith(' ')) norm = norm.substring(1);
        norm.split(/\s+/).forEach(token => {
          token = token.trim();
          if (!token) return;
          if (token.includes('x^2') || token.includes('x²')) {
            let co = token.replace(/x\^2|x²/g, '').replace(/[^0-9\.\+\-]/g, '');
            if (co === '' || co === '+') a += 1;
            else if (co === '-') a -= 1;
            else {
              const val = parseFloat(co);
              if (!isNaN(val)) a += val;
            }
          } else if (token.includes('x')) {
            let co = token.replace('x', '').replace(/[^0-9\.\+\-]/g, '');
            if (co === '' || co === '+') b += 1;
            else if (co === '-') b -= 1;
            else {
              const val = parseFloat(co);
              if (!isNaN(val)) b += val;
            }
          } else {
            const num = parseFloat(token.replace(/[^0-9\.\+\-]/g, ''));
            if (!isNaN(num)) c += num;
          }
        });

        if (sides.length > 1) {
          const rightConst = parseFloat(sides[1].replace(/[^0-9\.\+\-]/g, ''));
          if (!isNaN(rightConst)) c -= rightConst;
        }

        if (a === 0) return null;

        if (window.PerritoAcademic && window.PerritoAcademic.solveQuadratic) {
          const res = window.PerritoAcademic.solveQuadratic(a, b, c);
          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">⚡ Ecuación de Segundo Grado</span>
                <strong>Fórmula General Cuadrática (Chicharronera)</strong>
              </div>
              <div class="erudite-problem-line">
                Ecuación canónica: <code>${a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = 0</code>
              </div>
              <div class="erudite-steps">
                <div class="erudite-step-item">
                  <strong>Paso 1: Identificación de coeficientes.</strong><br>
                  <code>a = ${a}</code>, <code>b = ${b}</code>, <code>c = ${c}</code>.
                </div>
                <div class="erudite-step-item">
                  <strong>Paso 2: Cálculo del Discriminante (Δ = b² − 4ac).</strong><br>
                  <code>Δ = (${b})² − 4(${a})(${c}) = ${b * b} − (${4 * a * c}) = <strong>${res.delta}</strong></code>.<br>
                  <em>Naturaleza de raíces:</em> <strong>${res.rootType}</strong>.
                </div>
                <div class="erudite-step-item">
                  <strong>Paso 3: Sustitución en la Fórmula General:</strong><br>
                  <code>x = [ -(${b}) ± √(${res.delta}) ] / [ 2(${a}) ]</code>
                </div>
              </div>
              <div class="erudite-result-box">
                <span class="result-label">Raíces de la ecuación:</span>
                <span class="result-highlight">x₁ = ${res.x1Display}</span> &nbsp;|&nbsp; <span class="result-highlight">x₂ = ${res.x2Display}</span><br>
                <span class="result-dec" style="margin-top: 0.35rem; display: block;">Vértice de la parábola: V(${res.vertexH}, ${res.vertexK}) • Concavidad: ${res.concavity}</span>
              </div>
            </div>
          `;
        }
        return null;
      } catch (e) {
        return null;
      }
    },

    // Resolver M.C.D. o m.c.m. de una lista de números: ej: "mcd de 60, 90" o "mcm de 12, 18, 24"
    solveMcdMcm(query) {
      try {
        const isMcd = query.includes('mcd') || query.includes('maximo') || query.includes('divisor');
        const isMcm = query.includes('mcm') || query.includes('minimo') || query.includes('multiplo');
        if (!isMcd && !isMcm) return null;

        const numbers = (query.match(/\d+/g) || []).map(Number).filter(n => n > 0);
        if (numbers.length < 2) return null;

        if (isMcm) {
          const { lcmVal, factorizations, lcmExpr } = computeLcmWithSteps(numbers);
          const factorsHtml = factorizations.map(f => `• Factores de <code>${f.num}</code>: <code>${f.fact.text}</code>`).join('<br>');
          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">🎯 Teoría de Números • m.c.m.</span>
                <h4 class="erudite-title">Mínimo Común Múltiplo de [${numbers.join(', ')}]</h4>
                <span class="erudite-sub">Cálculo exacto por Descomposición en Factores Primos</span>
              </div>
              <div class="erudite-problem-line">
                Calcular m.c.m. de: <code>[${numbers.join(', ')}]</code>
              </div>
              <div class="erudite-steps">
                <div class="erudite-step-item">
                  <span class="step-num-badge">Paso 1</span>
                  <div>
                    <strong>Descomposición Canónica en Primos:</strong><br>
                    ${factorsHtml}
                  </div>
                </div>
                <div class="erudite-step-item">
                  <span class="step-num-badge">Paso 2</span>
                  <div>
                    <strong>Regla Fundamental del m.c.m.:</strong> Se toman todos los factores primos comunes y no comunes elevados a su <strong>mayor exponente</strong>:<br>
                    <code>m.c.m. = ${lcmExpr} = <strong>${lcmVal}</strong></code>.
                  </div>
                </div>
              </div>
              <div class="erudite-result-box">
                <span class="result-label">m.c.m. Calculado:</span>
                <span class="result-highlight">${lcmVal}</span>
              </div>
            </div>
          `;
        }

        // MCD
        const { gcdVal, factorizations, gcdExpr } = computeGcdWithSteps(numbers);
        const factorsHtml = factorizations.map(f => `• Factores de <code>${f.num}</code>: <code>${f.fact.text}</code>`).join('<br>');
        return `
          <div class="erudite-card-response">
            <div class="erudite-header">
              <span class="erudite-badge">🎯 Teoría de Números • M.C.D.</span>
              <h4 class="erudite-title">Máximo Común Divisor de [${numbers.join(', ')}]</h4>
              <span class="erudite-sub">Cálculo exacto por Factores Primos Comunes</span>
            </div>
            <div class="erudite-problem-line">
              Calcular M.C.D. de: <code>[${numbers.join(', ')}]</code>
            </div>
            <div class="erudite-steps">
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 1</span>
                <div>
                  <strong>Descomposición Canónica en Primos:</strong><br>
                  ${factorsHtml}
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 2</span>
                <div>
                  <strong>Regla Fundamental del M.C.D.:</strong> Se multiplican únicamente los factores primos comunes elevados a su <strong>menor exponente</strong>:<br>
                  <code>M.C.D. = ${gcdExpr} = <strong>${gcdVal}</strong></code>.
                </div>
              </div>
            </div>
            <div class="erudite-result-box">
              <span class="result-label">M.C.D. Calculado:</span>
              <span class="result-highlight">${gcdVal}</span>
            </div>
          </div>
        `;
      } catch (e) {
        return null;
      }
    },

    // Teorema de Pitágoras: ej: "pitagoras catetos 3 y 4" o "catetos 6 y 8"
    solvePythagoras(query) {
      try {
        const nums = (query.match(/\d+(\.\d+)?/g) || []).map(Number);
        if (nums.length < 2) return null;

        let a = nums[0], b = nums[1];
        let c = Math.sqrt(a * a + b * b);
        let cDisp = Number.isInteger(c) ? c.toString() : c.toFixed(4);

        return `
          <div class="erudite-card-response">
            <div class="erudite-header">
              <span class="erudite-badge">🔺 Geometría Euclidiana</span>
              <h4 class="erudite-title">Teorema de Pitágoras</h4>
              <span class="erudite-sub">Triángulos Rectángulos e Hipotenusa</span>
            </div>
            <div class="erudite-problem-line">
              Catetos dados: <code>a = ${a}</code>, <code>b = ${b}</code>
            </div>
            <div class="erudite-steps">
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 1</span>
                <div>
                  <strong>Teorema Fundamental:</strong> En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos:<br>
                  <code>c² = a² + b²</code>
                </div>
              </div>
              <div class="erudite-step-item">
                <span class="step-num-badge">Paso 2</span>
                <div>
                  <strong>Cálculo con tus valores:</strong><br>
                  • <code>a² = (${a})² = ${a * a}</code><br>
                  • <code>b² = (${b})² = ${b * b}</code><br>
                  • <code>c² = ${a * a} + ${b * b} = ${a * a + b * b}</code><br>
                  • <code>c = √(${a * a + b * b}) = <strong>${cDisp}</strong></code>
                </div>
              </div>
            </div>
            <div class="erudite-result-box">
              <span class="result-label">Hipotenusa calculada:</span>
              <span class="result-highlight">c = ${cDisp}</span>
            </div>
          </div>
        `;
      } catch (e) {
        return null;
      }
    },

    // Solucionador de problemas verbales y de aplicación cotidiana
    solveWordProblem(query) {
      try {
        const qNorm = (query || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();

        // 1. Porcentajes
        const pctMatch = qNorm.match(/(?:cuanto\s+es\s+el\s+|calcular\s+el\s+|el\s+)?(\d+(?:\.\d+)?)\s*%\s*(?:de\s+)?(\d+(?:\.\d+)?)/);
        if (pctMatch) {
          const pct = parseFloat(pctMatch[1]);
          const total = parseFloat(pctMatch[2]);
          const res = (pct * total) / 100;
          const resDisp = Number.isInteger(res) ? res.toString() : res.toFixed(2);
          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">🎯 Aritmética Comercial • Porcentajes</span>
                <h4 class="erudite-title">Cálculo de Porcentaje: ${pct}% de ${total}</h4>
                <span class="erudite-sub">Proporcionalidad Directa Base 100</span>
              </div>
              <div class="erudite-problem-line">
                Problema: <code>${pct}% de ${total}</code>
              </div>
              <div class="erudite-steps">
                <div class="erudite-step-item">
                  <span class="step-num-badge">Paso 1</span>
                  <div><strong>Concepto de Porcentaje:</strong> El <em>${pct}%</em> representa tomar <code>${pct}</code> partes de cada <code>100</code> unidades totales: <code>${pct}/100 = ${(pct / 100).toFixed(4).replace(/\.?0+$/, '')}</code>.</div>
                </div>
                <div class="erudite-step-item">
                  <span class="step-num-badge">Paso 2</span>
                  <div><strong>Multiplicación Directa:</strong><br>
                  <code>Resultado = (${pct} × ${total}) ÷ 100 = ${pct * total} ÷ 100 = <strong>${resDisp}</strong></code></div>
                </div>
              </div>
              <div class="erudite-result-box">
                <span class="result-label">Resultado:</span>
                <span class="result-highlight">${resDisp}</span>
              </div>
            </div>
          `;
        }

        // 2. Coincidencias periódicas en el tiempo (Problemas clásicos de m.c.m.: cometas, planetas, semáforos, campanas, autobuses, etc.)
        const isCoincidence = /repite|coincid|encontrar|junt|simultan|vez|sol|cometa|planeta|faro|alarma|campana|semaforo|autobus|camion|vuelta|pista|engranaje|ciclo/.test(qNorm);

        if (isCoincidence) {
          // Detect baseline year (ej: "ano 2000", "el año 2000", "en 2000", "desde el año 2000")
          let baseYear = null;
          const yearMatch = qNorm.match(/(?:ano|año|en el|desde el|el)\s*(\d{4})\b/) || qNorm.match(/\b(19\d\d|20\d\d|2100)\b/);
          if (yearMatch) {
            baseYear = parseInt(yearMatch[1], 10);
          }

          // Detect baseline hour (ej: "a las 12:00", "8:30", "a las 8")
          let baseHour = null, baseMin = null;
          const timeMatch = qNorm.match(/(\d{1,2}):(\d{2})/);
          if (timeMatch) {
            baseHour = parseInt(timeMatch[1], 10);
            baseMin = parseInt(timeMatch[2], 10);
          } else {
            const hourMatch = qNorm.match(/a las\s*(\d{1,2})\b/);
            if (hourMatch) {
              baseHour = parseInt(hourMatch[1], 10);
              baseMin = 0;
            }
          }

          // Extract periods
          let periods = [];
          const cadaMatches = [...qNorm.matchAll(/cada\s+(\d+)/g)].map(m => parseInt(m[1], 10));
          if (cadaMatches.length >= 2) {
            periods = cadaMatches;
          } else {
            const listAfterCada = qNorm.match(/cada\s+([0-9\s,ye\s]+?)(?:anos|años|dias|minutos|min|segundos|seg|horas|h|vueltas|meses|semanas|\.|\?|$)/);
            if (listAfterCada) {
              const found = (listAfterCada[1].match(/\d+/g) || []).map(Number);
              if (found.length >= 2) periods = found;
            }
            if (periods.length < 2) {
              const allInts = (qNorm.match(/\b\d+\b/g) || []).map(Number).filter(n => n > 0);
              periods = allInts.filter(n => n !== baseYear && (baseHour === null || (n !== baseHour && n !== baseMin)));
            }
          }

          periods = [...new Set(periods.filter(p => p > 1))];

          if (periods.length >= 2) {
            const unit = qNorm.includes('ano') || qNorm.includes('año') || qNorm.includes('siglo') ? 'años' :
                         qNorm.includes('minuto') || qNorm.includes('min') ? 'minutos' :
                         qNorm.includes('segundo') || qNorm.includes('seg') ? 'segundos' :
                         qNorm.includes('hora') ? 'horas' :
                         qNorm.includes('dia') ? 'días' :
                         qNorm.includes('vuelta') ? 'vueltas' : 'unidades de tiempo';

            const { lcmVal, factorizations, lcmExpr } = computeLcmWithSteps(periods);

            let targetFutureTitle = '';
            let targetFutureResult = '';
            let calculationHtml = '';
            let checkHtml = '';

            const factorsListHtml = factorizations.map((f, idx) => `• Período ${idx + 1} (<code>${f.num} ${unit}</code>): <code>${f.fact.text}</code>`).join('<br>');

            if (baseYear !== null) {
              const targetYear = baseYear + lcmVal;
              targetFutureTitle = `Coincidencia Periódica en el Tiempo (Año ${targetYear})`;
              targetFutureResult = `Volverán a encontrarse en el año ${targetYear}`;
              calculationHtml = `
                • <em>m.c.m. calculado:</em> <code>${lcmExpr} = <strong>${lcmVal} ${unit}</strong></code>.<br>
                • <em>Cálculo del Año de Coincidencia:</em><br>
                <code>Año base (${baseYear}) + m.c.m. (${lcmVal} ${unit}) = <strong>Año ${targetYear}</strong></code>.
              `;
              checkHtml = factorizations.map((f, i) => {
                const cycles = lcmVal / f.num;
                return `• Elemento ${i + 1} (${f.num} ${unit}): <code>${lcmVal} ÷ ${f.num} = ${cycles} órbitas/ciclos exactos</code>.`;
              }).join('<br>') + `<br>Al ser cocientes enteros exactos, ambos cuerpos coinciden con absoluta precisión en su perihelio.`;
            } else if (baseHour !== null) {
              const totalMinutes = (baseHour * 60) + baseMin + lcmVal;
              const finalHour = Math.floor(totalMinutes / 60) % 24;
              const finalMin = totalMinutes % 60;
              const timeStr = `${String(finalHour).padStart(2, '0')}:${String(finalMin).padStart(2, '0')}`;
              targetFutureTitle = `Coincidencia Periódica (A las ${timeStr})`;
              targetFutureResult = `Volverán a coincidir a las ${timeStr}`;
              calculationHtml = `
                • <em>m.c.m. de las frecuencias:</em> <code>${lcmExpr} = <strong>${lcmVal} minutos</strong></code> (${(lcmVal / 60).toFixed(1)} h).<br>
                • <em>Hora final:</em> <code>${String(baseHour).padStart(2, '0')} + ${lcmVal} min = <strong>${timeStr}</strong></code>.
              `;
              checkHtml = factorizations.map((f, i) => {
                const cycles = lcmVal / f.num;
                return `• Elemento ${i + 1} (${f.num} min): <code>${lcmVal} ÷ ${f.num} = ${cycles} repeticiones exactas</code>.`;
              }).join('<br>');
            } else {
              targetFutureTitle = `Coincidencia Periódica Simultánea (Cada ${lcmVal} ${unit})`;
              targetFutureResult = `Volverán a coincidir cada ${lcmVal} ${unit}`;
              calculationHtml = `
                • <em>m.c.m. de los períodos:</em> <code>m.c.m.(${periods.join(', ')}) = ${lcmExpr} = <strong>${lcmVal} ${unit}</strong></code>.
              `;
              checkHtml = factorizations.map((f, i) => {
                const cycles = lcmVal / f.num;
                return `• Elemento ${i + 1} (${f.num} ${unit}): <code>${lcmVal} ÷ ${f.num} = ${cycles} ciclos</code>.`;
              }).join('<br>');
            }

            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">🎯 Problema de Aplicación Verbal • m.c.m.</span>
                  <h4 class="erudite-title">${targetFutureTitle}</h4>
                  <span class="erudite-sub">Teoría de Números • Mínimo Común Múltiplo • Metodología George Pólya</span>
                </div>

                <div class="erudite-problem-line">
                  <strong>Problema planteado:</strong> "${query}"
                </div>

                <div class="erudite-steps">
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 1</span>
                    <div>
                      <strong>Comprender el Problema e Identificar Datos:</strong><br>
                      • Períodos regulares involucrados: <code>[${periods.map(p => `${p} ${unit}`).join(', ')}]</code>.<br>
                      ${baseYear ? `• Punto de inicio / última coincidencia: <code>Año ${baseYear}</code>.<br>` : ''}
                      ${baseHour !== null ? `• Hora de partida: <code>${String(baseHour).padStart(2, '0')}:${String(baseMin).padStart(2, '0')}</code>.<br>` : ''}
                      • <em>Objetivo:</em> Encontrar el instante exacto en que ambos ciclos volverán a coincidir simultáneamente en la misma posición.
                    </div>
                  </div>

                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 2</span>
                    <div>
                      <strong>Estrategia Matemática (¿Por qué m.c.m.?):</strong><br>
                      Cuando dos o más fenómenos periódicos se repiten con frecuencias distintas y buscamos la <em>primera vez en el futuro en que ocurrirán al mismo tiempo</em>, debemos calcular el <strong>Mínimo Común Múltiplo (m.c.m.)</strong> de sus períodos.
                    </div>
                  </div>

                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 3</span>
                    <div>
                      <strong>Ejecución y Descomposición Canónica en Primos:</strong><br>
                      ${factorsListHtml}<br>
                      • Tomamos factores primos comunes y no comunes al <strong>mayor exponente</strong>:<br>
                      ${calculationHtml}
                    </div>
                  </div>

                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 4</span>
                    <div>
                      <strong>Comprobación Retrospectiva (Verificación Pólya):</strong><br>
                      ${checkHtml}
                    </div>
                  </div>
                </div>

                <div class="erudite-result-box">
                  <span class="result-label">Respuesta Definitiva:</span>
                  <span class="result-highlight">${targetFutureResult}</span>
                  ${baseYear ? `<span class="result-dec" style="margin-top: 0.35rem; display: block;">Transcurrirán exactamente ${lcmVal} ${unit} desde el año ${baseYear}.</span>` : ''}
                </div>

                <div class="erudite-tip-box">
                  💡 <strong>Consejo de Oro del Profesor Perrito:</strong> En problemas de física o astronomía (cometas, planetas, semáforos, rutas de autobuses o campanas), ¡la coincidencia temporal siempre se resuelve con el <strong>m.c.m.</strong>!
                </div>
              </div>
            `;
          }
        }

        // 3. Reparto equitativo / División máxima (Problemas de M.C.D.)
        const isPartition = /cortar|repartir|dividir|envasar|empaquetar|trozos|pedazos|cajas|paquetes|bolsas|baldosas|listones|cuerdas/.test(qNorm) &&
                            /mayor|maximo|mas largo|mas grande|iguales|sin que sobre/.test(qNorm);

        if (isPartition) {
          const numbers = (qNorm.match(/\b\d+\b/g) || []).map(Number).filter(n => n > 1);
          if (numbers.length >= 2) {
            const { gcdVal, factorizations, gcdExpr } = computeGcdWithSteps(numbers);
            const totalParts = numbers.reduce((acc, val) => acc + (val / gcdVal), 0);
            const factorsListHtml = factorizations.map((f, idx) => `• Cantidad ${idx + 1} (<code>${f.num}</code>): <code>${f.fact.text}</code>`).join('<br>');
            const partsBreakdown = numbers.map((n, i) => `• Cantidad ${i + 1} (${n}): <code>${n} ÷ ${gcdVal} = ${n / gcdVal} partes</code>.`).join('<br>');

            return `
              <div class="erudite-card-response">
                <div class="erudite-header">
                  <span class="erudite-badge">🎯 Problema de Aplicación Verbal • M.C.D.</span>
                  <h4 class="erudite-title">Reparto Equitativo Máximo (Máximo Común Divisor)</h4>
                  <span class="erudite-sub">Teoría de Números • Partición Óptima sin Residuo</span>
                </div>

                <div class="erudite-problem-line">
                  <strong>Problema planteado:</strong> "${query}"
                </div>

                <div class="erudite-steps">
                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 1</span>
                    <div>
                      <strong>Comprender el Problema:</strong> Se tienen cantidades <code>[${numbers.join(', ')}]</code> que deben subdividirse en partes iguales lo más grandes posibles sin que sobre nada.
                    </div>
                  </div>

                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 2</span>
                    <div>
                      <strong>Estrategia Matemática (¿Por qué M.C.D.?):</strong> Al buscar la <em>máxima medida común</em> para dividir todas las cantidades de manera exacta, aplicamos el <strong>Máximo Común Divisor (M.C.D.)</strong>.
                    </div>
                  </div>

                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 3</span>
                    <div>
                      <strong>Descomposición en Primos y M.C.D.:</strong><br>
                      ${factorsListHtml}<br>
                      • Factores primos comunes con su <strong>menor exponente</strong>:<br>
                      <code>M.C.D.(${numbers.join(', ')}) = ${gcdExpr} = <strong>${gcdVal}</strong></code>.
                    </div>
                  </div>

                  <div class="erudite-step-item">
                    <span class="step-num-badge">Fase 4</span>
                    <div>
                      <strong>Conteo de Partes Obtenidas:</strong><br>
                      ${partsBreakdown}<br>
                      • Total de partes obtenidas: <code><strong>${totalParts} partes</strong></code>.
                    </div>
                  </div>
                </div>

                <div class="erudite-result-box">
                  <span class="result-label">Medida de cada parte:</span>
                  <span class="result-highlight">${gcdVal} unidades</span> &nbsp;|&nbsp;
                  <span class="result-label">Total de partes:</span>
                  <span class="result-highlight">${totalParts}</span>
                </div>

                <div class="erudite-tip-box">
                  💡 <strong>Consejo de Oro del Profesor Perrito:</strong> En problemas de cortar, envasar o repartir en el mayor tamaño posible sin desperdicio, ¡siempre es el <strong>M.C.D.</strong>!
                </div>
              </div>
            `;
          }
        }

        return null;
      } catch (err) {
        return null;
      }
    }
  };

  // ==========================================================================
  // 2. ENCICLOPEDIA CATEDRÁTICA UNIVERSAL DE MATEMÁTICAS (KNOWLEDGE BASE)
  // ==========================================================================

  const KNOWLEDGE_BASE = [
    // ---------------- FRACCIONES COMPUESTAS & RACIONALES ----------------
    {
      id: 'fracciones_compuestas',
      title: 'Fracciones Compuestas y Continuas (Cascada Multinivel)',
      category: 'Aritmética & Álgebra Racional',
      badge: 'Fracciones',
      keywords: ['compuesta', 'compuestas', 'fraccion compuesta', 'cascada', 'escalonada', 'piso', 'pisos', 'abajo hacia arriba', 'continuas', 'fracciones complejas'],
      concept: `Una <strong>fracción compuesta</strong> es una expresión fraccionaria donde el numerador, el denominador (o ambos) contienen a su vez otras fracciones o sumas de fracciones. Se asemejan a una torre de pisos multinivel o a muñecas rusas entrelazadas.`,
      formulas: [
        'Orden de resolución obligatorio: DE ABAJO HACIA ARRIBA (del piso más interno a la cima)',
        'Extremos por Medios: (a/b) / (c/d) = (a · d) / (b · c)'
      ],
      example: {
        statement: 'Simplificar paso a paso: <code>3 / [ 1 - 2 / (3 + 1/2) ]</code>',
        steps: [
          '<strong>Piso Inferior:</strong> Resolver la suma en la base profunda: <code>3 + 1/2 = 6/2 + 1/2 = 7/2</code>.',
          '<strong>Primera Herradura:</strong> Dividir el entero 2 entre <code>7/2</code>. Expresando 2 como <code>2/1</code>: <code>(2/1) / (7/2) = (2 × 2) / (1 × 7) = 4/7</code>.',
          '<strong>Piso Medio:</strong> Efectuar la resta: <code>1 - 4/7 = 7/7 - 4/7 = 3/7</code>.',
          '<strong>Herradura Definitiva:</strong> Dividir el numerador general 3 entre <code>3/7</code>: <code>(3/1) / (3/7) = (3 × 7) / (1 × 3) = 21/3 = 7</code>.'
        ],
        result: '7 (un número entero exacto)'
      },
      pitfalls: [
        'Intentar operar de arriba hacia abajo (ej. querer dividir 3 entre 1 al inicio).',
        'Invertir la posición de extremos y medios al dividir enteros: siempre escribe <code>a</code> como <code>a/1</code>.',
        'Olvidar la ley de signos cuando hay signos negativos en cascada: <code>-(-a) = +a</code>.'
      ],
      goldenTip: 'Nunca toques los pisos superiores mientras el piso inferior no sea una sola fracción consolidada.'
    },
    {
      id: 'ley_herradura',
      title: 'Ley de la Herradura (División por Extremos y Medios)',
      category: 'Aritmética Racional',
      badge: 'Fracciones',
      keywords: ['herradura', 'ley de la herradura', 'extremos y medios', 'extremos', 'medios', 'oreja', 'ley de la oreja', 'sandwich'],
      concept: `La <strong>Ley de la Herradura</strong> (también llamada popularmente <em>Ley de la Oreja</em> o <em>Regla del Sándwich</em>) es el método geométrico y visual para resolver la división de dos números racionales superpuestos.`,
      formulas: [
        '(a / b) ÷ (c / d) = (a × d) / (b × c)',
        'Extremos (a y d) se multiplican y van al NUMERADOR',
        'Medios (b y c) se multiplican y van al DENOMINADOR'
      ],
      example: {
        statement: 'Resolver: <code>(5/3) ÷ (10/7)</code>',
        steps: [
          'Identificamos los extremos: <code>5</code> (cima) y <code>7</code> (base del piso). Producto de extremos: <code>5 × 7 = 35</code>.',
          'Identificamos los medios: <code>3</code> y <code>10</code> (centro). Producto de medios: <code>3 × 10 = 30</code>.',
          'Formamos la fracción resultante: <code>35 / 30</code>.',
          'Simplificamos por su M.C.D.(35, 30) = 5: dividiendo entre 5 queda <code>7/6</code>.'
        ],
        result: '7/6 (1 entero y 1/6)'
      },
      pitfalls: [
        'Confundir cuál número va arriba: recuerda que el extremo superior multiplicado por el extremo inferior siempre gobierna en el numerador.',
        'Olvidar colocar denominador 1 cuando uno de los términos es un entero: ej. <code>(5) / (2/3) = (5/1) / (2/3) = 15/2</code>.'
      ],
      goldenTip: 'Extremos arriba como la corona, medios abajo como el cimiento.'
    },
    {
      id: 'suma_fracciones_mcm',
      title: 'Suma y Resta de Fracciones con Distinto Denominador (m.c.m.)',
      category: 'Aritmética',
      badge: 'Fracciones',
      keywords: ['suma de fracciones', 'resta de fracciones', 'fracciones heterogeneas', 'distinto denominador', 'mcm fracciones', 'metodo mariposa'],
      concept: `No se pueden sumar o restar fracciones directamente si representan partes de diferente tamaño (denominadores distintos). Es imperativo <strong>homogenizar</strong> los denominadores hallando el <strong>Mínimo Común Múltiplo (m.c.m.)</strong>.`,
      formulas: [
        'a/b ± c/d = ( (mcm/b)·a ± (mcm/d)·c ) / mcm',
        'Regla mariposa para 2 fracciones: (a·d ± b·c) / (b·d)'
      ],
      example: {
        statement: 'Calcular: <code>2/3 + 3/4 - 1/6</code>',
        steps: [
          'Calculamos el m.c.m. de los denominadores 3, 4 y 6: <code>m.c.m.(3, 4, 6) = 12</code>.',
          'Amplificamos cada numerador dividiendo 12 entre su denominador:<br>• <code>(12 ÷ 3) × 2 = 4 × 2 = 8</code><br>• <code>(12 ÷ 4) × 3 = 3 × 3 = 9</code><br>• <code>(12 ÷ 6) × 1 = 2 × 1 = 2</code>',
          'Operamos los numeradores sobre el denominador común 12: <code>(8 + 9 - 2) / 12 = 15 / 12</code>.',
          'Simplificamos dividiendo entre el M.C.D.(15, 12) = 3: <code>15÷3 / 12÷3 = 5/4</code>.'
        ],
        result: '5/4 (1 entero y 1/4)'
      },
      pitfalls: [
        '¡El error más grave de la historia escolar! Sumar en línea recta: <code>(2 + 3)/(3 + 4) = 5/7</code> ¡ESTÁ TOTALMENTE MAL!',
        'No simplificar el resultado al término irreducible.'
      ],
      goldenTip: 'Piensa en rebanadas de pizza: no puedes sumar rebanadas de tamaño mediano con rebanadas gigantes sin primero cortarlas al mismo tamaño común.'
    },

    // ---------------- TEORÍA DE NÚMEROS: M.C.D. vs m.c.m. ----------------
    {
      id: 'mcd_vs_mcm',
      title: 'M.C.D. (Máximo Común Divisor) vs m.c.m. (Mínimo Común Múltiplo)',
      category: 'Teoría de Números',
      badge: 'Aritmética',
      keywords: ['mcd', 'mcm', 'maximo comun divisor', 'minimo comun multiplo', 'diferencia mcd mcm', 'descomposicion simultanea', 'factores primos', 'cometa', 'cometas', 'coincidir', 'coincidencia', 'volver a encontrarse', 'periodos', 'ciclos', 'semaforo', 'autobus', 'campana', 'reparto equitativo', 'perihelio', 'proxima al sol'],
      concept: `Son las dos herramientas reinas de la aritmética entera:<br>
      • <strong>M.C.D.:</strong> El mayor número entero que divide exactamente a todos los números del conjunto (para repartos equitativos y simplificación).<br>
      • <strong>m.c.m.:</strong> El menor múltiplo positivo común a todos (para coincidencias de tiempos y suma de fracciones).`,
      formulas: [
        'Relación canónica para dos números: a × b = M.C.D.(a, b) × m.c.m.(a, b)',
        'M.C.D.: Solo primos que dividan a TODOS simultáneamente.',
        'm.c.m.: Se continúa dividiendo hasta que todas las columnas lleguen a 1.'
      ],
      example: {
        statement: 'Calcular el M.C.D. y m.c.m. de <code>24</code> y <code>36</code>',
        steps: [
          'Factores primos de 24: <code>2³ × 3</code>',
          'Factores primos de 36: <code>2² × 3²</code>',
          '<strong>M.C.D.:</strong> Factores comunes con su MENOR exponente: <code>2² × 3 = 4 × 3 = 12</code>.',
          '<strong>m.c.m.:</strong> Factores comunes y no comunes con su MAYOR exponente: <code>2³ × 3² = 8 × 9 = 72</code>.',
          'Comprobación: <code>24 × 36 = 864</code> y <code>12 × 72 = 864</code> ¡Exacto!'
        ],
        result: 'M.C.D. = 12 | m.c.m. = 72'
      },
      pitfalls: [
        'Confundirlos en problemas de aplicación: si te piden "cortar cuerdas en trozos iguales lo más largos posibles", es M.C.D. Si te piden "cuándo volverán a coincidir dos autobuses con distintas frecuencias", es m.c.m.'
      ],
      goldenTip: 'El M.C.D. siempre es MENOR O IGUAL que el número más pequeño. El m.c.m. siempre es MAYOR O IGUAL que el número más grande.'
    },

    // ---------------- ÁLGEBRA: FACTORIZACIÓN Y PRODUCTOS NOTABLES ----------------
    {
      id: 'factorizacion_total',
      title: 'Los 6 Casos Fundamentales de Factorización',
      category: 'Álgebra',
      badge: 'Álgebra',
      keywords: ['factorizacion', 'factorizar', 'casos de factorizacion', 'factor comun', 'diferencia de cuadrados', 'trinomio cuadrado perfecto', 'trinomio'],
      concept: `<strong>Factorizar</strong> significa transformar un polinomio (suma o resta de términos) en una multiplicación de factores irreducibles. Es el paso inverso al desarrollo de productos notables.`,
      formulas: [
        '1. Factor Común: ax + ay = a(x + y)',
        '2. Diferencia de Cuadrados: a² - b² = (a + b)(a - b)',
        '3. Trinomio Cuadrado Perfecto (TCP): a² ± 2ab + b² = (a ± b)²',
        '4. Trinomio x² + bx + c = (x + p)(x + q) con p·q=c y p+q=b',
        '5. Trinomio ax² + bx + c (Método del aspa o multiplicación por a)',
        '6. Suma/Diferencia de Cubos: a³ ± b³ = (a ± b)(a² ∓ ab + b²)'
      ],
      example: {
        statement: 'Factorizar: <code>x² - 5x + 6</code>',
        steps: [
          'Identificamos que es un trinomio de la forma <code>x² + bx + c</code> con <code>b = -5</code> y <code>c = 6</code>.',
          'Buscamos dos números enteros (<code>p</code> y <code>q</code>) tales que multiplicados den <code>+6</code> y sumados den <code>-5</code>.',
          'Los divisores de 6 son: (1, 6) y (2, 3). Para que la suma sea negativa y el producto positivo, ambos deben ser negativos.',
          'Probamos: <code>(-2) × (-3) = +6</code> y <code>(-2) + (-3) = -5</code> ¡Cumplen perfectamente!',
          'Escribimos el producto de binomios: <code>(x - 2)(x - 3)</code>.'
        ],
        result: '(x - 2)(x - 3)'
      },
      pitfalls: [
        'Diferencia de cuadrados vs suma de cuadrados: <code>a² - b² = (a+b)(a-b)</code>, pero <code>a² + b²</code> NO se factoriza en los números reales ℝ.',
        'Olvidar el doble producto en el TCP: <code>(x + 3)² = x² + 6x + 9</code>, ¡no es <code>x² + 9</code>!'
      ],
      goldenTip: 'Siempre busca primero si existe un FACTOR COMÚN numérico o literal antes de aplicar cualquier otro método.'
    },
    {
      id: 'productos_notables',
      title: 'Productos Notables Esenciales',
      category: 'Álgebra',
      badge: 'Álgebra',
      keywords: ['productos notables', 'binomio al cuadrado', 'binomios conjugados', 'binomio al cubo', 'desarrollo algebraico'],
      concept: `Los <strong>productos notables</strong> son multiplicaciones algebraicas cuyos resultados pueden escribirse directamente por simple inspección, sin necesidad de realizar la multiplicación término a término.`,
      formulas: [
        'Binomio al cuadrado: (a + b)² = a² + 2ab + b²',
        'Binomio con signo menos: (a - b)² = a² - 2ab + b²',
        'Binomios conjugados: (a + b)(a - b) = a² - b²',
        'Binomios con término común: (x + a)(x + b) = x² + (a+b)x + ab',
        'Binomio al cubo: (a + b)³ = a³ + 3a²b + 3ab² + b³'
      ],
      example: {
        statement: 'Desarrollar: <code>(3x - 5)²</code>',
        steps: [
          'Cuadrado del primer término: <code>(3x)² = 9x²</code>.',
          'Doble producto del primero por el segundo: <code>2 × (3x) × (-5) = -30x</code>.',
          'Cuadrado del segundo término: <code>(-5)² = +25</code>.',
          'Ensamblamos el trinomio cuadrado perfecto: <code>9x² - 30x + 25</code>.'
        ],
        result: '9x² - 30x + 25'
      },
      pitfalls: [
        'La falacia clásica: escribir <code>(a + b)² = a² + b²</code>. ¡El término central <code>2ab</code> nunca debe olvidarse!'
      ],
      goldenTip: 'Mnemotecnia: Cuadrado del primero, doble del primero por el segundo, cuadrado del segundo.'
    },

    // ---------------- ECUACIONES CUADRÁTICAS & SISTEMAS ----------------
    {
      id: 'ecuaciones_cuadraticas',
      title: 'Ecuaciones de 2º Grado y la Fórmula General ("La Chicharronera")',
      category: 'Álgebra Superior',
      badge: 'Ecuaciones',
      keywords: ['cuadratica', 'segundo grado', 'formula general', 'chicharronera', 'discriminante', 'parabola', 'raices'],
      concept: `Toda ecuación de segundo grado puede reducirse a la forma canónica <code>ax² + bx + c = 0</code> (con <code>a ≠ 0</code>). Sus soluciones representan los puntos de intersección de la parábola con el eje X.`,
      formulas: [
        'Fórmula General: x = [ -b ± √(b² - 4ac) ] / (2a)',
        'Discriminante Δ = b² - 4ac',
        '• Si Δ > 0: Dos soluciones reales distintas',
        '• Si Δ = 0: Una solución real doble (vértice sobre el eje X)',
        '• Si Δ < 0: Dos soluciones complejas conjugadas (no corta al eje X)',
        'Vértice de la parábola: h = -b / (2a), k = f(h)'
      ],
      example: {
        statement: 'Resolver: <code>2x² - 4x - 6 = 0</code>',
        steps: [
          'Identificamos coeficientes: <code>a = 2</code>, <code>b = -4</code>, <code>c = -6</code>.',
          'Calculamos el discriminante: <code>Δ = (-4)² - 4(2)(-6) = 16 - (-48) = 16 + 48 = 64</code>.',
          'Como <code>Δ = 64 > 0</code>, hay dos raíces reales y <code>√64 = 8</code>.',
          'Aplicamos la fórmula: <code>x = [ -(-4) ± 8 ] / [ 2(2) ] = [ 4 ± 8 ] / 4</code>.',
          '• Para el signo más: <code>x₁ = (4 + 8) / 4 = 12 / 4 = 3</code>.<br>• Para el signo menos: <code>x₂ = (4 - 8) / 4 = -4 / 4 = -1</code>.'
        ],
        result: 'x₁ = 3, x₂ = -1'
      },
      pitfalls: [
        'Signo en <code>-b</code>: si <code>b = -4</code>, entonces <code>-(-4) = +4</code>.',
        'Dividir solo a la raíz entre <code>2a</code> en vez de dividir a toda la expresión completa.'
      ],
      goldenTip: 'Antes de usar la fórmula general, verifica si puedes simplificar la ecuación dividiendo toda la fila entre un factor común (en el ejemplo, dividir entre 2 daba <code>x² - 2x - 3 = 0</code>).'
    },
    {
      id: 'sistemas_ecuaciones_cramer',
      title: 'Sistemas de Ecuaciones Lineales 2x2 y 3x3 (Regla de Cramer)',
      category: 'Álgebra & Álgebra Lineal',
      badge: 'Sistemas',
      keywords: ['sistema de ecuaciones', 'sistemas 2x2', 'sistemas 3x3', 'cramer', 'determinantes', 'sustitucion', 'reduccion', 'eliminacion'],
      concept: `Un sistema de ecuaciones lineales busca encontrar el punto <code>(x, y)</code> donde dos rectas se intersectan en el plano. La <strong>Regla de Cramer</strong> resuelve el sistema usando determinantes matriciales de forma elegante y directa.`,
      formulas: [
        'Determinante principal Δ = a₁b₂ - a₂b₁',
        'x = Δx / Δ,  y = Δy / Δ (siempre que Δ ≠ 0)',
        'Si Δ = 0 y Δx = 0: Sistema Compatible Indeterminado (infinitas soluciones)',
        'Si Δ = 0 y Δx ≠ 0: Sistema Incompatible (rectas paralelas, sin solución)'
      ],
      example: {
        statement: 'Resolver el sistema: <code>{ 2x + 3y = 13 ; x - 2y = -4 }</code>',
        steps: [
          'Determinante del sistema (Δ): <code>| 2  3 | / | 1 -2 | = (2)(-2) - (1)(3) = -4 - 3 = -7</code>.',
          'Determinante de x (Δx): Sustituimos la columna de x por los términos independientes:<br><code>| 13  3 | / | -4 -2 | = (13)(-2) - (-4)(3) = -26 - (-12) = -14</code>.',
          'Determinante de y (Δy): Sustituimos la columna de y:<br><code>| 2  13 | / | 1 -4 | = (2)(-4) - (1)(13) = -8 - 13 = -21</code>.',
          'Calculamos las incógnitas:<br>• <code>x = Δx / Δ = -14 / -7 = 2</code><br>• <code>y = Δy / Δ = -21 / -7 = 3</code>.'
        ],
        result: 'x = 2, y = 3 (Punto de corte: (2, 3))'
      },
      pitfalls: [
        'Restar al revés en la diagonal secundaria: la fórmula es siempre <code>(diagonal principal) − (diagonal secundaria)</code>.'
      ],
      goldenTip: 'Siempre sustituye tu solución en ambas ecuaciones originales para verificar que cumpla al 100%.'
    },

    // ---------------- GEOMETRÍA & TRIGONOMETRÍA ----------------
    {
      id: 'teorema_pitagoras',
      title: 'Teorema de Pitágoras y Ternas Pitagóricas',
      category: 'Geometría Euclidiana',
      badge: 'Geometría',
      keywords: ['pitagoras', 'teorema de pitagoras', 'hipotenusa', 'catetos', 'triangulo rectangulo', 'ternas pitagoricas'],
      concept: `El pilar de la geometría métrica: en todo triángulo que posea un ángulo recto (90°), el área del cuadrado construido sobre la hipotenusa es exactamente igual a la suma de las áreas de los cuadrados construidos sobre los catetos.`,
      formulas: [
        'c² = a² + b²',
        'Hipotenusa: c = √(a² + b²)',
        'Cateto faltante: a = √(c² - b²)  ó  b = √(c² - a²)',
        'Ternas sagradas enteras: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25)'
      ],
      example: {
        statement: 'Calcular el cateto faltante si la hipotenusa mide <code>10 cm</code> y un cateto mide <code>6 cm</code>',
        steps: [
          'Identificamos los datos: <code>c = 10</code>, <code>b = 6</code>, <code>a = ?</code>.',
          'Planteamos el despeje del cateto: <code>a² = c² - b²</code>.',
          'Elevamos al cuadrado: <code>a² = (10)² - (6)² = 100 - 36 = 64</code>.',
          'Extraemos raíz cuadrada: <code>a = √64 = 8 cm</code>.'
        ],
        result: 'El cateto mide 8 cm'
      },
      pitfalls: [
        'Sumar cuando se busca un cateto: solo se suma para hallar la hipotenusa. Para un cateto siempre se RESTA <code>c² - b²</code>.',
        'Intentar aplicarlo en triángulos que no sean rectángulos (para triángulos oblicuángulos se usa la Ley de Cosenos).'
      ],
      goldenTip: 'Si los lados son múltiplos de 3, 4 y 5 (como 6, 8 y 10), el cálculo es inmediato gracias a las ternas pitagóricas.'
    },
    {
      id: 'trigonometria_sohcahtoa',
      title: 'Razones Trigonométricas y Nemotecnia SOH-CAH-TOA',
      category: 'Trigonometría',
      badge: 'Trigonometría',
      keywords: ['trigonometria', 'seno', 'coseno', 'tangente', 'sohcahtoa', 'cateto opuesto', 'cateto adyacente', 'circulo unitario'],
      concept: `Las razones trigonométricas relacionan los ángulos de un triángulo rectángulo con las proporciones entre sus lados. La clave universal para dominarlas es la legendaria palabra mnemotécnica <strong>SOH-CAH-TOA</strong>.`,
      formulas: [
        'SOH: Seno(θ) = Opuesto / Hipotenusa',
        'CAH: Coseno(θ) = Adyacente / Hipotenusa',
        'TOA: Tangente(θ) = Opuesto / Adyacente',
        'Identidad Pitagórica Reina: sen²(θ) + cos²(θ) = 1',
        'tan(θ) = sen(θ) / cos(θ)'
      ],
      example: {
        statement: 'En un triángulo rectángulo de cateto opuesto = 3 y cateto adyacente = 4, hallar Seno, Coseno y Tangente',
        steps: [
          'Calculamos la hipotenusa por Pitágoras: <code>c = √(3² + 4²) = √25 = 5</code>.',
          'Aplicamos SOH: <code>sen(θ) = 3 / 5 = 0.6</code>.',
          'Aplicamos CAH: <code>cos(θ) = 4 / 5 = 0.8</code>.',
          'Aplicamos TOA: <code>tan(θ) = 3 / 4 = 0.75</code>.',
          'Comprobación pitagórica: <code>(0.6)² + (0.8)² = 0.36 + 0.64 = 1.0</code> ¡Perfecto!'
        ],
        result: 'sen(θ)=3/5, cos(θ)=4/5, tan(θ)=3/4'
      },
      pitfalls: [
        'Confundir cuál es el cateto opuesto y cuál el adyacente: el opuesto está FRENTE al ángulo elegido; el adyacente está JUNTO a él formando el ángulo con la hipotenusa.'
      ],
      goldenTip: 'Recuerda que los valores de Seno y Coseno de cualquier ángulo real siempre oscilan estrictamente entre -1 y +1.'
    },
    {
      id: 'ley_senos_cosenos',
      title: 'Leyes de Senos y Cosenos (Triángulos Cualesquiera)',
      category: 'Trigonometría Avanzada',
      badge: 'Trigonometría',
      keywords: ['ley de senos', 'ley de cosenos', 'triangulos oblicuangulos', 'senos', 'cosenos'],
      concept: `Cuando un triángulo NO tiene ningún ángulo de 90° (oblicuángulo), Pitágoras no se puede aplicar directamente. Se recurre a la <strong>Ley de Senos</strong> y a la <strong>Ley de Cosenos</strong> (que es la generalización universal del Teorema de Pitágoras).`,
      formulas: [
        'Ley de Senos: a / sen(A) = b / sen(B) = c / sen(C)',
        'Ley de Cosenos: c² = a² + b² - 2ab · cos(C)',
        '¿Cuándo usar Senos?: Conocidos 2 ángulos y 1 lado (AAL, ALA), o 2 lados y el ángulo opuesto.',
        '¿Cuándo usar Cosenos?: Conocidos los 3 lados (LLL), o 2 lados y el ángulo comprendido entre ellos (LAL).'
      ],
      example: {
        statement: 'Calcular el lado c si <code>a = 5</code>, <code>b = 7</code> y el ángulo comprendido es <code>C = 60°</code> (donde <code>cos(60°) = 0.5</code>)',
        steps: [
          'Como conocemos dos lados y el ángulo que forman (LAL), usamos la Ley de Cosenos.',
          'Fórmula: <code>c² = 5² + 7² - 2(5)(7)cos(60°)</code>.',
          'Operamos cuadrados: <code>5² = 25</code>, <code>7² = 49</code>, suma = <code>74</code>.',
          'Término trigonométrico: <code>2 × 5 × 7 × 0.5 = 35</code>.',
          'Restamos: <code>c² = 74 - 35 = 39</code> ⟹ <code>c = √39 ≈ 6.245</code>.'
        ],
        result: 'c = √39 ≈ 6.245'
      },
      pitfalls: [
        'Olvidar el término <code>- 2ab cos(C)</code>: nota que si C = 90°, cos(90°) = 0 y la fórmula se convierte exactamente en el Teorema de Pitágoras <code>c² = a² + b²</code>.'
      ],
      goldenTip: 'Asegúrate de que tu calculadora esté configurada en grados sexagesimales (DEG) y no en radianes (RAD) al evaluar ángulos en grados.'
    },

    // ---------------- CÁLCULO DIFERENCIAL & INTEGRAL ----------------
    {
      id: 'que_es_una_derivada',
      title: '¿Qué es una Derivada y cuáles son sus Reglas Maestras?',
      category: 'Cálculo Diferencial',
      badge: 'Cálculo',
      keywords: ['derivada', 'que es una derivada', 'calculo diferencial', 'razon de cambio', 'pendiente de la tangente', 'regla de la potencia', 'regla de la cadena'],
      concept: `La <strong>derivada</strong> representa dos conceptos colosales a la vez:<br>
      1. <strong>Físico:</strong> La razón de cambio instantánea a la que cambia una función (ej. velocidad instantánea como derivada de la posición).<br>
      2. <strong>Geométrico:</strong> La <strong>pendiente (m)</strong> exacta de la recta tangente a la curva en cualquier punto <code>x</code>.`,
      formulas: [
        'Definición formal: f\'(x) = lim(h→0) [ f(x + h) - f(x) ] / h',
        'Regla de la Potencia: d/dx [ xⁿ ] = n · xⁿ⁻¹',
        'Regla de la Constante: d/dx [ c ] = 0  y  d/dx [ c·x ] = c',
        'Regla del Producto: (u · v)\' = u\'v + uv\'',
        'Regla del Cociente: (u / v)\' = (u\'v - uv\') / v²',
        'Regla de la Cadena: d/dx [ f(g(x)) ] = f\'(g(x)) · g\'(x)'
      ],
      example: {
        statement: 'Calcular la derivada de <code>f(x) = 4x³ - 5x² + 7x - 9</code>',
        steps: [
          'Derivada de <code>4x³</code>: bajamos el 3 multiplicando y restamos 1 al exponente ⟹ <code>4 × 3x² = 12x²</code>.',
          'Derivada de <code>-5x²</code>: bajamos el 2 ⟹ <code>-5 × 2x¹ = -10x</code>.',
          'Derivada de <code>+7x</code>: la derivada de x es 1 ⟹ <code>7 × 1 = 7</code>.',
          'Derivada de <code>-9</code>: la derivada de cualquier número constante es 0.',
          'Unimos todos los términos derivados: <code>f\'(x) = 12x² - 10x + 7</code>.'
        ],
        result: "f'(x) = 12x² - 10x + 7"
      },
      pitfalls: [
        'En la regla del producto, sumar derivadas sin multiplicar por la otra función: <code>(uv)\' ≠ u\'v\'</code>.',
        'Olvidar derivar la función interna en la regla de la cadena.'
      ],
      goldenTip: 'Para calcular la pendiente en un punto específico (ej. en x = 2), simplemente sustituyes el 2 en tu fórmula derivada: <code>m = f\'(2)</code>.'
    },
    {
      id: 'limites_indeterminacion_00',
      title: 'Límites e Indeterminaciones del Tipo 0/0',
      category: 'Cálculo Diferencial',
      badge: 'Cálculo',
      keywords: ['limites', 'indeterminacion', 'cero sobre cero', '0/0', 'lhopital', 'factorizacion limites', 'limite'],
      concept: `Al evaluar un límite reemplazando el valor de <code>x</code>, con frecuencia se obtiene la expresión <code>0/0</code>. Esto <strong>NO significa que el límite no exista ni que sea 0</strong>: es una <strong>indeterminación</strong> que oculta un "agujero" algebraico que debe levantarse mediante factorización, racionalización o la Regla de L'Hôpital.`,
      formulas: [
        'Paso 1: Evaluar f(a). Si da 0/0, proceder a factorizar.',
        'Paso 2: Cancelar el binomio problemático (x - a) del numerador y denominador.',
        'Paso 3: Volver a evaluar el límite en la expresión simplificada.',
        'Regla de L\'Hôpital: lim [ f(x)/g(x) ] = lim [ f\'(x)/g\'(x) ] cuando da 0/0'
      ],
      example: {
        statement: 'Calcular: <code>lim (x → 3) [ (x² - 9) / (x - 3) ]</code>',
        steps: [
          'Evaluación directa: <code>(3² - 9) / (3 - 3) = (9 - 9) / 0 = 0/0</code> (Indeterminación).',
          'Factorizamos el numerador por Diferencia de Cuadrados: <code>x² - 9 = (x - 3)(x + 3)</code>.',
          'Reescribimos el límite cancelando el factor <code>(x - 3)</code>:<br><code>lim (x → 3) [ (x - 3)(x + 3) / (x - 3) ] = lim (x → 3) [ x + 3 ]</code>.',
          'Evaluamos con <code>x = 3</code>: <code>3 + 3 = 6</code>.'
        ],
        result: 'El límite vale exactamente 6'
      },
      pitfalls: [
        'Decir que 0/0 es igual a 0 o a 1: 0/0 puede valer cualquier número según las funciones que interactúan.'
      ],
      goldenTip: 'Si hay raíces cuadradas en la indeterminación 0/0, multiplica numerador y denominador por el BINOMIO CONJUGADO para racionalizar.'
    },
    {
      id: 'que_es_una_integral',
      title: '¿Qué es una Integral y el Teorema Fundamental del Cálculo?',
      category: 'Cálculo Integral',
      badge: 'Cálculo',
      keywords: ['integral', 'integrales', 'antiderivada', 'calculo integral', 'area bajo la curva', 'teorema fundamental del calculo', 'integracion por partes'],
      concept: `La <strong>integración</strong> es el proceso inverso a la derivación. Geométricamente, la <strong>integral definida</strong> representa el <strong>área neta bajo la curva</strong> acumulada por una función entre dos límites <code>a</code> y <code>b</code> mediante una suma infinita de rectángulos infinitesimales (Sumas de Riemann).`,
      formulas: [
        'Integral Indefinida de la Potencia: ∫ xⁿ dx = ( xⁿ⁺¹ / (n + 1) ) + C  (para n ≠ -1)',
        'Caso especial n = -1: ∫ (1/x) dx = ln|x| + C',
        'Exponencial: ∫ eˣ dx = eˣ + C',
        'Teorema Fundamental del Cálculo: ∫[a, b] f(x) dx = F(b) - F(a)',
        'Integración por partes: ∫ u dv = u·v - ∫ v du  ("Un Día Vi Una Vaca Vestida De Uniforme")'
      ],
      example: {
        statement: 'Calcular el área bajo la curva de <code>f(x) = 3x²</code> entre <code>x = 1</code> y <code>x = 3</code>',
        steps: [
          'Calculamos la antiderivada: <code>∫ 3x² dx = 3 · (x³ / 3) = x³</code>.',
          'Aplicamos la regla de Barrow evaluando en los límites [1, 3]:<br>• Límite superior: <code>F(3) = 3³ = 27</code><br>• Límite inferior: <code>F(1) = 1³ = 1</code>',
          'Restamos superior menos inferior: <code>27 - 1 = 26</code> unidades cuadradas.'
        ],
        result: '26 unidades cuadradas de área exacta'
      },
      pitfalls: [
        'Olvidar colocar la constante de integración <code>+ C</code> en integrales indefinidas.',
        'Invertir los límites de integración: siempre se resta <code>F(superior) − F(inferior)</code>.'
      ],
      goldenTip: 'Para comprobar si integraste bien, simplemente deriva tu resultado: debes obtener exactamente la función que estaba dentro de la integral.'
    },

    // ---------------- ÁLGEBRA LINEAL & VECTORES ----------------
    {
      id: 'vectores_producto_punto',
      title: 'Vectores: Magnitud, Dirección y Producto Punto / Escalar',
      category: 'Álgebra Lineal & Física',
      badge: 'Vectores',
      keywords: ['vectores', 'producto punto', 'producto escalar', 'magnitud', 'angulo entre vectores', 'vectores ortogonales', 'perpendiculares'],
      concept: `Un <strong>vector</strong> es un objeto matemático que posee <strong>magnitud (longitud)</strong>, <strong>dirección (ángulo)</strong> y sentido. El <strong>Producto Punto (Escalar)</strong> multiplica dos vectores dando como resultado un número real (escalar) que mide qué tan alineados apuntan ambos vectores.`,
      formulas: [
        'Magnitud de u = (u₁, u₂): ||u|| = √(u₁² + u₂²)',
        'Producto Punto Algebraico: u · v = u₁v₁ + u₂v₂',
        'Producto Punto Geométrico: u · v = ||u|| · ||v|| · cos(θ)',
        'Condición de Perpendicularidad / Ortogonalidad: u · v = 0 ⟺ Ángulo θ = 90°'
      ],
      example: {
        statement: 'Dados los vectores <code>u = (3, 4)</code> y <code>v = (4, -3)</code>, calcular su producto punto y determinar si son perpendiculares',
        steps: [
          'Multiplicamos componentes homólogas: <code>(3)(4) + (4)(-3)</code>.',
          'Operamos: <code>12 + (-12) = 12 - 12 = 0</code>.',
          'Como el producto punto es exactamente <strong>0</strong>, el ángulo entre ellos es 90°.'
        ],
        result: 'u · v = 0 (Son perpendiculares u ⊥ v)'
      },
      pitfalls: [
        'Confundir producto punto (da un escalar) con producto cruz (da un vector perpendicular en 3D).',
        'Sumar componentes en vez de multiplicarlas.'
      ],
      goldenTip: 'Si quieres saber el ángulo entre dos vectores cualesquiera, despeja el coseno: <code>cos(θ) = (u · v) / (||u|| · ||v||)</code>.'
    },

    // ---------------- PROBABILIDAD & COMBINATORIA ----------------
    {
      id: 'permutaciones_combinaciones',
      title: 'Combinatoria: Permutaciones vs Combinaciones',
      category: 'Probabilidad & Estadística',
      badge: 'Probabilidad',
      keywords: ['probabilidad', 'combinatoria', 'permutaciones', 'combinaciones', 'factorial', 'orden importa', 'tecnicas de conteo'],
      concept: `Ambas técnicas calculan el número de formas posibles de agrupar <code>r</code> elementos de un total de <code>n</code> disponibles. La única pregunta que debes hacerte para elegir la correcta es: <strong>¿IMPORTA EL ORDEN?</strong><br>
      • <strong>PERMUTACIONES:</strong> El orden SÍ importa (código de candado, podio de carreras 1º-2º-3º).<br>
      • <strong>COMBINACIONES:</strong> El orden NO importa (ensalada de frutas, equipo de trabajo, mano de cartas).`,
      formulas: [
        'Factorial: n! = n × (n - 1) × ... × 2 × 1  (con 0! = 1)',
        'Permutaciones (Orden SÍ importa): P(n, r) = n! / (n - r)!',
        'Combinaciones (Orden NO importa): C(n, r) = n! / [ r! · (n - r)! ]',
        'Regla de Laplace: P(A) = Casos Favorables / Casos Posibles'
      ],
      example: {
        statement: 'En un grupo de 5 personas, ¿cuántos comités de 3 personas se pueden formar?',
        steps: [
          'Pregunta clave: ¿Importa el orden en un comité? No, Juan-Ana-Pedro es el mismo comité que Pedro-Ana-Juan. Usamos <strong>Combinaciones</strong>.',
          'Datos: <code>n = 5</code>, <code>r = 3</code>.',
          'Fórmula: <code>C(5, 3) = 5! / [ 3! × (5 - 3)! ] = 5! / [ 3! × 2! ]</code>.',
          'Desarrollamos factoriales cancelando el 3!: <code>(5 × 4 × 3!) / (3! × 2 × 1) = (5 × 4) / 2 = 20 / 2 = 10</code>.'
        ],
        result: 'Se pueden formar 10 comités diferentes'
      },
      pitfalls: [
        'Llamar "combinación" al candado: en un candado numérico "123" no es lo mismo que "321", por tanto matemáticamente es una PERMUTACIÓN.'
      ],
      goldenTip: 'Las combinaciones siempre dan un número menor o igual que las permutaciones, porque eliminan las repeticiones causadas por el orden.'
    },

    // ---------------- ENIGMAS & PARADOJAS MATEMÁTICAS ----------------
    {
      id: 'por_que_no_dividir_cero',
      title: '¿Por qué es Imposible Dividir entre Cero?',
      category: 'Fundamentos de las Matemáticas',
      badge: 'Enigma',
      keywords: ['dividir entre cero', 'division por cero', 'dividir por cero', 'porque no se puede dividir entre cero', 'indefinido cero'],
      concept: `Dividir entre cero no es simplemente una regla arbitraria de los profesores: es una <strong>imposibilidad lógica</strong> que destruiría la estructura completa del sistema numérico.`,
      formulas: [
        'Definición de división: a ÷ b = c  significa que  c × b = a',
        'Caso 1 (Número entre cero, ej. 5 / 0): Buscamos un número "c" tal que c × 0 = 5. Como cualquier número por cero da 0, ¡NO EXISTE tal número! Por eso es INDEFINIDO.',
        'Caso 2 (Cero entre cero, 0 / 0): Buscamos "c" tal que c × 0 = 0. Cualquier número cumple (1×0=0, 7×0=0, 99×0=0). ¡TIENE INFINITAS RESPUESTAS! Por eso es INDETERMINADO.'
      ],
      example: {
        statement: '¿Qué pasaría si permitiéramos dividir entre cero?',
        steps: [
          'Supongamos que <code>a = b</code> (con <code>a ≠ 0</code>).',
          'Multiplicamos por a: <code>a² = ab</code>.',
          'Restamos b² a ambos lados: <code>a² - b² = ab - b²</code>.',
          'Factorizamos: <code>(a + b)(a - b) = b(a - b)</code>.',
          'Si "dividimos" entre <code>(a - b)</code>: <code>a + b = b</code>.',
          'Como <code>a = b</code>, sustituimos: <code>b + b = b ⟹ 2b = b</code>.',
          'Dividiendo entre b: <strong>2 = 1</strong> (¡Una aberración matemática!).',
          '¿Dónde estuvo la trampa? Al dividir entre <code>(a - b)</code>, como <code>a = b</code>, ¡se dividió entre CERO!'
        ],
        result: 'Dividir entre cero generaría falacias donde cualquier número es igual a cualquier otro'
      },
      pitfalls: [
        'Confundir <code>0 / 5</code> con <code>5 / 0</code>: Cero dividido entre cualquier número da <strong>0</strong> (cero caramelos entre 5 amigos = 0 caramelos a cada uno). Pero <code>5 / 0</code> no se puede calcular.'
      ],
      goldenTip: 'En cálculo, no dividimos entre cero: nos ACERCAMOS a cero con límites. Y al dividir entre números infinitamente pequeños, el resultado se dispara hacia el infinito (∞).'
    },
    {
      id: 'por_que_elevado_cero_es_uno',
      title: '¿Por qué cualquier número elevado a la 0 es igual a 1 (a⁰ = 1)?',
      category: 'Aritmética & Álgebra',
      badge: 'Enigma',
      keywords: ['elevado a la cero', 'potencia cero', 'a^0 = 1', 'porque todo numero a la 0 da 1', 'exponente cero'],
      concept: `La regla <code>a⁰ = 1</code> (para todo <code>a ≠ 0</code>) no es un capricho memorístico: es una consecuencia matemática obligatoria para mantener coherentes las <strong>leyes de los exponentes</strong>.`,
      formulas: [
        'Ley de cociente de potencias de igual base: aⁿ / aᵐ = aⁿ⁻ᵐ',
        'Si hacemos n = m: aⁿ / aⁿ = aⁿ⁻ⁿ = a⁰',
        'Pero cualquier número no nulo dividido entre sí mismo es 1: aⁿ / aⁿ = 1',
        'Por lo tanto, por transitividad: a⁰ = 1'
      ],
      example: {
        statement: 'Demostrar que <code>2⁰ = 1</code> usando potencias sucesivas',
        steps: [
          'Observemos el patrón de dividir entre 2 en cada paso hacia abajo:<br>• <code>2⁴ = 16</code><br>• <code>2³ = 8</code> (16 ÷ 2)<br>• <code>2² = 4</code> (8 ÷ 2)<br>• <code>2¹ = 2</code> (4 ÷ 2)',
          'Siguiendo exactamente la misma lógica matemática, para dar el siguiente paso bajando a la potencia 0:<br>• <code>2⁰ = 2 ÷ 2 = 1</code>.',
          'Y continuando hacia exponentes negativos:<br>• <code>2⁻¹ = 1 ÷ 2 = 1/2</code>.'
        ],
        result: '2⁰ = 1 por perfecta continuidad matemática'
      },
      pitfalls: [
        'La excepción singular: <code>0⁰</code> (cero elevado a la cero) se considera una <strong>indeterminación</strong> en el cálculo porque entran en conflicto dos reglas (0 a cualquier potencia es 0 vs cualquier número a la 0 es 1).'
      ],
      goldenTip: 'Piensa en las potencias como una multiplicación que parte siempre del número 1 (el elemento neutro multiplicativo): <code>a³ = 1 × a × a × a</code>. Por ende, <code>a⁰ = 1</code> (el 1 multiplicado por "cero factores de a").'
    },
    {
      id: 'por_que_menos_por_menos_mas',
      title: '¿Por qué Menos por Menos da Más [ (−) × (−) = (+) ]?',
      category: 'Fundamentos Aritméticos',
      badge: 'Enigma',
      keywords: ['menos por menos', 'ley de signos', 'porque menos por menos es mas', 'signos multiplicacion'],
      concept: `La regla <code>(-a) × (-b) = +ab</code> es la única forma de que la aritmética de los números enteros respete la <strong>Propiedad Distributiva</strong>. Sin ella, el álgebra colapsaría.`,
      formulas: [
        'Propiedad Distributiva: x · (y + z) = x·y + x·z',
        'Elemento inverso aditivo: b + (-b) = 0',
        'Multiplicar por (-a): (-a) · [ b + (-b) ] = (-a) · 0 = 0',
        'Distribuyendo: [ (-a) · b ] + [ (-a) · (-b) ] = 0',
        'Como (-a) · b = -ab:  -ab + [ (-a) · (-b) ] = 0',
        'Sumando +ab a ambos lados: (-a) · (-b) = +ab'
      ],
      example: {
        statement: 'Analogía intuitiva de la vida real con deudas o video',
        steps: [
          '<strong>Analogía del Video:</strong> Imagina una película de alguien caminando hacia atrás (-). Si pones la película en reversa (-), verás a la persona caminando hacia adelante (+). ¡Invertir una inversión es avanzar!',
          '<strong>Analogía Financiera:</strong> Si te "quitan" (-) una "deuda" (-), tu patrimonio neto AUMENTA (+).'
        ],
        result: '(-)(-) = (+) tanto por rigor axiomático como por intuición lógica'
      },
      pitfalls: [
        'Confundir suma con multiplicación: <code>(-3) + (-5) = -8</code> (debes 3 y debes 5, debes 8). Pero <code>(-3) × (-5) = +15</code>.'
      ],
      goldenTip: 'Signos iguales multiplicados dan positivo; signos diferentes multiplicados dan negativo.'
    },
    {
      id: 'que_es_pi_y_euler',
      title: 'Las Constantes Trascendentes: Pi (π) y el Número de Euler (e)',
      category: 'Constantes Universales',
      badge: 'Constantes',
      keywords: ['numero pi', 'que es pi', 'numero de euler', 'que es e', 'constantes matematicas', 'euler', 'identidad de euler'],
      concept: `Son los dos números irracionales más trascendentes del universo:<br>
      • <strong>Pi (π ≈ 3.14159...):</strong> La razón constante entre la circunferencia (perímetro) y el diámetro de cualquier círculo en el universo.<br>
      • <strong>Euler (e ≈ 2.71828...):</strong> La base del crecimiento exponencial continuo natural y los logaritmos neperianos.`,
      formulas: [
        'Definición de π: π = Circunferencia / Diámetro',
        'Definición de e: e = lim(n → ∞) [ 1 + (1 / n) ]ⁿ',
        'La fórmula más bella del mundo (Identidad de Euler): e^(i·π) + 1 = 0 (reúne a e, i, π, 1 y 0)'
      ],
      example: {
        statement: 'Calcular el perímetro y área de un círculo de radio <code>r = 5 cm</code>',
        steps: [
          'Perímetro (Circunferencia): <code>P = 2 · π · r = 2 · π · 5 = 10π ≈ 31.416 cm</code>.',
          'Área del círculo: <code>A = π · r² = π · (5)² = 25π ≈ 78.54 cm²</code>.'
        ],
        result: 'Perímetro ≈ 31.42 cm | Área ≈ 78.54 cm²'
      },
      pitfalls: [
        'Creer que π es exactamente 3.14 o 22/7: π tiene infinitos decimales no periódicos que jamás se repiten en un patrón.'
      ],
      goldenTip: 'El número e es la tasa máxima de crecimiento compuesto que puede existir en la naturaleza y en las finanzas.'
    },
    {
      id: 'numeros_complejos_imaginarios',
      title: 'Números Imaginarios (i) y el Plano Complejo (ℂ)',
      category: 'Álgebra Superior',
      badge: 'Complejos',
      keywords: ['numeros complejos', 'imaginarios', 'numero i', 'raiz negativa', 'plano complejo', 'complejos'],
      concept: `Los <strong>números imaginarios</strong> nacen para dar solución a ecuaciones como <code>x² + 1 = 0</code>, que exigirían calcular la raíz de un número negativo. Se define la unidad imaginaria como <code>i = √(-1)</code>, con lo cual <code>i² = -1</code>. Un número complejo combina una parte real y una imaginaria: <code>z = a + bi</code>.`,
      formulas: [
        'Unidad imaginaria: i = √(-1)  y  i² = -1',
        'Ciclo de potencias de i: i¹ = i, i² = -1, i³ = -i, i⁴ = 1',
        'Forma binómica: z = a + bi  (a = parte real, b = parte imaginaria)',
        'Módulo: |z| = √(a² + b²)'
      ],
      example: {
        statement: 'Calcular las soluciones de <code>x² + 9 = 0</code>',
        steps: [
          'Despejamos <code>x² = -9</code>.',
          'Extraemos raíz cuadrada a ambos lados: <code>x = ± √(-9)</code>.',
          'Descomponemos la raíz usando propiedades de radicales: <code>√(-9) = √(9 × -1) = √9 × √(-1) = 3i</code>.',
          'Obtenemos dos soluciones imaginarias conjugadas: <code>x₁ = +3i</code> y <code>x₂ = -3i</code>.'
        ],
        result: 'x = ± 3i'
      },
      pitfalls: [
        'Creer que los números imaginarios no existen en la vida real: son la base indispensable de la ingeniería eléctrica, telecomunicaciones, señales de audio, física cuántica y radar.'
      ],
      goldenTip: 'Para cualquier potencia alta de i (ej. i²⁷), simplemente divide el exponente entre 4 y quédate con el residuo: 27 ÷ 4 da residuo 3, por tanto i²⁷ = i³ = -i.'
    },

    // ========================================================================
    // QUÍMICA & LA MATERIA Y SUS INTERACCIONES (CBTIS 1er Semestre & Prepa)
    // ========================================================================
    {
      id: 'quimica_enlaces_quimicos',
      title: 'Enlaces Químicos: Iónico, Covalente y Metálico (Regla del Octeto)',
      category: 'Química & La Materia y sus Interacciones (CBTIS 1er Semestre)',
      badge: 'Química CBTIS',
      keywords: ['enlace quimico', 'enlaces quimicos', 'enlace ionico', 'enlace covalente', 'enlace metalico', 'covalente polar', 'covalente no polar', 'regla del octeto', 'electronegatividad', 'lewis', 'enlaces'],
      concept: `Un <strong>enlace químico</strong> es la fuerza electromagnética que mantiene unidos a los átomos para formar moléculas y redes cristalinas más estables, buscando completar 8 electrones en su último nivel de energía (<strong>Regla del Octeto de Gilbert N. Lewis</strong>). La diferencia de electronegatividad (ΔEN) entre los elementos determina la naturaleza del enlace.`,
      formulas: [
        'Diferencia de Electronegatividad (ΔEN) = EN_mayor - EN_menor',
        '• ΔEN ≥ 1.7 ➔ Enlace IÓNICO (transferencia total de electrones: Metal + No metal, ej. NaCl, KBr)',
        '• 0.4 < ΔEN < 1.7 ➔ Enlace COVALENTE POLAR (compartición desigual con polos δ+ y δ-, ej. H₂O, HCl)',
        '• ΔEN ≤ 0.4 ➔ Enlace COVALENTE NO POLAR / PURO (compartición simétrica, ej. O₂, CH₄, Cl₂)',
        '• Metal + Metal ➔ Enlace METÁLICO (red de cationes inmersos en un mar de electrones deslocalizados)'
      ],
      example: {
        statement: 'Determinar el tipo de enlace entre el Sodio (Na, EN = 0.93) y el Cloro (Cl, EN = 3.16)',
        steps: [
          '1. Consultar la electronegatividad de Pauling en la tabla periódica: EN(Na) = 0.93 y EN(Cl) = 3.16.',
          '2. Calcular la diferencia: ΔEN = 3.16 - 0.93 = 2.23.',
          '3. Evaluar el criterio: Dado que 2.23 > 1.7 y la unión ocurre entre un metal alcalino y un halógeno no metal, el sodio cede su único electrón de valencia (formando Na⁺) y el cloro lo acepta completando su octeto (formando Cl⁻).'
        ],
        result: 'Enlace Iónico (formación de la sal común o cloruro de sodio, NaCl)'
      },
      pitfalls: [
        'Creer que en el enlace covalente se transfieren electrones: en el covalente los electrones SIEMPRE se comparten.',
        'Olvidar que el Hidrógeno (H) solo requiere 2 electrones (regla del dueto) para asemejarse al gas noble Helio.',
        'Confundir enlaces interatómicos (iónico, covalente) con fuerzas intermoleculares (puentes de hidrógeno, Van der Waals).'
      ],
      goldenTip: 'En exámenes del CBTIS, si ves un metal junto a un no metal (ej. CaO, MgCl₂), casi siempre es iónico; si solo hay no metales (ej. CO₂, NH₃), es covalente.'
    },
    {
      id: 'quimica_balanceo_ecuaciones',
      title: 'Balanceo de Ecuaciones Químicas por Tanteo (Ley de Lavoisier)',
      category: 'Química & Reacciones (CBTIS 1er Semestre)',
      badge: 'Química CBTIS',
      keywords: ['balanceo', 'balancear ecuacion', 'balanceo por tanteo', 'conservacion de la masa', 'lavoisier', 'coeficientes estequiometricos', 'reactivos y productos', 'reaccion quimica'],
      concept: `La <strong>Ley de Conservación de la Masa</strong> (Antoine Lavoisier) postula que <em>"en una reacción química la materia no se crea ni se destruye, solo se transforma"</em>. Por consiguiente, el número de átomos de cada elemento presente en los reactivos (lado izquierdo) debe ser rigurosamente igual al de los productos (lado derecho).`,
      formulas: [
        'Orden mnemotécnico infalible para balancear por tanteo: 1º Metales ➔ 2º No Metales ➔ 3º Hidrógenos (H) ➔ 4º Oxígenos (O al final)',
        'Regla de Oro: Solo se pueden cambiar los COEFICIENTES estequiométricos (los números grandes a la izquierda de la fórmula). ¡JAMÁS modifiques los subíndices químicos!'
      ],
      example: {
        statement: 'Balancear por tanteo la reacción de combustión del gas propano: <code>C₃H₈ + O₂ ➔ CO₂ + H₂O</code>',
        steps: [
          '<strong>Paso 1 (No metales - Carbono):</strong> En reactivos hay 3 carbonos (C₃H₈). En productos hay 1 en CO₂. Colocamos coeficiente 3 frente a CO₂: <code>C₃H₈ + O₂ ➔ 3 CO₂ + H₂O</code>.',
          '<strong>Paso 2 (Hidrógenos):</strong> En reactivos hay 8 hidrógenos (C₃H₈). En productos hay 2 en H₂O. Colocamos coeficiente 4 frente a H₂O (4 × 2 = 8): <code>C₃H₈ + O₂ ➔ 3 CO₂ + 4 H₂O</code>.',
          '<strong>Paso 3 (Oxígenos al final):</strong> Contamos los átomos de O en productos: (3 × 2 en CO₂) + (4 × 1 en H₂O) = 6 + 4 = 10 oxígenos. Como en reactivos tenemos O₂, colocamos coeficiente 5 (5 × 2 = 10): <code>C₃H₈ + 5 O₂ ➔ 3 CO₂ + 4 H₂O</code>.'
        ],
        result: '<code>C₃H₈ + 5 O₂ ➔ 3 CO₂ + 4 H₂O</code> (Comprobación: 3 C, 8 H, 10 O en ambos lados)'
      },
      pitfalls: [
        'Modificar los subíndices de la fórmula (ej. escribir H₈O en lugar de 4 H₂O): alterar los subíndices crea sustancias químicas inexistentes o venenosas.',
        'No multiplicar el coeficiente por todos los elementos del compuesto (el 3 en 3 CO₂ afecta tanto al C como al O).'
      ],
      goldenTip: 'Deja siempre el oxígeno para el final. Al cuadrar metales, no metales e hidrógenos, el oxígeno casi siempre queda balanceado por sí solo.'
    },
    {
      id: 'quimica_tabla_periodica',
      title: 'Tabla Periódica: Grupos, Periodos y Configuración Electrónica',
      category: 'Química & Estructura de la Materia',
      badge: 'Química CBTIS',
      keywords: ['tabla periodica', 'grupos', 'periodos', 'metales', 'no metales', 'gases nobles', 'configuracion electronica', 'aufbau', 'regla de las diagonales', 'numero atomico', 'electrones de valencia'],
      concept: `La <strong>Tabla Periódica Moderna</strong> clasifica los 118 elementos químicos en orden creciente de su <strong>número atómico (Z)</strong>. Se estructura en 7 periodos (filas horizontales = niveles principales de energía 'n') y 18 grupos o familias (columnas verticales = elementos con igual número de electrones de valencia y comportamiento químico análogo).`,
      formulas: [
        'Z = Número de protones = Número de electrones (en átomo neutro)',
        'A (Masa Atómica) = Protones (Z) + Neutrones (N) ➔ N = A - Z',
        'Regla de Aufbau (Mnemotecnia de las diagonales): 1s² ➔ 2s² ➔ 2p⁶ ➔ 3s² ➔ 3p⁶ ➔ 4s² ➔ 3d¹⁰ ➔ 4p⁶ ➔ 5s²...',
        'Capacidad máxima por subnivel: s = 2 e⁻, p = 6 e⁻, d = 10 e⁻, f = 14 e⁻'
      ],
      example: {
        statement: 'Escribir la configuración electrónica completa del Sodio (Na, Z = 11) e identificar su periodo y grupo',
        steps: [
          '1. Distribuir los 11 electrones siguiendo el diagrama de las diagonales: <code>1s² 2s² 2p⁶ 3s¹</code> (Suma: 2 + 2 + 6 + 1 = 11 e⁻).',
          '2. Identificar el máximo nivel cuántico principal alcanzado: n = 3, por lo tanto pertenece al <strong>Periodo 3</strong>.',
          '3. Contar los electrones en la última capa (electrones de valencia): tiene 1 electrón en el nivel 3 (3s¹), por lo tanto pertenece al <strong>Grupo 1 (Familia IA de Metales Alcalinos)</strong>.'
        ],
        result: 'Configuración: 1s² 2s² 2p⁶ 3s¹ (o [Ne] 3s¹). Periodo 3, Grupo 1 (Alcalinos).'
      },
      pitfalls: [
        'Llenar el subnivel 3d antes del 4s: el subnivel 4s tiene menor energía que el 3d, por lo que se llena primero según el principio de Aufbau.',
        'Confundir masa atómica (con decimales por el promedio de isótopos) con número másico A (número entero de nucleones).'
      ],
      goldenTip: 'Los elementos de un mismo grupo o familia tienen los mismos electrones en su capa externa; por eso el litio, sodio y potasio reaccionan violentamente con el agua de forma similar.'
    },

    // ========================================================================
    // FÍSICA & CONSERVACIÓN DE LA ENERGÍA (CBTIS & Preparatoria)
    // ========================================================================
    {
      id: 'fisica_leyes_newton',
      title: 'Las 3 Leyes del Movimiento de Isaac Newton',
      category: 'Física Clásica & Dinámica (CBTIS)',
      badge: 'Física CBTIS',
      keywords: ['leyes de newton', 'newton', 'primera ley de newton', 'segunda ley de newton', 'tercera ley de newton', 'fuerza', 'f=ma', 'inercia', 'accion y reaccion', 'peso'],
      concept: `Las <strong>Leyes de Newton</strong> describen la relación matemática fundamental entre las fuerzas que interactúan sobre un objeto y el movimiento acelerado que este adquiere. Son la base de toda la ingeniería mecánica, automotriz, aeroespacial y de construcción civil.`,
      formulas: [
        '1ª Ley (Inercia): Si ΣF = 0 ➔ v = constante (un cuerpo permanece en reposo o en velocidad constante a menos que una fuerza neta externa actúe sobre él)',
        '2ª Ley (Fuerza y Aceleración): F = m · a  (Fuerza en Newtons [N], masa en [kg], aceleración en [m/s²])',
        '3ª Ley (Acción y Reacción): F_A➔B = - F_B➔A (A toda acción le corresponde una reacción de igual magnitud, misma dirección y sentido contrario en cuerpos distintos)',
        'Peso o Fuerza Gravitatoria: P = m · g (donde g ≈ 9.81 m/s² en la superficie terrestre)'
      ],
      example: {
        statement: '¿Qué fuerza constante debe aplicar el motor de un automóvil de 1,200 kg para acelerar desde el reposo a razón de 3 m/s²?',
        steps: [
          '1. Identificar datos conocidos: masa m = 1200 kg; aceleración deseada a = 3 m/s².',
          '2. Aplicar la Segunda Ley de Newton: <code>F = m · a</code>.',
          '3. Sustituir valores numéricos: <code>F = (1200 kg) × (3 m/s²) = 3600 kg·m/s²</code>.',
          '4. Recordar la definición de unidad del Sistema Internacional: 1 kg·m/s² = 1 Newton (N).'
        ],
        result: 'Fuerza neta F = 3,600 N (Newtons)'
      },
      pitfalls: [
        'Confundir masa con peso: tu masa (ej. 60 kg) es la misma en la Tierra y en la Luna; tu peso (P = m·g) cambia porque la gravedad lunar es 6 veces menor.',
        'Pensar que acción y reacción se cancelan: no se anulan porque actúan sobre cuerpos diferentes (ej. el pie empuja al balón hacia adelante y el balón empuja al pie hacia atrás).'
      ],
      goldenTip: 'Siempre dibuja un Diagrama de Cuerpo Libre (DCL): aísla el cuerpo, ubica las flechas de fuerza en los ejes X e Y, y aplica ΣF = m·a para cada eje por separado.'
    },
    {
      id: 'fisica_cinematica_mru_mrua',
      title: 'Cinemática: Movimiento Rectilíneo Uniforme (MRU) y Acelerado (MRUA)',
      category: 'Física & Mecánica (CBTIS)',
      badge: 'Física CBTIS',
      keywords: ['mru', 'mrua', 'cinematica', 'velocidad', 'aceleracion', 'distancia', 'tiempo', 'caida libre', 'movimiento rectilineo', 'gravedad'],
      concept: `La <strong>cinemática</strong> estudia el movimiento de los cuerpos sin atender a las causas (fuerzas) que lo producen. En el <strong>MRU</strong> la velocidad permanece inalterable (aceleración = 0). En el <strong>MRUA</strong> la velocidad varía uniformemente en el tiempo debido a una aceleración constante, como ocurre en la <strong>caída libre</strong> bajo la gravedad terrestre (g = 9.8 m/s²).`,
      formulas: [
        'MRU: v = d / t  ➔  d = v · t  ➔  t = d / v',
        'MRUA 1 (Velocidad final): v_f = v_0 + a · t',
        'MRUA 2 (Distancia recorrida): d = v_0 · t + ½ · a · t²',
        'MRUA 3 (Sin tiempo): v_f² = v_0² + 2 · a · d',
        'Conversión de unidades: km/h ÷ 3.6 = m/s  |  m/s × 3.6 = km/h'
      ],
      example: {
        statement: 'Un tráiler parte del reposo (v_0 = 0) en la autopista Reynosa-Monterrey y acelera a 2 m/s² durante 6 segundos. ¿Qué velocidad alcanza y qué distancia recorre?',
        steps: [
          '1. Velocidad final: <code>v_f = v_0 + a · t = 0 + (2 m/s² × 6 s) = 12 m/s</code>.',
          '2. Para convertir a km/h multiplicamos por 3.6: <code>12 × 3.6 = 43.2 km/h</code>.',
          '3. Distancia recorrida: <code>d = v_0 · t + ½ · a · t² = 0 + 0.5 × (2 m/s²) × (6 s)² = 1 × 36 = 36 metros</code>.'
        ],
        result: 'Velocidad = 12 m/s (43.2 km/h) | Distancia recorrida = 36 metros'
      },
      pitfalls: [
        'Olvidar elevar el tiempo al cuadrado en ½·a·t²: (6 s)² = 36 s², no 12.',
        'Mezclar km/h con segundos: antes de meter cualquier dato a las fórmulas, convierte SIEMPRE las velocidades a m/s.'
      ],
      goldenTip: 'Regla rápida: si un problema dice "parte del reposo", automáticamente v_0 = 0; si dice "se detiene o frena totalmente", entonces v_f = 0.'
    },
    {
      id: 'fisica_ley_ohm_circuitos',
      title: 'Ley de Ohm, Potencia Eléctrica y Circuitos en Serie y Paralelo',
      category: 'Física & Electricidad (CBTIS & Universidad)',
      badge: 'Física CBTIS',
      keywords: ['ley de ohm', 'ohm', 'voltaje', 'corriente', 'resistencia', 'amperios', 'voltios', 'circuito serie', 'circuito paralelo', 'potencia electrica', 'watts'],
      concept: `La <strong>Ley de Ohm</strong> (Georg Simon Ohm) gobierna el comportamiento de los circuitos eléctricos: la corriente (I, flujo de electrones) es directamente proporcional al voltaje aplicado (V, diferencia de potencial) e inversamente proporcional a la resistencia del conductor (R, oposición al flujo).`,
      formulas: [
        'Ley de Ohm: V = I · R  ➔  I = V / R  ➔  R = V / I  (V en Voltios, I en Amperios [A], R en Ohmios [Ω])',
        'Potencia Eléctrica (Ley de Joule): P = V · I = I² · R = V² / R  (en Watts o Vatios [W])',
        'Circuito en SERIE: R_eq = R₁ + R₂ + R₃ (misma corriente en todos los focos, si uno se funde se apagan todos)',
        'Circuito en PARALELO: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ (mismo voltaje en todas las ramas, como en las casas)'
      ],
      example: {
        statement: 'Una laptop conectada a la toma de corriente de 120 V consume 2.5 Amperios. ¿Cuál es su resistencia interna y qué potencia consume?',
        steps: [
          '1. Calcular la resistencia con la Ley de Ohm: <code>R = V / I = 120 V / 2.5 A = 48 Ω</code> (Ohmios).',
          '2. Calcular la potencia consumida: <code>P = V · I = 120 V × 2.5 A = 300 Watts (W)</code>.',
          '3. Expresar en kilowatts para recibo de CFE: 300 W = 0.3 kW.'
        ],
        result: 'Resistencia R = 48 Ω | Potencia P = 300 W (0.3 kW)'
      },
      pitfalls: [
        'Sumar resistencias en paralelo directamente: recuerda que en paralelo la resistencia total SIEMPRE es MENOR que la resistencia individual más pequeña.',
        'Confundir Amperios (corriente que fluye) con Voltios (fuerza o empuje eléctrico).'
      ],
      goldenTip: 'Recuerda el triángulo nemotécnico: "Victoria Reina de Inglaterra" (V arriba, R e I abajo). Tapa con tu dedo la letra que buscas y verás la fórmula exacta.'
    },

    // ========================================================================
    // LENGUA Y COMUNICACIÓN & NORMAS APA (CBTIS 1er Semestre & Prepa)
    // ========================================================================
    {
      id: 'lengua_reglas_acentuacion',
      title: 'Reglas de Acentuación RAE: Agudas, Graves, Esdrújulas y Acento Diacrítico',
      category: 'Lengua y Comunicación (CBTIS 1er Semestre)',
      badge: 'Español & APA',
      keywords: ['acentuacion', 'reglas de acentuacion', 'agudas', 'graves', 'llanas', 'esdrujulas', 'sobresdrujulas', 'tilde diacritica', 'hiato', 'diptongo', 'ortografia', 'rae', 'español'],
      concept: `En la lengua española, <strong>todas las palabras tienen acento prosódico</strong> (la sílaba tónica con mayor intensidad acústica), pero solo un grupo específico lleva <strong>tilde o acento ortográfico (´)</strong> según las normas oficiales de la RAE. El orden se determina contando las sílabas de derecha a izquierda con la regla mnemotécnica <strong>SEGA</strong>.`,
      formulas: [
        'Mnemotecnia SEGA (de derecha a izquierda):',
        '• [S] Sobresdrújulas (antes de antepenúltima sílaba) ➔ ¡SIEMPRE llevan tilde! (ej. cóm-pra-me-lo, trā-e-te-lo)',
        '• [E] Esdrújulas (antepenúltima sílaba) ➔ ¡SIEMPRE llevan tilde! (ej. má-qui-na, cé-lu-la, quí-mi-ca)',
        '• [G] Graves o Llanas (penúltima sílaba) ➔ Llevan tilde cuando terminan en consonante distinta de N, S o Vocal (ej. ár-bol, lá-piz, ca-rác-ter)',
        '• [A] Agudas (última sílaba) ➔ Llevan tilde cuando terminan en vocal o en las consonantes N o S (ej. can-ción, ca-fé, a-rro-z [no lleva tilde porque termina en Z])',
        '• Tilde Diacrítica: Distingue palabras de igual grafía: él (pronombre) / el (artículo); tú (pronombre) / tu (posesivo); más (cantidad) / mas (pero); sí (afirmación) / si (condición).'
      ],
      example: {
        statement: 'Clasificar silábicamente y justificar la acentuación de: "árbol", "canción", "fácilmente" y "examen"',
        steps: [
          '1. <strong>ár-bol:</strong> Tónica en "ár" (penúltima sílaba = Grave). Termina en consonante "L" (diferente de N, S o vocal) ➔ Lleva tilde.',
          '2. <strong>can-ción:</strong> Tónica en "ción" (última sílaba = Aguda). Termina en "N" ➔ Lleva tilde obligatoria.',
          '3. <strong>fá-cil-men-te:</strong> Adverbio en -mente. Mantiene la tilde de su adjetivo base "fácil" (Sobresdrújula) ➔ Lleva tilde.',
          '4. <strong>ex-a-men:</strong> Tónica en "a" (penúltima = Grave). Termina en "N" ➔ NO lleva tilde. (En cambio, su plural "exámenes" es esdrújula y sí lleva tilde).'
        ],
        result: 'árbol (grave con tilde) | canción (aguda con tilde) | fácilmente (sobresdrújula) | examen (grave sin tilde)'
      },
      pitfalls: [
        'Ponerle tilde a "examen", "imagen" o "origen": son palabras graves terminadas en N, por tanto jamás llevan tilde.',
        'Ponerle tilde a monosílabos sin función diacrítica: "ti", "fe", "dio", "vio", "fui" NUNCA llevan tilde en español moderno.'
      ],
      goldenTip: 'Aprende la palabra SEGA: escribe las letras S - E - G - A sobre las sílabas de tu palabra de derecha a izquierda y sabrás la categoría en 2 segundos.'
    },
    {
      id: 'lengua_normas_apa_7',
      title: 'Normas APA 7ª Edición: Citas en el Texto y Referencias Bibliográficas',
      category: 'Lengua y Comunicación & Metodología Académica',
      badge: 'Español & APA',
      keywords: ['apa', 'normas apa', 'apa 7', 'apa 7ma edicion', 'citar en apa', 'citas textuales', 'parafraseo', 'bibliografia', 'referencias', 'citas'],
      concept: `El manual de la <strong>American Psychological Association (APA 7ª edición)</strong> es el estándar científico internacional exigido en preparatoria y universidad para redactar informes, ensayos y tesis. Su propósito ético central es dar crédito explícito a las fuentes de información y evitar el plagio académico.`,
      formulas: [
        '1. Cita Textual Corta (< 40 palabras): Se incorpora en el párrafo entre comillas: "texto" (Apellido, Año, p. XX).',
        '2. Cita Textual Larga (≥ 40 palabras): Se escribe en bloque aparte con sangría izquierda de 1.27 cm, sin comillas e interlineado doble.',
        '3. Parafraseo: Explicar la idea con tus propias palabras: según Gómez (2022), las reacciones redox... o al final (Gómez, 2022).',
        '4. Formato de Referencias al final (con Sangría Francesa de 1.27 cm):',
        '• Libro: Apellido, A. A. (Año). <em>Título del libro en cursiva</em> (edición). Editorial.',
        '• Artículo: Apellido, A. A. (Año). Título del artículo. <em>Nombre de Revista en Cursiva</em>, volumen(número), páginas. https://doi.org/...',
        '• Página Web: Autor u Organización. (Fecha completa). <em>Título del artículo web</em>. Nombre del Sitio. URL'
      ],
      example: {
        statement: 'Cómo citar en APA 7 un libro de Química General de Chang y cómo redactar la referencia final',
        steps: [
          '1. Cita parentética dentro del párrafo: "La energía de enlace es la cantidad requerida para romper un mol de moléculas" (Chang & Goldsby, 2017, p. 384).',
          '2. Cita narrativa: Como afirman Chang y Goldsby (2017), el enlace covalente...',
          '3. Entrada completa en la lista de referencias al final del documento con sangría francesa:<br><code>Chang, R., & Goldsby, K. A. (2017). <em>Química</em> (12ª ed.). McGraw-Hill Education.</code>'
        ],
        result: 'Cita en texto: (Chang & Goldsby, 2017) | Referencia: Chang, R., & Goldsby, K. A. (2017). Química (12ª ed.). McGraw-Hill.'
      },
      pitfalls: [
        'Copiar y pegar solo el link de internet en la bibliografía: un link solo no es una referencia APA válida; siempre debe llevar autor, año y título.',
        'Confundir cita (mención corta en el cuerpo del texto) con referencia (ficha bibliográfica completa al final).'
      ],
      goldenTip: 'En APA 7ª edición ya NO se escribe la frase "Recuperado de:" antes de los enlaces web, ni se incluye la ciudad de la editorial.'
    },
    {
      id: 'lengua_ensayo_academico',
      title: 'Estructura y Redacción del Ensayo Académico Escolar y Universitario',
      category: 'Lengua y Comunicación (CBTIS 1er Semestre)',
      badge: 'Español & APA',
      keywords: ['ensayo', 'ensayo academico', 'como hacer un ensayo', 'estructura del ensayo', 'tesis', 'conectores', 'conclusion', 'redaccion', 'argumentacion'],
      concept: `El <strong>ensayo académico</strong> es un género textual en prosa donde el estudiante analiza, interpreta y defiende una postura fundamentada (llamada <strong>Tesis</strong>) sobre un tema científico, social o humanístico, utilizando argumentos racionales y evidencias verificables.`,
      formulas: [
        'Estructura Canónica en 3 Partes:',
        '1. Introducción (15% del texto): Gancho de apertura + delimitación del tema + planteamiento explícito de la TESIS (oración afirmativa que expresa tu postura defendible).',
        '2. Desarrollo Argumentativo (70% del texto): Párrafos estructurados (Idea temática + Evidencia o cita APA + Explicación y contraargumentación).',
        '3. Conclusión (15% del texto): Reafirmación sintética de la tesis con nuevas palabras + balance de argumentos + reflexión prospectiva final.',
        'Conectores argumentativos clave: <em>Por consiguiente, No obstante, En contraste, Sin embargo, Por ende, Asimismo</em>.'
      ],
      example: {
        statement: 'Estructurar la tesis y el plan de argumentos para un ensayo sobre tecnología en el CBTIS',
        steps: [
          '1. Tema delimitado: El impacto de la educación tecnológica en los bachilleratos de la frontera.',
          '2. Formulación de la Tesis (clara, directa y debatible): "La integración temprana de herramientas computacionales avanzadas en el primer semestre de preparatoria en el CBTIS 7 no solo combate el rezago académico en ciencias exactas, sino que resulta determinante para la inserción en la industria tecnológica de Reynosa".',
          '3. Argumento 1: Evidencia del aprendizaje activo en matemáticas y física.',
          '4. Argumento 2: Demanda laboral técnica en los parques industriales de Tamaulipas.',
          '5. Conclusión: Reafirmar la necesidad de capacitar a los jóvenes como agentes de cambio regional.'
        ],
        result: 'Esquema de ensayo balanceado, con tesis defendible y argumentos contextualizados.'
      },
      pitfalls: [
        'Confundir un ensayo con un resumen: un resumen dice lo que otros autores escribieron; un ensayo defiende TU propia postura con respaldo crítico.',
        'Escribir en primera persona informal ("Yo opino que...", "A mí me parece que..."): en preparatoria y universidad se redacta en tercera persona formal o impersonal ("Se argumenta que...", "La evidencia demuestra que...").'
      ],
      goldenTip: 'Dedica cada párrafo a una sola idea principal; si cambias de argumento o de enfoque, salta de inmediato a un nuevo párrafo.'
    },

    // ========================================================================
    // INGLÉS I A VI (CBTIS & Preparatoria / Universidad)
    // ========================================================================
    {
      id: 'ingles_verb_to_be',
      title: 'Verb To Be: Conjugation, Personal Pronouns & Sentence Formulas',
      category: 'Inglés I (CBTIS 1er Semestre)',
      badge: 'Inglés',
      keywords: ['verb to be', 'to be', 'am is are', 'was were', 'ingles', 'pronombres', 'personal pronouns', 'english grammar', 'verb'],
      concept: `El <strong>Verb To Be</strong> (traducido como 'Ser' o 'Estar') es el núcleo vertebral de la gramática inglesa. Es único porque cambia completamente según la persona gramatical y no necesita verbos auxiliares (como do/does) para formular preguntas o negaciones.`,
      formulas: [
        'Present Simple: I AM | You / We / They ARE | He / She / It IS',
        'Past Simple: I / He / She / It WAS | You / We / They WERE',
        'Estructura Afirmativa: Subject + Be + Complement (ej. She is an intelligent student)',
        'Estructura Negativa: Subject + Be + NOT + Complement (ej. He is not / isn\'t at school)',
        'Estructura Interrogativa (Inversión): BE + Subject + Complement? (ej. Are they in the classroom?)'
      ],
      example: {
        statement: 'Formar las 3 estructuras (afirmativa, negativa e interrogativa) para: "Mi hija estudia en la preparatoria CBTIS 7"',
        steps: [
          '1. Affirmative: <code>My daughter is a student at CBTIS 7 high school.</code> (Contracted: <code>My daughter\'s a student...</code>).',
          '2. Negative: <code>My daughter is not a student at CBTIS 7.</code> (Contracted: <code>My daughter isn\'t a student...</code>).',
          '3. Interrogative (inversión de sujeto y verbo to be): <code>Is your daughter a student at CBTIS 7?</code>',
          '4. Short Answers: <code>Yes, she is. / No, she isn\'t.</code>'
        ],
        result: 'Affirmative: She is... | Negative: She isn\'t... | Question: Is she...?'
      },
      pitfalls: [
        'Usar los auxiliares "do" o "does" con el verbo To Be (¡Error grave! No se dice "Do you be happy?", se dice "Are you happy?").',
        'Omitir el artículo "a / an" al referirse a profesiones u ocupaciones: en inglés es obligatorio decir "I am A student", nunca "I am student".'
      ],
      goldenTip: 'El verbo To Be es el rey de los verbos: él solo niega añadiendo "not" y él solo pregunta saltando al principio de la oración.'
    },
    {
      id: 'ingles_present_simple_continuous',
      title: 'Present Simple vs Present Continuous: Rules, -s endings & Uses',
      category: 'Inglés I & II (CBTIS)',
      badge: 'Inglés',
      keywords: ['present simple', 'present continuous', 'simple present', 'present progressive', 'do does', 'ing', 'adverbs of frequency', 'grammar rules'],
      concept: `El <strong>Present Simple</strong> se utiliza para describir hábitos, rutinas diarias, verdades científicas inmutables y horarios fijos. El <strong>Present Continuous</strong> (o progresivo) describe acciones que están ocurriendo en este preciso instante o situaciones temporales en desarrollo.`,
      formulas: [
        'Present Simple (Afirmativo): Sujeto + Verbo Base (añadir -s / -es / -ies en 3ª persona He/She/It)',
        'Present Simple (Negativo & Pregunta): Sujeto + DON\'T / DOESN\'T + Verbo Base | DO / DOES + Sujeto + Verbo Base?',
        'Present Continuous: Sujeto + AM / IS / ARE + Verbo terminado en -ING',
        'Pistas temporales (Time Markers):',
        '• Simple: always, usually, often, every day, on Mondays.',
        '• Continuous: now, right now, at the moment, currently, Look!, Listen!'
      ],
      example: {
        statement: 'Completar con el tiempo correcto: "Right now, Sofia _____ (solve) a physics problem, but she normally _____ (study) math on Tuesdays."',
        steps: [
          '1. Primera cláusula: "Right now" indica una acción en progreso ➔ Present Continuous ➔ <code>is solving</code>.',
          '2. Segunda cláusula: "normally" expresa una rutina habitual ➔ Present Simple. El sujeto es "she" (3ª persona singular), por lo que el verbo "study" cambia su "y" por "-ies" ➔ <code>studies</code>.'
        ],
        result: '"Right now, Sofia is solving a physics problem, but she normally studies math on Tuesdays."'
      },
      pitfalls: [
        'Olvidar la "-s" en 3ª persona afirmativa: se dice "He works", jamás "He work".',
        'Dejar la "-s" cuando ya está el auxiliar "does": "Does he work?" (correcto) vs "Does he works?" (¡error común!).'
      ],
      goldenTip: 'Cuando el auxiliar DOES o DOESN\'T entra por la puerta, la "-s" del verbo sale por la ventana (el verbo regresa a su forma natural).'
    },
    {
      id: 'ingles_conditionals',
      title: 'Conditional Sentences: Zero, First, Second & Third Conditionals',
      category: 'Inglés Intermedio & Avanzado (Bachillerato & Universidad)',
      badge: 'Inglés',
      keywords: ['conditionals', 'first conditional', 'second conditional', 'zero conditional', 'third conditional', 'if clause', 'would', 'will'],
      concept: `Las <strong>oraciones condicionales</strong> expresan relaciones de causa y efecto. Dependiendo del grado de certeza o de fantasía hipotética, el inglés emplea cuatro estructuras condicionales con fórmulas verbales exactas.`,
      formulas: [
        '• Zero Conditional (Verdades científicas y leyes 100% certeras): If + Present Simple, Present Simple. (ej. If you freeze water, it turns into ice)',
        '• First Conditional (Situaciones reales con alta probabilidad en el futuro): If + Present Simple, WILL + Verbo Base. (ej. If you study every day, you will pass the exam)',
        '• Second Conditional (Situaciones hipotéticas, imaginarias o poco probables en el presente): If + Past Simple, WOULD + Verbo Base. (ej. If I won the lottery, I would buy a library)',
        '• Third Conditional (Lamentos sobre situaciones del pasado imposible de cambiar): If + Past Perfect (had + V3), WOULD HAVE + V3. (ej. If I had prepared better, I would have got a ten)'
      ],
      example: {
        statement: 'Construir una oración en First Conditional y otra en Second Conditional para aconsejar a un estudiante',
        steps: [
          '1. First Conditional (real y alcanzable): <code>If you practice with Perrito Math, you will master calculus.</code>',
          '2. Second Conditional (hipotético): <code>If I had more free time, I would learn German and robotics.</code>'
        ],
        result: '1st: If you practice..., you will master... | 2nd: If I had..., I would learn...'
      },
      pitfalls: [
        'Meter "will" o "would" dentro de la cláusula de "if" (¡Error clásico de examen! Nunca digas "If you will study", di "If you study").',
        'En Second Conditional se prefiere usar "were" para todas las personas: "If I were you..." en vez de "If I was you".'
      ],
      goldenTip: 'Asocia cada condicional con un tiempo: Zero = Hechos científicos | First = Futuro real (Will) | Second = Sueños e hipótesis (Would) | Third = Arrepentimientos del pasado (Would have).'
    },

    // ========================================================================
    // CULTURA DIGITAL & INFORMÁTICA (CBTIS 1er Semestre & Universidad)
    // ========================================================================
    {
      id: 'cultura_digital_excel_formulas',
      title: 'Microsoft Excel & Hojas de Cálculo: Fórmulas y Funciones Esenciales',
      category: 'Cultura Digital I (CBTIS 1er Semestre)',
      badge: 'Cultura Digital',
      keywords: ['excel', 'hoja de calculo', 'formulas excel', 'funciones excel', 'suma excel', 'promedio excel', 'si condicional', 'buscarv', 'vlookup', 'fijar celda', 'referencias absolutas'],
      concept: `Las <strong>hojas de cálculo (Microsoft Excel y Google Sheets)</strong> constituyen la competencia ofimática y técnica más indispensable para la administración, la ingeniería, la ciencia de datos y la industria manufacturera y maquiladora de la frontera norte de México.`,
      formulas: [
        'Operaciones Básicas:',
        '• =SUMA(A1:A10) ➔ Suma continua de un rango numérico.',
        '• =PROMEDIO(B2:B20) ➔ Media aritmética exacta.',
        '• =MAX(C1:C50) y =MIN(C1:C50) ➔ Valor máximo y mínimo.',
        '• =CONTAR.SI(rango, criterio) ➔ Cuenta celdas que cumplen una condición.',
        'Lógica y Búsqueda Avanzada:',
        '• =SI(prueba_lógica, valor_si_verdadero, valor_si_falso) ➔ Toma de decisiones condicionales.',
        '• =BUSCARV(valor_buscado, tabla, indicador_columna, FALSO) ➔ Búsqueda vertical exacta.',
        'Referencias Absolutas ($A$1): Los signos de pesos fijan la columna ($A) o la fila ($1) para que no se muevan al arrastrar la fórmula.'
      ],
      example: {
        statement: 'Escribir la fórmula en Excel para determinar si un estudiante del CBTIS aprueba o reprueba con promedio en la celda D5 (mínimo aprobatorio: 6)',
        steps: [
          '1. Iniciar siempre con el signo igual: <code>=</code>.',
          '2. Emplear la función lógica condicional: <code>SI(</code>.',
          '3. Definir la prueba lógica: <code>D5 >= 6</code>.',
          '4. Establecer el valor verdadero (texto entre comillas): <code>\"APROBADO\"</code>.',
          '5. Establecer el valor falso (texto entre comillas): <code>\"REPROBADO\"</code>.',
          '6. Cerrar paréntesis: <code>=SI(D5>=6, \"APROBADO\", \"REPROBADO\")</code>.'
        ],
        result: '<code>=SI(D5>=6, "APROBADO", "REPROBADO")</code> (o con punto y coma ";" según la configuración regional)'
      },
      pitfalls: [
        'Confundir coma (,) con punto y coma (;) como separador de argumentos según la configuración regional de Windows o Mac.',
        'Olvidar colocar las comillas dobles en los textos ("APROBADO"): sin comillas, Excel piensa que es el nombre de una fórmula y arroja el error #¿NOMBRE?.'
      ],
      goldenTip: 'Presiona la tecla F4 (o Cmd+T en Mac) mientras seleccionas una celda en tu fórmula para convertirla instantáneamente en referencia absoluta fija ($A$1).'
    },
    {
      id: 'cultura_digital_algoritmos_diagramas',
      title: 'Pensamiento Computacional: Algoritmos y Diagramas de Flujo',
      category: 'Cultura Digital I (CBTIS 1er Semestre)',
      badge: 'Cultura Digital',
      keywords: ['algoritmo', 'diagrama de flujo', 'pensamiento computacional', 'pseudocodigo', 'simbologia flujo', 'inicio fin', 'decision', 'proceso', 'programacion'],
      concept: `Un <strong>algoritmo</strong> es un conjunto prescrito de instrucciones o reglas bien definidas, ordenadas y finitas que permite solucionar un problema específico. Un <strong>Diagrama de Flujo</strong> es su esquematización gráfica estandarizada (norma ISO) que facilita el diseño de software y la automatización de procesos.`,
      formulas: [
        'Simbología Estándar de Diagramas de Flujo:',
        '• Óvalo o Elipse: Inicio y Fin del algoritmo.',
        '• Rectángulo: Proceso u operación interna (ej. suma = a + b).',
        '• Paralelogramo (Romboide): Entrada o Salida de datos (ej. Leer calificación; Imprimir resultado).',
        '• Rombo: Decisión o condición con dos caminos posibles (Verdadero / Falso o Sí / No).',
        '• Flechas: Líneas de flujo que indican el sentido secuencial de ejecución.'
      ],
      example: {
        statement: 'Escribir el pseudocódigo estructurado para calcular el área de un triángulo (Base × Altura ÷ 2)',
        steps: [
          '1. Inicio',
          '2. Escribir "Ingresa el valor de la base (b) y de la altura (h):"',
          '3. Leer base, altura',
          '4. area = (base * altura) / 2',
          '5. Escribir "El área calculada es: ", area',
          '6. Fin'
        ],
        result: 'Algoritmo determinista, finito y secuencial de 6 pasos claros.'
      },
      pitfalls: [
        'Omitir la instrucción de "Fin": todo algoritmo por definición debe ser estrictamente finito.',
        'Invertir los símbolos de entrada (paralelogramo) y proceso (rectángulo).'
      ],
      goldenTip: 'Aplica el principio IPO (Input, Processing, Output): primero determina qué datos necesitas que el usuario ingrese, luego qué operación matemática harás con ellos, y finalmente qué mostrarás en pantalla.'
    },

    // ========================================================================
    // BIOLOGÍA & ECOSISTEMAS (CBTIS & Preparatoria)
    // ========================================================================
    {
      id: 'biologia_celula_organelos',
      title: 'Biología Celular: Procariota vs Eucariota y Funciones de los Organelos',
      category: 'Biología & Ciencias Naturales',
      badge: 'Biología',
      keywords: ['celula', 'procariota', 'eucariota', 'organelos', 'mitocondria', 'nucleo', 'ribosoma', 'membrana celular', 'adn', 'biologia'],
      concept: `La <strong>célula</strong> es la unidad morfológica, fisiológica y genética de todos los seres vivos (Teoría Celular). Se divide en dos grandes linajes: <strong>Células Procariotas</strong> (sin núcleo definido, material genético disperso en el citoplasma, como las bacterias) y <strong>Células Eucariotas</strong> (con núcleo verdadero rodeado por carioteca y organelos membranosos, como animales, vegetales y hongos).`,
      formulas: [
        'Estructura y función de organelos celulares:',
        '• Núcleo celular: Contiene y protege el genoma (ADN), coordinando la replicación y transcripción.',
        '• Mitocondria: Central energética celular donde se sintetiza ATP mediante la respiración aeróbica.',
        '• Ribosomas: Estructuras no membranosas encargadas de la síntesis de proteínas (traducción del ARNm).',
        '• Retículo Endoplasmático Rugoso (RER): Red de membranas con ribosomas adheridos para procesar proteínas.',
        '• Cloroplastos (exclusivo vegetal): Contienen clorofila y captan energía solar para la fotosíntesis.',
        '• Pared Celular (vegetales y bacterias): Estructura rígida de celulosa o peptidoglucano que brinda soporte.'
      ],
      example: {
        statement: '¿Qué organelo se encuentra en mayor densidad en las células musculares de un atleta y por qué razón biológica?',
        steps: [
          '1. Analizar el requerimiento metabólico: El tejido muscular esquelético realiza trabajo mecánico continuo y requiere un suministro masivo e ininterrumpido de energía química (ATP).',
          '2. Identificar el organelo responsable de la fosforilación oxidativa: La mitocondria genera más del 90% del ATP celular mediante el ciclo de Krebs y la cadena de transporte de electrones.',
          '3. Concluir: Las fibras musculares contienen miles de mitocondrias por célula para soportar la contracción muscular prolongada.'
        ],
        result: 'La Mitocondria (debido a su función indispensable de respiración celular y producción de ATP).'
      },
      pitfalls: [
        'Creer que las células vegetales no tienen mitocondrias: las plantas tienen AMBOS (cloroplastos para producir glucosa con luz solar Y mitocondrias para quemar esa glucosa de noche).',
        'Confundir célula procariota con virus: los virus no son células, son complejos macromoleculares acelulares que requieren una célula viva para replicarse.'
      ],
      goldenTip: 'Metáfora mnemotécnica de la célula como una ciudad industrial: Núcleo = Palacio municipal; Mitocondria = Planta eléctrica; Ribosomas = Fábricas de manufactura; Membrana = Aduana perimetral.'
    },
    {
      id: 'biologia_genetica_mendel',
      title: 'Genética Clásica: Leyes de Mendel y Cuadros de Punnett',
      category: 'Biología & Genética',
      badge: 'Biología',
      keywords: ['mendel', 'leyes de mendel', 'genetica', 'cuadro de punnett', 'genotipo', 'fenotipo', 'alelo dominante', 'recesivo', 'herencia'],
      concept: `Las <strong>Leyes de Gregorio Mendel</strong> (el padre de la genética moderna) sentaron las bases universales de la transmisión de caracteres hereditarios a través de los genes y alelos, refutando la antigua teoría de la mezcla de fluidos biológicos.`,
      formulas: [
        '1ª Ley (Principio de la Uniformidad): Cruzar dos líneas puras homocigotas (AA × aa) genera una primera generación F1 100% heterocigota (Aa) con fenotipo idéntico al progenitor dominante.',
        '2ª Ley (Principio de la Segregación): Al autocruzar la F1 (Aa × Aa), los alelos se separan en los gametos. En la generación F2 reaparece el carácter recesivo con proporción genotípica 1 AA : 2 Aa : 1 aa (75% dominante y 25% recesivo).',
        'Genotipo: Dotación alélica interna (letras: AA, Aa, aa).',
        'Fenotipo: Expresión física o bioquímica observable (ej. ojos castaños, tipo de sangre, altura).'
      ],
      example: {
        statement: 'Calcular las proporciones fenotípicas y genotípicas al cruzar dos plantas heterocigotas de flores moradas (Aa × Aa), donde el alelo "A" (morado) domina sobre "a" (blanco)',
        steps: [
          '1. Diseñar el Cuadro de Punnett 2x2: gametos de un progenitor en la fila (A, a) y del otro en la columna (A, a).',
          '2. Cruzar las casillas: Cuadrante 1 = AA; Cuadrante 2 = Aa; Cuadrante 3 = Aa; Cuadrante 4 = aa.',
          '3. Proporción Genotípica: 25% AA (homocigoto dominante), 50% Aa (heterocigoto), 25% aa (homocigoto recesivo).',
          '4. Proporción Fenotípica: Los genotipos AA y Aa expresan color morado (25% + 50% = 75%). El genotipo aa expresa color blanco (25%).'
        ],
        result: 'Genotipo: 1 AA : 2 Aa : 1 aa | Fenotipo: 75% Flores Moradas (3/4) y 25% Flores Blancas (1/4)'
      },
      pitfalls: [
        'Confundir homocigoto con heterocigoto: homocigoto tiene alelos iguales (AA o aa); heterocigoto tiene alelos distintos (Aa).',
        'Creer que el fenotipo recesivo desaparece para siempre: el alelo recesivo permanece intacto en el ADN y reaparece cuando dos portadores heterocigotos se cruzan.'
      ],
      goldenTip: 'Un rasgo recesivo (ej. ojos claros) solo se manifiesta cuando ambos alelos son recesivos (aa); la presencia de un solo alelo dominante (A) lo oculta fenotípicamente.'
    },

    // ========================================================================
    // CIENCIAS SOCIALES E HISTORIA (CBTIS 1er Semestre)
    // ========================================================================
    {
      id: 'ciencias_sociales_instituciones_estado',
      title: 'Estructura del Estado Mexicano: Los 3 Poderes y la Constitución',
      category: 'Ciencias Sociales I (CBTIS 1er Semestre)',
      badge: 'Ciencias Sociales',
      keywords: ['ciencias sociales', 'poderes de la union', 'poder ejecutivo', 'poder legislativo', 'poder judicial', 'constitucion de 1917', 'derechos humanos', 'mexico', 'reynosa'],
      concept: `México es una República representativa, democrática, federal y laica. Su sistema de gobierno se fundamenta en el principio republicano de la <strong>División de Poderes</strong> (formulado por Montesquieu) para evitar la tiranía, garantizar el equilibrio constitucional y salvaguardar los derechos humanos de la ciudadanía.`,
      formulas: [
        'Los Tres Poderes de la Unión (Nivel Federal):',
        '• Poder Ejecutivo: Encabezado por la Presidencia de la República. Se encarga de administrar los recursos públicos, diseñar políticas de estado y promulgar y ejecutar las leyes.',
        '• Poder Legislativo: Congreso de la Unión, integrado por la Cámara de Diputados (500 diputados: representan al pueblo y aprueban el Presupuesto) y la Cámara de Senadores (128 senadores: representan a las entidades federativas). Elabora, debate y aprueba las leyes.',
        '• Poder Judicial: Suprema Corte de Justicia de la Nación (SCJN), Tribunales Colegiados y Juzgados de Distrito. Administra justicia, interpreta la Constitución y resuelve controversias mediante el Juicio de Amparo.',
        'Carta Magna: Constitución Política de los Estados Unidos Mexicanos, promulgada el 5 de febrero de 1917 en Querétaro.'
      ],
      example: {
        statement: '¿Qué órgano del estado mexicano tiene la facultad exclusiva de discutir y aprobar anualmente el Presupuesto de Egresos de la Federación?',
        steps: [
          '1. Analizar las facultades constitucionales de los poderes: El artículo 74 de la Constitución establece las facultades exclusivas.',
          '2. Verificar la exclusividad: A diferencia de las leyes ordinarias (que deben pasar por ambas cámaras), el Presupuesto de Egresos es revisado y aprobado únicamente por los representantes populares directos.',
          '3. Concluir: La Cámara de Diputados es la facultada constitucionalmente de forma exclusiva.'
        ],
        result: 'Cámara de Diputados (Poder Legislativo Federal)'
      },
      pitfalls: [
        'Creer que el Senado aprueba el Presupuesto de Egresos: el Senado analiza la Ley de Ingresos, pero el Presupuesto de Egresos es facultad exclusiva de los Diputados.',
        'Confundir un estado federal con uno centralista: en México cada estado (como Tamaulipas) es libre y soberano en su régimen interior, con su propio Congreso local y gobernador.'
      ],
      goldenTip: 'Recuerda las funciones con verbos clave: El Legislativo CREA las leyes, el Ejecutivo las APLICA y administra, y el Judicial las JUZGA e interpreta.'
    },

    // ========================================================================
    // HUMANIDADES & FILOSOFÍA (CBTIS 1er Semestre)
    // ========================================================================
    {
      id: 'humanidades_falacias_logicas',
      title: 'Lógica y Filosofía: Las Falacias Argumentativas Más Comunes',
      category: 'Humanidades I (CBTIS 1er Semestre)',
      badge: 'Humanidades',
      keywords: ['falacia', 'falacias', 'falacias logicas', 'ad hominem', 'hombre de paja', 'ad verecundiam', 'falsa dicotomia', 'logica', 'filosofia', 'argumentacion'],
      concept: `En filosofía y lógica formal, una <strong>falacia</strong> es un argumento que parece válido y convincente a primera vista, pero que encierra un vicio o error lógico en su estructura que invalida su conclusión. Identificar falacias es la habilidad principal del pensamiento crítico en preparatoria y universidad.`,
      formulas: [
        'Catálogo de falacias clásicas:',
        '• Ad Hominem (Ataque personal): Descalificar la propuesta atacando a la persona que la emite en vez de refutar sus datos o argumentos.',
        '• Hombre de Paja (Straw Man): Caricaturizar o distorsionar la postura del oponente haciéndola ver ridícula para derribarla fácilmente.',
        '• Ad Verecundiam (Apelación a la falsa autoridad): Respaldar una afirmación invocando a una figura pública o celebridad que no es experta en la materia.',
        '• Falsa Dicotomía (Blanco o Negro): Reducir un problema complejo a solo dos opciones extremas, ignorando las alternativas intermedias.',
        '• Petición de Principio (Circularidad): La conclusión que se pretende demostrar ya está asumida implícitamente dentro de la premisa.'
      ],
      example: {
        statement: 'Identificar la falacia en la frase: "El maestro reprobó mi ensayo de historia porque a él no le caigo bien y es una persona intolerante"',
        steps: [
          '1. Analizar el argumento: Se intenta invalidar una calificación académica objetiva.',
          '2. Evaluar el fundamento ofrecido: Se ataca la personalidad y los supuestos sentimientos del evaluador, en lugar de contrastar el texto del ensayo con la rúbrica y las citas bibliográficas.',
          '3. Clasificar: Al desviar la atención hacia un rasgo personal del docente, se comete un ataque ad hominem.'
        ],
        result: 'Falacia Ad Hominem (contra la persona).'
      },
      pitfalls: [
        'Creer que cualquier insulto es automáticamente una falacia ad hominem: solo es falacia si el insulto se utiliza COMO la razón para pretender refutar un argumento.',
        'La falacia de la falacia (Ad Logicam): asumir que porque el argumento de alguien contiene una falacia, su conclusión es automáticamente falsa.'
      ],
      goldenTip: 'En un debate o ensayo, ataca las premisas, las evidencias y la coherencia lógica de las ideas, nunca a las personas.'
    },

    // ========================================================================
    // TÉCNICAS DE ESTUDIO Y ÉXITO ACADÉMICO (CBTIS 7 & Admisión Universitaria)
    // ========================================================================
    {
      id: 'estudio_tecnicas_examen_cbtis',
      title: 'Técnicas de Estudio de Alto Rendimiento: Pomodoro, Feynman y Apuntes Cornell',
      category: 'Metodología & Éxito Académico (CBTIS 7 & Universidad)',
      badge: 'Técnicas de Estudio',
      keywords: ['pomodoro', 'tecnica feynman', 'metodo cornell', 'como estudiar', 'tecnicas de estudio', 'examenes cbtis', 'exani', 'habitos de estudio', 'repaso espaciado'],
      concept: `La neurociencia cognitiva ha demostrado que la lectura pasiva y el desvelo la noche anterior al examen son las formas más ineficientes de aprender. Las metodologías con mayor evidencia científica para retener conocimientos a largo plazo y destacar en preparatoria (CBTIS) y universidad son la <strong>evocación activa</strong> y la <strong>repetición espaciada</strong>.`,
      formulas: [
        '1. Técnica Pomodoro: 25 minutos de enfoque absoluto (celular en otra habitación) + 5 minutos de descanso activo. Tras 4 ciclos, tomar un descanso reparador de 20-30 minutos.',
        '2. Técnica Feynman (Aprender enseñando): Selecciona el tema difícil ➔ Explícaselo a un niño en palabras sencillas sin tecnicismos ➔ Identifica dónde te trabaste ➔ Vuelve al libro y simplifica aún más con analogías.',
        '3. Método Cornell para Apuntes: Divide la libreta en 3 zonas: Columna izquierda (Preguntas y conceptos clave), Espacio principal (Apuntes breves y diagramas de clase), Pie de página (Resumen de 2 renglones con tus propias palabras).',
        '4. Regla del Descarte para Exámenes de Opción Múltiple: De 4 opciones (A, B, C, D), 2 suelen ser disparates obvios; descártalas de inmediato para elevar tu probabilidad de acierto del 25% al 50% entre las finalistas.'
      ],
      example: {
        statement: 'Plan de preparación para un examen parcial de Matemáticas o Química en el CBTIS 7',
        steps: [
          '1. Cero lectura pasiva: No te limites a releer el cuaderno. Resuelve ejercicios desde cero con una hoja en blanco y lápiz.',
          '2. Crea una Hoja Resumen de Fórmulas y Errores Típicos: anota dónde sueles equivocarte en los signos o en el despeje.',
          '3. Aplica 3 ciclos Pomodoro de práctica intensiva y realiza un simulacro con cronómetro de 45 minutos simulando el examen real.'
        ],
        result: 'Retención superior al 85%, dominio conceptual y máxima confianza ante la prueba.'
      },
      pitfalls: [
        'Subrayar todo el libro con marcatextos fluorescentes: crea la falsa ilusión de que estás aprendiendo, pero tu cerebro no es capaz de recordar la fórmula si le quitas el libro.',
        'Estudiar escuchando música con letra cantada: las palabras de la música saturan el bucle fonológico del cerebro, mermando la capacidad de resolver problemas matemáticos.'
      ],
      goldenTip: 'Repasa tus apuntes dentro de las primeras 24 horas después de la clase; esto frena la "Curva del Olvido" y ahorra horas de estudio pesado al final del bimestre.'
    }
  ];

  // ==========================================================================
  // 3. MOTOR DE BÚSQUEDA Y RAZONAMIENTO CATEDRÁTICO (ERUDITE INFERENCE)
  // ==========================================================================

  function normalizeText(txt) {
    return (txt || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatKnowledgeResponse(topic) {
    const formulasHtml = topic.formulas.map(f => `<code>${f}</code>`).join('<br>');
    const stepsHtml = topic.example.steps.map((st, i) => `
      <div class="erudite-step-item">
        <span class="step-num-badge">Paso ${i + 1}</span>
        <div>${st}</div>
      </div>
    `).join('');

    const pitfallsHtml = topic.pitfalls.map(p => `<li>${p}</li>`).join('');

    return `
      <div class="erudite-card-response">
        <div class="erudite-header">
          <span class="erudite-badge">🎓 Cátedra Magistral • ${topic.badge}</span>
          <h4 class="erudite-title">${topic.title}</h4>
          <span class="erudite-sub">${topic.category}</span>
        </div>

        <div class="erudite-section">
          <div class="erudite-sec-title">🧠 Fundamento Teórico & Intuición:</div>
          <div class="erudite-concept">${topic.concept}</div>
        </div>

        <div class="erudite-section">
          <div class="erudite-sec-title">📐 Principio y Fórmulas Esenciales:</div>
          <div class="erudite-formula-box">${formulasHtml}</div>
        </div>

        <div class="erudite-section">
          <div class="erudite-sec-title">📝 Ejemplo Práctico Resuelto Paso a Paso:</div>
          <div class="erudite-example-statement">${topic.example.statement}</div>
          <div class="erudite-steps">${stepsHtml}</div>
          <div class="erudite-result-box">
            <span class="result-label">Resultado Final:</span>
            <span class="result-highlight">${topic.example.result}</span>
          </div>
        </div>

        <div class="erudite-section erudite-pitfall-box">
          <div class="erudite-sec-title">⚠️ Trampas Habituales en Exámenes:</div>
          <ul class="erudite-pitfall-list">${pitfallsHtml}</ul>
        </div>

        <div class="erudite-tip-box">
          💡 <strong>Consejo de Oro del Profesor Perrito:</strong> ${topic.goldenTip}
        </div>
      </div>
    `;
  }

  // Generador heurístico general multidisciplinario para cualquier otra consulta académica
  function formatGenericEruditeResponse(userQuery, activeContext) {
    return `
      <div class="erudite-card-response">
        <div class="erudite-header">
          <span class="erudite-badge">🎓 Cátedra Multidisciplinaria • Tutor Universal</span>
          <h4 class="erudite-title">Orientación Académica: "${userQuery}"</h4>
          <span class="erudite-sub">Metodología Científica y Pedagógica de Excelencia para Preparatoria & Universidad</span>
        </div>

        <div class="erudite-section">
          <div class="erudite-concept">
            Como <strong>Profesor Perrito Catedrático</strong>, para abordar tu consulta sobre <strong>${userQuery}</strong> en tus estudios de preparatoria (como en el <strong>CBTIS 7</strong>) o universidad, aplicamos los 4 pilares del método científico y analítico universal:
          </div>
        </div>

        <div class="erudite-steps">
          <div class="erudite-step-item">
            <span class="step-num-badge">Pilar 1</span>
            <div><strong>Diagnóstico del Problema y Área de Estudio:</strong> Identificar la disciplina rectora (Matemáticas, Química, Física, Lengua/APA, Inglés, Excel/Informática, Ciencias Sociales o Filosofía) y delimitar los conceptos, variables, reactivos o premisas fundamentales.</div>
          </div>
          <div class="erudite-step-item">
            <span class="step-num-badge">Pilar 2</span>
            <div><strong>Fundamento Teórico y Ley Rectora:</strong> Seleccionar el principio rector: ley física/química (Leyes de Newton, Lavoisier, Ley de Ohm), teorema matemático (Pitágoras, regla de Cramer, derivadas), regla ortográfica de la RAE, estructura gramatical en inglés o fórmula de hoja de cálculo.</div>
          </div>
          <div class="erudite-step-item">
            <span class="step-num-badge">Pilar 3</span>
            <div><strong>Desarrollo y Ejecución Meticulosa:</strong> Resolver paso a paso sin saltarse etapas intermedias, cuidando el balanceo estequiométrico, la ley de los signos algebraicos, la concordancia gramatical o la sintaxis de programación.</div>
          </div>
          <div class="erudite-step-item">
            <span class="step-num-badge">Pilar 4</span>
            <div><strong>Verificación y Comprobación:</strong> Contrastar el resultado con la realidad física, comprobar la igualdad matemática o verificar la coherencia argumentativa y la correcta citación en formato APA 7.</div>
          </div>
        </div>

        <div class="erudite-tip-box">
          🐾 <strong>¡Pregúntame con total libertad!</strong> Puedes consultarme cualquier duda de:<br>
          • <strong>Matemáticas:</strong> operaciones, fracciones compuestas, álgebra, cuadráticas, derivadas, integrales, estadística.<br>
          • <strong>Química:</strong> enlaces iónicos y covalentes, balanceo por tanteo, tabla periódica, configuración electrónica.<br>
          • <strong>Física:</strong> leyes de Newton, MRU/MRUA, caída libre, ley de Ohm, circuitos eléctricos, energía y trabajo.<br>
          • <strong>Lengua & APA:</strong> reglas de acentuación SEGA, estructura del ensayo, cómo citar en APA 7ª edición.<br>
          • <strong>Inglés:</strong> Verb To Be, Present Simple vs Continuous, verbos irregulares, condicionales.<br>
          • <strong>Cultura Digital:</strong> fórmulas de Excel (=SI, =BUSCARV), algoritmos, diagramas de flujo y ciberseguridad.<br>
          • <strong>Ciencias Sociales, Filosofía & Técnicas de Estudio:</strong> poderes del estado, falacias lógicas, técnica Pomodoro y Feynman.
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 4. API GEMINI INTEGRADA (CONEXIÓN EXTERNA OPCIONAL CON CASCADE & DIAGNÓSTICO)
  // ==========================================================================

  const GEMINI_KEY_STORAGE = 'perrito_math_gemini_api_key';
  const GEMINI_ACTIVE_MODEL_STORAGE = 'perrito_math_gemini_active_model';
  const GEMINI_ACTIVE_VER_STORAGE = 'perrito_math_gemini_active_ver';

  // Catálogo moderno y ampliado de modelos Gemini ordenado por prioridad
  const DEFAULT_GEMINI_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-2.0-pro-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest'
  ];

  function cleanApiKey(key) {
    if (!key || typeof key !== 'string') return '';
    return key.trim().replace(/^["']|["']$/g, '').replace(/^key=/, '').trim();
  }

  // Consulta directa a ModelService.ListModels de Google para obtener exactamente los modelos autorizados para esta clave
  async function listAvailableGeminiModels(cleanKey) {
    if (!cleanKey) return null;
    const versions = ['v1beta', 'v1'];
    let lastErr = null;

    for (const ver of versions) {
      try {
        const url = `https://generativelanguage.googleapis.com/${ver}/models?key=${cleanKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const ej = await res.json();
            if (ej && ej.error) msg = ej.error.message || msg;
          } catch (_) {}
          const err = new Error(msg);
          err.status = res.status;
          lastErr = err;
          // Si la clave es inválida (400) o denegada (403), lanzar para alertar de inmediato
          if (res.status === 400 || res.status === 403) {
            throw err;
          }
          continue;
        }

        const data = await res.json();
        if (data && Array.isArray(data.models)) {
          const contentModels = data.models
            .filter(m => {
              const methods = m.supportedGenerationMethods || [];
              return methods.includes('generateContent');
            })
            .map(m => (m.name || '').replace(/^models\//, '').trim())
            .filter(Boolean);

          if (contentModels.length > 0) {
            // Ordenar por prioridad óptima (Flash rápidos primero)
            contentModels.sort((a, b) => {
              let idxA = DEFAULT_GEMINI_MODELS.indexOf(a);
              let idxB = DEFAULT_GEMINI_MODELS.indexOf(b);
              if (idxA === -1) idxA = 999;
              if (idxB === -1) idxB = 999;
              return idxA - idxB;
            });
            return { apiVersion: ver, models: contentModels };
          }
        }
      } catch (err) {
        lastErr = err;
        if (err.status === 400 || err.status === 403) throw err;
      }
    }
    if (lastErr && (lastErr.status === 400 || lastErr.status === 403)) throw lastErr;
    return null;
  }

  // Conversor elegante de Markdown y notación matemática a HTML para respuestas de Gemini
  function renderMarkdown(md) {
    if (!md) return '';
    let html = md;
    // Sanitización básica: evitar scripts
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Code blocks
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre style="background:rgba(0,0,0,0.4); padding:0.75rem; border-radius:8px; overflow-x:auto; margin:0.6rem 0;"><code>$2</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:0.15rem 0.4rem; border-radius:4px; color:#a78bfa;">$1</code>');

    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h6 style="color:#cbd5e1; margin:0.8rem 0 0.3rem 0; font-weight:700; font-size:0.95rem;">$1</h6>');
    html = html.replace(/^### (.*$)/gim, '<h5 style="color:#e2e8f0; margin:0.9rem 0 0.35rem 0; font-weight:700; font-size:1.05rem;">$1</h5>');
    html = html.replace(/^## (.*$)/gim, '<h4 style="color:#f8fafc; margin:1.1rem 0 0.4rem 0; font-weight:700; font-size:1.15rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.25rem;">$1</h4>');
    html = html.replace(/^# (.*$)/gim, '<h3 style="color:#ffffff; margin:1.2rem 0 0.5rem 0; font-weight:800; font-size:1.3rem;">$1</h3>');

    // Blockquotes
    html = html.replace(/^>\s+(.*$)/gim, '<blockquote style="border-left:3px solid #7c3aed; padding:0.4rem 0.8rem; margin:0.6rem 0; background:rgba(124,58,237,0.08); border-radius:0 6px 6px 0; color:#e2e8f0;">$1</blockquote>');

    // Block math ($$ ... $$)
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (m, formula) => {
      let cleanForm = formula.trim()
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\times/g, '×')
        .replace(/\\cdot/g, '·')
        .replace(/\\pm/g, '±')
        .replace(/\\le/g, '≤')
        .replace(/\\ge/g, '≥')
        .replace(/\\ne/g, '≠')
        .replace(/\\approx/g, '≈')
        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
      return `<div style="text-align:center; margin:0.75rem 0; padding:0.55rem 0.8rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; font-weight:600; color:#38bdf8; font-family:'Courier New', monospace; font-size:1.05rem; overflow-x:auto;">${cleanForm}</div>`;
    });

    // Inline math ($ ... $)
    html = html.replace(/\$([^\$\n]+)\$/g, (m, formula) => {
      let cleanForm = formula.trim()
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\times/g, '×')
        .replace(/\\cdot/g, '·')
        .replace(/\\pm/g, '±')
        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
      return `<code style="background:rgba(56,189,248,0.1); color:#38bdf8; padding:0.12rem 0.35rem; border-radius:4px; font-weight:600; font-family:monospace;">${cleanForm}</code>`;
    });

    // Bold & italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr style="border:0; border-top:1px solid rgba(255,255,255,0.12); margin:1rem 0;">');

    // Numbered and bullet list items
    html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li style="margin-bottom:0.35rem;"><strong>$1.</strong> $2</li>');
    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li style="margin-bottom:0.35rem;">$1</li>');

    // Wrap consecutive li elements in ul
    html = html.replace(/(<li style="margin-bottom:0\.35rem;">[\s\S]*?<\/li>\s*)+/g, (match) => {
      return `<ul style="padding-left:1.3rem; margin:0.6rem 0;">${match}</ul>`;
    });

    // Paragraphs
    const paragraphs = html.split(/\n\s*\n/);
    return paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<ul') || p.startsWith('<div') || p.startsWith('<blockquote') || p.startsWith('<hr')) return p;
      return `<p style="margin:0.55rem 0; line-height:1.65;">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }

  async function callGeminiApi(model, cleanKey, body, preferredVersion = null) {
    const cleanModel = (model || '').replace(/^models\//, '').trim();
    const versionsToTry = preferredVersion ? [preferredVersion] : ['v1beta', 'v1'];
    let lastErr = null;

    for (const ver of versionsToTry) {
      const url = `https://generativelanguage.googleapis.com/${ver}/models/${cleanModel}:generateContent?key=${cleanKey}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          let errMsg = `HTTP ${res.status}`;
          let errStatus = '';
          try {
            const errJson = await res.json();
            if (errJson && errJson.error) {
              errMsg = errJson.error.message || errJson.error.status || errMsg;
              errStatus = errJson.error.status || '';
            }
          } catch (_) {}
          const err = new Error(errMsg);
          err.status = res.status;
          err.apiStatus = errStatus;
          err.model = cleanModel;
          err.apiVersion = ver;
          lastErr = err;

          // Si es 404 (modelo no encontrado en esta versión de API), probamos en la otra versión si hay más
          if (res.status === 404) {
            continue;
          }
          // Para otros errores (400 clave inválida, 429 cuota, 403 permisos), lanzar de inmediato
          throw err;
        }

        const data = await res.json();
        const candidate = data.candidates && data.candidates[0];
        if (candidate && candidate.content && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
          // Filtrar partes de pensamiento interno (thought: true) y extraer únicamente texto útil
          const textParts = candidate.content.parts
            .filter(p => !p.thought && typeof p.text === 'string')
            .map(p => p.text);
          let fullText = textParts.join('');
          if (!fullText.trim()) {
            fullText = candidate.content.parts.map(p => p.text || '').join('');
          }
          if (fullText.trim()) {
            if (candidate.finishReason === 'MAX_TOKENS') {
              fullText += '\n\n*(Nota: La respuesta alcanzó el límite máximo de longitud de tokens).*';
            }
            return {
              text: fullText,
              model: cleanModel,
              apiVersion: ver,
              finishReason: candidate.finishReason
            };
          }
        }
        throw new Error('Respuesta vacía o bloqueada por políticas de seguridad de Gemini');
      } catch (e) {
        lastErr = e;
        if (e.status !== 404) throw e;
      }
    }
    throw lastErr || new Error(`No se pudo obtener respuesta del modelo ${cleanModel}`);
  }

  async function testGeminiKey(key) {
    const cleanKey = cleanApiKey(key);
    if (!cleanKey) {
      return { ok: false, error: 'Por favor ingresa una clave de API antes de probar.' };
    }
    if (cleanKey.length < 15) {
      return { ok: false, error: 'La clave ingresada es demasiado corta. Las claves de Google AI Studio suelen comenzar con "AIzaSy..." y tener aproximadamente 39 caracteres.' };
    }

    const testBody = {
      contents: [{
        role: 'user',
        parts: [{ text: 'Responde estrictamente con la palabra: CONECTADO' }]
      }],
      generationConfig: {
        maxOutputTokens: 300
      }
    };

    // 1. Descubrimiento dinámico de modelos autorizados con ModelService.ListModels
    let candidateModels = [];
    let detectedVersion = 'v1beta';
    let discoveryError = null;

    try {
      const discovered = await listAvailableGeminiModels(cleanKey);
      if (discovered && discovered.models && discovered.models.length > 0) {
        candidateModels = discovered.models;
        detectedVersion = discovered.apiVersion || 'v1beta';
        console.log('[Perrito Erudite] Modelos detectados via ListModels:', candidateModels);
      }
    } catch (err) {
      discoveryError = err;
      if (err.status === 400 && (err.message || '').includes('API key not valid')) {
        return {
          ok: false,
          error: 'Clave de API no válida en Google. Por favor verifica que la hayas copiado completa desde Google AI Studio.'
        };
      }
      if (err.status === 403) {
        return {
          ok: false,
          error: `Google denegó el acceso (403): ${err.message}. Verifica que tu clave no tenga restricciones en Google Cloud Console que bloqueen la "Generative Language API".`
        };
      }
    }

    // 2. Si ListModels no arrojó modelos o falló la llamada, usar la lista por defecto moderna
    if (candidateModels.length === 0) {
      candidateModels = DEFAULT_GEMINI_MODELS;
    }

    // 3. Probar los modelos candidatos en orden de prioridad hasta hallar uno activo
    let lastError = discoveryError;
    for (const model of candidateModels) {
      try {
        const result = await callGeminiApi(model, cleanKey, testBody, detectedVersion);
        // Guardar modelo activo verificado y versión en localStorage
        try {
          localStorage.setItem(GEMINI_ACTIVE_MODEL_STORAGE, result.model);
          localStorage.setItem(GEMINI_ACTIVE_VER_STORAGE, result.apiVersion);
        } catch (_) {}

        const detectedInfo = candidateModels.length > 1
          ? `<br><small style="opacity: 0.9; display: inline-block; margin-top: 6px;">🎯 Modelos activos detectados en tu cuenta: <code>${candidateModels.slice(0, 3).join('</code>, <code>')}</code>${candidateModels.length > 3 ? '...' : ''}</small>`
          : '';

        return {
          ok: true,
          model: result.model,
          apiVersion: result.apiVersion,
          message: `¡Conexión exitosa! El modelo <strong>${result.model}</strong> (${result.apiVersion}) está activo y respondiendo correctamente.${detectedInfo}`
        };
      } catch (err) {
        lastError = err;
        // Si la clave es inválida, no seguir probando otros modelos
        if (err.status === 400 && (err.message || '').includes('API key not valid')) {
          break;
        }
      }
    }

    let errMsg = lastError ? lastError.message : 'No se pudo conectar con los servidores de Google Generative AI.';
    return {
      ok: false,
      error: errMsg
    };
  }

  async function queryGemini(userPrompt, apiKey, activeContext) {
    const cleanKey = cleanApiKey(apiKey);
    if (!cleanKey) throw new Error('Clave de API no provista');

    const systemInstruction = `
Eres el "Profesor Perrito 🐶🎓", Catedrático Polímata y Virtuoso Tutor Pedagógico Multidisciplinario de Excelencia Académica, con maestría y doctorado en pedagogía de las ciencias, humanidades e idiomas.
Estás especialmente consagrado a formar y orientar con la máxima devoción didáctica a estudiantes de Preparatoria (con especial reconocimiento y cariño a los alumnos del Bachillerato Tecnológico DGETI / CBTIS —como la destacada alumna de 1er semestre del CBTIS 7 de Reynosa, Tamaulipas—, Bachilleratos Generales y Técnicos) y de Universidad (Ingenierías, Ciencias de la Salud, Ciencias Sociales y Humanidades).

Tu misión sagrada e inquebrantable es RESPONDER, RESOLVER Y EXPLICAR CUALQUIER TIPO DE DUDA O EJERCICIO ACADÉMICO que el alumno te plantee, sin importar la materia a la que pertenezca ni su grado de complejidad:

📚 DOMINIO UNIVERSAL DE DISCIPLINAS Y ASIGNATURAS:

1. PENSAMIENTO MATEMÁTICO & MATEMÁTICAS SUPERIORES:
• Aritmética y Números: Operaciones combinadas (PEMDAS), fracciones simples y continuas multinivel (Ley de la Herradura), números mixtos, razones, proporciones, porcentajes, regla de tres directa e inversa, M.C.D., m.c.m., números primos, potencias y radicales, notación científica.
• Álgebra Elemental y Superior: Reducción de términos, productos notables, factorización completa (factor común, trinomios, diferencia de cuadrados, cubos, método de Ruffini), fracciones algebraicas, leyes de exponentes, logaritmos, números complejos (i).
• Ecuaciones, Inecuaciones y Sistemas: Ecuaciones de 1er grado, sistemas de ecuaciones 2x2, 3x3 y nxn (Cramer/Determinantes, Gauss-Jordan, sustitución, reducción), ecuaciones cuadráticas (Fórmula General / Chicharronera, factorización, vértice y concavidad de parábolas), inecuaciones y valor absoluto.
• Geometría Euclidiana & Trigonometría: Perímetros, áreas, volúmenes, Teorema de Pitágoras, Teorema de Tales, razones trigonométricas (SOH-CAH-TOA), identidades pitagóricas, Ley de Senos y Cosenos, ángulos notables.
• Geometría Analítica: Distancia entre puntos, punto medio, pendiente, ecuaciones de la recta, paralelismo y perpendicularidad, cónicas (circunferencia, parábola, elipse, hipérbola).
• Cálculo Diferencial e Integral: Límites e indeterminaciones (0/0, regla de L'Hôpital), derivadas por definición y reglas (potencia, producto, cociente, cadena), máximos y mínimos, antiderivadas, integrales inmediatas, métodos de integración (sustitución, por partes, fracciones parciales), áreas bajo la curva.
• Álgebra Lineal & Probabilidad: Vectores 2D/3D (producto punto y cruz), matrices e inversas, medidas de tendencia central y dispersión, combinatoria (permutaciones y combinaciones), probabilidad clásica y Teorema de Bayes.

2. LA MATERIA Y SUS INTERACCIONES & QUÍMICA:
• Estructura Atómica: Protones, neutrones, electrones, número atómico (Z), masa atómica (A), isótopos, modelos atómicos (Bohr, cuántico) y configuración electrónica por el principio de Aufbau.
• Tabla Periódica: Grupos, familias, periodos, metales, no metales, gases nobles, electronegatividad, radio atómico y afinidad electrónica.
• Enlaces Químicos: Enlace iónico, enlace covalente (polar y no polar), enlace metálico, estructuras de Lewis y regla del octeto.
• Reacciones Químicas & Estequiometría: Tipos de reacciones, balanceo de ecuaciones por tanteo y redox, ley de conservación de la masa (Lavoisier), mol, masa molar, reactivo limitante, soluciones molares y pH.

3. CONSERVACIÓN DE LA ENERGÍA & FÍSICA:
• Cinemática: MRU (v = d/t), MRUA (aceleración, ecuaciones de velocidad y distancia), caída libre y tiro vertical (g = 9.81 m/s²), tiro parabólico.
• Dinámica: Las 3 Leyes de Newton (Inercia, F = m·a, Acción y Reacción), diagramas de cuerpo libre (DCL), fuerza de fricción, peso vs masa.
• Trabajo, Potencia y Energía: Trabajo mecánico (W = F·d·cos θ), energía cinética (Ec = ½mv²), energía potencial gravitatoria (Ep = mgh), principio de conservación de la energía mecánica.
• Fluidos & Termodinámica: Presión hidrostática, principio de Pascal, principio de Arquímedes, calor y temperatura, calor específico, leyes de la termodinámica.
• Electricidad & Magnetismo: Ley de Coulomb, campo eléctrico, Ley de Ohm (V = I·R), potencia eléctrica (P = V·I), circuitos en serie y en paralelo, magnetismo e inducción de Faraday.

4. LENGUA Y COMUNICACIÓN, REDACCIÓN & NORMAS APA:
• Ortografía & Acentuación RAE: Regla SEGA (agudas, graves, esdrújulas, sobresdrújulas), tilde diacrítica, diptongos, triptongos e hiatos, puntuación formal.
• Redacción Académica & Ensayo: Estructura del ensayo (introducción, tesis argumentativa, desarrollo y conclusión), conectores textuales de cohesión, tipos de párrafos, figuras retóricas.
• Normas APA 7ª Edición: Citas parentéticas y narrativas, citas textuales cortas (< 40 palabras) y largas (en bloque), parafraseo ético, lista de referencias bibliográficas con sangría francesa (libros, artículos científicos, páginas web).

5. INGLÉS (NIVELES I A VI & UNIVERSITARIO):
• Gramática Esencial: Verb To Be (presente y pasado), Pronombres personales, objeto y posesivos, adjetivos, WH-questions.
• Tiempos Verbales: Present Simple vs Present Continuous, Past Simple (verbos regulares -ed e irregulares), Past Continuous, Present Perfect, Future (Will vs Going to).
• Estructuras Avanzadas: Modal Verbs (can, could, should, must), Conditionals (Zero, First, Second, Third), Passive Voice, Reported Speech, Phrasal Verbs.
• Redacción y Vocabulario: Expresión formal, linking words, vocabulario técnico de ciencias y tecnología, preparación para certificaciones TOEFL/Cambridge.

6. CULTURA DIGITAL, INFORMÁTICA & TIC:
• Hojas de Cálculo (Excel & Google Sheets): Fórmulas esenciales (=SUMA, =PROMEDIO, =MAX, =MIN), funciones condicionales (=SI, =Y, =O, =CONTAR.SI), funciones de búsqueda (=BUSCARV / =VLOOKUP, =BUSCARX / =XLOOKUP), referencias absolutas con signo de pesos ($A$1).
• Algoritmos y Diagramas de Flujo: Pensamiento computacional, simbología ISO/ANSI (óvalo, rectángulo, romboide, rombo), pseudocódigo estructurado, variables, ciclos (para/mientras) y condiciones.
• Ciudadanía y Seguridad Digital: Huella digital, contraseñas robustas, autenticación de dos factores (2FA), prevención de phishing y malware, uso ético de la inteligencia artificial.

7. CIENCIAS SOCIALES, HUMANIDADES & FILOSOFÍA:
• Ciencias Sociales: El ser social, instituciones del estado mexicano, los 3 Poderes de la Unión (Ejecutivo, Legislativo, Judicial), Constitución Política de 1917, derechos humanos, estructura socioeconómica de México y dinámica fronteriza (Reynosa, Tamaulipas y comercio exterior).
• Humanidades y Lógica: Lógica formal e informal, silogismos, tablas de verdad, identificación y refutación de falacias argumentativas (ad hominem, hombre de paja, ad verecundiam, falsa dicotomía), ética vs moral, corrientes filosóficas clásicas y contemporáneas.

8. METODOLOGÍA & TÉCNICAS DE ESTUDIO:
• Hábitos de estudio basados en neurociencia: Técnica Pomodoro, Método Feynman, Método Cornell para apuntes, repaso espaciado, mapas conceptuales y mentales, técnicas para exámenes de opción múltiple y preparación para CENEVAL EXANI-I y II.

🎯 PAUTAS ESTRICTAS DE RESPUESTA:
- Tono: Distinguido, culto, cordial, motivador, ultra paciente y didáctico, con sutiles y cariñosos toques de perrito catedrático 🐾🎓.
- SI ES UN EJERCICIO O PROBLEMA (de matemáticas, física, química, inglés, excel, etc.): RESUÉLVELO DE PRINCIPIO A FIN DE FORMA COMPLETA Y DETALLADA. Muestra cada sustitución, despeje, paso algebraico, traducción o fórmula hasta llegar al resultado final.
- SI ES UNA DUDA TEÓRICA O CONCEPTUAL: Explica la intuición, los fundamentos científicos o normativos, y proporciona un ejemplo real resuelto.
- Estructura elegante en cada cátedra:
  1. 📌 Planteamiento y Datos Clave.
  2. 📐 Principio Científico, Regla o Fórmula Rectora.
  3. 🔢 Desarrollo Paso a Paso Exhaustivo.
  4. 🏆 Resultado Final o Conclusión Destacada.
  5. ⚠️ Trampa Típica de Examen (errores frecuentes en este tema en preparatorias como el CBTIS y universidades).
  6. 💡 Consejo de Oro Didáctico del Profesor Perrito.

Contexto actual del estudiante en la plataforma: ${activeContext ? activeContext.typeName : 'Preparatoria y Universidad'}.
    `.trim();

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Pregunta u operación matemática del alumno: ${userPrompt}` }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    };

    // Construir lista de modelos a probar: modelo activo guardado primero, luego descubiertos o por defecto
    const modelsToTry = [];
    const cachedModel = localStorage.getItem(GEMINI_ACTIVE_MODEL_STORAGE);
    const cachedVer = localStorage.getItem(GEMINI_ACTIVE_VER_STORAGE) || 'v1beta';

    if (cachedModel) {
      modelsToTry.push({ model: cachedModel, ver: cachedVer });
    }

    try {
      const discovered = await listAvailableGeminiModels(cleanKey);
      if (discovered && discovered.models) {
        for (const m of discovered.models) {
          if (!modelsToTry.some(item => item.model === m)) {
            modelsToTry.push({ model: m, ver: discovered.apiVersion || 'v1beta' });
          }
        }
      }
    } catch (_) {}

    for (const defModel of DEFAULT_GEMINI_MODELS) {
      if (!modelsToTry.some(item => item.model === defModel)) {
        modelsToTry.push({ model: defModel, ver: 'v1beta' });
      }
    }

    let lastError = null;
    for (const item of modelsToTry) {
      try {
        const result = await callGeminiApi(item.model, cleanKey, body, item.ver);
        // Guardar modelo activo verificado
        try {
          localStorage.setItem(GEMINI_ACTIVE_MODEL_STORAGE, result.model);
          localStorage.setItem(GEMINI_ACTIVE_VER_STORAGE, result.apiVersion);
        } catch (_) {}

        const parsedHtml = renderMarkdown(result.text);
        return `
          <div class="erudite-card-response erudite-gemini-card">
            <div class="erudite-header">
              <span class="erudite-badge" style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff;">✨ Google Gemini (${result.model})</span>
              <strong>Cátedra Magistral con IA</strong>
            </div>
            <div class="erudite-gemini-content">
              ${parsedHtml}
            </div>
          </div>
        `;
      } catch (err) {
        lastError = err;
        // Si el modelo no existe (404), intentamos con el siguiente modelo de la lista
        if (err.status === 404 || (err.message || '').includes('not found')) {
          continue;
        }
        // Si es otro error (ej: cuota agotada o clave inválida), lanzamos el error
        throw err;
      }
    }
    throw lastError || new Error('No se pudo obtener respuesta de Google Gemini');
  }

  // ==========================================================================
  // 5. INTERFAZ PÚBLICA DEL MOTOR ERUDITO
  // ==========================================================================

  async function ask(query, activeContext) {
    if (!query || !query.trim()) {
      return '🐾 ¡Hola! Escribe tu duda o problema de cualquier materia (Matemáticas, Química, Física, Lengua/APA, Inglés, Cultura Digital/Excel, Ciencias Sociales, Filosofía) y te lo explico paso a paso con todo gusto.';
    }

    const cleanQuery = query.trim();
    const qNorm = normalizeText(cleanQuery);

    let geminiApiErrorNotice = '';

    // 1. ¿Tiene el usuario configurada una API Key de Gemini y hay conexión?
    const rawApiKey = localStorage.getItem(GEMINI_KEY_STORAGE);
    const savedApiKey = cleanApiKey(rawApiKey);
    if (savedApiKey && savedApiKey.length > 10 && (typeof navigator === 'undefined' || navigator.onLine !== false)) {
      try {
        const geminiAnswer = await queryGemini(cleanQuery, savedApiKey, activeContext);
        if (geminiAnswer) return geminiAnswer;
      } catch (err) {
        console.warn('[Perrito Erudite] Error al consultar API de Gemini:', err);
        const errDetail = err.message || 'Error al conectar con Google Generative Language API';
        geminiApiErrorNotice = `
          <div class="erudite-api-notice">
            <div class="erudite-notice-header">
              <span>⚠️</span> <strong>Aviso del Asistente Google Gemini:</strong>
            </div>
            <div class="erudite-notice-body">
              Google reportó: <code>${escapeHtml(errDetail)}</code>.<br>
              🐶 <em>No te preocupes: el <strong>Profesor Perrito Math</strong> activó el <strong>Motor Matemático Offline Local</strong> para resolver tu ejercicio de inmediato:</em>
            </div>
          </div>
        `;
      }
    }

    function withGeminiNotice(html) {
      if (!html) return html;
      return geminiApiErrorNotice ? (geminiApiErrorNotice + html) : html;
    }

    // 2. ¿Es un cálculo o problema específico para el evaluador interactivo?
    // Problemas verbales de aplicación (coincidencias periódicas de m.c.m., cometas, reparto equitativo M.C.D., porcentajes)
    const wordRes = PerritoSolver.solveWordProblem(cleanQuery);
    if (wordRes) return withGeminiNotice(wordRes);

    // Fracciones directas (soporta lenguaje natural como '3/8 mas 9/3', '3/8 y 9/3', enteros con fracciones, etc.)
    const fracRes = PerritoSolver.solveFractions(cleanQuery);
    if (fracRes) return withGeminiNotice(fracRes);

    // Cálculos aritméticos y científicos directos (porcentajes, raíces, potencias, aritmética elemental)
    const arithRes = PerritoSolver.solveArithmetic(cleanQuery);
    if (arithRes) return withGeminiNotice(arithRes);

    // Ecuación lineal
    const linRes = PerritoSolver.solveLinear(cleanQuery);
    if (linRes) return withGeminiNotice(linRes);

    // Ecuación cuadrática
    const quadRes = PerritoSolver.solveQuadratic(cleanQuery);
    if (quadRes) return withGeminiNotice(quadRes);

    // M.C.D. o m.c.m.
    const mcdRes = PerritoSolver.solveMcdMcm(cleanQuery);
    if (mcdRes) return withGeminiNotice(mcdRes);

    // Teorema de Pitágoras
    if (qNorm.includes('pitagora') || (qNorm.includes('cateto') && qNorm.includes('hipotenusa'))) {
      const pitRes = PerritoSolver.solvePythagoras(cleanQuery);
      if (pitRes) return withGeminiNotice(pitRes);
    }

    // 3. ¿Coincide con algún tema de la Base de Conocimiento Erudita?
    let bestMatch = null;
    let maxScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        const normKw = normalizeText(kw);
        if (qNorm.includes(normKw)) {
          score += normKw.length;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && maxScore >= 3) {
      return withGeminiNotice(formatKnowledgeResponse(bestMatch));
    }

    // 4. Si la consulta tiene que ver con el contexto activo (ej. fracción compuesta en pantalla)
    if (activeContext && (qNorm.includes('este') || qNorm.includes('actual') || qNorm.includes('pantalla') || qNorm.includes('resultado') || qNorm.includes('porque') || qNorm.includes('por que'))) {
      if (activeContext.id === 'compfrac') {
        const compItem = KNOWLEDGE_BASE.find(k => k.id === 'fracciones_compuestas');
        if (compItem) return withGeminiNotice(formatKnowledgeResponse(compItem));
      } else if (activeContext.id === 'equations') {
        const algItem = KNOWLEDGE_BASE.find(k => k.id === 'factorizacion_total');
        if (algItem) return withGeminiNotice(formatKnowledgeResponse(algItem));
      } else if (activeContext.id === 'mcd') {
        const mcdItem = KNOWLEDGE_BASE.find(k => k.id === 'mcd_vs_mcm');
        if (mcdItem) return withGeminiNotice(formatKnowledgeResponse(mcdItem));
      }
    }

    // 5. Respuesta heurística general de Pólya con ejemplos
    return withGeminiNotice(formatGenericEruditeResponse(cleanQuery, activeContext));
  }

  function getTopics() {
    return KNOWLEDGE_BASE;
  }

  function getTopicById(id) {
    const item = KNOWLEDGE_BASE.find(t => t.id === id);
    return item ? formatKnowledgeResponse(item) : null;
  }

  function setApiKey(key) {
    const cleaned = cleanApiKey(key);
    if (cleaned) {
      localStorage.setItem(GEMINI_KEY_STORAGE, cleaned);
      return true;
    } else {
      localStorage.removeItem(GEMINI_KEY_STORAGE);
      localStorage.removeItem(GEMINI_ACTIVE_MODEL_STORAGE);
      localStorage.removeItem(GEMINI_ACTIVE_VER_STORAGE);
      return false;
    }
  }

  function getApiKey() {
    return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
  }

  function getActiveModel() {
    return localStorage.getItem(GEMINI_ACTIVE_MODEL_STORAGE) || '';
  }

  // Exportar en window
  global.PerritoErudite = {
    ask,
    getTopics,
    getTopicById,
    setApiKey,
    getApiKey,
    getActiveModel,
    testGeminiKey,
    cleanApiKey,
    listAvailableGeminiModels,
    solver: PerritoSolver
  };

})(typeof window !== 'undefined' ? window : this);
