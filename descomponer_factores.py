#!/usr/bin/env python3
"""
Módulo de Descomposición en Factores (Factores Primos, Árbol de Factores y Pares)
Uso por línea de comandos:
    python3 descomponer_factores.py 48
    python3 descomponer_factores.py 60 90 150
"""

import sys
import math

def es_primo(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def obtener_pares_factores(n):
    pares = []
    limite = int(math.isqrt(n))
    for i in range(1, limite + 1):
        if n % i == 0:
            pares.append((i, n // i))
    return pares

def descomponer_factores_primos(n):
    """Retorna los pasos sucesivos de división vertical y los factores."""
    pasos = []
    temp = n
    factores = {}
    d = 2

    while temp > 1:
        if temp % d == 0:
            cociente_anterior = temp
            temp //= d
            factores[d] = factores.get(d, 0) + 1
            pasos.append({
                "cociente": cociente_anterior,
                "factor_primo": d,
                "nuevo_cociente": temp
            })
        else:
            if d == 2:
                d = 3
            elif d == 3:
                d = 5
            else:
                d += 2

    return pasos, factores

def construir_arbol_factores(n):
    """Genera una estructura de árbol binario para el número."""
    if n <= 1 or es_primo(n):
        return {"valor": n, "es_primo": True, "hijos": None}

    # Buscar dos factores balanceados cercanos a la raíz
    mejor_par = None
    raiz = int(math.isqrt(n))
    for i in range(raiz, 1, -1):
        if n % i == 0:
            mejor_par = (i, n // i)
            break

    if not mejor_par:
        return {"valor": n, "es_primo": True, "hijos": None}

    f1, f2 = mejor_par
    return {
        "valor": n,
        "es_primo": False,
        "hijos": (construir_arbol_factores(f1), construir_arbol_factores(f2))
    }

def imprimir_arbol_ascii(nodo, prefijo="", es_ultimo=True):
    conector = "└── " if es_ultimo else "├── "
    tipo = "(Primo ★)" if nodo["es_primo"] else "(Compuesto)"
    print(f"{prefijo}{conector}{nodo['valor']} {tipo}")

    if nodo["hijos"]:
        nuevo_prefijo = prefijo + ("    " if es_ultimo else "│   ")
        h1, h2 = nodo["hijos"]
        imprimir_arbol_ascii(h1, nuevo_prefijo, False)
        imprimir_arbol_ascii(h2, nuevo_prefijo, True)

def analizar_numero(n):
    print("=" * 65)
    print(f" DESCOMPOSICIÓN EN FACTORES DEL NÚMERO: {n}")
    print("=" * 65)

    if n <= 1:
        print(f"El número {n} no tiene descomposición en factores primos estándar.\n")
        return

    primo = es_primo(n)
    print(f"• Tipo de número: {'★ NÚMERO PRIMO' if primo else '🧩 NÚMERO COMPUESTO'}")

    # 1. Pares de factores
    pares = obtener_pares_factores(n)
    print("\n1. PARES DE FACTORES (a × b = n):")
    for a, b in pares:
        print(f"   • {a} × {b} = {n}")

    # 2. Descomposición vertical
    pasos, factores = descomponer_factores_primos(n)
    print("\n2. TABLA VERTICAL DE FACTORES PRIMOS (Divisiones sucesivas):")
    print("   Cociente  │  Factor Primo  │  Explicación")
    print("   ──────────┼────────────────┼──────────────────────────────")
    for idx, p in enumerate(pasos, start=1):
        print(f"   {p['cociente']:<9} │  {p['factor_primo']:<13} │  Paso {idx}: {p['cociente']} ÷ {p['factor_primo']} = {p['nuevo_cociente']}")
    print("   1         │  ✓              │  Fin de la descomposición.")

    # 3. Expresión canónica
    superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}
    def to_super(val):
        return "".join(superscripts.get(c, c) for c in str(val))

    canon_parts = []
    for p in sorted(factores.keys()):
        exp = factores[p]
        canon_parts.append(f"{p}{to_super(exp)}" if exp > 1 else f"{p}")
    canon_str = " × ".join(canon_parts) if canon_parts else str(n)

    print(f"\n3. FORMA CANÓNICA DE FACTORES PRIMOS:")
    print(f"   {n} = {canon_str}")

    # 4. Propiedades y número de divisores
    # tau(n) = prod(e_i + 1)
    num_divisores = 1
    for exp in factores.values():
        num_divisores *= (exp + 1)

    print(f"\n4. PROPIEDADES DE FACTORIZACIÓN:")
    print(f"   • Cantidad total de divisores positivos: {num_divisores}")
    divs = []
    for a, b in pares:
        divs.append(a)
        if a != b:
            divs.append(b)
    divs.sort()
    print(f"   • Lista de divisores: {divs}")
    print(f"   • Suma de divisores σ({n}): {sum(divs)}")

    # 5. Árbol de Factores
    print("\n5. ÁRBOL DE FACTORES (Factor Tree):")
    arbol = construir_arbol_factores(n)
    imprimir_arbol_ascii(arbol)
    print()

def main():
    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            try:
                num = int(arg)
                analizar_numero(num)
            except ValueError:
                print(f"Argumento inválido: '{arg}' no es un número entero.")
    else:
        # Ejemplo por defecto
        analizar_numero(48)
        analizar_numero(72)

if __name__ == "__main__":
    main()
