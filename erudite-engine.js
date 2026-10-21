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
    // Resolver fracciones directas: ej: 3/4 + 5/6 ó (2/3) / (4/5)
    solveFractions(expr) {
      try {
        let clean = expr.replace(/[?¿!¡;]/g, ' ').trim();
        clean = clean.replace(/^(por\s+favor\s+|hola\s*perrito\s*,?\s*|profesor\s*,?\s*)/i, '');
        clean = clean.replace(/^(resuelve|resolver|calcula|calcular|halla|hallar|evalua|evaluar|cuanto\s+es|cuanto\s+da|simplifica|simplificar|solve)\s*(la\s+operacion\s+|la\s+fraccion\s+|el\s+ejercicio\s+|:)?\s*/i, '');
        clean = clean.replace(/\s+/g, '').replace(/[×·]/g, '*').replace(/[÷]/g, '/');

        // Buscar patrón de dos fracciones con operador: a/b [+-*/] c/d
        const match = clean.match(/([+-]?\d+)\/(\d+)([\+\-\*\/])([+-]?\d+)\/(\d+)/);
        if (!match) return null;

        const n1 = BigInt(match[1]), d1 = BigInt(match[2]);
        const op = match[3];
        const n2 = BigInt(match[4]), d2 = BigInt(match[5]);

        const r1 = new Rational(n1, d1);
        const r2 = new Rational(n2, d2);
        let res, opName, stepsHtml;

        if (op === '+') {
          res = r1.add(r2);
          const mcm = lcmBig(r1.d, r2.d);
          const f1 = mcm / r1.d;
          const f2 = mcm / r2.d;
          const amp1 = r1.n * f1;
          const amp2 = r2.n * f2;
          const sum = amp1 + amp2;
          opName = 'Suma de Fracciones con m.c.m.';
          stepsHtml = `
            <div class="erudite-step-item">
              <strong>Paso 1: Homogenización de denominadores.</strong> Calculamos el mínimo común múltiplo de ${r1.d} y ${r2.d}:<br>
              <code>m.c.m.(${r1.d}, ${r2.d}) = ${mcm}</code>.
            </div>
            <div class="erudite-step-item">
              <strong>Paso 2: Amplificación de numeradores.</strong><br>
              • Primera fracción: <code>(${r1.n} × ${f1})/${mcm} = ${amp1}/${mcm}</code><br>
              • Segunda fracción: <code>(${r2.n} × ${f2})/${mcm} = ${amp2}/${mcm}</code>
            </div>
            <div class="erudite-step-item">
              <strong>Paso 3: Suma y simplificación.</strong><br>
              <code>${amp1} + ${amp2} = ${sum}</code> ⟹ Fracción resultante: <code>${sum}/${mcm}</code><br>
              ${gcdBig(sum, mcm) > 1n ? `Simplificando por M.C.D.(${sum}, ${mcm}) = <strong>${gcdBig(sum, mcm)}</strong>` : 'Ya es irreducible'}.
            </div>
          `;
        } else if (op === '-') {
          res = r1.sub(r2);
          const mcm = lcmBig(r1.d, r2.d);
          const f1 = mcm / r1.d;
          const f2 = mcm / r2.d;
          const amp1 = r1.n * f1;
          const amp2 = r2.n * f2;
          const diff = amp1 - amp2;
          opName = 'Resta de Fracciones con m.c.m.';
          stepsHtml = `
            <div class="erudite-step-item">
              <strong>Paso 1: Hallar el m.c.m. de los denominadores.</strong><br>
              <code>m.c.m.(${r1.d}, ${r2.d}) = ${mcm}</code>.
            </div>
            <div class="erudite-step-item">
              <strong>Paso 2: Amplificar numeradores.</strong><br>
              • Primera fracción: <code>${amp1}/${mcm}</code><br>
              • Segunda fracción: <code>${amp2}/${mcm}</code>
            </div>
            <div class="erudite-step-item">
              <strong>Paso 3: Sustracción y reducción.</strong><br>
              <code>${amp1} − ${amp2} = ${diff}</code> ⟹ <code>${diff}/${mcm}</code>.
            </div>
          `;
        } else if (op === '*') {
          res = r1.mul(r2);
          opName = 'Multiplicación en Línea Recta';
          stepsHtml = `
            <div class="erudite-step-item">
              <strong>Paso 1: Multiplicar numeradores entre sí.</strong><br>
              <code>${r1.n} × ${r2.n} = ${r1.n * r2.n}</code>.
            </div>
            <div class="erudite-step-item">
              <strong>Paso 2: Multiplicar denominadores entre sí.</strong><br>
              <code>${r1.d} × ${r2.d} = ${r1.d * r2.d}</code>.
            </div>
            <div class="erudite-step-item">
              <strong>Paso 3: Fracción irreducible final.</strong><br>
              <code>(${r1.n * r2.n})/(${r1.d * r2.d}) = <strong>${res.toString()}</strong></code>.
            </div>
          `;
        } else if (op === '/') {
          res = r1.div(r2);
          opName = 'División de Fracciones (Ley de la Herradura / Extremos y Medios)';
          stepsHtml = `
            <div class="erudite-step-item">
              <strong>Paso 1: Ley de la Herradura (Extremos por Medios).</strong><br>
              • Multiplicamos los extremos (superior e inferior): <code>${r1.n} × ${r2.d} = ${r1.n * r2.d}</code> (nuevo numerador).<br>
              • Multiplicamos los medios (interiores): <code>${r1.d} × ${r2.n} = ${r1.d * r2.n}</code> (nuevo denominador).
            </div>
            <div class="erudite-step-item">
              <strong>Paso 2: Simplificación final por M.C.D.</strong><br>
              Resultado irreducible: <strong>${res.toString()}</strong>.
            </div>
          `;
        }

        return `
          <div class="erudite-card-response">
            <div class="erudite-header">
              <span class="erudite-badge">🧮 Solución al Vuelo</span>
              <strong>${opName}</strong>
            </div>
            <div class="erudite-problem-line">
              Operación ingresada: <code>${r1.toString()} ${op} ${r2.toString()}</code>
            </div>
            <div class="erudite-steps">
              ${stepsHtml}
            </div>
            <div class="erudite-result-box">
              <span class="result-label">Resultado Final:</span>
              <span class="result-highlight">${res.toString()}</span>
              ${res.d !== 1n ? `<span class="result-dec">(≈ ${(Number(res.n) / Number(res.d)).toFixed(5)})</span>` : ''}
            </div>
          </div>
        `;
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
          const res = numbers.reduce((acc, val) => {
            let a = acc, b = val;
            while (b) { const t = b; b = a % b; a = t; }
            return (acc * val) / a;
          });
          return `
            <div class="erudite-card-response">
              <div class="erudite-header">
                <span class="erudite-badge">🎯 Teoría de Números</span>
                <strong>Mínimo Común Múltiplo (m.c.m.)</strong>
              </div>
              <div class="erudite-problem-line">
                Calcular m.c.m. de: <code>[${numbers.join(', ')}]</code>
              </div>
              <div class="erudite-steps">
                <div class="erudite-step-item">
                  <strong>Concepto:</strong> El m.c.m. es el número positivo más pequeño que es múltiplo exacto de todos ellos a la vez. Es indispensable para homogenizar denominadores en sumas y restas de fracciones.
                </div>
                <div class="erudite-step-item">
                  <strong>Descomposición en Factores Primos:</strong> Se descompone simultáneamente dividiendo por números primos (2, 3, 5, 7...) hasta que todas las columnas lleguen a 1.
                </div>
              </div>
              <div class="erudite-result-box">
                <span class="result-label">m.c.m. Exacto:</span>
                <span class="result-highlight">${res}</span>
              </div>
            </div>
          `;
        }

        // MCD
        const res = numbers.reduce((acc, val) => {
          let a = acc, b = val;
          while (b) { const t = b; b = a % b; a = t; }
          return a;
        });

        return `
          <div class="erudite-card-response">
            <div class="erudite-header">
              <span class="erudite-badge">🎯 Teoría de Números</span>
              <strong>Máximo Común Divisor (M.C.D.)</strong>
            </div>
            <div class="erudite-problem-line">
              Calcular M.C.D. de: <code>[${numbers.join(', ')}]</code>
            </div>
            <div class="erudite-steps">
              <div class="erudite-step-item">
                <strong>Concepto:</strong> El M.C.D. es el divisor entero más grande que divide exactamente a <em>todos</em> los números sin dejar residuo.
              </div>
              <div class="erudite-step-item">
                <strong>Algoritmo de Descomposición:</strong> Se divide únicamente por los factores primos que dividen a <strong>todos</strong> los términos al mismo tiempo. En cuanto dejan de tener un factor común primo, el proceso se detiene.
              </div>
            </div>
            <div class="erudite-result-box">
              <span class="result-label">M.C.D. Calculado:</span>
              <span class="result-highlight">${res}</span>
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

        const isHypot = query.includes('hipotenusa') || query.includes('cateto');
        let a = nums[0], b = nums[1];
        let c = Math.sqrt(a * a + b * b);
        let cDisp = Number.isInteger(c) ? c.toString() : c.toFixed(4);

        return `
          <div class="erudite-card-response">
            <div class="erudite-header">
              <span class="erudite-badge">🔺 Geometría Euclidiana</span>
              <strong>Teorema de Pitágoras</strong>
            </div>
            <div class="erudite-problem-line">
              Catetos dados: <code>a = ${a}</code>, <code>b = ${b}</code>
            </div>
            <div class="erudite-steps">
              <div class="erudite-step-item">
                <strong>Teorema Fundamental:</strong> En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos:<br>
                <code>c² = a² + b²</code>
              </div>
              <div class="erudite-step-item">
                <strong>Paso a paso con tus datos:</strong><br>
                • <code>a² = (${a})² = ${a * a}</code><br>
                • <code>b² = (${b})² = ${b * b}</code><br>
                • <code>c² = ${a * a} + ${b * b} = ${a * a + b * b}</code><br>
                • <code>c = √(${a * a + b * b}) = <strong>${cDisp}</strong></code>
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
      keywords: ['mcd', 'mcm', 'maximo comun divisor', 'minimo comun multiplo', 'diferencia mcd mcm', 'descomposicion simultanea', 'factores primos'],
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

  // Generador heurístico general siguiendo el Método de Pólya para cualquier otra consulta matemática
  function formatGenericEruditeResponse(userQuery, activeContext) {
    return `
      <div class="erudite-card-response">
        <div class="erudite-header">
          <span class="erudite-badge">🎓 Tutoría Personalizada</span>
          <h4 class="erudite-title">Análisis Matemático: "${userQuery}"</h4>
          <span class="erudite-sub">Metodología Universal de George Pólya para Resolver Problemas</span>
        </div>

        <div class="erudite-section">
          <div class="erudite-concept">
            Como catedrático de matemáticas, para abordar tu inquietud sobre <strong>${userQuery}</strong> aplicamos los 4 pasos universales del rigor científico:
          </div>
        </div>

        <div class="erudite-steps">
          <div class="erudite-step-item">
            <span class="step-num-badge">Fase 1</span>
            <div><strong>Comprender el Problema e Identificar Datos:</strong> Determinar con exactitud cuáles son las incógnitas, cuáles son los datos conocidos y qué condiciones algebraicas o geométricas rigen la situación.</div>
          </div>
          <div class="erudite-step-item">
            <span class="step-num-badge">Fase 2</span>
            <div><strong>Concebir un Plan Estratégico:</strong> Seleccionar el teorema o método idóneo (factorización, m.c.m. de denominadores, Ley de la Herradura, Fórmula General o regla de derivación correspondiente).</div>
          </div>
          <div class="erudite-step-item">
            <span class="step-num-badge">Fase 3</span>
            <div><strong>Ejecución Meticulosa:</strong> Realizar cada operación matemática cuidando al 100% las leyes de los signos (<code>-(-) = +</code>), la jerarquía PEMDAS (paréntesis antes de multiplicaciones y sumas) y la simplificación por M.C.D.</div>
          </div>
          <div class="erudite-step-item">
            <span class="step-num-badge">Fase 4</span>
            <div><strong>Comprobación Retrospectiva:</strong> Sustituir la respuesta en la expresión original para verificar la identidad o igualdad matemática.</div>
          </div>
        </div>

        <div class="erudite-tip-box">
          🐾 <strong>¡Pregúntame con toda confianza!</strong> Puedes escribir una operación directa como <code>cuanto es 3/4 + 5/6</code>, una ecuación como <code>2x + 5 = 15</code>, o pedirme que te explique temas como <em>"teorema de pitagoras"</em>, <em>"derivadas"</em>, <em>"factorizacion"</em>, o <em>"fracciones compuestas"</em>. ¡Te daré el desarrollo completo paso a paso con ejemplos reales!
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 4. API GEMINI INTEGRADA (CONEXIÓN EXTERNA OPCIONAL)
  // ==========================================================================

  const GEMINI_KEY_STORAGE = 'perrito_math_gemini_api_key';

  async function queryGemini(userPrompt, apiKey, activeContext) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `
Eres el "Profesor Perrito Math 🐶", un erudito y virtuoso catedrático de matemáticas con doctorado en pedagogía y didáctica matemática.
Tu misión es enseñar y responder CUALQUIER duda matemática que el estudiante plantee con:
1. Tono culto, amable, motivador, claro y paciente (con toques sutiles y cariñosos de perrito profesor 🐾).
2. Explicación conceptual profunda pero sumamente intuitiva con analogías comprensibles.
3. Principios y fórmulas bien explicadas.
4. SIEMPRE incluye uno o dos EJEMPLOS PRÁCTICOS RESUELTOS PASO A PASO con números reales, mostrando cada cálculo intermedio.
5. Destaca trampas típicas y errores comunes de examen.
6. Emplea etiquetas HTML bien estructuradas (ej: <strong>, <code>, <div>, <ul>, <li>, <div class="erudite-step-item">) para que la respuesta se vea hermosa y fácil de leer. No uses Markdown con asteriscos crudos; usa HTML limpio.
Contexto actual del estudiante en la app: ${activeContext ? activeContext.typeName : 'Matemáticas Generales'}.
    `.trim();

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Pregunta del alumno: ${userPrompt}` }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Error en API de Gemini: HTTP ${res.status}`);
    }

    const data = await res.json();
    const candidate = data.candidates && data.candidates[0];
    if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
      return candidate.content.parts[0].text;
    }
    throw new Error('Respuesta vacía de Gemini');
  }

  // ==========================================================================
  // 5. INTERFAZ PÚBLICA DEL MOTOR ERUDITO
  // ==========================================================================

  async function ask(query, activeContext) {
    if (!query || !query.trim()) {
      return '¡Hola! Escribe tu duda o escribe una operación matemática para resolvértela con todo gusto.';
    }

    const cleanQuery = query.trim();
    const qNorm = normalizeText(cleanQuery);

    // 1. ¿Tiene el usuario configurada una API Key de Gemini y hay conexión?
    const savedApiKey = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (savedApiKey && savedApiKey.trim().length > 10 && navigator.onLine) {
      try {
        const geminiAnswer = await queryGemini(cleanQuery, savedApiKey.trim(), activeContext);
        if (geminiAnswer) return geminiAnswer;
      } catch (err) {
        console.warn('[Perrito Erudite] Gemini no disponible, recurriendo al motor offline local:', err);
      }
    }

    // 2. ¿Es un cálculo o problema específico para el evaluador interactivo?
    // Fracciones directas
    const fracRes = PerritoSolver.solveFractions(cleanQuery);
    if (fracRes) return fracRes;

    // Ecuación lineal
    const linRes = PerritoSolver.solveLinear(cleanQuery);
    if (linRes) return linRes;

    // Ecuación cuadrática
    const quadRes = PerritoSolver.solveQuadratic(cleanQuery);
    if (quadRes) return quadRes;

    // M.C.D. o m.c.m.
    const mcdRes = PerritoSolver.solveMcdMcm(cleanQuery);
    if (mcdRes) return mcdRes;

    // Teorema de Pitágoras
    if (qNorm.includes('pitagora') || (qNorm.includes('cateto') && qNorm.includes('hipotenusa'))) {
      const pitRes = PerritoSolver.solvePythagoras(cleanQuery);
      if (pitRes) return pitRes;
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
      return formatKnowledgeResponse(bestMatch);
    }

    // 4. Si la consulta tiene que ver con el contexto activo (ej. fracción compuesta en pantalla)
    if (activeContext && (qNorm.includes('este') || qNorm.includes('actual') || qNorm.includes('pantalla') || qNorm.includes('resultado') || qNorm.includes('porque') || qNorm.includes('por que'))) {
      if (activeContext.id === 'compfrac') {
        const compItem = KNOWLEDGE_BASE.find(k => k.id === 'fracciones_compuestas');
        if (compItem) return formatKnowledgeResponse(compItem);
      } else if (activeContext.id === 'equations') {
        const algItem = KNOWLEDGE_BASE.find(k => k.id === 'factorizacion_total');
        if (algItem) return formatKnowledgeResponse(algItem);
      } else if (activeContext.id === 'mcd') {
        const mcdItem = KNOWLEDGE_BASE.find(k => k.id === 'mcd_vs_mcm');
        if (mcdItem) return formatKnowledgeResponse(mcdItem);
      }
    }

    // 5. Respuesta heurística general de Pólya con ejemplos
    return formatGenericEruditeResponse(cleanQuery, activeContext);
  }

  function getTopics() {
    return KNOWLEDGE_BASE;
  }

  function getTopicById(id) {
    const item = KNOWLEDGE_BASE.find(t => t.id === id);
    return item ? formatKnowledgeResponse(item) : null;
  }

  function setApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
      return true;
    } else {
      localStorage.removeItem(GEMINI_KEY_STORAGE);
      return false;
    }
  }

  function getApiKey() {
    return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
  }

  // Exportar en window
  global.PerritoErudite = {
    ask,
    getTopics,
    getTopicById,
    setApiKey,
    getApiKey,
    solver: PerritoSolver
  };

})(typeof window !== 'undefined' ? window : this);
