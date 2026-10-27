const tr=(es,en)=>window.BEBEPUNT_I18N?.text(es,en)||es;
// Illustrative catalog only. No real commercial specifications or purchasable IDs.
window.BEBEPUNT_GET_DEMO_CATALOG = () => ({
  "collections": [
    {
      "id": "demo-otono",
      "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
      "season": tr("Calidez para sus primeros días","Warmth for their first days"),
      "slug": "otono",
      "cover": "bebe2.jpg"
    },
    {
      "id": "demo-primavera",
      "name": tr("Primavera Verano 2026","Spring Summer 2026"),
      "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine"),
      "slug": "primavera",
      "cover": "bebe1.jpg"
    },
    {
      "id": "demo-ceremonia",
      "name": tr("Ceremonia","Special occasions"),
      "season": tr("Momentos para recordar","Moments to remember"),
      "slug": "ceremonia",
      "cover": "ceremonia5.jpg"
    }
  ],
  "products": [
    {
      "id": "demo-modelo-01",
      "collection_id": "demo-otono",
      "collections": {
        "id": "demo-otono",
        "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
        "season": tr("Calidez para sus primeros días","Warmth for their first days")
      },
      "name": tr("Conjunto Rosa Empolvado","Dusty Rose Set"),
      "description": tr("Punto rosa y cuello blanco para un conjunto de aire delicado.","Pink knitwear and a white collar for a delicate look."),
      "demo_image": "bebe2.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-01-0",
          "sku": "MUESTRA-01-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 32,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-01-1",
          "sku": "MUESTRA-01-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 32,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-01-2",
          "sku": "MUESTRA-01-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 32,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-02",
      "collection_id": "demo-otono",
      "collections": {
        "id": "demo-otono",
        "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
        "season": tr("Calidez para sus primeros días","Warmth for their first days")
      },
      "name": tr("Vestido Canela","Cinnamon Dress"),
      "description": tr("Un diseño de inspiración clásica en tonos cálidos.","A classically inspired design in warm shades."),
      "demo_image": "bebe4.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-02-0",
          "sku": "MUESTRA-02-1",
          "size": "3 M",
          "color": tr("Canela","Cinnamon"),
          "professional_price": 38,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-02-1",
          "sku": "MUESTRA-02-2",
          "size": "6 M",
          "color": tr("Canela","Cinnamon"),
          "professional_price": 38,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-02-2",
          "sku": "MUESTRA-02-3",
          "size": "12 M",
          "color": tr("Canela","Cinnamon"),
          "professional_price": 38,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-03",
      "collection_id": "demo-otono",
      "collections": {
        "id": "demo-otono",
        "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
        "season": tr("Calidez para sus primeros días","Warmth for their first days")
      },
      "name": tr("Conjunto Cielo","Sky Set"),
      "description": tr("Una propuesta de punto azul para los primeros meses.","Blue knitwear for the first months."),
      "demo_image": "bebe8.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-03-0",
          "sku": "MUESTRA-03-1",
          "size": "3 M",
          "color": tr("Azul","Blue"),
          "professional_price": 34,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-03-1",
          "sku": "MUESTRA-03-2",
          "size": "6 M",
          "color": tr("Azul","Blue"),
          "professional_price": 34,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-03-2",
          "sku": "MUESTRA-03-3",
          "size": "12 M",
          "color": tr("Azul","Blue"),
          "professional_price": 34,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-04",
      "collection_id": "demo-otono",
      "collections": {
        "id": "demo-otono",
        "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
        "season": tr("Calidez para sus primeros días","Warmth for their first days")
      },
      "name": tr("Chaqueta Nube","Cloud Cardigan"),
      "description": tr("Chaqueta clara combinada con una prenda inferior azul.","A light cardigan paired with blue bottoms."),
      "demo_image": "bebe12.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-04-0",
          "sku": "MUESTRA-04-1",
          "size": "3 M",
          "color": tr("Marfil / azul","Ivory / blue"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-04-1",
          "sku": "MUESTRA-04-2",
          "size": "6 M",
          "color": tr("Marfil / azul","Ivory / blue"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-04-2",
          "sku": "MUESTRA-04-3",
          "size": "12 M",
          "color": tr("Marfil / azul","Ivory / blue"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-05",
      "collection_id": "demo-otono",
      "collections": {
        "id": "demo-otono",
        "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
        "season": tr("Calidez para sus primeros días","Warmth for their first days")
      },
      "name": tr("Conjunto Dulce Descanso","Sweet Dreams Set"),
      "description": tr("Silueta cómoda en azul suave, con cuello en contraste.","A comfortable silhouette in soft blue with a contrasting collar."),
      "demo_image": "bebe14.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-05-0",
          "sku": "MUESTRA-05-1",
          "size": "3 M",
          "color": tr("Azul","Blue"),
          "professional_price": 33,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-05-1",
          "sku": "MUESTRA-05-2",
          "size": "6 M",
          "color": tr("Azul","Blue"),
          "professional_price": 33,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-05-2",
          "sku": "MUESTRA-05-3",
          "size": "12 M",
          "color": tr("Azul","Blue"),
          "professional_price": 33,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-06",
      "collection_id": "demo-otono",
      "collections": {
        "id": "demo-otono",
        "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
        "season": tr("Calidez para sus primeros días","Warmth for their first days")
      },
      "name": tr("Dos Piezas Brisa","Breeze Two-Piece Set"),
      "description": tr("Dos piezas en azul claro con detalles de punto.","A light blue two-piece set with knitted details."),
      "demo_image": "bebe19.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-06-0",
          "sku": "MUESTRA-06-1",
          "size": "3 M",
          "color": tr("Azul claro","Light blue"),
          "professional_price": 35,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-06-1",
          "sku": "MUESTRA-06-2",
          "size": "6 M",
          "color": tr("Azul claro","Light blue"),
          "professional_price": 35,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-06-2",
          "sku": "MUESTRA-06-3",
          "size": "12 M",
          "color": tr("Azul claro","Light blue"),
          "professional_price": 35,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-07",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Primavera Verano 2026","Spring Summer 2026"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Ranita Oliva","Olive Romper"),
      "description": tr("Una propuesta bicolor para descubrir el mundo.","A two-tone design for discovering the world."),
      "demo_image": "bebe1.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-07-0",
          "sku": "MUESTRA-07-1",
          "size": "3 M",
          "color": tr("Verde / natural","Green / natural"),
          "professional_price": 29,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-07-1",
          "sku": "MUESTRA-07-2",
          "size": "6 M",
          "color": tr("Verde / natural","Green / natural"),
          "professional_price": 29,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-07-2",
          "sku": "MUESTRA-07-3",
          "size": "12 M",
          "color": tr("Verde / natural","Green / natural"),
          "professional_price": 29,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-08",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Primavera Verano 2026","Spring Summer 2026"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Peto Fresa","Strawberry Dungarees"),
      "description": tr("Tonos claros con detalles rojos llenos de alegría.","Light shades with cheerful red details."),
      "demo_image": "bebe3.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-08-0",
          "sku": "MUESTRA-08-1",
          "size": "3 M",
          "color": tr("Natural / rojo","Natural / red"),
          "professional_price": 31,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-08-1",
          "sku": "MUESTRA-08-2",
          "size": "6 M",
          "color": tr("Natural / rojo","Natural / red"),
          "professional_price": 31,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-08-2",
          "sku": "MUESTRA-08-3",
          "size": "12 M",
          "color": tr("Natural / rojo","Natural / red"),
          "professional_price": 31,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-09",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Primavera Verano 2026","Spring Summer 2026"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Conjunto Agua","Aqua Set"),
      "description": tr("Conjunto sin mangas en un fresco tono turquesa.","A sleeveless set in a fresh turquoise shade."),
      "demo_image": "bebe6.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-09-0",
          "sku": "MUESTRA-09-1",
          "size": "3 M",
          "color": tr("Turquesa","Turquoise"),
          "professional_price": 28,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-09-1",
          "sku": "MUESTRA-09-2",
          "size": "6 M",
          "color": tr("Turquesa","Turquoise"),
          "professional_price": 28,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-09-2",
          "sku": "MUESTRA-09-3",
          "size": "12 M",
          "color": tr("Turquesa","Turquoise"),
          "professional_price": 28,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-10",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Primavera Verano 2026","Spring Summer 2026"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Vestido Albaricoque","Apricot Dress"),
      "description": tr("Contraste de punto coral y tejido claro.","Contrasting coral knitwear and light fabric."),
      "demo_image": "bebe9.png",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-10-0",
          "sku": "MUESTRA-10-1",
          "size": "3 M",
          "color": tr("Coral / crudo","Coral / ecru"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-10-1",
          "sku": "MUESTRA-10-2",
          "size": "6 M",
          "color": tr("Coral / crudo","Coral / ecru"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-10-2",
          "sku": "MUESTRA-10-3",
          "size": "12 M",
          "color": tr("Coral / crudo","Coral / ecru"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-11",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Primavera Verano 2026","Spring Summer 2026"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Vestido Pradera","Meadow Dress"),
      "description": tr("Verde y blanco para una silueta de inspiración campestre.","Green and white for a countryside-inspired silhouette."),
      "demo_image": "bebe13.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-11-0",
          "sku": "MUESTRA-11-1",
          "size": "3 M",
          "color": tr("Verde / blanco","Green / white"),
          "professional_price": 39,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-11-1",
          "sku": "MUESTRA-11-2",
          "size": "6 M",
          "color": tr("Verde / blanco","Green / white"),
          "professional_price": 39,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-11-2",
          "sku": "MUESTRA-11-3",
          "size": "12 M",
          "color": tr("Verde / blanco","Green / white"),
          "professional_price": 39,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-12",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Primavera Verano 2026","Spring Summer 2026"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Ranita Pétalo","Petal Romper"),
      "description": tr("Una ranita rosa de líneas sencillas.","A pink romper with clean lines."),
      "demo_image": "bebe17.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-12-0",
          "sku": "MUESTRA-12-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 30,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-12-1",
          "sku": "MUESTRA-12-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 30,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-12-2",
          "sku": "MUESTRA-12-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 30,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-13",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Avellana","Hazelnut Set"),
      "description": tr("Punto en tono avellana y cuello blanco de inspiración romántica.","Hazelnut knitwear and a romantic white collar."),
      "demo_image": "ceremonia1.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-13-0",
          "sku": "MUESTRA-13-1",
          "size": "3 M",
          "color": tr("Avellana","Hazelnut"),
          "professional_price": 42,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-13-1",
          "sku": "MUESTRA-13-2",
          "size": "6 M",
          "color": tr("Avellana","Hazelnut"),
          "professional_price": 42,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-13-2",
          "sku": "MUESTRA-13-3",
          "size": "12 M",
          "color": tr("Avellana","Hazelnut"),
          "professional_price": 42,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-14",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Magnolia","Magnolia Set"),
      "description": tr("Punto rosa empolvado y detalles blancos para una ocasión especial.","Dusty pink knitwear with white details for a special occasion."),
      "demo_image": "ceremonia2.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-14-0",
          "sku": "MUESTRA-14-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 43,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-14-1",
          "sku": "MUESTRA-14-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 43,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-14-2",
          "sku": "MUESTRA-14-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 43,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-15",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Aurora","Aurora Set"),
      "description": tr("Dos piezas de tejido claro con un delicado dibujo.","A two-piece set in light fabric with a delicate pattern."),
      "demo_image": "ceremonia3.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-15-0",
          "sku": "MUESTRA-15-1",
          "size": "3 M",
          "color": tr("Beige rosado","Pink beige"),
          "professional_price": 48,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-15-1",
          "sku": "MUESTRA-15-2",
          "size": "6 M",
          "color": tr("Beige rosado","Pink beige"),
          "professional_price": 48,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-15-2",
          "sku": "MUESTRA-15-3",
          "size": "12 M",
          "color": tr("Beige rosado","Pink beige"),
          "professional_price": 48,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-16",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Ranita Almendra","Almond Romper"),
      "description": tr("Ranita beige con cuello blanco de volumen suave.","A beige romper with a softly gathered white collar."),
      "demo_image": "ceremonia4.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-16-0",
          "sku": "MUESTRA-16-1",
          "size": "3 M",
          "color": tr("Almendra","Almond"),
          "professional_price": 40,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-16-1",
          "sku": "MUESTRA-16-2",
          "size": "6 M",
          "color": tr("Almendra","Almond"),
          "professional_price": 40,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-16-2",
          "sku": "MUESTRA-16-3",
          "size": "12 M",
          "color": tr("Almendra","Almond"),
          "professional_price": 40,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-17",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Vestido Flor de Abril","April Blossom Dress"),
      "description": tr("Una propuesta rosa con cuello blanco y detalles delicados.","A pink design with a white collar and delicate details."),
      "demo_image": "ceremonia5.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-17-0",
          "sku": "MUESTRA-17-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 52,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-17-1",
          "sku": "MUESTRA-17-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 52,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-17-2",
          "sku": "MUESTRA-17-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 52,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-18",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Vestido Jardín","Garden Dress"),
      "description": tr("Vestido amplio en rosa suave con detalles de inspiración floral.","A full dress in soft pink with floral-inspired details."),
      "demo_image": "ceremonia6.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": tr("2 A","2 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 56 cm · largo 44 cm","Example: chest circumference 56 cm · length 44 cm")
        },
        {
          "size": tr("3 A","3 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 58 cm · largo 47 cm","Example: chest circumference 58 cm · length 47 cm")
        },
        {
          "size": tr("4 A","4 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 60 cm · largo 50 cm","Example: chest circumference 60 cm · length 50 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-18-0",
          "sku": "MUESTRA-18-1",
          "size": tr("2 A","2 Y"),
          "color": tr("Rosa","Pink"),
          "professional_price": 58,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-18-1",
          "sku": "MUESTRA-18-2",
          "size": tr("3 A","3 Y"),
          "color": tr("Rosa","Pink"),
          "professional_price": 58,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-18-2",
          "sku": "MUESTRA-18-3",
          "size": tr("4 A","4 Y"),
          "color": tr("Rosa","Pink"),
          "professional_price": 58,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-19",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Dalia","Dahlia Set"),
      "description": tr("Camisa clara y pantalón corto para celebrar con comodidad.","A light shirt and shorts for comfortable celebrations."),
      "demo_image": "ceremonia7.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": tr("2 A","2 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 56 cm · largo 44 cm","Example: chest circumference 56 cm · length 44 cm")
        },
        {
          "size": tr("3 A","3 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 58 cm · largo 47 cm","Example: chest circumference 58 cm · length 47 cm")
        },
        {
          "size": tr("4 A","4 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 60 cm · largo 50 cm","Example: chest circumference 60 cm · length 50 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-19-0",
          "sku": "MUESTRA-19-1",
          "size": tr("2 A","2 Y"),
          "color": tr("Marfil","Ivory"),
          "professional_price": 54,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-19-1",
          "sku": "MUESTRA-19-2",
          "size": tr("3 A","3 Y"),
          "color": tr("Marfil","Ivory"),
          "professional_price": 54,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-19-2",
          "sku": "MUESTRA-19-3",
          "size": tr("4 A","4 Y"),
          "color": tr("Marfil","Ivory"),
          "professional_price": 54,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-20",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Vestido Lirio","Lily Dress"),
      "description": tr("Vestido blanco de silueta amplia y hombros delicados.","A white dress with a full silhouette and delicate shoulders."),
      "demo_image": "ceremonia8.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": tr("2 A","2 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 56 cm · largo 44 cm","Example: chest circumference 56 cm · length 44 cm")
        },
        {
          "size": tr("3 A","3 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 58 cm · largo 47 cm","Example: chest circumference 58 cm · length 47 cm")
        },
        {
          "size": tr("4 A","4 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 60 cm · largo 50 cm","Example: chest circumference 60 cm · length 50 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-20-0",
          "sku": "MUESTRA-20-1",
          "size": tr("2 A","2 Y"),
          "color": tr("Blanco","White"),
          "professional_price": 57,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-20-1",
          "sku": "MUESTRA-20-2",
          "size": tr("3 A","3 Y"),
          "color": tr("Blanco","White"),
          "professional_price": 57,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-20-2",
          "sku": "MUESTRA-20-3",
          "size": tr("4 A","4 Y"),
          "color": tr("Blanco","White"),
          "professional_price": 57,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-21",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Vestido Azahar","Orange Blossom Dress"),
      "description": tr("Vestido claro con una silueta de aire tradicional.","A light dress with a traditional silhouette."),
      "demo_image": "ceremonia9.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": "3 M",
          "measurements": tr("Ejemplo: contorno de pecho 44 cm · largo 28 cm","Example: chest circumference 44 cm · length 28 cm")
        },
        {
          "size": "6 M",
          "measurements": tr("Ejemplo: contorno de pecho 46 cm · largo 31 cm","Example: chest circumference 46 cm · length 31 cm")
        },
        {
          "size": "12 M",
          "measurements": tr("Ejemplo: contorno de pecho 48 cm · largo 34 cm","Example: chest circumference 48 cm · length 34 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-21-0",
          "sku": "MUESTRA-21-1",
          "size": "3 M",
          "color": tr("Marfil","Ivory"),
          "professional_price": 49,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-21-1",
          "sku": "MUESTRA-21-2",
          "size": "6 M",
          "color": tr("Marfil","Ivory"),
          "professional_price": 49,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-21-2",
          "sku": "MUESTRA-21-3",
          "size": "12 M",
          "color": tr("Marfil","Ivory"),
          "professional_price": 49,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-22",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Nardo","Tuberose Set"),
      "description": tr("Camisa blanca y pantalón beige para un conjunto de ceremonia.","A white shirt and beige trousers for a special occasion set."),
      "demo_image": "ceremonia10.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "measurements": tr("Medidas de ejemplo en centímetros, no tomadas de las prendas fotografiadas. Verificar con BEBEPUNT antes de publicar para venta.","Example measurements in centimetres, not taken from the photographed garments. Confirm with BEBEPUNT before listing for sale."),
      "size_guide": [
        {
          "size": tr("2 A","2 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 56 cm · largo 44 cm","Example: chest circumference 56 cm · length 44 cm")
        },
        {
          "size": tr("3 A","3 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 58 cm · largo 47 cm","Example: chest circumference 58 cm · length 47 cm")
        },
        {
          "size": tr("4 A","4 Y"),
          "measurements": tr("Ejemplo: contorno de pecho 60 cm · largo 50 cm","Example: chest circumference 60 cm · length 50 cm")
        }
      ],
      "product_variants": [
        {
          "id": "demo-modelo-22-0",
          "sku": "MUESTRA-22-1",
          "size": tr("2 A","2 Y"),
          "color": tr("Blanco / beige","White / beige"),
          "professional_price": 53,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-22-1",
          "sku": "MUESTRA-22-2",
          "size": tr("3 A","3 Y"),
          "color": tr("Blanco / beige","White / beige"),
          "professional_price": 53,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-22-2",
          "sku": "MUESTRA-22-3",
          "size": tr("4 A","4 Y"),
          "color": tr("Blanco / beige","White / beige"),
          "professional_price": 53,
          "stock": 0,
          "is_active": true
        }
      ]
    }
  ]
});