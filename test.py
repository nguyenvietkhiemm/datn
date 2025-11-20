from mathml2latex import MathML2Latex

mathml = """<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>Q</mi><mo>=</mo><mi>c</mi><mi>m</mi><mo>(</mo><msub><mi>t</mi><mn>2</mn></msub><mo>-</mo><msub><mi>t</mi><mn>1</mn></msub><mo>)</mo><mo>+</mo><mi>&#x3BB;</mi><mi>m</mi><mo>=</mo><mn>96165</mn><mi>J</mi><mo>&#x2248;</mo><mn>96.17</mn><mi>kJ</mi></mrow></math>"""

converter = MathML2Latex()
latex_str = converter.convert(mathml)
print(latex_str)